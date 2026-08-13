import express from "express";
import http from "http";
import { Server } from "socket.io";
import D1024 from "node-d1024";

import { initFixtures } from "./config/fixtures.js";
import { state, updateState } from "./engine/state.js";
import { getParColor, getSpotColorIndices } from "./engine/palettes.js";
import { calculateSpotPanTilt } from "./engine/movements.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

const dmx = new D1024({ fps: 30 });

if (!dmx.universe) {
  dmx.universe = new Uint8Array(512);
  const origSetChannel = dmx.setChannel?.bind(dmx);
  dmx.setChannel = (ch, val) => {
    if (ch >= 1 && ch <= 512) {
      dmx.universe[ch - 1] = val;
    }
    if (origSetChannel) {
      try {
        origSetChannel(ch, val);
      } catch (e) {}
    }
  };
}

const { pars, spots, blinders } = initFixtures(dmx);

let moveStep = 0;
let lastBeatTime = Date.now();
let beatCount = 0;
let isFlipped = false;
const FLIP_EVERY_BARS = 2;

let calibrationMode = false;
let activeCalSpot = "frontLeft";
let showAllInCal = true;

const calPositions = {
  frontLeft: { pan: 270, tilt: 135 },
  frontRight: { pan: 270, tilt: 135 },
  rearLeft: { pan: 90, tilt: 135 },
  rearRight: { pan: 90, tilt: 135 },
};

// Render loop (30 fps)
setInterval(() => {
  const now = Date.now();
  const masterRatio = state.masterDimmer / 100;

  const msPerBeat = 60000 / (state.bpm || 128);
  if (now - lastBeatTime >= msPerBeat) {
    lastBeatTime = now;
    beatCount++;
    if (beatCount % (FLIP_EVERY_BARS * 4) === 0) {
      isFlipped = !isFlipped;
    }
  }

  if (calibrationMode) {
    pars.forEach((par) => par.setDimmer(0));
    blinders.forEach((b) => b.off());

    Object.entries(spots).forEach(([key, spot]) => {
      const pos = calPositions[key];
      const isSelected = key === activeCalSpot || activeCalSpot === "all";

      if (showAllInCal || isSelected) {
        spot.setDimmer(255);
        spot.setColor(0);
        spot.setShutter(true, 0);
        spot.setPrism(false);
        spot.setPan(pos.pan);
        spot.setTilt(pos.tilt);
      } else {
        spot.setDimmer(0);
      }
    });

    io.emit("dmxFrame", Array.from(dmx.universe));
    return;
  }

  const parAddresses = [57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137];

  pars.forEach((par, idx) => {
    if (state.blinder) {
      par.setDimmer(255);
      par.setColor(255, 255, 255);
      par.setStrobe(0);
    } else {
      par.setDimmer(Math.round(255 * masterRatio));

      const [r, g, b] = getParColor(
        state.palette,
        idx,
        parAddresses,
        moveStep,
        isFlipped,
      );

      par.setColor(r, g, b);
      par.setStrobe(state.strobe ? 15 : 0);
    }
  });

  blinders.forEach((b) => {
    if (state.blinder) b.on();
    else b.off();
  });

  const speedFactor = (state.bpm / 60) * 0.05;
  moveStep += speedFactor;

  const { finalSpotColorA, finalSpotColorB } = getSpotColorIndices(
    state.palette,
    moveStep,
    isFlipped,
  );
  const spotColorAssignments = {
    frontLeft: finalSpotColorA,
    rearRight: finalSpotColorA,
    frontRight: finalSpotColorB,
    rearLeft: finalSpotColorB,
  };

  Object.entries(spots).forEach(([key, spot]) => {
    if (state.blinder) {
      spot.setDimmer(255);
      spot.setColor(0);
      spot.setShutter(true, 0);
    } else {
      spot.setDimmer(Math.round(255 * masterRatio));
      spot.setColor(spotColorAssignments[key] ?? 0);
      spot.setShutter(true, state.strobe ? 200 : 0);
    }

    spot.setPrism(state.prism);
    const { pan, tilt } = calculateSpotPanTilt(
      key,
      state.spotMove,
      state.spotPosition,
      moveStep,
    );
    spot.setPan(pan);
    spot.setTilt(tilt);
  });

  io.emit("dmxFrame", Array.from(dmx.universe));
}, 1000 / 30);

function handleStateUpdate(data) {
  const updatedState = updateState(data);
  io.emit("state", updatedState);
}

app.post("/api/dmx", (req, res) => {
  handleStateUpdate(req.body);
  res.json({ status: "ok", state });
});

function emitCalState() {
  io.emit("calibrationState", {
    activeSpot: activeCalSpot,
    showAll: showAllInCal,
    positions: calPositions,
  });
}

io.on("connection", (socket) => {
  socket.emit("state", state);
  socket.on("updateState", (data) => handleStateUpdate(data));

  socket.on("startCalibration", (spotKey) => {
    calibrationMode = true;
    if (spotKey) activeCalSpot = spotKey;
    emitCalState();
  });

  socket.on("stopCalibration", () => {
    calibrationMode = false;
  });

  socket.on("setCalSpot", (spotKey) => {
    activeCalSpot = spotKey;
    emitCalState();
  });

  socket.on("toggleShowAllCal", (showAll) => {
    showAllInCal = Boolean(showAll);
    emitCalState();
  });

  socket.on("moveCalibration", ({ panDelta, tiltDelta }) => {
    if (!calibrationMode) return;

    const applyDelta = (spotKey) => {
      const pos = calPositions[spotKey];
      pos.pan = Math.max(0, Math.min(540, pos.pan + panDelta));
      pos.tilt = Math.max(0, Math.min(270, pos.tilt + tiltDelta));
    };

    if (activeCalSpot === "all") {
      Object.keys(calPositions).forEach((key) => applyDelta(key));
    } else if (calPositions[activeCalSpot]) {
      applyDelta(activeCalSpot);
    }

    emitCalState();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Engine running on port ${PORT}`);
});

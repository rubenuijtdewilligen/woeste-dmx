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

// Initialize DMX
const dmx = new D1024({ fps: 30 });
const { pars, spots, blinders } = initFixtures(dmx);

// Engine variables
let moveStep = 0;
let lastBeatTime = Date.now();
let beatCount = 0;
let isFlipped = false;
const FLIP_EVERY_BARS = 2;

// Render loop (30 FPS)
setInterval(() => {
  if (!dmx.isConnected) return;

  const now = Date.now();
  const masterRatio = state.masterDimmer / 100;

  // Beat tracking & flip logic
  const msPerBeat = 60000 / (state.bpm || 128);
  if (now - lastBeatTime >= msPerBeat) {
    lastBeatTime = now;
    beatCount++;
    if (beatCount % (FLIP_EVERY_BARS * 4) === 0) {
      isFlipped = !isFlipped;
    }
  }

  // Update pars
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
        pars.length,
        moveStep,
        isFlipped,
      );
      par.setColor(r, g, b);
      par.setStrobe(state.strobe ? 15 : 0);
    }
  });

  // Update blinders
  blinders.forEach((b) => {
    if (state.blinder) b.on();
    else b.off();
  });

  // Update spots
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
}, 1000 / 30);

// Server
function handleStateUpdate(data) {
  const updatedState = updateState(data);
  io.emit("state", updatedState);
}

app.post("/api/dmx", (req, res) => {
  handleStateUpdate(req.body);
  res.json({ status: "ok", state });
});

io.on("connection", (socket) => {
  socket.emit("state", state);
  socket.on("updateState", (data) => handleStateUpdate(data));
});

// Startup
async function start() {
  try {
    console.log("Connecting to QuickDMX D1024...");
    await dmx.connect();
    console.log("D1024 connected successfully");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting connecting to D1024:", err.message);
  }
}

process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await dmx.disconnect();
  process.exit(0);
});

start();

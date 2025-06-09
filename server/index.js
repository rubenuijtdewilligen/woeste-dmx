const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { setChannel } = require("./dmx");

const app = express();
const PORT = 3000;

const STATE_FILE = path.join(__dirname, "dmx_state.json");

let dmxState = {};
if (fs.existsSync(STATE_FILE)) {
  try {
    dmxState = JSON.parse(fs.readFileSync(STATE_FILE));
  } catch (err) {
    console.error("Failed to load DMX state:", err);
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(dmxState, null, 2));
}

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { channel, value } = req.body;
  if (typeof channel !== "number" || typeof value !== "number") {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  console.log(`Setting channel ${channel} to value ${value}`);
  setChannel(channel, value);
  dmxState[channel] = value;
  saveState();
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.json(dmxState);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  Object.entries(dmxState).forEach(([channel, value]) => {
    setChannel(Number(channel), value);
  });
});

import { io } from "socket.io-client";
import D1024 from "node-d1024";

const ENGINE_URL = process.env.ENGINE_URL || "http://localhost:3000";

const dmx = new D1024({ fps: 30 });

async function initDMX() {
  try {
    console.log("[DMX] Connecting to QuickDMX D1024...");
    await dmx.connect();
    console.log("[DMX] ✅ D1024 connected!");
  } catch (err) {
    console.error("[DMX] ❌ No D1024 hardware found:", err.message);
  }
}

console.log(`[NET] Connecting to engine on ${ENGINE_URL}...`);
const socket = io(ENGINE_URL, { reconnection: true });

socket.on("connect", () => {
  console.log(`[NET] ✅ Connected to engine!`);
});

socket.on("disconnect", () => {
  console.warn("[NET] Connection broken");
});

socket.on("dmxFrame", (universeData) => {
  if (!dmx.isConnected) return;

  const UNIVERSE_OFFSET = 512;

  if (Array.isArray(universeData) || Buffer.isBuffer(universeData)) {
    for (let i = 0; i < universeData.length; i++) {
      dmx.setChannel(i + 1 + UNIVERSE_OFFSET, universeData[i]);
    }
  }
});

process.on("SIGINT", async () => {
  socket.disconnect();
  if (dmx.isConnected) await dmx.disconnect();
  process.exit(0);
});

initDMX();

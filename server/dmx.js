const os = require("os");
const { SerialPort } = require("serialport");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const universeSize = 512;
const dmxData = Buffer.alloc(universeSize, 0);

let port;

try {
  if (
    os.platform() === "linux" &&
    os.hostname().toLowerCase().includes("raspberry")
  ) {
    port = new SerialPort({
      path: "/dev/ttyUSB0",
      baudRate: 250000,
      dataBits: 8,
      stopBits: 2,
      parity: "none",
    });

    port.on("open", () => {
      console.log("Serial port opened, starting DMX loop...");
      sendDMXLoop();
    });

    port.on("error", (err) => {
      console.error("SerialPort error:", err.message);
      console.log("Falling back to mock mode.");
    });
  } else {
    throw new Error("Not on production device. Using mock mode.");
  }
} catch (err) {
  console.warn("DMX interface not available:", err.message);
}

function setChannel(channel, value) {
  if (channel < 1 || channel > 512) return;
  dmxData[channel - 1] = value;
}

async function sendDMXLoop() {
  while (true) {
    await new Promise((resolve, reject) => {
      port.set({ brk: true }, async (err) => {
        if (err) return reject(err);
        await sleep(1);
        port.set({ brk: false }, async (err) => {
          if (err) return reject(err);
          await sleep(1);
          const frame = Buffer.concat([Buffer.from([0]), dmxData]);
          port.write(frame, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    });

    await sleep(30);
  }
}

module.exports = { setChannel };

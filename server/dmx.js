const { SerialPort } = require("serialport");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const port = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 250000,
  dataBits: 8,
  stopBits: 2,
  parity: "none",
});

const universeSize = 512;
const dmxData = Buffer.alloc(universeSize, 0);

function setChannel(channel, value) {
  if (channel < 1 || channel > 512) return;
  dmxData[channel - 1] = value;
}

async function sendDMXLoop() {
  while (true) {
    await new Promise((resolve, reject) => {
      port.set({ brk: true }, async (err) => {
        if (err) return reject(err);
        await sleep(0.001);
        port.set({ brk: false }, async (err) => {
          if (err) return reject(err);
          await sleep(0.001);
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

port.on("open", () => {
  console.log("Starting DMX loop...");
  sendDMXLoop();
});

module.exports = { setChannel };

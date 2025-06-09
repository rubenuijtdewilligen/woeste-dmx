const express = require("express");
const cors = require("cors");
const { setChannel } = require("./dmx");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { channel, value } = req.body;
  console.log(`Setting channel ${channel} to value ${value}`);
  setChannel(channel, value);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

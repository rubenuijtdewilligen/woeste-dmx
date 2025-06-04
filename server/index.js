const express = require("express");
const { setChannel } = require("./dmx");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/", (req, res) => {
  const { channel, value } = req.body;
  setChannel(channel, value);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

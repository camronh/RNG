const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json()); // for parsing application/json
app.use(cors());
const port = 9000;

// Get Random Number
app.get("/randomNumber", async (req, res) => {
  let { min, max } = req.query;
  if (!min || !max)
    return res.status(400).send({ error: "Missing required Param" });
  try {
    const { randomSync } = require("pure-random-number");
    let randomNumber = await randomSync(Number(min), Number(max));
    res.send({ randomNumber });
  } catch (error) {
    return res.status(400).send({ error: "Bad request" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening ats http://localhost:${port}`);
});

// module.exports = app;

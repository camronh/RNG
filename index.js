const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json()); // for parsing application/json
app.use(cors());
const port = 9000;
const db = require("./utils/db");

// Method: GET
// Path: /randomNumber
// Params: max, commit, address
// Description: Get CSPRN. Add ?commit and ?address to use commit-reveal.

app.get("/randomNumber", async (req, res) => {
  let { max } = req.query;
  if (!max) return res.status(400).send({ error: "Missing required Param" });

  if (max > 0xffffffff)
    return res.status(400).send({ error: "Max value is 32 bit" });

  try {
    var sodium = require("sodium-native");

    const randomNumber = sodium.randombytes_uniform(Number(max) + 1);

    // If request query contains ?commit=true and ?address=xxxxx
    const { commit, address } = req.query;
    console.log({ commit, address });
    if (commit == "true" && address) {
      // Commit to DB
      const hash = await db.commitData(randomNumber, address);
      return res.status(200).send({ hash });
    }
    // Else return unhashed random number
    return res.status(200).send({ randomNumber });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Bad request" });
  }
});

// Method: GET
// Path: /reveal
// Params: hash
// Description: Reveal data that was hashed in the commit.

app.get("/reveal", async (req, res) => {
  let { hash } = req.query;
  if (!hash) return res.status(400).send({ error: "Missing required Param" });

  try {
    const data = await db.reveal(hash);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Bad request" });
  }
});

app.get("/commits", async (req, res) => {
  try {
    const data = await db.getCommits();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Bad request" });
  }
});

// Launch server locally

// app.listen(port, () => {
//   console.log(`RNG API listening at http://localhost:${port}`);
// });

// Required for AWS Lambda
module.exports = app;

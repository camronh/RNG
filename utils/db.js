let AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});

const ethers = require("ethers");

var docClient = new AWS.DynamoDB.DocumentClient();

async function commitData(data, address) {
  return new Promise((resolve, reject) => {
    const hash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["string"], [`${data}${address}`])
    );
    console.log(`Committing ${hash}...`);

    const params = {
      TableName: "commits",
      Item: {
        hash,
        data,
      },
    };
    docClient.put(params, async function (err, data) {
      if (err) {
        console.error("Unable to commit", JSON.stringify(err, null, 2));
        reject();
      } else {
        console.log(`Commit saved`);
        resolve(hash);
      }
    });
  });
}

async function deleteCommit(hash) {
  return new Promise((resolve, reject) => {
    console.log(`Deleting ${hash}`);
    const params = {
      TableName: "commits",
      Key: {
        hash,
      },
    };

    docClient.delete(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to delete commit. Error:",
          JSON.stringify(err, null, 2)
        );
        reject(false);
      } else {
        console.log("Delete succeeded.");
        // console.log(data);
        resolve(true);
      }
    });
  });
}

async function reveal(hash) {
  return new Promise((resolve, reject) => {
    console.log(`Revealing ${hash}...`);

    const params = {
      TableName: "commits",
      Key: {
        hash,
      },
    };
    docClient.get(params, async function (err, data) {
      if (err) {
        console.error("Unable reveal commit", JSON.stringify(err, null, 2));
        reject();
      } else {
        console.log({ data });
        await deleteCommit(hash);
        resolve(data.Item);
      }
    });
  });
}

async function getCommits() {
  return new Promise((resolve, reject) => {
    console.log("Getting hashes...");
    const params = {
      TableName: "commits",
    };
    docClient.scan(params, async function (err, data) {
      if (err) {
        console.error("Unable Scan commits", JSON.stringify(err, null, 2));
        reject();
      } else {
        resolve(data.Items);
        //   console.log("PutItem succeeded:", movie.title);
      }
    });
  });
}

module.exports = { commitData, reveal, getCommits };

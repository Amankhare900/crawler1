const fs = require("fs");
let backUp = async (queue, waitingQueue, visitedUrls, sid) => {
  const writeBackUp = fs.createWriteStream(
    `./sessions/s_id${sid}/backUp/backUp.txt`
  );
  writeBackUp.write(JSON.stringify({ queue, waitingQueue, visitedUrls }));
  writeBackUp.end();
};

module.exports = backUp;

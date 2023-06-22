const fs = require("fs");
let backUp = async (queue, waitingQueue, visitedUrls, sid) => {
  return new Promise((resolve) => {
    // console.log(visitedUrls);
    const writeBackUp = fs.createWriteStream(
      `./sessions/s_id${sid}/backUp/backUp.txt`
    );
    let setArr = Array.from(visitedUrls);
    writeBackUp.write(JSON.stringify({ queue, waitingQueue, setArr }));
    // writeBackUp.write(JSON.stringify(Array.from(visitedUrls)));
    writeBackUp.end(() => resolve());
  });
  // const writeBackUp = fs.createWriteStream(
  //   `./sessions/s_id${sid}/backUp/backUp.txt`
  // );
  // writeBackUp.write(JSON.stringify({ queue, waitingQueue, visitedUrls }));
  // writeBackUp.end();
};

module.exports = backUp;

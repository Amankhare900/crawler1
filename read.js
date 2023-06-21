const fs = require("fs");

let readLinkFromHtml = (path) => {
  console.log("In the read Html file");
  console.log(path);
  const readFileStream = fs.createReadStream(path);
  let htmlData = "";
  readFileStream.on("data", (chunk) => (htmlData += chunk));
  readFileStream.on("error", (err) => {
    // console.log("hello");
    console.log("No such file exist", err);
    return err;
  });
  readFileStream.on("end", () => {
    // console.log(htmlData);
    return htmlData;
  });
};

module.exports = readLinkFromHtml;

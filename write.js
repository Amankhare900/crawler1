const fs = require("fs");
let WriteLinkToHtml = (path, htmlData, crawledLink) => {
  console.log("In write function ::");
  // console.log(path);
  if (htmlData === undefined) {
    return;
  }
  return new Promise((resolve) => {
    const writeBackUp = fs.createWriteStream(`${path}/${crawledLink}.html`);
    writeBackUp.write(htmlData);

    writeBackUp.end(() => resolve(`${path}/${crawledLink}.html`));
  });
};

module.exports = WriteLinkToHtml;
// let parser = (
//   path,
//   maxDepth,
//   depth,
//   htmlData,
//   queue,
//   sid,
//   baseUrl,
//   waitingQueue,
//   visitedUrls,
//   crawledLink
// ) => {
//   return new Promise((resolve, reject) => {
//     if (htmlData === undefined) {
//       reject(new Error("Data undefined"));
//     }
//     if (!fs.existsSync(path)) {
//       fs.mkdirSync(path);
//       crawledLink = 1;
//     }
//     const writeToHtml = fs.createWriteStream(`${path}/${crawledLink}.html`);
//     writeToHtml.write(htmlData);
//     writeToHtml.end();
//     resolve(`${path}/${crawledLink}.html`);
//   })
//     .then((path) => {
//       readLinkFromHtml(path);
//       let matchesLinks = getLinks(htmlData, baseUrl);
//       console.log(`crawling on url: ${baseUrl} for depth: ${depth}`);
//       return matchesLinks;
//     })
//     .then((matchesLinks) => {
//       for (const link of matchesLinks) {
//         if (!visitedUrls.has(link) && depth < maxDepth) {
//           if (depth < maxDepth) {
//             // count++;
//             // console.log(link);
//             queue.push({
//               // url: `http://127.0.0.1:8000${link}?sid=${sid}&depth=${
//               //   depth + 1
//               // }/`,
//               url: link,
//               depth: depth + 1,
//             });
//             visitedUrls.add(link);
//             // backUp(queue, waitingQueue, visitedUrls, sid);
//           }
//         }
//       }

//       backUp(queue, waitingQueue, visitedUrls, sid);
//       return { queue, waitingQueue, visitedUrls };
//     })
//     .catch((error) => {
//       console.log("Error in Reading and Writhing the Html Data", error);
//     });

//   // const readFileStream = fs.createReadStream(`${path}/${crawledLink}.html`);
//   // htmlData = "";
//   // readFileStream.on("data", (chunk) => (htmlData += chunk));
//   // readFileStream.on("error", (err) => reject(err));
//   // readFileStream.on("end", () => resolve(chunks));
// };

// module.exports = parser;

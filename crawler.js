const WriteLinkToHtml = require("./write");
const getLinks = require("./getlinks");
const fetchUrl = require("./fetchurl");
// const backUp = require("./backUp");
const rateLimiter = require("./ratelimiter");
const readLinkFromHtml = require("./read");
const fs = require("fs");
const { Console } = require("console");
// async function delay() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log(`currTime is: and oldTime is:  so delay: `);
//       resolve();
//     }, 2000);
//   });
// }
async function crawler(maxDepth, waitingQueue, queue, path, visitedUrls, sid) {
  // console.log(maxDepth, waitingQueue, queue, path, visitedUrls);
  if (queue.length === 0) {
    return;
  }
  let domainMap = new Map();
  domainMap.set("max_connection", 15);
  // console.log(queue);
  let WaitingQueueReplenishTime = Date.now();
  let fetchPromises = [];
  while (queue.length > 0 || waitingQueue.length > 0) {
    // while (true) {
    // if (queue.length === 0 && waitingQueue.length === 0) {
    // break;
    // }
    if (
      Date.now() - WaitingQueueReplenishTime === 60000 &&
      waitingQueue.length > 0
    ) {
      WaitingQueueReplenishTime = Date.now();
      while (waitingQueue.length > 0) {
        queue.unshift(waitingQueue.shift());
      }
      continue;
    }
    if (queue.length === 0) {
      continue;
    }
    console.log(queue);
    try {
      let connection_queue = [];
      while (queue.length > 0 && connection_queue.length != 15) {
        const { url, depth, crawledLink } = queue.shift();
        if (!rateLimiter(url, depth, domainMap, waitingQueue)) {
          continue;
        } else {
          connection_queue.push({ url, depth, crawledLink });
        }
      }

      console.log(connection_queue);
      // implementing the parallel promises in javascript

      fetchPromises = connection_queue.map(
        async ({ url, depth, crawledLink }) => {
          return fetchUrl(url, depth, crawledLink);
        }
      );
      connection_queue = [];
      let writePromises = [];
      await Promise.allSettled(fetchPromises)
        //results will we the arr of all the settled array
        .then((results) => {
          const resolvedResults = results.filter(
            (result) => result.status === "fulfilled"
          );
          if (resolvedResults.length > 0) {
            const firstResult = resolvedResults[0].value;
            if (!fs.existsSync(`${path}/htmlFile/${firstResult.newDepth}`)) {
              fs.mkdirSync(`${path}/htmlFile/${firstResult.newDepth}`);
              // crawledLink = 1;
              count = 1;
            }
            writePromises.push(
              WriteLinkToHtml(
                `${path}/htmlFile/${firstResult.newDepth}`,
                firstResult.html,
                firstResult.crawledLink
              )
                .then((path) => readLinkFromHtml(path))
                .then((htmlData) => {
                  // console.log(htmlData);
                  return getLinks(htmlData, firstResult.url);
                })
                .then((links) => {
                  return new Promise(() => {
                    // console.log(links);
                    for (const link of links) {
                      crawledLink = count;
                      if (
                        !visitedUrls.has(link) &&
                        firstResult.newDepth < maxDepth
                      ) {
                        count++;
                        queue.push({
                          url: link,
                          depth: firstResult.newDepth + 1,
                          crawledLink: crawledLink++,
                        });
                        visitedUrls.add(link);
                      }
                    }
                  });
                })
            );
          } else {
            console.log("All requests failed.");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      await Promise.allSettled(writePromises).then(() => {
        console.log(queue);
      });
    } catch (err) {
      console.error(`Error fetching`, err);
    }
  }
  console.log("complete fetching...");
  // }
}

module.exports = crawler;

// console.log(allPromises).then(() => {});
// await Promise.allSettled(allPromises).then(() => {});
// await Promise.allSettled(allPromises).then((data) => {
//   allPromises = data.filter((htmlData) => {
//     if (htmlData.status === "fulfilled") {
//       // console.log(htmlData.value);
//       if (!fs.existsSync(`${path}/htmlFile/${depth}`)) {
//         fs.mkdirSync(`${path}/htmlFile/${depth}`);
//         crawledLink = 1;
//       }
//       parser(
//         `${path}/htmlFile/${depth}`,
//         maxDepth,
//         depth,
//         htmlData.value,
//         queue,
//         sid,
//         url,
//         waitingQueue,
//         visitedUrls,
//         crawledLink
//       );
//       crawledLink++;
//       return false;
//     } else if (htmlData.status !== "rejected") {
//       console.log(htmlData.reason);
//       return true;
//     }
//   });
// });

// fs.writeFileSync(`${depth}.txt`, count.toString());

// if (queue.length === 0 && waitingQueue.length === 0) {
// url = `http://127.0.0.1:8000/stop_session?sid=${sid}`;
// fetch(url)
//   .then((response) => response.json())
//   .then((json) => {
//     console.log(json);
//     console.log("completed... ");
//   });

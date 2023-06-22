const WriteLinkToHtml = require("./write");
const getLinks = require("./getlinks");
const fetchUrl = require("./fetchurl");
const backUp = require("./backUp");
const rateLimiter = require("./ratelimiter");
const readLinkFromHtml = require("./read");
const fs = require("fs");
//remove the delay function
async function crawler(maxDepth, waitingQueue, queue, path, visitedUrls, sid) {
  // console.log(maxDepth, waitingQueue, queue, path, visitedUrls);

  console.log("visitedUrls", visitedUrls);
  if (queue.length === 0) {
    return;
  }
  let count = 0;
  let domainMap = new Map();
  domainMap.set("max_connection", 15);

  let WaitingQueueReplenishTime = Date.now();
  let fetchPromises = [];
  while (queue.length > 0 || waitingQueue.length > 0) {
    if (
      Date.now() - WaitingQueueReplenishTime >= 60000 &&
      waitingQueue.length > 0
    ) {
      console.log("replenishing the waiting queue");
      WaitingQueueReplenishTime = Date.now();
      while (waitingQueue.length > 0) {
        queue.unshift(waitingQueue.shift());
      }
      continue;
    }
    if (queue.length === 0) {
      continue;
    }
    // console.log("printing queue", queue);
    // added the setTimeout to stop the url to go again and again
    if (domainMap.get("max_connection") === 0) {
      console.log("waiting 30 sec");
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 30000);
      });
    }
    try {
      let connection_queue = [];

      while (queue.length > 0 && connection_queue.length != 15) {
        const { url, depth, crawledLink } = queue.shift();
        if (!rateLimiter(url, depth, domainMap, waitingQueue, crawledLink)) {
          continue;
        } else {
          connection_queue.push({ url, depth, crawledLink });
        }
      }

      // console.log("printing connection queue", connection_queue);
      // implementing the parallel promises in javascript

      fetchPromises = connection_queue.map(
        async ({ url, depth, crawledLink }) => {
          console.log(
            `fetching url ${url} for depth ${depth}, crawlerLink ${crawledLink}`
          );
          return fetchUrl(url, depth, crawledLink);
        }
      );
      connection_queue = [];
      let writePromises = [];
      if (fetchPromises.length > 0) {
        await Promise.allSettled(fetchPromises)
          //results will we the arr of all the settled array
          .then((results) => {
            const resolvedResults = results.filter(
              (result) => result.status === "fulfilled"
            );
            if (resolvedResults.length > 0) {
              // const firstResult = resolvedResults[0].value;
              // newly added line implemented
              // added the for loop to get all the result form the resolvedResults array

              resolvedResults.forEach((data) => {
                const firstResult = data.value;
                if (
                  !fs.existsSync(`${path}/htmlFile/${firstResult.newDepth}`)
                ) {
                  console.log(
                    `printing the new directory path :${path}/htmlFile/${firstResult.newDepth}`
                  );
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
                      return getLinks(htmlData, firstResult.url, visitedUrls);
                    })
                    .then((links) => {
                      return new Promise((resolve) => {
                        // console.log(visitedUrls);
                        // console.log(links);
                        for (const link of links) {
                          crawledLink = count;
                          if (firstResult.newDepth < maxDepth) {
                            count++;
                            queue.push({
                              url: link,
                              depth: firstResult.newDepth + 1,
                              crawledLink: crawledLink++,
                            });
                            // visitedUrls.add(link);
                          }
                          console.log("backUPing the data");
                        }
                        backUp(queue, waitingQueue, visitedUrls, sid);
                        resolve();
                      });
                    })
                    .then(() => {})
                );
              }); //
            } else {
              console.log("All requests failed.");
            }
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      } else {
        console.log("Promises array in empty");
      }
      if (writePromises.length > 0) {
        await Promise.allSettled(writePromises)
          .then(() => {
            console.log("writePromises completed");
            // console.log(queue);
          })
          .catch(() => {
            console.log("error in writePromises");
          });
      } else {
        console.log("writePromises array is empty");
      }
      writePromises = [];
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

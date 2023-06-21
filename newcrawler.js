const WriteLinkToHtml = require("./write");
const getLinks = require("./getlinks");
const fetchUrl = require("./fetchurl");
const backUp = require("./backUp");
const rateLimiter = require("./ratelimiter");
// const readLinkFromHtml = require("./read");
const fs = require("fs");

// count variable for checking the link in a depth

let count = 0;
async function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
async function crawler(maxDepth, waitingQueue, queue, path, visitedUrls, sid) {
  // map to implement the rateLimiter
  let domainMap = new Map();
  domainMap.set("max_connection", 15);
  // to check last time we remove the element from the waitingQueue
  let WaitingQueueReplenishTime = Date.now();

  // starting the crawling for the seed Url
  while (queue.length > 0 || waitingQueue.length > 0) {
    // checking the time when we replenish the waiting queue
    if (
      Date.now() - WaitingQueueReplenishTime === 60000 &&
      waitingQueue.length > 0
    ) {
      WaitingQueueReplenishTime = Date.now();
      while (waitingQueue.length > 0) {
        queue.unshift(waitingQueue.pop());
      }
      continue;
    }
    if (queue.length === 0) {
      continue;
    }
    // let { url, depth } = queue.shift();
    let { url, depth, crawledLink } = queue.shift();
    console.log(`removing url: ${url} of depth: ${depth} from the queue`);
    try {
      // if (!rateLimiter(url, depth, domainMap, waitingQueue)) {

      // checking for url to have token left or not
      if (!rateLimiter(url, depth, domainMap, waitingQueue, crawledLink)) {
        continue;
      }

      // fetching data from url

      let { htmlData, depth } = await fetchUrl(url, depth);
      if (!fs.existsSync(`${path}/htmlFile/${depth}`)) {
        fs.mkdirSync(`${path}/htmlFile/${depth}`);
        count = 1;
      }

      // writing the data to html file

      WriteLinkToHtml(`${path}/htmlFile/${depth}`, htmlData, crawledLink).then(
        (path) => {
          // reading the data from html file
          // let data = readLinkFromHtml(`${path}`);
        }
      );

      // crawledLink++;

      let matchesLinks = getLinks(htmlData, url);
      console.log(crawledLink);
      console.log(`crawling on url: ${url} for depth: ${depth}`);

      // adding the non visited link in the queue and visitedUrls

      for (const link of matchesLinks) {
        crawledLink = count;
        if (!visitedUrls.has(link) && depth < maxDepth) {
          count++;
          queue.push({
            url: link,
            depth: depth + 1,
            crawledLink: crawledLink++,
          });
          visitedUrls.add(link);
        }
      }
      // queue, waitingQueue, visitedUrls, sid;
      backUp(queue, waitingQueue, visitedUrls, sid);
      fs.writeFileSync(`${depth}.txt`, count.toString());
    } catch (err) {
      console.error(`Error fetching ${url}`, err);
    }
  }
  if (queue.length === 0 && waitingQueue.length === 0) {
    console.log("completed... ");
  }
}

module.exports = crawler;

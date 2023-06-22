const readlineSync = require("readline-sync");
const fs = require("fs");
// const crawler = require("./newcrawler.js");
const crawler = require("./crawler.js");
const backUp = require("./backUp");
let testing = readlineSync.question(
  "Do you want to Test the crawled Website(t/f): "
);
let seedUrl;
let maxDepth;
let queue = [];
let session_id = 1;
let test_session_id = 0;
let obj = {};
let path = "./sessions";

async function readBackUp(path) {
  const readBackUp = fs.createReadStream(
    `./${path}/backUp/backUp.txt`,
    "utf-8"
  );
  let chunks = "";
  return new Promise((resolve, reject) => {
    readBackUp.on("data", (chunk) => (chunks += chunk));
    readBackUp.on("error", (err) => reject(err));
    readBackUp.on("end", () => resolve(chunks));
  });
}

if (testing === "t") {
  test_session_id = readlineSync.question(
    "Enter the session_id that you want to test: "
  );
  path = `${path}/s_id${test_session_id}`;
  if (!fs.existsSync(path)) {
    console.log("That is the wrong session id no such directory exist!");
  } else {
    // const data = fs.readFileSync("path/backUp/backUp.txt", "utf-8");
    readBackUp(session_id).then((response) => {
      const { queue, waitingQueue, visitedUrls } = JSON.parse(response);
      let oldnNewdepth = readlineSync.question("Want to go with new depth");
      if (oldnNewdepth === t) {
        maxDepth = parseInt(
          readlineSync.question("enter your desired maximum Depth")
        );
      } else {
        const sessionData = fs.readFileSync("./session.json", "utf-8");
        maxDepth = JSON.parse(sessionData)[test_session_id][maxDepth];
      }
      crawler(maxDepth, waitingQueue, queue, path, visitedUrls);
    });
  }
} else {
  // getting the curr session_id to create
  const sessionData = fs.readFileSync("./total_session.txt", "utf-8");
  if (sessionData !== "") {
    session_id = parseInt(sessionData) + 1;
  }

  // reading all the data form session.json file to add the new session detail in it
  let objString = fs.readFileSync("./session.json", "utf-8");
  if (objString !== "") {
    obj = JSON.parse(objString);
  }

  // updating the new total session_id
  fs.writeFileSync("./total_session.txt", session_id.toString());
  path += `/s_id${session_id}`;
  // checking weather the new directory exist or not if not the create
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  if (!fs.existsSync(`${path}/backUp`)) {
    fs.mkdirSync(`${path}/backUp`, { recursive: true });
  }
  if (!fs.existsSync(`${path}/htmlFile`)) {
    fs.mkdirSync(`${path}/htmlFile`, { recursive: true });
  }

  if (!fs.existsSync(`${path}/filesPath`)) {
    fs.mkdirSync(`${path}/filesPath`, { recursive: true });
  }
  // getting the seedUrl form the cmd
  seedUrl = readlineSync.question("Enter the seedUrl for Crawl: ");

  //getting the max depth form the cmd to crawl

  maxDepth = readlineSync.question("Enter the Max Depth you want to crawl: ");

  obj[session_id] = { seedUrl, maxDepth };
  // making the visited set of url so we don't visit same url again and again
  let visitedUrls = new Set();

  visitedUrls.add(seedUrl);
  // console.log("visitedUrls", visitedUrls);
  //here [] implies the waitingQueue
  // queue, waitingQueue, visitedUrls, sid
  let setArray = Array.from(visitedUrls);
  backUp(queue, [], setArray, session_id);
  // updating the session.json file by adding the new session_id : url;
  fs.writeFileSync("./session.json", JSON.stringify(obj));

  queue.push({ url: seedUrl, depth: 1, crawledLink: 1 });
  // crawler(maxDepth, queue, path);
  crawler(maxDepth, [], queue, path, visitedUrls, session_id);
}

// new code start from here

// async function main() {
//   if (isCrash === "f") {
//     const response = await fetch(url);
//     const json = await response.json();
//     const sid = json.data;
//     let path = `./${sid}/htmlFile`;
//     console.log(sid);

//     fs.mkdirSync(`./${sid}`);
//     fs.mkdirSync(`./${sid}/backUp`);
//     fs.mkdirSync(`./${sid}/htmlFile`);
//     url = `http://127.0.0.1:8000/seed_session?sid=${sid}&depth=${depth}`;
//     queue.push({ url, depth });
//     backUp(queue, [], new Set(), sid);
//     console.log(queue);
//     crawler(maxDepth, [], queue, path, newSet(), sid);
//   } else {
//     let session_id = readline.question("give me the session_id: ");
//     if (fs.existsSync("./session_id")) {
//       console.log(`wrong session_id: ${session_id}`);
//     }
//     path = `./${session_id}/htmlFile`;
//     readBackUp(session_id).then((response) => {
//       const { queue, waitingQueue, visitedUrls } = JSON.parse(response);
//       crawler(maxDepth, waitingQueue, queue, path, visitedUrls, sid);
//     });
//   }
// }
// main();

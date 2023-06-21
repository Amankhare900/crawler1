// //hashmap to store the data in form of key value pair.

// // let domainMap = new Map();
// // let waitingQueue = [];
// // let max_connection = 15;

// function rateLimiter(url, depth, domainMap, waitingQueue) {
//   // function rateLimiter(url) {
//   let Url = new URL(url);
//   let domain = Url.hostname;
//   if (domainMap.get("max_connection") === 0) {
//     if (Date.now() - domainMap.get(domain).domain_time_stamp >= 2000) {
//       console.log(`replenishing the toke for domain ${domain}`);
//       domainMap.get(domain).curr_token = 1;
//       domainMap.get(domain).domain_time_stamp = Date.now();
//       domainMap.set("max_connection", 1);
//     } else {
//       setTimeout(() => {}, 1000);
//       // console.log("Max connection reached!");
//       // waitingQueue.push({ url: url, depth: depth, time_stamp: Date.now() });
//       waitingQueue.push({ url: url, depth: depth });
//       return false;
//     }
//   }
//   if (domainMap.has(domain)) {
//     if (Date.now() - domainMap.get(domain).domain_time_stamp >= 2000) {
//       console.log(`replenishing the toke for domain ${domain}`);
//       domainMap.get(domain).curr_token = 1;
//       domainMap.get(domain).domain_time_stamp = Date.now();
//       domainMap.set("max_connection", 1);
//     }
//     // console.log(Date.now() - domainMap.get(domain).domain_time_stamp);
//     if (domainMap.get(domain).curr_token === 0) {
//       // console.log(`Request limit exceeded`);
//       // waitingQueue.push({ url: url, time_stamp: Date.now() });
//       waitingQueue.push({ url: url, depth: depth });
//       return false;
//     } else {
//       console.log("request allowed");
//       //   decrementing current token by one as we have consumed it now.
//       domainMap.get(domain).curr_token -= 1;
//       domainMap.set("max_connection", domainMap.get("max_connection") - 1);
//       // domainMap.get(domain).url_time.push(Date.now());
//       // console.log(domainMap.get(domain));
//       return true;
//     }
//   } else {
//     console.log("adding domain to the hasMap");
//     domainMap.set(domain, {
//       //   url_time: [Date.now()],
//       domain_time_stamp: Date.now(),
//       curr_token: 0,
//     });
//     domainMap.set("max_connection", domainMap.get("max_connection") - 1);
//     return true;
//   }
// }

// // let callingRateLimiter = async () => {
// //   rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// //   rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// //   await setTimeout(() => {
// //     rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// //   }, 11000);
// //   //   rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// //   //   rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// //   //   rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// // };
// // callingRateLimiter();
// module.exports = rateLimiter;

//hashmap to store the data in form of key value pair.

// let domainMap = new Map();
// domainMap.set("max_connection", 8);
// let waitingQueue = [];
// let depth = 0;
function rateLimiter(url, depth, domainMap, waitingQueue, crawledLink) {
  // function rateLimiter(url) {
  let Url = new URL(url);
  let domain = Url.hostname;
  if (domainMap.get("max_connection") === 0) {
    if (Date.now() - domainMap.get(domain).domain_time_stamp >= 60000) {
      console.log(`replenishing the token for domain ${domain}`);
      domainMap.get(domain).curr_token += 1;
      domainMap.get(domain).url_time.shift();
      if (domainMap.get(domain).url_time.length === 0) {
        domainMap.get(domain).domain_time_stamp = Date.now();
      } else {
        domainMap.get(domain).domain_time_stamp =
          domainMap.get(domain).url_time[0];
      }
      domainMap.set("max_connection", domainMap.get("max_connection") + 1);
      // console.log(domainMap.get(domain));
    } else {
      setTimeout(() => {}, 30000);
      console.log("Max connection reached!");

      // waitingQueue.push({ url: url, depth: depth, time_stamp: Date.now() });
      waitingQueue.push({ url: url, depth: depth, crawledLink: crawledLink });
      return false;
    }
  }
  if (domainMap.has(domain)) {
    if (Date.now() - domainMap.get(domain).domain_time_stamp >= 60000) {
      console.log(`replenishing the toke for domain ${domain}`);
      domainMap.get(domain).curr_token += 1;
      domainMap.get(domain).url_time.shift();
      if (domainMap.get(domain).url_time.length === 0) {
        domainMap.get(domain).domain_time_stamp = Date.now();
      } else {
        domainMap.get(domain).domain_time_stamp =
          domainMap.get(domain).url_time[0];
      }
      domainMap.set("max_connection", domainMap.get("max_connection") + 1);
      // console.log(domainMap);
    }
    // console.log(Date.now() - domainMap.get(domain).domain_time_stamp);
    if (domainMap.get(domain).curr_token === 0) {
      // console.log(`Request limit exceeded`);
      // waitingQueue.push({ url: url, time_stamp: Date.now() });
      waitingQueue.push({ url: url, depth: depth, crawledLink: crawledLink });
      // console.log(domainMap);
      return false;
    } else {
      console.log("request allowed");
      console.log(domainMap.get("max_connection"));
      //   decrementing current token by one as we have consumed it now.
      domainMap.get(domain).curr_token -= 1;
      domainMap.set("max_connection", domainMap.get("max_connection") - 1);
      domainMap.get(domain).url_time.push(Date.now());
      // console.log(domainMap);
      return true;
    }
  } else {
    console.log("adding domain to the hasMap");
    domainMap.set(domain, {
      url_time: [Date.now()],
      domain_time_stamp: Date.now(),
      curr_token: 4,
    });
    domainMap.set("max_connection", domainMap.get("max_connection") - 1);
    return true;
  }
}

// let callingRateLimiter = async () => {
// rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// // await setTimeout(() => {
// //   rateLimiter("https://w3collective.com/get-domain-name-url-javascript/");
// // }, 11000);
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// rateLimiter("https://blog.logrocket.com/rate-limiting-node-js/");
// };
// callingRateLimiter();
module.exports = rateLimiter;

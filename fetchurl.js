async function fetchUrl(url, depth, crawledLink) {
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      return {
        url: url,
        html: data,
        newDepth: depth,
        crawledLink: crawledLink,
      };
    })
    .catch((error) => {
      return {
        url: url,
        error: error,
      };
    });
}

// async function fetchUrl(url) {
//   try {
//     const data = await fetch(url);
//     if (!data.ok) {
//       throw new Error(`HTTP error: ${data.status}`);
//     }
//     const json = await data.json();
//     console.log(json);
//   } catch (error) {
//     console.log("Error while fetching the data for url", url, "Error:", error);
//   }
// }
// fetchUrl();

// async function fetchUrl(url) {
//   fetch(url)
//     .then((res) => res.text())
//     .catch((error) => {
//       console.error(
//         "Error while fetching the data for url",
//         url,
//         "Error:",
//         error
//       );
//     });
// }

module.exports = fetchUrl;

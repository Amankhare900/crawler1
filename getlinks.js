let aTReg = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;

let getLinks = (htmlData, baseUrl, visitedUrls) => {
  console.log("inside the getLinks Function");
  let match;
  let links = [];
  return new Promise((resolve) => {
    while ((match = aTReg.exec(htmlData))) {
      const href = match[2];
      if (checkUrls(href)) {
        const absoluteUrl = new URL(href, baseUrl).href;
        if (!visitedUrls.has(absoluteUrl)) {
          visitedUrls.add(absoluteUrl);
          links.push(absoluteUrl);
        }
        // console.log(absoluteUrl);
        // links.add(absoluteUrl);
      }
    }
    // resolve(...links);
    // resolve(Array.from(links));
    resolve(links);
  });
};
//   while ((match = aTReg.exec(htmlData))) {
//     const href = match[2];
//     if (checkUrls(href)) {
//       const absoluteUrl = new URL(href, baseUrl).href;
//       links.add(absoluteUrl);
//     }
//   }
//   return [...links];

function checkUrls(href) {
  if (
    [
      "#",
      "mailto:",
      "javascript:",
      "tel:",
      "sms:",
      "data:",
      "skype:",
      "whatsapp:",
      "viber:",
      "facetime:",
      "callto:",
      "sip:",
      "geo:",
      "maps:",
      "fb-messenger:",
      "tg:",
      "intent:",
      "itms:",
      "itms-apps:",
      "market:",
      "chrome:",
      "chrome-extension:",
      "moz-extension:",
      "ms-browser-extension:",
      "edge:",
      "safari:",
      "opera:",
      "vivaldi:",
    ].some((prefix) => href.startsWith(prefix))
  )
    return false;
  if (
    [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".xls",
      ".xlsx",
      ".zip",
      ".rar",
      ".tar",
      ".gz",
      ".7z",
      ".mp4",
      ".mp3",
      ".avi",
      ".mkv",
      ".flv",
      ".mov",
      ".wmv",
      ".webm",
      ".ogg",
      ".wav",
      ".m4a",
      ".aac",
      ".flac",
      ".wma",
      ".alac",
      ".aiff",
      ".ape",
      ".opus",
      ".midi",
      ".js",
      ".css",
      ".xml",
      ".json",
      ".txt",
      ".csv",
      ".tsv",
      ".rtf",
      ".md",
    ].some((extension) => href.endsWith(extension))
  )
    return false;
  return true;
}

module.exports = getLinks;

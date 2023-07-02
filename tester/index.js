const { JSDOM } = require("jsdom");

function extractText(htmlData) {
  const dom = new JSDOM(htmlData);
  const document = dom.window.document;

  let bodyChildNodes = document.body.childNodes;
  // remove text {} from childNodes
  let headerChildNodes = document.head.childNodes;

  headerText = "";

  headerChildNodes = Array.from(headerChildNodes).filter((node) => {
    if (node.nodeType === node.TEXT_NODE) {
      if (!node.textContent || node.textContent.trim() === "") {
        return false;
      } else {
        return true;
      }
    } else if (node.nodeType === node.COMMENT_NODE) {
      return false;
    } else if (
      node.tagName === "META" ||
      node.getAttribute("content") != null ||
      node.tagName === "TITLE"
    ) {
      return true;
    }
  });

  for (node in headerChildNodes) {
    if (headerChildNodes.length - 1 === node) {
      if (headerChildNodes[node].tagName === "META") {
        headerText += headerChildNodes[node].getAttribute("content").trim();
      } else {
        headerText += headerChildNodes[node].textContent.trim();
      }
    } else {
      if (headerChildNodes[node].tagName === "META") {
        if (headerChildNodes[node].getAttribute("content") !== null) {
          headerText +=
            headerChildNodes[node].getAttribute("content").trim() + " ";
        }
      } else {
        headerText += headerChildNodes[node].textContent.trim() + " ";
      }
    }
  }

  bodyChildNodes = Array.from(bodyChildNodes).filter((node) => {
    if (node.nodeType === node.TEXT_NODE) {
      if (!node.textContent || node.textContent.trim() === "") {
        return false;
      } else {
        return true;
      }
    } else if (node.nodeType === node.COMMENT_NODE) {
      return false;
    } else if (node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
      return true;
    }
  });
  bodyText = "";
  for (node in bodyChildNodes) {
    if (bodyChildNodes.length - 1 === node) {
      bodyText += bodyChildNodes[node].textContent.trim();
    } else {
      bodyText += bodyChildNodes[node].textContent.trim() + " ";
    }
  }

  return { headerText, bodyText };
}

function getTextFromHtml(htmlData, url) {
  let { headerText, bodyText } = extractText(htmlData);
  //   console.log(extractedText.toLowerCase().split(/\W+/));

  headerText = headerText.split(/\W+/);
  bodyText = bodyText.split(/\W+/);
  headerText.pop();
  bodyText.pop();
  return [headerText, bodyText];
}

// getTextFromHtml();
module.exports = { getTextFromHtml };

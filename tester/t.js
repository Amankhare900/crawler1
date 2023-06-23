const { JSDOM } = require("jsdom");
let html = `
<head>
<meta name="robots" />
<meta name="keywords" content ="codeQuotient, codeQuotient, code Quotient" />
<title> Launchpad of your Tech career | codeQuotient</title>
</head>`;

const dom = new JSDOM(html);
const document = dom.window.document;

let headerChildNodes = document.head.childNodes;
headerText = "";

headerChildNodes = Array.from(headerChildNodes).filter((node) => {
  if (node.nodeType === node.TEXT_NODE) {
    if (!node.textContent || node.textContent.trim() === "") {
      //   console.log("returning false", node);
      return false;
    } else {
      //   console.log("returning true", node);
      return true;
    }
  } else if (node.nodeType === node.COMMENT_NODE) {
    // console.log(node);
    return false;
  } else if (node.tagName === "META" || node.tagName === "TITLE") {
    console.log(node);
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
      headerText += headerChildNodes[node].getAttribute("content").trim() + " ";
    } else {
      headerText += headerChildNodes[node].textContent.trim() + " ";
    }
  }
}

let arr = headerText.split(/\W+/);
arr.pop();
console.log(arr);

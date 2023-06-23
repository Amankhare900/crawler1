const { getTextFromHtml } = require("./index");

const { test, expect } = require("@jest/globals");

test("getTextFromHTML", () => {
  const input = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="robots" />
  <meta name="keywords" content ="codeQuotient, codeQuotient, code Quotient" />
  <title> Launchpad of your Tech career | codeQuotient</title>
  </head>
  <body>
      <h1>This is a heading</h1>
      <p>This is a paragraph.</p>
      <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
      </ul>
      <div>
          <p>Nested paragraph inside a div.</p>
      </div>
  </body>
  </html>
    `;
  const actual = getTextFromHtml(input);
  let expected = [
    [
      "codeQuotient",
      "codeQuotient",
      "code",
      "Quotient",
      "Launchpad",
      "of",
      "your",
      "Tech",
      "career",
      "codeQuotient",
    ],
    [
      "This",
      "is",
      "a",
      "heading",
      "This",
      "is",
      "a",
      "paragraph",
      "Item",
      "1",
      "Item",
      "2",
      "Item",
      "3",
      "Nested",
      "paragraph",
      "inside",
      "a",
      "div",
    ],
  ];
  expect(actual).toEqual(expected);
});

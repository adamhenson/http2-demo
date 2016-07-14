'use strict';

function getHTML(options) {
  let html = `
<html>
  <head>
    <title>${options.title}</title>
    <link href="/public/images/favicon.ico" rel="icon" type="image/x-icon" />
    <link href="/public/css/main.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <h2>${options.title}</h2>
    <div id="image">
      <p>Waiting 1 second, then loading image...</p>
    </div>
    <script src="/public/js/main.js"></script>
  </body>
</html>
`;

  return html;
}

module.exports = getHTML;
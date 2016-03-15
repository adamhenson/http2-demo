const HTML = `
<html>
  <head>
    <title>Hello HTTP/2</title>
    <link href="/public/images/favicon.ico" rel="icon" type="image/x-icon" />
    <link href="/public/css/main.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <h2>Hello HTTP/2</h2>
    <div id="image">
      <p>Waiting 1 second, then loading image...</p>
    </div>
  </body>
  <script>
    setTimeout(function(){
      document.getElementById('image').innerHTML = '<img src="/public/images/nyc.jpg"/>';
    }, 1000);
  </script>
</html>
`;

module.exports = {
  HTML
};
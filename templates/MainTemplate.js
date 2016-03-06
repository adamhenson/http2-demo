'use strict';

class MainTemplate {

  static output(files){
    let cssPath = files[0].path;
    let imagePath = files[1].path;
    let markup = `
<html>
  <head>
    <title>Hello HTTP/2</title>
    <link href="${cssPath}" rel="stylesheet" type="text/css">
  </head>
  <body>
    <h2>Hello HTTP/2</h2>
    <div id="image">
      <p>Waiting 1 second, then loading image...</p>
    </div>
  </body>
  <script>
    setTimeout(function(){
      document.getElementById('image').innerHTML = '<img src="${imagePath}"/>';
    }, 1000);
  </script>
</html>
    `;
    // return markup without blank lines
    return markup.replace(/^\s*\n/gm, ''); 
  }
  
}

module.exports = MainTemplate;
'use strict';

class MainTemplate {

  static output(options){
    let markup = `
<html>
  <head>
    <title>Hello HTTP/2</title>
    <link href="${options.css}" rel="stylesheet" type="text/css">
  </head>
  <body>
    <h2>Hello HTTP/2</h2>
    <div id="image">
      <p>Waiting 1 second, then loading image...</p>
    </div>
  </body>
  <script>
    setTimeout(function(){
      document.getElementById('image').innerHTML = '<img src="${options.image}"/>';
    }, 1000);
  </script>
</html>
    `;
    // return markup without blank lines
    return markup.replace(/^\s*\n/gm, ''); 
  }
  
}

module.exports = MainTemplate;
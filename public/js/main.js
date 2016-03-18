// Waiting one second and loading the image to prove the file read
// stream stays open.
setTimeout(function(){
  document.getElementById('image').innerHTML = '<img src="/public/images/nyc.jpg"/>';
}, 1000);
var Leap = require('./node_modules/leapjs');
var options = {
    host: '127.0.0.1',
    port: 8080,
    //Don't receive frames when not in foreground app
    background: false,
    useAllPlugins: true,
    enableGestures: true
  };

  //Just to adjust the options no more
var Controller = new Leap.Controller(options);

  
  

var thumbDetails = function(thumb){
    var ditsalDirection = thumb.distal.direction();
    var proximalDirection = thumb.proximal.direction();
    var metacarpalDirection = thumb.metacarpal.direction();
    var upAngle = Math.acos(Leap.vec3.dot(ditsalDirection, proximalDirection)) * (180 / Math.PI);
    var downAngle = Math.acos(Leap.vec3.dot(proximalDirection, metacarpalDirection)) * (180 / Math.PI);
};
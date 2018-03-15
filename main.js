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


var controller = Leap.loop(Controller, function(frame) {
    
    if(frame.hands.length > 0){
        thumbDetails(frame.hands[0].thumb);
        pinkyFinger(frame.hands[0].pinky);
    }
  });     

var thumbDetails = function(thumb){
    var ditsalDirection = thumb.distal.direction();
    var proximalDirection = thumb.proximal.direction();
    var metacarpalDirection = thumb.metacarpal.direction();
    var upAngle = Math.acos(Leap.vec3.dot(ditsalDirection, proximalDirection)) * (180 / Math.PI);
    var downAngle = Math.acos(Leap.vec3.dot(proximalDirection, metacarpalDirection)) * (180 / Math.PI);

};



var pinkyFinger = function(pinky) {
  var pinkyDistal = pinky.distal.direction();
  var pinkyMedial = pinky.medial.direction();
  var pinkyProximal = pinky.proximal.direction();
  var pinkyMetacarpal = pinky.metacarpal.direction();

  var distal_medial = Math.acos(Leap.vec3.dot(pinkyDistal, pinkyMedial));
  var medial_proximal = Math.acos(Leap.vec3.dot(pinkyMedial, pinkyProximal));
  var proximal_metacarpal = Math.acos(Leap.vec3.dot(pinkyProximal, pinkyMetacarpal));

  console.log("Angle between distal and medial: " + distal_medial * 180 / Math.PI);
  console.log("Angle between medial and proximal: " + medial_proximal * 180 / Math.PI);
  console.log("Angle between Proximal and Metacarpal: " + proximal_metacarpal * 180 / Math.PI);
}; 

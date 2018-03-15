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
        thumbFinger(frame.hands[0].thumb);
        indexFinger(frame.hands[0].indexFinger);
        middleFinger(frame.hands[0].middleFinger);
        ringFinger(frame.hands[0].ringFinger);
        pinkyFinger(frame.hands[0].pinky);
    }
  });     

var thumbFinger = function(thumb){
    var thumbDistal = thumb.distal.direction();
    var thumbProximal = thumb.proximal.direction();
    var thumbMetacarpal = thumb.metacarpal.direction();
    var distal_proximal = Math.acos(Leap.vec3.dot(thumbDistal, thumbProximal)) * (180 / Math.PI);
    var proximal_metacarpal = Math.acos(Leap.vec3.dot(thumbProximal, thumbMetacarpal)) * (180 / Math.PI);
};

var indexFinger = function(index)
{
    var indexDistal = index.distal.direction();
    var indexMedial = index.medial.direction();
    var indexProximal = index.proximal.direction();
    var indexMetacarpal = index.metacarpal.direction();
  
    var distal_medial = Math.acos(Leap.vec3.dot(indexDistal, indexMedial)) * (180 / Math.PI);
    var medial_proximal = Math.acos(Leap.vec3.dot(indexMedial, indexProximal)) * (180 / Math.PI);
    var proximal_metacarpal = Math.acos(Leap.vec3.dot(indexProximal, indexMetacarpal)) * (180 / Math.PI);
};

var middleFinger = function(middle)
{
    var middleDistal = middle.distal.direction();
    var middleMedial = middle.medial.direction();
    var middleProximal = middle.proximal.direction();
    var middleMetacarpal = middle.metacarpal.direction();
  
    var distal_medial = Math.acos(Leap.vec3.dot(middleDistal, middleMedial)) * (180 / Math.PI);
    var medial_proximal = Math.acos(Leap.vec3.dot(middleMedial, middleProximal)) * (180 / Math.PI);
    var proximal_metacarpal = Math.acos(Leap.vec3.dot(middleProximal, middleMetacarpal)) * (180 / Math.PI);
};

var ringFinger = function(ring)
{
    var ringDistal = ring.distal.direction();
    var ringMedial = ring.medial.direction();
    var ringProximal = ring.proximal.direction();
    var ringMetacarpal = ring.metacarpal.direction();
  
    var distal_medial = Math.acos(Leap.vec3.dot(ringDistal, ringMedial)) * (180 / Math.PI);
    var medial_proximal = Math.acos(Leap.vec3.dot(ringMedial, ringProximal)) * (180 / Math.PI);
    var proximal_metacarpal = Math.acos(Leap.vec3.dot(ringProximal, ringMetacarpal)) * (180 / Math.PI);
};



var pinkyFinger = function(pinky) {
  var pinkyDistal = pinky.distal.direction();
  var pinkyMedial = pinky.medial.direction();
  var pinkyProximal = pinky.proximal.direction();
  var pinkyMetacarpal = pinky.metacarpal.direction();

  var distal_medial = Math.acos(Leap.vec3.dot(pinkyDistal, pinkyMedial)) * (180 / Math.PI);
  var medial_proximal = Math.acos(Leap.vec3.dot(pinkyMedial, pinkyProximal)) * (180 / Math.PI);
  var proximal_metacarpal = Math.acos(Leap.vec3.dot(pinkyProximal, pinkyMetacarpal)) * (180 / Math.PI);

  console.log("Angle between distal and medial: " + distal_medial);
  console.log("Angle between medial and proximal: " + medial_proximal);
  console.log("Angle between Proximal and Metacarpal: " + proximal_metacarpal);
}; 

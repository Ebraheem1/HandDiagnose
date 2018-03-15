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

var pinkyFinger = function(pinky) {
  var indexDistal = pinky.distal.direction();
  var indexMedial = pinky.medial.direction();
  var indexProximal = pinky.proximal.direction();
  var indexMetacarpal = pinky.metacarpal.direction();

  var distal_medial = Math.acos(Leap.vec3.dot(indexDistal, indexMedial));
  var medial_proximal = Math.acos(Leap.vec3.dot(indexMedial, indexProximal));
  var proximal_metacarpal = Math.acos(Leap.vec3.dot(indexProximal, indexMetacarpal));

  console.log("Angle between distal and medial: " + distal_medial * 180 / Math.PI);
  console.log("Angle between medial and proximal: " + medial_proximal * 180 / Math.PI);
  console.log("Angle between Proximal and Metacarpal: " + proximal_metacarpal * 180 / Math.PI);
}

var Leap = require('./node_modules/leapjs');
const delay = require('delay');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({headers: ["0", "1","2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]});
var fs = require('fs');
writer.pipe(fs.createWriteStream('static-measurements.csv'));
var arr = new Array(14);
var terminate = 0;
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

function terminateFunc(){
    if(terminate != 3)
    {
        terminate = 3;
        console.log('Measurement is done');
        writer.end();
    }
};

var controller = Leap.loop(Controller, function(frame) {
    if(frame.hands.length > 0){
        if(terminate == 0)
        {
            terminate = 0.1;
            delay(1070)
            .then(() => {
                terminate = 1;
                console.log('Waiting is done');
            });
        }
        else if(terminate == 1)
        {
            terminate = 2;
            setTimeout(terminateFunc, 3060);
        }
        if((terminate == 1) || (terminate == 2)){
            thumbFinger(frame.hands[0].thumb);
            indexFinger(frame.hands[0].indexFinger);
            middleFinger(frame.hands[0].middleFinger);
            ringFinger(frame.hands[0].ringFinger);
            pinkyFinger(frame.hands[0].pinky);
            writer.write(arr);
        }
    }
  });     

var thumbFinger = function(thumb){
    var thumbDistal = thumb.distal.direction();
    var thumbProximal = thumb.proximal.direction();
    var thumbMetacarpal = thumb.metacarpal.direction();
    var distal_proximal = Math.acos(Leap.vec3.dot(thumbDistal, thumbProximal)) * (180 / Math.PI);
    var proximal_metacarpal = Math.acos(Leap.vec3.dot(thumbProximal, thumbMetacarpal)) * (180 / Math.PI);
    arr[0] = distal_proximal;
    arr[1] = proximal_metacarpal;
    // console.log("Angle between distal and proximal: " + distal_proximal);
    // console.log("Angle between proximal and metacarpal: " + proximal_metacarpal);
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
    arr[2] = distal_medial;
    arr[3] = medial_proximal;
    arr[4] = proximal_metacarpal;
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
    arr[5] = distal_medial;
    arr[6] = medial_proximal;
    arr[7] = proximal_metacarpal;
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
    arr[8] = distal_medial;
    arr[9] = medial_proximal;
    arr[10] = proximal_metacarpal;
    
};



var pinkyFinger = function(pinky) {
  var pinkyDistal = pinky.distal.direction();
  var pinkyMedial = pinky.medial.direction();
  var pinkyProximal = pinky.proximal.direction();
  var pinkyMetacarpal = pinky.metacarpal.direction();

  var distal_medial = Math.acos(Leap.vec3.dot(pinkyDistal, pinkyMedial)) * (180 / Math.PI);
  var medial_proximal = Math.acos(Leap.vec3.dot(pinkyMedial, pinkyProximal)) * (180 / Math.PI);
  var proximal_metacarpal = Math.acos(Leap.vec3.dot(pinkyProximal, pinkyMetacarpal)) * (180 / Math.PI);
  arr[11] = distal_medial;
  arr[12] = medial_proximal;
  arr[13] = proximal_metacarpal;
//   console.log("Angle between distal and medial: " + distal_medial);
//   console.log("Angle between medial and proximal: " + medial_proximal);
//   console.log("Angle between Proximal and Metacarpal: " + proximal_metacarpal);

}; 

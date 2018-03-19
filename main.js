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
    console.log("directions: " + distal_medial);
    // console.log("directions: " + medial_proximal);
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


///////////////////////////////////////////////////////////////////////////////////////////////

var indexFinger2 = function(index) {
  // angle of the distal interphalangeal joint
  // fingerTip = index.stabilizedTipPosition;
  fingerTip = index.distal.nextJoint;
  fingerTipX = fingerTip[0];
  fingerTipY = fingerTip[1];
  fingerTipZ = fingerTip[2];

  // angle of the proximal interphalangeal joint
  distalJoint = index.dipPosition;
  distalX = distalJoint[0];
  distalY = distalJoint[1];
  distalZ = distalJoint[2];
  // console.log(distalX, distalY, distalZ);

  proximalJoint = index.pipPosition;
  proximalX = proximalJoint[0];
  proximalY = proximalJoint[1];
  proximalZ = proximalJoint[2];

  metacarpalJoint = index.mcpPosition;
  metacarpalX = metacarpalJoint[0];
  metacarpalY = metacarpalJoint[1];
  metacarpalZ = metacarpalJoint[2];

  tip_distal = Math.sqrt(Math.pow(distalX - fingerTipX, 2) + Math.pow(distalY - fingerTipY, 2) + Math.pow(distalZ - fingerTipZ, 2));

  tip_proximal = Math.sqrt(Math.pow(proximalX - fingerTipX, 2) + Math.pow(proximalY - fingerTipY, 2) + Math.pow(proximalZ - fingerTipZ, 2));
  // a
  distal_proximal = Math.sqrt(Math.pow(distalX - proximalX, 2) + Math.pow(distalY - proximalY, 2) + Math.pow(distalZ - proximalZ, 2));
  // b
  proximal_metacarpal = Math.sqrt(Math.pow(proximalX - metacarpalX, 2) + Math.pow(proximalY - metacarpalY, 2) + Math.pow(proximalZ - metacarpalZ, 2));
  // c
  distal_metacarpal = Math.sqrt(Math.pow(distalX - metacarpalX, 2) + Math.pow(distalY - metacarpalY, 2) + Math.pow(distalZ - metacarpalZ, 2));

  distal_medial = Math.acos((Math.pow(tip_distal, 2) + Math.pow(distal_proximal, 2) - Math.pow(tip_proximal, 2)) / (2 * tip_distal * distal_proximal));

  medial_proximal = Math.acos((Math.pow(distal_proximal, 2) + Math.pow(proximal_metacarpal, 2) - Math.pow(distal_metacarpal, 2)) / (2 * distal_proximal * proximal_metacarpal));

  console.log("Positions: " + (180-(distal_medial * (180 / Math.PI))));
  // console.log("Positions: " + (180-(medial_proximal * (180 / Math.PI))));
}

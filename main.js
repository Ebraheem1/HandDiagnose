var Leap = require('./node_modules/leapjs');
const delay = require('delay');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({headers: ["ThumbDIP", "ThumbPIP","IndexDIP", "IndexPIP", 
 "IndexMCP", "MiddleDIP", "MiddlePIP", "MiddleMCP", "RingDIP", "RingPIP",
 "RingMCP", "PinkyDIP", "PinkyPIP", "PinkyMCP", "TI", "IM", "MR", "RP",
 "Wrist Angle Upward", "Wrist Angle Downward"]});
/**
 * TI-> Angle between Thumb and Index Fingers
 * IM -> Angle between Index and Middle Fingers
 * MR -> Angle between Middle and Ring Fingers
 * RP -> Angle between Ring and Pinky Fingers
 */

var fs = require('fs');
writer.pipe(fs.createWriteStream('static-measurements.csv'));
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var terminate = 0;
var angleCounter = 0;
var wristAngleUp = 0;
var wristAngleDown = 0;
var options = {
    host: '127.0.0.1',
    port: 8080,
    background: true,
    useAllPlugins: true,
    enableGestures: true
};



//Just to adjust the options no more
var Controller = new Leap.Controller(options);

function terminateFunc(){
    if(terminate == 2)
    {
        terminate = 3;
        console.log('Finger Measurements are done, Move Your hand up with fixed wrist');
        for(var i =0; i < arr.length; i++)
        {
            arr[i] /= angleCounter;
        }
    }else if(terminate == 4)
    {
        terminate = 5;
        console.log('Wrist Upward Measurements are done, Move Your hand down with fixed wrist');
        arr[18] /= wristAngleUp;
    }else if(terminate == 6)
    {
        terminate = 7;
        console.log('Measurements are done');
        arr[19] /= wristAngleDown;
        writer.write(arr);
        writer.end();
    }
};

var controller = Leap.loop(Controller, function(frame) {
    if(frame.hands.length > 0){
        
        if(terminate == 0)
        {
            //here is a delay to ensure that the hand of the patient is in the right position
            //so we wait for only one sec
            terminate = 0.1;
            delay(1070)
            .then(() => {
                terminate = 1;
                console.log('Waiting is done');
            });
        }
        else if(terminate == 1)
        {
            //Here we wait for 4 secs to get the measurements between the fingers
            //like the angles between the fingers
            //and the angles between the joints of each finger
            terminate = 2;
            //this function waits for 4 seconds
            setTimeout(terminateFunc, 4060);
        }
        if((terminate == 1) || (terminate == 2)){
            //Here we call the measurement functions for 4 secs as mentioned above
            if(frame.hands[0].valid)
            {
                angleCounter++;
                measuringAngleBetweenFingers(frame.hands[0]);
            } 
            if(frame.hands[0].thumb.valid) thumbFinger(frame.hands[0].thumb);
            if(frame.hands[0].indexFinger.valid) indexFinger(frame.hands[0].indexFinger);
            if(frame.hands[0].middleFinger.valid) middleFinger(frame.hands[0].middleFinger);
            if(frame.hands[0].ringFinger.valid) ringFinger(frame.hands[0].ringFinger);
            if(frame.hands[0].pinky.valid) pinkyFinger(frame.hands[0].pinky);
        }
        else if(terminate == 3)
        {
            //here we wait for 2 secs in order to leave a room for the patient
            //to change his hand position to measure the wrist threshold upward
            terminate = 3.1;
            delay(2070)
            .then(() => {
                terminate = 4;
                console.log('Waiting For Up Wrist Position is done');
                //we measure the wrist angle upward for 3 secs.
                setTimeout(terminateFunc, 3060);
            });
        }
        else if(terminate == 4)
        {
            
            if(frame.hands[0].valid)
            {
                wristAngleUp++;
                measuringWristAngle(frame.hands[0]);
            }
        } else if(terminate == 5)
        {
            //here we wait for 2 secs in order to leave a room for the patient
            //to change his hand position to measure the wrist threshold downward
            terminate = 5.1;
            delay(2070)
            .then(() => {
                terminate = 6;
                console.log('Waiting For Down Wrist Position is done');
                //we measure the wrist angle downward for 3 secs.
                setTimeout(terminateFunc, 3060);
            });
        }
        if(terminate == 6)
        {
            if(frame.hands[0].valid)
            {
                wristAngleDown++;
                measuringWristAngle(frame.hands[0]);
            }
        }
    }
  });

var measuringWristAngle = function(hand){
    var armDirection = hand.arm.direction();
    var handDirection = hand.direction;

    var wristAngle = Math.acos(Leap.vec3.dot(armDirection, handDirection)) * (180 / Math.PI);
    if(wristAngleDown == 0)
        arr[18] += wristAngle;
    else 
        arr[19] += wristAngle;
};
var measuringAngleBetweenFingers = function(hand)
{
    var thumbDirection = hand.thumb.medial.direction();
    var indexDirection = hand.indexFinger.proximal.direction();
    var middleDirection = hand.middleFinger.proximal.direction();
    var ringDirection = hand.ringFinger.proximal.direction();
    var pinkyDirection = hand.pinky.proximal.direction();

    var thumbIndexAngle = Math.acos(Leap.vec3.dot(thumbDirection, indexDirection)) * (180 / Math.PI);
    var indexMidAngle = Math.acos(Leap.vec3.dot(indexDirection, middleDirection)) * (180 / Math.PI);
    var midRingAngle = Math.acos(Leap.vec3.dot(middleDirection, ringDirection)) * (180 / Math.PI);
    var ringPinkyAngle = Math.acos(Leap.vec3.dot(ringDirection, pinkyDirection)) * (180 / Math.PI);
          
    arr[14] += thumbIndexAngle;
    arr[15] += indexMidAngle;
    arr[16] += midRingAngle;
    arr[17] += ringPinkyAngle;
};



var thumbFinger = function(thumb){
    var thumbDistal = thumb.distal.direction();
    var thumbMedial = thumb.medial.direction();
    var thumbProximal = thumb.proximal.direction();
    var distal_medial = Math.acos(Leap.vec3.dot(thumbDistal, thumbMedial)) * (180 / Math.PI);
    var medial_proximal = Math.acos(Leap.vec3.dot(thumbMedial, thumbProximal)) * (180 / Math.PI);
    arr[0] += distal_medial;
    arr[1] += medial_proximal;
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
    arr[2] += distal_medial;
    arr[3] += medial_proximal;
    arr[4] += proximal_metacarpal;
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
    arr[5] += distal_medial;
    arr[6] += medial_proximal;
    arr[7] += proximal_metacarpal;
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
    arr[8] += distal_medial;
    arr[9] += medial_proximal;
    arr[10] += proximal_metacarpal;

};



var pinkyFinger = function(pinky) {
  var pinkyDistal = pinky.distal.direction();
  var pinkyMedial = pinky.medial.direction();
  var pinkyProximal = pinky.proximal.direction();
  var pinkyMetacarpal = pinky.metacarpal.direction();

  var distal_medial = Math.acos(Leap.vec3.dot(pinkyDistal, pinkyMedial)) * (180 / Math.PI);
  var medial_proximal = Math.acos(Leap.vec3.dot(pinkyMedial, pinkyProximal)) * (180 / Math.PI);
  var proximal_metacarpal = Math.acos(Leap.vec3.dot(pinkyProximal, pinkyMetacarpal)) * (180 / Math.PI);
  arr[11] += distal_medial;
  arr[12] += medial_proximal;
  arr[13] += proximal_metacarpal;
};




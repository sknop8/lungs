const THREE = require('three');
import pitchHelper from './pitchHelper'
var playing = false;
var context;
var sourceNode;
var gainNode;
var analyser;
var buffer;
var jsNode;
var splitter;
var reset = true;
function init(path, initWorlds) {
  if (! window.AudioContext) { // check if the default naming is enabled, if not use the chrome one.
      if (! window.webkitAudioContext) alert('no audiocontext found');
      window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();
  loadSound(path, initWorlds);
}

// load the specified sound
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      if(!buffer) {
          // Error decoding file data
          return;
      }
      sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;

      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 2048;

      sourceNode.connect(analyser);

      gainNode = context.createGain();
      sourceNode.connect(gainNode);
      gainNode.connect(context.destination);
      reset = true;

      playing = true;
    }, (e) => {console.log(e)});
  }
  request.send();
}

function stopSound() {
  sourceNode.stop();
  playing = false;
}

function mute() {
  gainNode.gain.value = 0;
}

function unmute(){
  gainNode.gain.value = 1;
}

function isPlaying() {
  return playing;
}

function setMusic(name, updateAnalysers) {
  stopSound();
  playOnLoad('./audio/' + name + '.mp3', updateAnalysers);
}

function playSound() {
  sourceNode.start(0);
  playing = true;
}

function getAverageVolume(array) {
   var values = 0;
   for (var i = 0; i < array.length; i++) {
     values += array[i];
   }
   return values / array.length;
}

// Calculated based on the volume / amplitude
function getSizeFromSound() {
  var arr =  new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(arr);
  return getAverageVolume(arr);
}


function detectPitch() {
	var buffer = new Uint8Array(analyser.fftSize);
	analyser.getByteTimeDomainData(buffer);

	var fundamentalFreq = pitchHelper.findFundamentalFreq(buffer,context.sampleRate);

	if (fundamentalFreq !== -1) {
    return fundamentalFreq
  }
}

// Returns a new color based on the given color
// Calculated based on the pitch of the audio
function getColorFromSound(oldColor) {
  var color = oldColor;
    var pitch = detectPitch();
    if (pitch) {
      var hex = Math.floor(pitch).toString(16);
      hex = ("000" + hex).substr(-3);
      color = new THREE.Color("#" + hex);

      var r = 0.8 * oldColor.r + 0.2 * color.r;
      var g = 0.8 * oldColor.g + 0.2 * color.g;
      var b = 0.8 * oldColor.b + 0.2 * color.b;
      color = new THREE.Color(r,g,b);
      // console.log(color);
    }
  return color;
}

function getRateFromSound() {
  //TODO: implement according to bpm
  return 0;
}

export default {
  playSound: playSound,
  getAnalyser: getAnalyser,
  getSourceJS: getSourceJS,
  getArray: getArray,
  init: init,
  mute: mute,
  unmute: unmute,
  setMusic: setMusic,
  isPlaying: isPlaying,
  getSizeFromSound: getSizeFromSound,
  getColorFromSound: getColorFromSound,
  getRateFromSound: getRateFromSound
}


const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Audio from './audio'

var clock = new THREE.Clock(false);

// scene nodes
var scene;
var camera;
var directionalLight;

var audioControl = { 'mute': false };

function onLoad(framework) {
  scene = framework.scene;
  camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 5, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // var backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  // backLight.color.setHSL(0.1, 1, 0.95);
  // backLight.position.set(1, 1, -2);
  // backLight.position.multiplyScalar(10);
  // scene.add(backLight);

  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 20));
  camera.updateProjectionMatrix();

  Audio.init();

  gui.add(audioControl, 'mute').onChange(function(newVal) {
    if (newVal) {
      Audio.mute()
    } else {
      Audio.unmute()
    }
  })

}

function onUpdate(framework) {

  // if (Audio.isPlaying()) {
  //   var size = Audio.getSizeFromSound();
  //   var bg = scene.background ? scene.background : new THREE.Color(0,0,0);
  //   var color = Audio.getColorFromSound(bg);
  //   scene.background = color;
  // }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

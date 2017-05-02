
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'
import FlowerWorld from './worlds/flowerWorld'
import WaterWorld from './worlds/waterWorld'
import CrystalWorld from './worlds/crystalWorld'

import Audio from './audio'

// initialize global clock
var clock =new THREE.Clock(false);
var cameraControls;

var koiGeo;

// worlds
var flowerWorld;
var waterWorld;
var crystalWorld;
var currentWorld;

// scene nodes
var scene;
var camera;
var directionalLight;

var humble = "./audio/humble.mp3";
var wildcat = "./audio/wildcat.mp3";
var flowers = "./audio/the-deli-flowers.mp3";


var music = {
  humble: 1,
  wildcat: 2,
  flowers: 3,
};

var song = music.flowers;

var audioControl = { 'mute': false, 'music': 'smooth operator' };
var planetControl = {'planet': 'flower'};

var cameraOffset = 20;
// called after the scene loads
function onLoad(framework) {

  // initialize framework
  scene = framework.scene;
  camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 5, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);

  var backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.color.setHSL(0.1, 1, 0.95);
  backLight.position.set(1, 1, -2);
  backLight.position.multiplyScalar(10);

  scene.add(backLight);

  // set camera position
  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 20));
  camera.updateProjectionMatrix();

  cameraControls = new CameraControls(scene, clock, camera);

  // putting in a simple axis helper to help visualize
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  var objLoader = new THREE.OBJLoader();

  // audio
  objLoader.load('textures/koi.obj', function(obj) {
    koiGeo = obj.children[0].geometry;
    var path;
    switch(song) {
      case music.humble:
        path = humble;
      break;
      case music.wildcat:
        path = wildcat;
      break;
      case music.flowers:
        path = flowers;
      break;
    }
    Audio.init(path, initWorlds);
  });

  gui.add(audioControl, 'mute').onChange(function(newVal) {
    if (newVal) {
      Audio.mute()
    } else {
      Audio.unmute()
    }
  })

}


// called on frame updates
function onUpdate(framework) {

  if (Audio.isPlaying()) {
    var size = Audio.getSizeFromSound();
    var bg = scene.background ? scene.background : new THREE.Color(0,0,0);
    var color = Audio.getColorFromSound(bg);
    // Change the background color (testing)
    scene.background = color;
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

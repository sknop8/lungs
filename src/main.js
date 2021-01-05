
const THREE = require('three');
const EffectComposer = require('three-effectcomposer')(THREE)
import Framework from './framework'
import Audio from './audio'
import Sparkle from './postprocessing/sparkle'

var clock = new THREE.Clock(false);

var scene
var camera
var renderer
var directionalLight

var composer
var allPost = [Sparkle]
var currentPost = []

var audioControl = { 'mute': false };

function onLoad(framework) {
  scene = framework.scene;
  camera = framework.camera;
  renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 5, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  scene.background = new THREE.Color(1, 1, 1)

  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 20));
  camera.updateProjectionMatrix();

  Audio.init();

  if (audioControl.mute) Audio.mute()

  gui.add(audioControl, 'mute').onChange(function(newVal) {
    if (newVal) { Audio.mute() } else { Audio.unmute() }
  })

  currentPost = [ Sparkle ]
  setPostProcessing()

  clock.start()

  getAudioContext().resume();
}

function setPostProcessing(shaders) {
  for (var s in allPost) { allPost[s].turnOff() }
  composer = new EffectComposer(renderer);
  var renderPass = new EffectComposer.RenderPass(scene, camera);
  composer.addPass(renderPass);
  for (var s in currentPost) {
    currentPost[s].turnOn();
    var pass = currentPost[s].shader;
    pass.renderToScreen = true;
    composer.addPass(pass);
  }
  render();
}

function render() {
  composer.render()
  requestAnimationFrame(render)
}

function cosine_interp(a, b, t) {
  var cos_t = (1 - Math.cos(t * Math.PI)) * 0.5
  return a * (1 - cos_t) + b * cos_t
}

var oldBgColor
var bgColor
var c

function onUpdate(framework) {
  clock.getDelta()
  var time = clock.elapsedTime

  if (Audio.isPlaying()) {
    var size = Audio.getSizeFromSound()

    var fract = time % 1
    if (Math.floor(fract * 10) % 4  == 0) {
      var bg = scene.background ? scene.background : new THREE.Color(1, 1, 1)
      scene.background = Audio.getColorFromSound(bg)
    }

    Sparkle.shader.material.uniforms.size.value = size
  }

  Sparkle.shader.material.uniforms.time.value = time
}

Framework.init(onLoad, onUpdate);

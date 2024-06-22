let debounce;
var VRbec = 1;
var VRbat = 1;
var VRrez = 1;
const whiteboard = new Whiteboard();

function ValuesInRange() {
  if (VRbec < 1) VRbec = 1;
  if (VRbat < 1) VRbat = 1;
  if (VRrez < 1) VRrez = 1;

  if (VRbec > 1000000) VRbec = 1000000;
  if (VRbat > 1000000) VRbat = 1000000;
  if (VRrez > 1000000) VRrez = 1000000;

  document.getElementById('baterieNumber').setAttribute('value', VRbat);
  document.getElementById('rezistorNumber').setAttribute('value', VRrez);
  document.getElementById('becNumber').setAttribute('value', VRbec);
}

document.querySelector('a-scene').addEventListener('contextmenu', function (evt) {
  evt.preventDefault();
  evt.stopPropagation();
  whiteboard.placeShape();
});

document.querySelector('a-scene').addEventListener('mousemove', function (evt) {
  // clearTimeout(debounce);
  // debounce = setTimeout(function() {
  whiteboard.placeShadowShape();
  // }, 10);
});

AFRAME.registerComponent('force-z-above-0', {
  tick: function () {
    const position = this.el.object3D.position;
    if (position.z <= -0.5) {
      position.z = -0.5;
    }
  }
});

AFRAME.registerComponent('laser-intersection', {
  init: function () {
    var intersectedEl;

    // Assuming we're in vr
    this.el.sceneEl.addEventListener('enter-vr', () => {
      whiteboard.inVR = true;

      document.getElementById('camera').removeChild(document.getElementById('cursor'));
    });

    // And if we're not in VR
    this.el.sceneEl.addEventListener('exit-vr', () => {
      whiteboard.inVR = false;

      const newHTML = document.createElement('a-cursor');
      newHTML.setAttribute('id', 'cursor');
      newHTML.setAttribute('raycaster', 'objects: .clickable, .deletable');
      newHTML.setAttribute('color', '#FFDAE9');

      document.getElementById('camera').appendChild(newHTML);
    });

    // take only first intersected object
    this.el.addEventListener('raycaster-intersection', (evt) => {
      intersectedEl = evt.detail.els[0];
      console.log(intersectedEl);
    });

    // interaction
    this.el.addEventListener('click', () => {
      if (intersectedEl) {
        if (intersectedEl.id === 'whiteboard')
          whiteboard.placeShape();

        else if (intersectedEl.id === 'VRsim')
          whiteboard.sendGrid();

        else if (intersectedEl.id === 'VRres')
          whiteboard.resetAnimations();

        else if (intersectedEl.id === 'VRbecminus')
          VRbec -= 1;

        else if (intersectedEl.id === 'VRbecplus')
          VRbec += 1;

        else if (intersectedEl.id === 'VRbaterieminus')
          VRbat -= 1;

        else if (intersectedEl.id === 'VRbaterieplus')
          VRbat += 1;

        else if (intersectedEl.id === 'VRrezistorminus')
          VRrez -= 1;

        else if (intersectedEl.id === 'VRrezistorplus')
          VRrez += 1;

        else {
          document.getElementById('VR' + whiteboard.currentShape).setAttribute('material', 'src', '#rosu');

          if (intersectedEl.id == 'VRnone')
            whiteboard.currentShape = 'none';

          if (intersectedEl.id == 'VRbec')
            whiteboard.currentShape = 'bec';

          if (intersectedEl.id == 'VRbaterie')
            whiteboard.currentShape = 'baterie';

          if (intersectedEl.id == 'VRintrerupator')
            whiteboard.currentShape = 'intrerupator';

          if (intersectedEl.id == 'VRintrerupatorAlt')
            whiteboard.currentShape = 'intrerupatorAlt';

          if (intersectedEl.id == 'VRrezistor')
            whiteboard.currentShape = 'rezistor';

          if (intersectedEl.id == 'VRamper')
            whiteboard.currentShape = 'amper';

          if (intersectedEl.id == 'VRvolt')
            whiteboard.currentShape = 'volt';

          if (intersectedEl.id == 'VRcablu')
            whiteboard.currentShape = 'cablu';

          if (intersectedEl.id == 'VRrotate')
            whiteboard.currentShape = 'rotate';

          if (intersectedEl.id == 'VRturnon')
            whiteboard.currentShape = 'turnon';

          if (intersectedEl.id == 'VRdelete')
            whiteboard.currentShape = 'delete';


          document.getElementById('VR' + intersectedEl.id).setAttribute('material', 'src', '#verde');
          ValuesInRange();
        }
      }
    });
  },

  tick: function () {
    if (whiteboard.inVR)
      whiteboard.placeShadowShape();
  }
});

document.getElementById('hand').setAttribute('laser-intersection', '');
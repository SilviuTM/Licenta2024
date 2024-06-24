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

// for importing
document.getElementById('fileInput').addEventListener('change', function (evt) {
  const file = evt.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const jsonString = e.target.result;
        const matrix = JSON.parse(jsonString);

        if (Array.isArray(matrix) && matrix.every(Array.isArray)) {
          console.log('Matrix:', matrix);

          const asceneEL = document.querySelector('a-scene');
          const board = document.getElementById('whiteboard');
          const boardWidth = Number.parseFloat(whiteboard.htmlElement.getAttribute('width'));
          const boardHeight = Number.parseFloat(whiteboard.htmlElement.getAttribute('height'));
          
          // reset all
          for (let i = 0; i < matrix.length; i++)
            for (let j = 0; j < matrix[i].length; j++) {
              RemoveIfExists({ parent: asceneEL, child: whiteboard.grid[i][j].htmlElt });
              whiteboard.grid[i][j] = { gridLetter: '0' };
            }

          // aici se recreaza grid
          for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
              if (matrix[i][j].Letter !== '0') {
                let curShape = '0';

                if (matrix[i][j].Letter === 'l')
                  curShape = 'bec';
                if (matrix[i][j].Letter === 'b')
                  curShape = 'baterie';
                if (matrix[i][j].Letter === 's')
                  curShape = 'intrerupator';
                if (matrix[i][j].Letter === 'S')
                  curShape = 'intrerupatorAlt';
                if (matrix[i][j].Letter === 'r')
                  curShape = 'rezistor';
                if (matrix[i][j].Letter === 't')
                  curShape = 'tranzistor';
                if (matrix[i][j].Letter === 'a')
                  curShape = 'amper';
                if (matrix[i][j].Letter === 'v')
                  curShape = 'volt';
                if (matrix[i][j].Letter === 'c')
                  curShape = 'cablu';

                const shapeEl = CircuitElementFactory.getShape(curShape, {
                  x: whiteboard.tileSize * j - boardWidth / 2 + board.getAttribute('position').x,
                  y: -(whiteboard.tileSize * i - boardHeight / 2) + 0.05 + board.getAttribute('position').y,
                  z: board.getAttribute('position').z
                }, whiteboard.tileSize, whiteboard.tileSize / boardHeight);
                console.log(shapeEl, i, j);
                whiteboard.grid[i][j] = shapeEl;
                whiteboard.evaluateCablus(i, j);
                asceneEL.appendChild(shapeEl.htmlElt);

                whiteboard.grid[i][j].gridLetter = matrix[i][j].Letter;
                whiteboard.grid[i][j].setRotation(matrix[i][j].Rotation);
                whiteboard.grid[i][j].setIsTurnedOn(matrix[i][j].IsTurnedOn);
                whiteboard.grid[i][j].volt = matrix[i][j].Voltage;
                whiteboard.grid[i][j].resistance = matrix[i][j].Resistance;
                whiteboard.grid[i][j].afisateText();
              }
            }
          }

          whiteboard.circuitValid = true;
          whiteboard.showHideError();
        } else {
          throw new Error('The JSON does not represent a 2D array (matrix).');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  } else {
    console.error('No file selected.');
  }
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
      document.getElementById('VRMenu').setAttribute('position', "-2 1.7 -0.7");
    });

    // And if we're not in VR
    this.el.sceneEl.addEventListener('exit-vr', () => {
      whiteboard.inVR = false;

      const newHTML = document.createElement('a-cursor');
      newHTML.setAttribute('id', 'cursor');
      newHTML.setAttribute('raycaster', 'objects: .clickable, .deletable');
      newHTML.setAttribute('color', '#FFDAE9');

      document.getElementById('camera').appendChild(newHTML);      
      document.getElementById('VRMenu').setAttribute('position', '9999 9999 9999');
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
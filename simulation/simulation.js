let currentShape = 'none'; // Default shape

function setShape(shape, el) {
  const buttons = document.querySelectorAll('.ui-container-btn');
  buttons.forEach((button) => {
    button.classList.remove('active');
  });
  el.classList.add('active');
  currentShape = shape;
}

// Function to create and place a shape at the cursor's intersection point
function placeShape() {
  if (currentShape === 'none')
    return;

  const sceneEl = document.querySelector('a-scene');
  const cursorEl = document.querySelector('#cursor');
  const intersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.clickable'));

  if (intersection && currentShape !== 'delete') {
    let shapeEl;
    if (currentShape === 'box') {
      shapeEl = document.createElement('a-box');
      shapeEl.setAttribute('width', 1);
      shapeEl.setAttribute('height', 1);
      shapeEl.setAttribute('depth', 1);
    } else if (currentShape === 'sphere') {
      shapeEl = document.createElement('a-sphere');
      shapeEl.setAttribute('radius', 0.5);
    } else if (currentShape === 'cylinder') {
      shapeEl = document.createElement('a-cylinder');
      shapeEl.setAttribute('radius', 0.5);
      shapeEl.setAttribute('height', 1);
    }

    shapeEl.setAttribute('position', intersection.point);
    shapeEl.setAttribute('color', '#4CC3D9');
    shapeEl.setAttribute('class', 'deletable');
    shapeEl.setAttribute('dynamic-body', '');
    shapeEl.addEventListener('click', function () {
      if (currentShape === 'delete') {
        sceneEl.removeChild(shapeEl);
      }
    });

    sceneEl.appendChild(shapeEl);
  } else if (intersection && currentShape === 'delete') {
    const deletableIntersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.deletable'));
    if (deletableIntersection) {
      sceneEl.removeChild(deletableIntersection.object.el);
    }
  }
}

document.querySelector('a-scene').addEventListener('contextmenu', function (e) {
  e.preventDefault();
  e.stopPropagation();
  placeShape();
});
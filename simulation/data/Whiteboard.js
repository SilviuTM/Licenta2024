class Whiteboard {
    constructor() {
        this.currentShape = 'none';
    }

    draw() {
        // Drawing code goes here
    }

    setShape(shape, el) {
        const buttons = document.querySelectorAll('.ui-container-btn');
        buttons.forEach((button) => {
          button.classList.remove('active');
        });
        el.classList.add('active');
        this.currentShape = shape;
      }

      placeShape() {
        if (this.currentShape === 'none')
          return;
      
        const sceneEl = document.querySelector('a-scene');
        const cursorEl = document.querySelector('#cursor');
        const intersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.clickable'));
      
        if (intersection && this.currentShape !== 'delete') {
          let shapeEl;
          if (this.currentShape === 'box') {
            shapeEl = document.createElement('a-box');
            shapeEl.setAttribute('width', 1);
            shapeEl.setAttribute('height', 1);
            shapeEl.setAttribute('depth', 1);
            intersection.point.z += 0.5;
          } else if (this.currentShape === 'sphere') {
            shapeEl = document.createElement('a-sphere');
            shapeEl.setAttribute('radius', 0.5);
            intersection.point.z += 0.5;
          } else if (this.currentShape === 'cylinder') {
            shapeEl = document.createElement('a-cylinder');
            shapeEl.setAttribute('radius', 0.5);
            shapeEl.setAttribute('height', 1);
            intersection.point.z += 0.5;
          }
      
          shapeEl.setAttribute('position', intersection.point);
          shapeEl.setAttribute('color', '#4CC3D9');
          shapeEl.setAttribute('class', 'deletable');
          shapeEl.setAttribute('dynamic-body', '');
          shapeEl.addEventListener('click', function () {
            if (this.currentShape === 'delete') {
              sceneEl.removeChild(shapeEl);
            }
          });
      
          sceneEl.appendChild(shapeEl);
        } else if (intersection && this.currentShape === 'delete') {
          const deletableIntersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.deletable'));
          if (deletableIntersection) {
            sceneEl.removeChild(deletableIntersection.object.el);
          }
        }
      }
}
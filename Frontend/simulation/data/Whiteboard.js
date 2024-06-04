class Whiteboard {
  constructor() {
    this.currentShape = 'bec';
    this.htmlElement = document.getElementById('whiteboard');
    this.htmlElement.setAttribute('material', 'opacity', 0);
    const height = this.htmlElement.getAttribute('height');
    this.tileSize = height / 7;
    const newWidth = Number.parseInt(this.htmlElement.getAttribute('width') / this.tileSize) * this.tileSize;
    this.htmlElement.setAttribute('width', newWidth);
    const width = this.htmlElement.getAttribute('width');
    this.rows = Number.parseInt(height / this.tileSize);
    this.cols = Number.parseInt(width / this.tileSize);
    this.grid = this.#initGrid();
    this.shadowEl = null;
    this.shadowElShape = null;
    console.log('rows and cols', this.rows, this.cols);
  }

  #initGrid() {
    const grid = new Array(this.cols);
    for (let col = 0; col < this.cols; col++) {
      grid[col] = new Array(this.rows);
      for (let row = 0; row < this.rows; row++) {
        grid[col][row] = '0';
      }
    }
    return grid;
  }


  #toggleActiveClass(el) {
    const buttons = document.querySelectorAll('.ui-container-btn');
    buttons.forEach((button) => {
      button.classList.remove('active');
    });
    el.classList.add('active');
  }

  #handleDelete() {
    const sceneEl = document.querySelector('a-scene');
    const cursorEl = document.querySelector('#cursor');
    const deletableIntersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.deletable'));
    if (deletableIntersection) {
      sceneEl.removeChild(deletableIntersection.object.el);
    };
  }



  setShape(shape, el) {
    this.#toggleActiveClass(el);
    this.currentShape = shape;
  }

  #getShapeEl(props) {
    const cursorEl = document.querySelector('#cursor');
    const intersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.clickable'));
    if (intersection) {
      // in caz ca va fi vreodata nevoie de hitbox cu alt format decat 1:1
      const boardWidth = Number.parseFloat(this.htmlElement.getAttribute('width'));
      const boardHeight = Number.parseFloat(this.htmlElement.getAttribute('height'));
      intersection.point.z += Number.parseFloat(intersection.object.el.getAttribute('depth'));

      const gridX = Math.round((intersection.point.x + boardWidth / 2) / this.tileSize);
      const gridY = Math.round((intersection.point.y + boardHeight / 2) / this.tileSize);
      const adjustedGridY = this.rows - ( gridY - this.rows ) ; // here update for y magic
      intersection.point.x = gridX * this.tileSize - boardWidth / 2;
      intersection.point.y = gridY * this.tileSize - boardHeight / 2;

      
      const shapeEl = CircuitElementFactory.getShape(this.currentShape, intersection.point, this.tileSize);
      if (!!props && props.isShadow) {
        shapeEl.setShadow();
      }
      return {shapeEl, gridX, gridY: adjustedGridY};
    }
  }

  placeShadowShape() {
    const sceneEl = document.querySelector('a-scene');
    const cursorEl = document.querySelector('#cursor');

    
    if(this.currentShape !== this.shadowElShape){
      this.shadowElShape = this.currentShape;
      const {shapeEl} = this.#getShapeEl({ isShadow: true });
      if (shapeEl) {
          if (this.shadowEl) {
              sceneEl.removeChild(this.shadowEl);
          }
          this.shadowEl = shapeEl.getHtmlElement();
          sceneEl.appendChild(this.shadowEl);
      }
  }

    if (!this.shadowEl) {
        const {shapeEl} = this.#getShapeEl({ isShadow: true });
        if (shapeEl) {
            this.shadowEl = shapeEl.getHtmlElement();
            sceneEl.appendChild(this.shadowEl);
        }
    } else {
        const intersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.clickable'));
        if (intersection) {
            const boardWidth = parseFloat(this.htmlElement.getAttribute('width'));
            const boardHeight = parseFloat(this.htmlElement.getAttribute('height'));
            intersection.point.z += Number.parseFloat(intersection.object.el.getAttribute('depth'));
            intersection.point.x = Math.round((intersection.point.x + boardWidth / 2) / this.tileSize) * this.tileSize - boardWidth / 2;
            intersection.point.y = Math.round((intersection.point.y + boardHeight / 2) / this.tileSize) * this.tileSize - boardHeight / 2;
            this.shadowEl.setAttribute('position', intersection.point);
        }
        else {
          let intersection = {
            point: {
              x: 0,
              y: 0,
              z: 0
            },
            object: {
              el: {
                getAttribute: function(attribute) {
                }
              }
            }
          };
          this.shadowEl.setAttribute('position', intersection);
        }
    }
  }

  placeShape() {
    if (this.currentShape === 'none')
      return;

    if (this.currentShape === 'delete') {
      this.#handleDelete();
      return;
    }
    const sceneEl = document.querySelector('a-scene');
    const shapeData = this.#getShapeEl();
    if (shapeData) {
      const {shapeEl, gridX, gridY} = shapeData;
      // console.log('gridy gridx', gridX, gridY);
        this.grid[gridX][gridY] = shapeEl.gridLetter;
        if(!!shapeEl)
            sceneEl.appendChild(shapeEl.getHtmlElement());
    }
    console.log(this.grid);
  }

  sendGrid(){
    fetch('https://localhost:7268/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.grid)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
}
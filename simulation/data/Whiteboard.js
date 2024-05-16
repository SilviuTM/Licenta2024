class Whiteboard {
  constructor() {
    this.currentShape = 'box';
    this.htmlElement = document.getElementById('whiteboard');
    const height = this.htmlElement.getAttribute('height');
    this.tileSize = height / 7;
    const newWidth = Number.parseInt(this.htmlElement.getAttribute('width') / this.tileSize) * this.tileSize;
    this.htmlElement.setAttribute('width', newWidth);
    const width = this.htmlElement.getAttribute('width');
    this.rows = Number.parseInt(height / this.tileSize);
    this.cols = Number.parseInt(width / this.tileSize);
    this.grid = this.#initGrid();
  }

  #initGrid() {
    const grid = new Array(this.cols);
    for (let col = 0; col < this.cols; col++) {
      grid[col] = new Array(this.rows);
      for (let row = 0; row < this.rows; row++) {
        grid[col][row] = 0;
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

  placeShape() {
    if (this.currentShape === 'none')
      return;

    if (this.currentShape === 'delete') {
      this.#handleDelete();
      return;
    }

    const sceneEl = document.querySelector('a-scene');
    const cursorEl = document.querySelector('#cursor');
    const intersection = cursorEl.components.raycaster.getIntersection(document.querySelector('.clickable'));
    console.log(intersection.object.el);
    if (intersection) {
      // in caz ca va fi vreodata nevoie de hitbox cu alt format decat 1:1
      const boardWidth = Number.parseFloat(this.htmlElement.getAttribute('width'));
      const boardHeight = Number.parseFloat(this.htmlElement.getAttribute('height'));
      intersection.point.z += Number.parseFloat(intersection.object.el.getAttribute('depth'));
      intersection.point.x = Number.parseInt(intersection.point.x * 10000 / this.tileSize / 10000)  * this.tileSize; 
      intersection.point.y = Number.parseInt(intersection.point.y * 10000 / this.tileSize / 10000)  * this.tileSize; 
      const shapeEl = CircuitElementFactory.getShape(this.currentShape, intersection.point, this.tileSize);
      sceneEl.appendChild(shapeEl.getHtmlElement());
      console.log(shapeEl.getHtmlElement());
    }
  }
}
class Whiteboard {
  constructor() {
    this.currentShape = 'none';
    this.batteryVoltage = 25;
    this.resistorOhm = 5;
    this.htmlElement = document.getElementById('whiteboard');
    this.htmlElement.setAttribute('material', 'opacity', 0);
    const height = this.htmlElement.getAttribute('height');
    this.tileSize = height / 14;
    const newWidth = Number.parseInt(this.htmlElement.getAttribute('width') / this.tileSize) * this.tileSize;
    this.htmlElement.setAttribute('width', newWidth);
    const width = this.htmlElement.getAttribute('width');
    this.rows = Number.parseInt(height / this.tileSize);
    this.cols = Number.parseInt(width / this.tileSize);
    this.grid = this.#initGrid();
    this.shadowEl = null;
    this.shadowElShape = null;
    this.animationInterval = null;
    this.animatiiResetate = true;

    this.inVR = false;

    this.circuitValid = true;
    console.log('rows and cols', this.rows, this.cols);
  }

  #initGrid() {
    const grid = new Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      grid[row] = new Array(this.cols);
      for (let col = 0; col < this.cols; col++) {
        grid[row][col] = { gridLetter: '0', active: false };
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

  evaluateCablus(Y, X) {
    this.handleCabluGraphics(Y, X);
    this.handleCabluGraphics(Y + 1, X);
    this.handleCabluGraphics(Y - 1, X);
    this.handleCabluGraphics(Y, X + 1);
    this.handleCabluGraphics(Y, X - 1);
  }

  #getIntersection() {
    if (this.inVR === false) {
      const cursorEl = document.querySelector('#cursor');
      return cursorEl.components.raycaster.getIntersection(document.getElementById('whiteboard'));
    }
    else {
      const handEl = document.querySelector('#hand');
      return handEl.components.raycaster.getIntersection(document.getElementById('whiteboard'));
    }
  }

  #getGridCoords(intersection) {
    // in caz ca va fi vreodata nevoie de hitbox cu alt format decat 1:1
    const boardWidth = Number.parseFloat(this.htmlElement.getAttribute('width'));
    const boardHeight = Number.parseFloat(this.htmlElement.getAttribute('height'));
    //intersection.point.z += Number.parseFloat(intersection.object.el.getAttribute('depth')); avea probleme de z variabil :(
    intersection.point.z += 0;

    const gridX = Math.round((intersection.point.x + boardWidth / 2) / this.tileSize);
    const gridY = Math.round((intersection.point.y + boardHeight / 2) / this.tileSize);
    const adjustedGridY = this.rows - (gridY - this.rows); // here update for y magic
    return { gridX, gridY, adjustedGridY };
  }

  #handleDelete() {
    const sceneEl = document.querySelector('a-scene');
    const intersection = this.#getIntersection()
    if (intersection) {
      const { gridX, adjustedGridY } = this.#getGridCoords(intersection);
      if (this.grid[adjustedGridY][gridX].gridLetter != '0') {
        RemoveIfExists({ parent: sceneEl, child: this.grid[adjustedGridY][gridX].htmlElt });
        this.grid[adjustedGridY][gridX] = { gridLetter: '0' };
        this.evaluateCablus(adjustedGridY, gridX);
      }
    }
  }

  #handleRotation() {
    const intersection = this.#getIntersection()
    if (intersection) {
      const { gridX, adjustedGridY } = this.#getGridCoords(intersection);
      if (this.grid[adjustedGridY][gridX].gridLetter != '0') {
        this.grid[adjustedGridY][gridX].setRotation((this.grid[adjustedGridY][gridX].rotation + 90) % 360);
        this.evaluateCablus(adjustedGridY, gridX);
      }
    }
  }

  #handleTurnOn() {
    const intersection = this.#getIntersection()
    if (intersection) {
      const { gridX, adjustedGridY } = this.#getGridCoords(intersection);
      if (this.grid[adjustedGridY][gridX].gridLetter != '0') {
        this.grid[adjustedGridY][gridX].setIsTurnedOn(!this.grid[adjustedGridY][gridX].isturnedon);
      }
    }
  }


  setShape(shape, el) {
    this.#toggleActiveClass(el);
    this.currentShape = shape;
  }

  #getShapeEl(props) {
    const intersection = this.#getIntersection();
    if (intersection) {
      const boardWidth = Number.parseFloat(this.htmlElement.getAttribute('width'));
      const boardHeight = Number.parseFloat(this.htmlElement.getAttribute('height'));
      const { gridX, gridY, adjustedGridY } = this.#getGridCoords(intersection);
      intersection.point.x = gridX * this.tileSize - boardWidth / 2;
      intersection.point.y = gridY * this.tileSize - boardHeight / 2;


      const scale = this.tileSize / boardHeight;
      const shapeEl = CircuitElementFactory.getShape(this.currentShape, intersection.point, this.tileSize, scale);
      if (!!props && props.isShadow) {
        shapeEl.setShadow();
      }
      return { shapeEl, gridX, gridY, adjustedGridY };
    }
  }

  placeShadowShape() {
    const sceneEl = document.querySelector('a-scene');
    if (this.currentShape === 'none' || this.currentShape === 'delete' ||
      this.currentShape === 'turnon' || this.currentShape === 'rotate') {
      RemoveIfExists({ parent: sceneEl, child: this.shadowEl });
      this.shadowEl = null;
      return;
    }

    if (this.currentShape !== this.shadowElShape) {
      this.shadowElShape = this.currentShape;
      const { shapeEl } = this.#getShapeEl({ isShadow: true });
      if (shapeEl) {
        RemoveIfExists({ parent: sceneEl, child: this.shadowEl });
        this.shadowEl = shapeEl.htmlElt;
        sceneEl.appendChild(this.shadowEl);
      }
    }

    if (!this.shadowEl) {
      const { shapeEl } = this.#getShapeEl({ isShadow: true });
      if (shapeEl) {
        this.shadowEl = shapeEl.htmlElt;
        sceneEl.appendChild(this.shadowEl);
      }
    } else {
      const intersection = this.#getIntersection();
      if (intersection) {
        const boardWidth = parseFloat(this.htmlElement.getAttribute('width'));
        const boardHeight = parseFloat(this.htmlElement.getAttribute('height'));
        intersection.point.z += 0;
        const { gridX, gridY } = this.#getGridCoords(intersection);
        intersection.point.x = gridX * this.tileSize - boardWidth / 2;
        intersection.point.y = gridY * this.tileSize - boardHeight / 2;
        this.shadowEl.setAttribute('position', intersection.point);
      }
      else {
        // behind table
        this.shadowEl.setAttribute('position', "-0.17 1.7 -1.7");
      }
    }
  }

  placeShape() {
    if (this.currentShape === 'none')
      return;

    if (this.animatiiResetate === false)
      this.resetAnimations();

    if (this.currentShape === 'delete') {
      this.#handleDelete();
      return;
    }

    if (this.currentShape === 'rotate') {
      this.#handleRotation();
      return;
    }

    if (this.currentShape === 'turnon') {
      this.#handleTurnOn();
      return;
    }


    const sceneEl = document.querySelector('a-scene');
    const shapeData = this.#getShapeEl();
    if (shapeData) {
      const { shapeEl, gridX, adjustedGridY } = shapeData;
      // console.log('gridy gridx', gridX, gridY);
      this.grid[adjustedGridY][gridX].gridLetter = shapeEl.gridLetter;
      console.log('grid', adjustedGridY, gridX);
      if (!!shapeEl) {
        RemoveIfExists({ parent: sceneEl, child: this.grid[adjustedGridY][gridX].htmlElt });
        this.grid[adjustedGridY][gridX] = shapeEl;
        this.evaluateCablus(adjustedGridY, gridX);
        sceneEl.appendChild(shapeEl.htmlElt);
      }
    }
    console.log(this.grid);
  }

  #handleReceivedData(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].letter !== '0') {
          this.grid[i][j].setActive(data[i][j].active);
          //this.grid[i][j].setRotation(data[i][j].rotation);
          //this.grid[i][j].setIsTurnedOn(data[i][j].isTurnedOn);
          this.grid[i][j].currentTo = data[i][j].currentTo;
          if (this.grid[i][j].gridLetter !== 's' || this.grid[i][j].isturnedon === true)
            this.grid[i][j].currentFrom = data[i][j].currentFrom;
          else this.grid[i][j].currentFrom = [];
          this.grid[i][j].volt = data[i][j].voltage;
          this.grid[i][j].intensity = data[i][j].amplitude;
          this.grid[i][j].afisateText();
        }
      }
    }

    this.circuitValid = true;
    this.#applyAnimations();
    this.showHideError();
  }


  toggleAnimation(elt) {
    if (this.animationInterval == null) {
      elt.innerHTML = 'Stop';
      this.animationInterval = setInterval(this.sendGrid.bind(this), 1000);
    }
    else {
      elt.innerHTML = 'Start';
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  sendGrid() {
    this.resetAnimations();
    this.animatiiResetate = false;

    const newGrid = this.grid.map((row) => row.map((cell) => {
      return {
        Letter: cell.gridLetter, Active: cell.active, Voltage: cell.volt,
        Resistance: cell.resistance, Rotation: cell.rotation, IsTurnedOn: cell.isturnedon,
        currentFrom: [], currentTo: []
      }
    }));

    fetch('https://localhost:7268/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGrid)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        return response.json();
      })
      .then(this.#handleReceivedData.bind(this))
      .catch((error) => {
        console.error('Error:', error);
        this.circuitValid = false;
        this.showHideError();
      });
  }

  exportGrid() {
    // creaza continut json si url
    const newGrid = this.grid.map((row) => row.map((cell) => {
      return {
        Letter: cell.gridLetter, Voltage: cell.volt, Resistance: cell.resistance,
        Rotation: cell.rotation, IsTurnedOn: cell.isturnedon
      }
    }));
    const jsonString = JSON.stringify(newGrid);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // element de hyperlink
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sim.json';

    // apasa linkul
    document.body.appendChild(a);
    a.click();

    // sterge (este temporar)
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  importGrid() {
    document.getElementById('fileInput').click();
  }

  handleCabluGraphics(row, col) {
    if (row < 0 || row >= this.rows) return;
    if (col < 0 || col >= this.cols) return;
    if (this.grid[row][col].gridLetter != 'c') return;


    let hasLeft = false, hasRight = false, hasUp = false, hasDown = false;
    // check upwards
    if (row - 1 >= 0 && this.grid[row - 1][col].gridLetter != '0') {
      // check regular comps
      if ((this.grid[row - 1][col].rotation != 90 && this.grid[row - 1][col].rotation != 270)
        && (this.grid[row - 1][col].gridLetter !== 'S' && this.grid[row - 1][col].gridLetter !== 't'))
        hasUp = true;

      // check wire
      if (this.grid[row - 1][col].gridLetter === 'c')
        hasUp = true;

      // check alternate switch and transistor
      if ((this.grid[row - 1][col].gridLetter === 'S' || this.grid[row - 1][col].gridLetter === 't') &&
        this.grid[row - 1][col].rotation != 180)
        hasUp = true;
    }

    // check downwards
    if (row + 1 < this.rows && this.grid[row + 1][col].gridLetter != '0') {
      // check regular comps
      if ((this.grid[row + 1][col].rotation != 90 && this.grid[row + 1][col].rotation != 270)
        && (this.grid[row + 1][col].gridLetter !== 'S' && this.grid[row + 1][col].gridLetter !== 't'))
        hasDown = true;

      // check wire
      if (this.grid[row + 1][col].gridLetter === 'c')
        hasDown = true;

      // check alternate switch and transistor
      if ((this.grid[row + 1][col].gridLetter === 'S' || this.grid[row + 1][col].gridLetter === 't') &&
        this.grid[row + 1][col].rotation != 0)
        hasDown = true;
    }

    // check leftwards
    if (col - 1 >= 0 && this.grid[row][col - 1].gridLetter != '0') {
      // check regular comps
      if ((this.grid[row][col - 1].rotation != 0 && this.grid[row][col - 1].rotation != 180)
        && (this.grid[row][col - 1].gridLetter !== 'S' && this.grid[row][col - 1].gridLetter !== 't'))
        hasLeft = true;

      // check wire
      if (this.grid[row][col - 1].gridLetter === 'c')
        hasLeft = true;

      // check alternate switch and transistor
      if ((this.grid[row][col - 1].gridLetter === 'S' || this.grid[row][col - 1].gridLetter === 't') &&
        this.grid[row][col - 1].rotation != 270)
        hasLeft = true;
    }

    // check rightwards
    if (col + 1 < this.cols && this.grid[row][col + 1].gridLetter != '0') {
      // check regular comps
      if ((this.grid[row][col + 1].rotation != 0 && this.grid[row][col + 1].rotation != 180)
        && (this.grid[row][col + 1].gridLetter !== 'S' && this.grid[row][col + 1].gridLetter !== 't'))
        hasRight = true;

      // check wire
      if (this.grid[row][col + 1].gridLetter === 'c')
        hasRight = true;

      // check alternate switch and transistor
      if ((this.grid[row][col + 1].gridLetter === 'S' || this.grid[row][col + 1].gridLetter === 't') &&
        this.grid[row][col + 1].rotation != 90)
        hasRight = true;
    }

    // delete all children and recreate
    RemoveAllChildren(this.grid[row][col].htmlElt);

    if (hasUp == true) {
      const newHTML = document.createElement('a-entity');
      newHTML.setAttribute('gltf-model', '#firSusMODEL');

      this.grid[row][col].htmlElt.appendChild(newHTML);
    }

    if (hasDown == true) {
      const newHTML = document.createElement('a-entity');
      newHTML.setAttribute('gltf-model', '#firJosMODEL');

      this.grid[row][col].htmlElt.appendChild(newHTML);
    }

    if (hasRight == true) {
      const newHTML = document.createElement('a-entity');
      newHTML.setAttribute('gltf-model', '#firDreaptaMODEL');

      this.grid[row][col].htmlElt.appendChild(newHTML);
    }

    if (hasLeft == true) {
      const newHTML = document.createElement('a-entity');
      newHTML.setAttribute('gltf-model', '#firStangaMODEL');

      this.grid[row][col].htmlElt.appendChild(newHTML);
    }
  }

  #applyAnimations() {
    for (let row = 0; row < this.rows; row++)
      for (let col = 0; col < this.cols; col++)
        if (this.grid[row][col].htmlElt)
          this.grid[row][col].animateCurrent();
  }

  resetAnimations() {
    this.animatiiResetate = true;

    for (let row = 0; row < this.rows; row++)
      for (let col = 0; col < this.cols; col++)
        if (this.grid[row][col].htmlElt) {
          RemoveAllChildren(this.grid[row][col].htmlElt);
          this.evaluateCablus(row, col);
          //this.grid[row][col].afisateText();
        }
  }

  showHideError() {
    var paragraph = document.getElementById('errorCircuit');
    if (this.circuitValid == true) {
      paragraph.style.display = 'none';
      document.getElementById('VRCInv').setAttribute('position', "0 -0.65 -0.001");
    }
    else {
      paragraph.style.display = 'block';
      document.getElementById('VRCInv').setAttribute('position', "0 -0.65 0.001");
    }
  }
}
class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}



class CircuitElement {
    constructor(p, img, type, color, classes) {
        this.position = p;
        this.img = img;
        this.type = type;
        this.color = color;
        this.classes = classes;
        this.bodyType = 'dynamic-body';
        this.shadow = false;
    }

    getHtmlElement() { 
        throw new Error('Method getHtmlElement must be implemented by child class!');
    }

    setShadow() {
       this.shadow = true;
    }

    setAttributes(shapeEl){
        shapeEl.setAttribute('position', this.position);
        shapeEl.setAttribute('color', this.color);
        shapeEl.setAttribute('class', this.classes);
        shapeEl.setAttribute(this.bodyType, '');
        if(this.shadow){
            shapeEl.setAttribute('material', 'opacity', 0.5);
            const classes = shapeEl.getAttribute('class');
            shapeEl.setAttribute('class', classes + ' shadow');
        }
    }
}

class Box extends CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        const color = '#ffffff';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);
        super(newPosition, '', 'box', color, classes);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-box');
        shapeEl.setAttribute('width', this.width);
        shapeEl.setAttribute('height', this.height);
        shapeEl.setAttribute('depth', this.depth);
        super.setAttributes(shapeEl);
        return shapeEl;
    }
}

class Sphere extends CircuitElement {
    constructor(radius, intersectionPoint) {
        const color = '#ffffff';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);

        super(newPosition, '', 'sphere', color, classes);
        this.radius = radius;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-sphere');
        shapeEl.setAttribute('radius', this.radius);
        super.setAttributes(shapeEl);
        return shapeEl;
    }
}

class Cylinder extends CircuitElement {
    constructor(radius, height, intersectionPoint) {
        const color = '#4CC3D9';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);

        super(newPosition, '', 'cylinder', color, classes);
        this.radius = radius;
        this.height = height;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-cylinder');
        shapeEl.setAttribute('radius', this.radius);
        shapeEl.setAttribute('height', this.height);
        super.setAttributes(shapeEl);
        return shapeEl;
    }
}



class Bec extends Box {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#bec';
        this.gridLetter = 'l';
    }

    getHtmlElement() {
        const shapeEl = super.getHtmlElement();
        shapeEl.setAttribute('material', 'src', this.img);
        return shapeEl;
    }
}

class Baterie extends Box {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#baterie';
        this.gridLetter = 'b';

    }

    getHtmlElement() {
        const shapeEl = super.getHtmlElement();
        shapeEl.setAttribute('material', 'src', this.img);
        return shapeEl;
    }
}

class Intrerupator extends Box {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#rupator';
        this.gridLetter = 's';
    }

    getHtmlElement() {
        const shapeEl = super.getHtmlElement();
        shapeEl.setAttribute('material', 'src', this.img);
        return shapeEl;
    }
}

class Cablu extends Box {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#W-none';
        this.gridLetter = 'c';
    }

    getHtmlElement() {
        const shapeEl = super.getHtmlElement();
        shapeEl.setAttribute('material', 'src', this.img);
        return shapeEl;
    }
}

class CircuitElementFactory{
    static getShape(shapeType, intersectionPoint, hitbox){
        
        switch(shapeType){
            case 'bec':
                return new Bec(hitbox, hitbox, hitbox, intersectionPoint);
            case 'baterie':
                return new Baterie(hitbox, hitbox, hitbox, intersectionPoint);
            case 'intrerupator':
                return new Intrerupator(hitbox, hitbox, hitbox, intersectionPoint);
            case 'cablu':
                return new Cablu(hitbox, hitbox, hitbox, intersectionPoint);
        }
    }
}



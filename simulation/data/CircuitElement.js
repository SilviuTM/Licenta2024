class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}



class CircuitElement {
    constructor(p, img, type, color, classes, onclick) {
        this.position = p;
        this.img = img;
        this.type = type;
        this.color = color;
        this.classes = classes;
        this.onclick = onclick;
        this.bodyType = 'dynamic-body';
    }

    getHtmlElement() { 
        throw new Error('Method getHtmlElement must be implemented by child class!');
    }
}

class Box extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, onclick) {
        const color = '#4CC3D9';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);
        super(newPosition, '', 'box', color, classes, onclick);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-box');
        shapeEl.setAttribute('width', this.width);
        shapeEl.setAttribute('height', this.height);
        shapeEl.setAttribute('depth', this.depth);
        shapeEl.setAttribute('position', this.position);
        shapeEl.setAttribute('color', this.color);
        shapeEl.setAttribute('class', this.classes);
        shapeEl.setAttribute(this.bodyType, '');
        return shapeEl;
    }
}

class Sphere extends CircuitElement {
    constructor(radius, intersectionPoint, onclick) {
        const color = '#4CC3D9';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);

        super(newPosition, '', 'sphere', color, classes, onclick);
        this.radius = radius;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-sphere');
        shapeEl.setAttribute('radius', this.radius);
        shapeEl.setAttribute('position', this.position);
        shapeEl.setAttribute('color', this.color);
        shapeEl.setAttribute('class', this.classes);
        shapeEl.setAttribute(this.bodyType, '');
        return shapeEl;
    }
}

class Cylinder extends CircuitElement {
    constructor(radius, height, intersectionPoint, onclick) {
        const color = '#4CC3D9';
        const classes = 'deletable';
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);

        super(newPosition, '', 'cylinder', color, classes, onclick);
        this.radius = radius;
        this.height = height;
    }

    getHtmlElement() {
        const shapeEl = document.createElement('a-cylinder');
        shapeEl.setAttribute('radius', this.radius);
        shapeEl.setAttribute('height', this.height);
        shapeEl.setAttribute('position', this.position);
        shapeEl.setAttribute('color', this.color);
        shapeEl.setAttribute('class', this.classes);
        shapeEl.setAttribute(this.bodyType, '');
        console.log(this.position);
        return shapeEl;
    }
}

class CircuitElementFactory{
    static getShape(shapeType, intersectionPoint, hitbox){
        
        switch(shapeType){
            case 'box':
                return new Box(hitbox, hitbox, hitbox, intersectionPoint);
            case 'sphere':
                return new Sphere(hitbox / 2, intersectionPoint);
            case 'cylinder':
                return new Cylinder(hitbox / 2, hitbox, intersectionPoint);
        }
    }
}



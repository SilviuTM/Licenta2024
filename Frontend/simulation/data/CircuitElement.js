class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}



class CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        const newPosition = new Position(intersectionPoint.x, intersectionPoint.y,
            intersectionPoint.z);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position = newPosition;
        this.img = '';
        this.type = 'box';
        this.color = '#ffffff';
        this.classes = 'deletable';
        this.bodyType = 'dynamic-body';
        this.shadow = false;
        this.htmlElt = this.#buildHtmlElement();
    }

    setShadow() {
       this.shadow = true;
       this.htmlElt.setAttribute('material', 'opacity', 0.5);
       const classes = this.htmlElt.getAttribute('class');
       this.htmlElt.setAttribute('class', classes + ' shadow');
    }

    #buildHtmlElement() {
        const html = document.createElement('a-box');
        html.setAttribute('width', this.width);
        html.setAttribute('height', this.height);
        html.setAttribute('depth', this.depth);
        html.setAttribute('position', this.position);
        html.setAttribute('color', this.color);
        html.setAttribute('class', this.classes);
        html.setAttribute(this.bodyType, '');
        return html;
    }
  
}




class Bec extends CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#bec';
        this.gridLetter = 'l';
        this.htmlElt.setAttribute('material', 'src', this.img);
    }

    getHtmlElement() {
        return this.htmlElt;
    }
}

class Baterie extends CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#baterie';
        this.gridLetter = 'b';
    }

    getHtmlElement() {
        return this.htmlElt;
    }
}

class Intrerupator extends CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#rupator';
        this.gridLetter = 's';
        this.htmlElt.setAttribute('material', 'src', this.img);

    }

    getHtmlElement() {
        return this.htmlElt;
    }
}

class Cablu extends CircuitElement {
    constructor(width, height, depth, intersectionPoint) {
        super(width, height, depth, intersectionPoint);
        this.img = '#W-none';
        this.gridLetter = 'c';
        this.htmlElt.setAttribute('material', 'src', this.img);
    }

    getHtmlElement() {
       return this.htmlElt;
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



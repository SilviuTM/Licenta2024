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
        this.color = '#ff0000';
        this.classes = 'deletable';
        this.bodyType = 'dynamic-body';
        this.shadow = false;
        this.htmlElt = this.buildHtmlElement();
        this.active = false;
        this.rotation = 0;
        this.isturnedon = false;
    }

    setShadow() {
       this.shadow = true;
       this.htmlElt.setAttribute('material', 'opacity', 0.5);
       const classes = this.htmlElt.getAttribute('class');
       this.htmlElt.setAttribute('class', classes + ' shadow');
    }

    setActive(active) {
        this.active = active;
        if(active){
            this.htmlElt.setAttribute('color', '#00ff00');
        }else{
            this.htmlElt.setAttribute('color', '#ff0000');
        }
    }

    setRotation(rotation) {
        this.rotation = rotation;
        this.htmlElt.setAttribute('rotation', `0 0 ${rotation}`);
    }

    setIsTurnedOn(turnedOn) {
        this.isturnedon = turnedOn;
        this.updateTexture();
    }

    updateTexture() {

    }

    buildHtmlElement() {
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
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#becMODEL';
        this.gridLetter = 'l';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    getHtmlElement() {
        return this.htmlElt;
    }

    buildHtmlElement() {
        const html = document.createElement('a-entity');
        html.setAttribute('width', this.width);
        html.setAttribute('height', this.height);
        html.setAttribute('depth', this.depth);
        html.setAttribute('position', this.position);
        html.setAttribute('class', this.classes);
        html.setAttribute(this.bodyType, '');
        return html;
    }
}

class Baterie extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#baterieMODEL';
        this.gridLetter = 'b';
        
        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    getHtmlElement() {
        return this.htmlElt;
    }

    buildHtmlElement() {
        const html = document.createElement('a-entity');
        html.setAttribute('width', this.width);
        html.setAttribute('height', this.height);
        html.setAttribute('depth', this.depth);
        html.setAttribute('position', this.position);
        html.setAttribute('class', this.classes);
        html.setAttribute(this.bodyType, '');
        return html;
    }
}

class Intrerupator extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#rupatorOFFMODEL';
        this.gridLetter = 's';
        
        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    getHtmlElement() {
        return this.htmlElt;
    }

    updateTexture() {
        if(this.isturnedon){
            this.img = '#rupatorONMODEL'
        }else{
            this.img = '#rupatorOFFMODEL'
        }

        this.htmlElt.setAttribute('gltf-model', this.img);
    }

    buildHtmlElement() {
        const html = document.createElement('a-entity');
        html.setAttribute('width', this.width);
        html.setAttribute('height', this.height);
        html.setAttribute('depth', this.depth);
        html.setAttribute('position', this.position);
        html.setAttribute('class', this.classes);
        html.setAttribute(this.bodyType, '');
        return html;
    }
}

class Cablu extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#W-none';
        this.gridLetter = 'c';
        this.htmlElt.setAttribute('material', 'src', this.img);


    }

    setRotation() {
        
    }

    getHtmlElement() {
       return this.htmlElt;
    }
}

class CircuitElementFactory{
    static getShape(shapeType, intersectionPoint, hitbox, scale){
        
        switch(shapeType){
            case 'bec':
                return new Bec(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'baterie':
                return new Baterie(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'intrerupator':
                return new Intrerupator(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'cablu':
                return new Cablu(hitbox, hitbox, hitbox, intersectionPoint, scale);
        }
    }
}



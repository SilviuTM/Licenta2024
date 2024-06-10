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
        if (active) {
            this.htmlElt.setAttribute('color', '#00ff00');
        } else {
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
        this.img = '#rupatorMODEL';
        this.gridLetter = 's';

        this.classes = this.classes + ' ' + 'animation-mixer';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);

        this.htmlElt.setAttribute('animation-mixer', 'timeScale: 10;');
        this.htmlElt.setAttribute('animation-mixer', 'clampWhenFinished: true;');
        this.htmlElt.setAttribute('animation-mixer', 'clip: Opening;');
        this.htmlElt.setAttribute('animation-mixer', 'loop: once;');
    }

    getHtmlElement() {
        return this.htmlElt;
    }

    updateTexture() {
        if (this.isturnedon) {
            this.htmlElt.setAttribute('animation-mixer', 'clip: Closing;');
        } else {
            this.htmlElt.setAttribute('animation-mixer', 'clip: Opening;');
        }
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

class IntrerupatorAlternativ extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#rupatorALTMODEL';
        this.gridLetter = 'S';

        this.classes = this.classes + ' ' + 'animation-mixer';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);

        this.htmlElt.setAttribute('animation-mixer', 'timeScale: 10;');
        this.htmlElt.setAttribute('animation-mixer', 'clampWhenFinished: true;');
        this.htmlElt.setAttribute('animation-mixer', 'clip: SwitchALTFalseRight;');
        this.htmlElt.setAttribute('animation-mixer', 'loop: once;');
    }

    getHtmlElement() {
        return this.htmlElt;
    }

    updateTexture() {
        if (this.isturnedon) {
            this.htmlElt.setAttribute('animation-mixer', 'clip: SwitchALTTrueLeft;');
        } else {
            this.htmlElt.setAttribute('animation-mixer', 'clip: SwitchALTFalseRight;');
        }
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

class Rezistor extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#rezistorMODEL';
        this.gridLetter = 'r';

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

class Tranzistor extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#tranzistorMODEL';
        this.gridLetter = 't';

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

class Ampermetru extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#amperMODEL';
        this.gridLetter = 'a';

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

class Voltmetru extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#voltMODEL';
        this.gridLetter = 'v';

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

class Wattmetru extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#wattMODEL';
        this.gridLetter = 'w';

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

class Ohmmetru extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#ohmMODEL';
        this.gridLetter = 'o';

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

class Cablu extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#firCentruMODEL';
        this.gridLetter = 'c';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    setRotation() {
        // Overwrite ca sa nu faca nimic functia. Nu sterge.
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

    getHtmlElement() {
        return this.htmlElt;
    }
}

class CircuitElementFactory {
    static getShape(shapeType, intersectionPoint, hitbox, scale) {

        switch (shapeType) {
            case 'bec':
                return new Bec(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'baterie':
                return new Baterie(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'intrerupator':
                return new Intrerupator(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'intrerupatorAlt':
                return new IntrerupatorAlternativ(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'rezistor':
                return new Rezistor(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'tranzistor':
                return new Tranzistor(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'amper':
                return new Ampermetru(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'volt':
                return new Voltmetru(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'watt':
                return new Wattmetru(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'ohm':
                return new Ohmmetru(hitbox, hitbox, hitbox, intersectionPoint, scale);
            case 'cablu':
                return new Cablu(hitbox, hitbox, hitbox, intersectionPoint, scale);
        }
    }
}



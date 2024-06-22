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
        this.volt = 0;
        this.intensity = 0;
        this.resistance = 0.0000001;
        this.currentFrom = [];
        this.currentTo = [];
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

    afisateText() {

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

    animateCurrent() {
        let array = ['N', 'E', 'S', 'W'];

        for (let i = 0; i < this.currentFrom.length; i++)
            this.currentFrom[i] = array[(array.findIndex(x => x == this.currentFrom[i]) + this.rotation / 90) % 4];

        for (let i = 0; i < this.currentTo.length; i++)
            this.currentTo[i] = array[(array.findIndex(x => x == this.currentTo[i]) + this.rotation / 90) % 4];

        let destination = 0.87;
        //if (this.intensity == 0) destination = 0;
        //if (this.intensity < 0) destination *= -1;

        // prima data curentul care vine inauntru
        if (this.currentFrom.includes('N')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, to: '0 0 0', from: `0 ${destination} 0`, loop: true});
            
            this.htmlElt.appendChild(html);
        }

        if (this.currentFrom.includes('S')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, to: '0 0 0', from: `0 -${destination} 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        if (this.currentFrom.includes('E')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, to: '0 0 0', from: `${destination} 0 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        if (this.currentFrom.includes('W')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, to: '0 0 0', from: `-${destination} 0 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        // apoi curentul care iese
        if (this.currentTo.includes('N')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, from: '0 0 0', to: `0 ${destination} 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        if (this.currentTo.includes('S')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, from: '0 0 0', to: `0 -${destination} 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        if (this.currentTo.includes('E')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, from: '0 0 0', to: `${destination} 0 0`, loop: true});

            this.htmlElt.appendChild(html);
        }

        if (this.currentTo.includes('W')) {
            const html = document.createElement('a-entity');
            html.setAttribute('scale', '1.75 1.75 1.75');
            html.setAttribute('rotation', `0 0 ${360 - this.rotation}`);
            html.setAttribute('gltf-model', '#curentMODEL');
            html.setAttribute('animation', {property: 'position', easing: 'linear', dur: 2000, from: '0 0 0', to: `-${destination} 0 0`, loop: true});

            this.htmlElt.appendChild(html);
        }
    }
}




class Bec extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#becMODEL';
        this.gridLetter = 'l';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);

        const rezistenta = document.getElementById('becNumber');
        if (rezistenta.value === "")
            this.resistance = 1;
        else
            this.resistance = +rezistenta.value;

            this.afisateText();
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

    afisateText() {
        const html = document.createElement('a-text');
        html.setAttribute('value', `${this.resistance}oh`);
        html.setAttribute('position', `0.5 -0.5 0.3`);
        html.setAttribute('scale', `1.5 1.5 1.5`);
        html.setAttribute('align', `center`);
        html.setAttribute('color', `#FFF`);

        this.htmlElt.appendChild(html);
    }
}

class Baterie extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#baterieMODEL';
        this.gridLetter = 'b';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);

        const voltaj = document.getElementById('baterieNumber');
        if (voltaj.value === "")
            this.volt = 1;
        else
            this.volt = +voltaj.value;

        this.afisateText()
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

    afisateText() {
        const html = document.createElement('a-text');
        html.setAttribute('value', `${this.volt}V`);
        html.setAttribute('position', `0.5 -0.5 0.3`);
        html.setAttribute('scale', `1.5 1.5 1.5`);
        html.setAttribute('align', `center`);
        html.setAttribute('color', `#FFF`);

        this.htmlElt.appendChild(html);
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

        const rezistenta = document.getElementById('rezistorNumber');
        if (rezistenta.value === "")
            this.resistance = 1;
        else
            this.resistance = +rezistenta.value;

            this.afisateText()
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

    afisateText() {
        const html = document.createElement('a-text');
        html.setAttribute('value', `${this.resistance}oh`);
        html.setAttribute('position', `0.5 -0.5 0.3`);
        html.setAttribute('scale', `1.5 1.5 1.5`);
        html.setAttribute('align', `center`);
        html.setAttribute('color', `#FFF`);

        this.htmlElt.appendChild(html);
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

        this.afisateText();
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
    
    afisateText() {
        const html = document.createElement('a-text');
        html.setAttribute('value', `${this.intensity}A`);
        html.setAttribute('position', `0.5 -0.5 0.3`);
        html.setAttribute('scale', `1.5 1.5 1.5`);
        html.setAttribute('align', `center`);
        html.setAttribute('color', `#FFF`);

        this.htmlElt.appendChild(html);
    }
}

class Voltmetru extends CircuitElement {
    constructor(width, height, depth, intersectionPoint, scale) {
        super(width, height, depth, intersectionPoint);
        this.img = '#voltMODEL';
        this.gridLetter = 'v';

        this.htmlElt.setAttribute('gltf-model', this.img);
        this.htmlElt.setAttribute('scale', `${scale} ${scale} ${scale}`);

        this.resistance = 999999999;
        this.afisateText()
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

    afisateText() {
        const html = document.createElement('a-text');
        html.setAttribute('value', `${this.volt}V`);
        html.setAttribute('position', `0.5 -0.5 0.3`);
        html.setAttribute('scale', `1.5 1.5 1.5`);
        html.setAttribute('align', `center`);
        html.setAttribute('color', `#FFF`);

        this.htmlElt.appendChild(html);
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
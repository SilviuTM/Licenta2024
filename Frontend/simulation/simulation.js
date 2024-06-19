let debounce;
const whiteboard = new Whiteboard();  

document.querySelector('a-scene').addEventListener('contextmenu', function (evt) {
  evt.preventDefault();
  evt.stopPropagation();
  whiteboard.placeShape();
});

document.querySelector('a-scene').addEventListener('mousemove', function (evt) {
  // clearTimeout(debounce);
  // debounce = setTimeout(function() {
    whiteboard.placeShadowShape();
  // }, 10);
});

AFRAME.registerComponent('force-z-above-0', {
  tick: function () {
    const position = this.el.object3D.position;
    if (position.z <= 0) {
      position.z = 0;
    }
  }
});

AFRAME.registerComponent('laser-intersection', {
  init: function () {
    this.intersectedEl;

    // Assuming we're in vr
    this.el.sceneEl.addEventListener('enter-vr', () => {
      whiteboard.inVR = true;
    });

    // And if we're not in VR
    this.el.sceneEl.addEventListener('exit-vr', () => {
      whiteboard.inVR = false;
    });

    // take only first intersected object
    this.el.addEventListener('raycaster-intersection', (evt) => {
        this.intersectedEl = evt.detail.els[0];
        console.log(intersectedEl);
    });

    // this.el.addEventListener('raycaster-intersection-cleared', (evt) => {
    //   console.log('Intersection cleared:', evt.detail.clearedEls);
    //   evt.detail.clearedEls.forEach((el) => {
    //     el.setAttribute('color', '#4CC3D9'); // Change color back to original
    //     const index = this.intersectedEls.indexOf(el);
    //     if (index > -1) {
    //       this.intersectedEls.splice(index, 1);
    //     }
    //   });
    // });

    this.el.addEventListener('click', () => {
    });
  },
});

document.getElementById('hand').setAttribute('laser-intersection', '');
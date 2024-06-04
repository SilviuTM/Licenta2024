let debounce;
const whiteboard = new Whiteboard();  

document.querySelector('a-scene').addEventListener('contextmenu', function (e) {
  e.preventDefault();
  e.stopPropagation();
  whiteboard.placeShape();
});

document.querySelector('a-scene').addEventListener('mousemove', function (e) {
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
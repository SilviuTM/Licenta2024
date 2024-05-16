const whiteboard = new Whiteboard();  

document.querySelector('a-scene').addEventListener('contextmenu', function (e) {
  e.preventDefault();
  e.stopPropagation();
  whiteboard.placeShape();
});

document.querySelector('a-scene').addEventListener('mousemove', function (e) {
  whiteboard.placeShadowShape();
});
// Component to change to a sequential color on click.
AFRAME.registerComponent('cursor-listener', {
    init: function () {
      this.el.addEventListener('mouseenter', function (evt) {
        this.setAttribute('material',  {src: '#thumbBtnHover', transparent: true});
      });
      this.el.addEventListener('mouseleave', function (evt) {
        this.setAttribute('material', {src: '#thumbBtn', transparent: true} );
      });
    }
  });
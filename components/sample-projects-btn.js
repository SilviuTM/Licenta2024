// Component to change to a sequential color on click.
AFRAME.registerComponent('sample-projects-btn', {
    init: function () {
      this.el.addEventListener('click', function (evt) {
        // document.querySelector('#menuCard').setAttribute('visible', false);
        document.querySelector('#projectCard').setAttribute('visible', true);
      });
    }
  });
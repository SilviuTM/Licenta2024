AFRAME.registerComponent('project-click', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            window.location.href = '/example/fallingball';
        });
    }
});
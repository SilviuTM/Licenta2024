AFRAME.registerComponent('project-click', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            const url = this.el.getAttribute('link').href;
            window.location.href = url;
        });
    }
});
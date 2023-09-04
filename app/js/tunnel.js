let countTunnel = 100;
let cylCountTunnel = 10;

AFRAME.registerComponent('tunnel', {
    schema: {
        x: {type: 'number'}
    },
    init: function() {
        tunnelSound.components.sound.playSound();
        let sceneEl = document.querySelector('[tunnel]');
        for (let i=0; i<countTunnel; i++) {
            var newBall = document.createElement('a-entity');
            newBall.setAttribute("ball", "start: " + this.data.x + "; index: " + (i) + "; color: " + i);         
            sceneEl.appendChild(newBall);
        }
    },
    tick: function(time) {
        this.el.setAttribute('position', '0 0 ' + map(Math.sin(time/2000), -1, 1, 0, 6));
    }
});

AFRAME.registerComponent('ball', { 
    schema: {
        index: {type: 'number'},
        start: {type: 'number'},
        color: {type: 'string'}
    },
    init: function() {
        this.data.color = "hsl(" + map(this.data.index, 0, countTunnel, 0, 255) + ", 60%, 50%)";
        this.el.setAttribute('geometry', 'primitive: sphere; radius: ' + this.data.start/30);
        this.el.setAttribute('material', 'color: ' + this.data.color + '; shader: flat');
        this.el.setAttribute('position', this.data.start +' 2 -' + this.data.index/8);
    },
    tick: function() {
        rotateAboutPoint(this.el.object3D, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, this.data.start), this.data.index*0.0006, false);
    }
});

let range = 25;
let interval = 15;

AFRAME.registerComponent('rain', {
    init: function() {
        rainSound.components.sound.playSound();
        let sceneEl = document.querySelector('[rain]');
        setInterval(function() {
            var newDrop = document.createElement('a-entity');
            newDrop.setAttribute("raindrop", "");             
            sceneEl.appendChild(newDrop);
        }, interval);
    }
});

AFRAME.registerComponent('raindrop', {
    schema: {
        position: { type: 'vec3', default: { x: 0, y: 50, z: 0 } },
        color: { type: 'string' },
        speed: { type: 'number' }
    },
    init: function() {
        this.el.setAttribute('geometry', "primitive: box; width: 0.05; height: 2; depth: 0.05;");  
        this.data.color = "hsl(" + Math.random()*255 + ", 60%, 50%)";
        this.el.setAttribute('material', "shader: flat; color: " + this.data.color);
        this.data.position.x = rndm(-range, range);
        this.data.position.z = rndm(-range, range);
        this.data.speed = rndm(5, 15)/10;
    },
    tick: function(time) {        
        this.data.position.y -= this.data.speed;
        this.el.object3D.position.set(this.data.position.x, this.data.position.y, this.data.position.z);
        if (this.data.position.y <= -2) {
            this.el.object3D.position.set(this.data.position.x, this.data.position.y + Math.random(), this.data.position.z);
            this.el.setAttribute("hit", "");
            this.el.removeAttribute("raindrop");
        }
    }
});

AFRAME.registerComponent('hit', {
    schema: {
        timer: { type: 'number', default: 0 },
        opacity: { type: 'number', default: 1 }
    },
    init: function() {
        this.el.removeAttribute("geometry");
        this.el.setAttribute('rotation', "-90 0 0");  
        this.el.setAttribute('geometry', "primitive: circle; radius: 0.01"); 
        this.el.setAttribute('animation', 'property: geometry.radius; from: 0.01; to: 2; dur: 1000; easing: easeOutQuad');
    },
    tick: function() {
        this.data.opacity-=0.02;
        this.el.setAttribute('material', "opacity: " + this.data.opacity);  
        this.data.timer++;
        if (this.data.timer >= 60) {
            this.el.removeAttribute("hit");
            this.el.parentNode.removeChild(this.el);
            this.el.destroy();
        }
    }
});

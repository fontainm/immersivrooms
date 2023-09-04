let timerInteraction = 0;
let sceneElInteraction;
let cursorInteraction;

let points = [];
let pointsMirrored = [];

let blink = true;
let intervalInteraction = 6;
let maxLifetime = intervalInteraction * 12;

AFRAME.registerComponent('interaction', {
    schema: {
        mirrored: { type: 'boolean' },
        timer: { type: 'number', default: 0 }
    },
    init: function() {
        interactionSound.components.sound.playSound();
        this.el.object3D.updateMatrixWorld();
        sceneElInteraction = document.querySelector('[interaction]');
        cursorInteraction = document.getElementById('vrCursor');
    },
    tick: function() {
        this.data.timer++;
        timerInteraction++;
        if (this.data.timer % intervalInteraction === 0) {
            let pos = new THREE.Vector3(); 
            cursorInteraction.object3D.getWorldPosition(pos);
            let newBlob = document.createElement('a-entity');
            if (!this.data.mirrored) {
                newBlob.setAttribute("blob", "position: " + roundHalf(pos.x) + " " + roundHalf(pos.y) + " " + roundHalf(pos.z) + "; mirrored: false");             
            } else {
                newBlob.setAttribute("blob", "position: " + roundHalf(-pos.x) + " " + roundHalf(pos.y) + " " + roundHalf(pos.z) + "; mirrored: true");             
            }
            this.el.appendChild(newBlob);
        }
    }
});

AFRAME.registerComponent('blob', { 
    schema: {
        position: { type: 'vec3' },
        lifetime: { type: 'number' },
        mirrored: { type: 'boolean' }
    },
    init: function() {
        this.el.setAttribute("geometry", "primitive: sphere; radius: 0.005");
        this.el.setAttribute("position", this.data.position);
        this.el.setAttribute("material", "shader: flat");
        if (this.data.mirrored) {
            pointsMirrored.push(this.data.position);
        } else {
            points.push(this.data.position);
        }
        if (points.length > 1) {
            let newLine = document.createElement('a-entity');
            newLine.setAttribute("connector", "mirrored: true"); 
            sceneElInteraction.appendChild(newLine);
        }
        if (pointsMirrored.length > 1) {
            let newLine = document.createElement('a-entity');
            newLine.setAttribute("connector", "mirrored: false"); 
            sceneElInteraction.appendChild(newLine);
        }
    },
    tick: function() {
        this.data.lifetime++;
        this.el.setAttribute("material", "color: hsl(" + points.length + ", 70%, 50%)" );
        this.el.setAttribute("material", "opacity: " + map(this.data.lifetime, 0, maxLifetime, 1, 0));
        if (this.data.lifetime >= maxLifetime) {
            this.el.parentNode.removeChild(this.el);
            this.el.destroy();
        }
    }
});

AFRAME.registerComponent('connector', { 
    schema: {
        lifetime: { type: 'number', default: 0 },
        mirrored: { type: 'boolean' }
    },
    init: function() {
        if (!this.data.mirrored) {
            this.el.setAttribute('line',
            "; start: " + points[points.length - 2].x + " " + points[points.length - 2].y + " " + points[points.length - 2].z + 
            "; end: " + points[points.length - 1].x + " " + points[points.length - 1].y + " " + points[points.length - 1].z + 
            "; color: hsl(" + points.length + ", 70%, 50%)" );
        } else {
            this.el.setAttribute('line',
            "; start: " + pointsMirrored[pointsMirrored.length - 2].x + " " + pointsMirrored[pointsMirrored.length - 2].y + " " + pointsMirrored[pointsMirrored.length - 2].z + 
            "; end: " + pointsMirrored[pointsMirrored.length - 1].x + " " + pointsMirrored[pointsMirrored.length - 1].y + " " + pointsMirrored[pointsMirrored.length - 1].z + 
            "; color: hsl(" + pointsMirrored.length + ", 70%, 50%)" );
        }
        
    },
    tick: function() {
        
        if (this.data.lifetime >= maxLifetime && blink) {
            this.el.setAttribute('line', 'opacity: ' + map(Math.sin(timerInteraction/100), -1, 1, 0, 0.8 ));
        } else {
            this.data.lifetime++;
            this.el.setAttribute('line', 'opacity: ' + map(this.data.lifetime, 0, maxLifetime, 1, 0));
        }

    }
});

function roundHalf(num) {
    return Math.round(num*6)/6;
}
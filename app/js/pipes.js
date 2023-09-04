let lineCount = 16;
let lineLength = 40;
let lineSegments = 20;
let pipeCursor;
let pipeCursorPos;

AFRAME.registerComponent('lines', { 
    schema: {
        top: {type: 'boolean'}
    },
    init: function() {
        linesSound.components.sound.playSound();
        for (let i = -lineCount; i < 0; i++) {
            let newTube = document.createElement("a-tube");
            newTube.setAttribute("radius", "1.3");
            newTube.setAttribute("path", "0 0 0, 0 0 0");
            newTube.setAttribute("mytube", "zPos: " + (i*3-4) + "; color: " + map(i, -lineCount, 0, 0, 255));
            this.el.appendChild(newTube);
        }
        pipeCursorPos = new THREE.Vector3(); 
        pipeCursor = document.getElementById('vrCursor');
        console.log("Pipes");
    }
});

AFRAME.registerComponent('mytube', {
    schema: {
        zPos: { type: 'number' },
        color: { type: 'number' },
        values: { type: 'array' },
        pathString: { type: 'string', default: "" }
    },
    init: function() {
        this.data.values.push(0);
        let distance = lineLength / lineSegments;
        for(let i = 0; i < lineSegments; i++) {
            this.data.values.push(this.data.values[i] + (rndm(-100, 100)/200));
        }
        for (let i = 0; i < this.data.values.length; i++) {
            this.data.pathString = this.data.pathString + "" + (i*distance) + " " + this.data.values[i] +  " 0, " ;
        }
        this.data.pathString = this.data.pathString.slice(0, -2);
        this.el.setAttribute("path", this.data.pathString );
        this.el.setAttribute("material", "color: hsl(" + this.data.color + ", 50%, 50%); shader: flat");
    },
    tick: function(time, timeDelta) {
        this.el.setAttribute("material", "opacity: " + map(this.data.zPos, 0, -lineCount*3+4, 0, 0.8));
        if (this.data.zPos >= 4) {
            this.data.zPos = -lineCount*3+4;
        } else {
            this.data.zPos+=timeDelta/600;
            this.el.setAttribute("position", -lineLength/2 + " 0 " + this.data.zPos);
        }
    }
});
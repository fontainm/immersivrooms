let intro = true;
let loadingHelmet;
let isLoading = true;
let load = 1;
let cursor;
let vrActive = false;

// SFX Variables
let popSound;
let openSound;
let ambientSound;
let rainSound;
let tunnelSound;
let linesSound;
let interactionSound;
let waterSound;

AFRAME.registerComponent('start', {
    schema: {
        opacity: {type: 'number', default: 1}
    },
    init: function() {
        popSound = document.getElementById('popsound');
        openSound = document.getElementById('opensound');
        ambientSound = document.getElementById('ambientsound');
        rainSound = document.getElementById('rainsound');
        tunnelSound = document.getElementById('tunnelsound');
        linesSound = document.getElementById('linesSound');
        interactionSound = document.getElementById('interactionSound');
        waterSound = document.getElementById('watersound');

        document.querySelector('a-scene').addEventListener('enter-vr', function () {
            console.log("ENTERED VR");
            vrActive = true;
        });

        document.querySelector('a-scene').addEventListener('exit-vr', function () {
            console.log("EXIT VR");
            vrActive = false;
        });

        cursorInteraction = document.getElementById('vrSplash');
        enterLoad('intro');
    }
});

AFRAME.registerComponent('loader', { 
    init: function() {
        loadingHelmet = document.createElement('a-entity');
        loadingHelmet.setAttribute("material", "shader: flat; color: #111; side: double;");
        loadingHelmet.setAttribute("geometry", "primitive: sphere; radius: 1.1;");
        this.el.appendChild(loadingHelmet);
    },
    tick: function() {
        loadingHelmet.setAttribute("material", "opacity: " + load);
    }
});

AFRAME.registerComponent('spinner', { 
    init: function() {
        let spin1 = document.createElement('a-entity');
        spin1.setAttribute("geometry", "primitive: ring; radiusInner: 0.025; radiusOuter: 0.03; thetaStart: 0; thetaLength: 90");
        spin1.setAttribute("material", "shader: flat; side: double; color: white;");
        this.el.appendChild(spin1);
        let spin2 = document.createElement('a-entity');
        spin2.setAttribute("geometry", "primitive: ring; radiusInner: 0.025; radiusOuter: 0.03; thetaStart: 180; thetaLength: 90");
        spin2.setAttribute("material", "shader: flat; side: double; color: white;");
        this.el.appendChild(spin2);
    },
    tick: function(time) {
        if (!isLoading) {
            this.el.setAttribute("visible", "false");
        } else {
            this.el.setAttribute("rotation", "0 0 " + -time/3);
            this.el.setAttribute("visible", "true");
        }
    }
});

AFRAME.registerComponent('window', {
    schema: {
        headline: {type: 'string'},
        text: {type: 'string'},
        opacity: {type: 'number', default: 0}
    },
    init: function() {
    },
    tick : function() {
        if (!intro) {
            document.querySelector("#ui-start").setAttribute("visible", false);
        }
    }
});

AFRAME.registerComponent('button', {
    schema: {
        name: {type: 'string'},
        hovered: {type: 'boolean', default: false},
        timer: {type: 'number', default: 0},
        counter: {type: 'number', default: 0},
        color: {type: 'string', default: 'tomato'},
    },
    update: function() {
        this.el.addEventListener("mouseenter", () => {
            openSound.components.sound.playSound();
            this.data.timer = performance.now();
            this.data.hovered = true;
        });
        this.el.addEventListener("mouseleave", () => {
            this.data.timer = performance.now();
            this.data.hovered = false;
        });
    },
    tick: function() {
        if (this.data.hovered) {
            this.data.counter < 2000 ? this.data.counter = performance.now() - this.data.timer : this.data.counter = 2000;
            if (this.data.counter >= 2000) {
                popSound.components.sound.playSound();
                document.querySelector("#ui-" + this.data.name).setAttribute("visible", false);
                if (this.data.name == "start") {
                    document.getElementById("btnStart").classList.remove("clickable");
                    document.getElementById("ui-warning").setAttribute("visible", "true");
                    document.getElementById("btnWarning").classList.add("clickable");
                }
                else if (this.data.name == "warning") { 
                    intro = false; 
                    enterLoad('main');
                }
            } else {
                document.querySelector("#" + this.data.name + "filler").setAttribute("width", this.data.counter/(2000/0.7));
            }
        }
        else {
            this.data.counter >=50 ? this.data.counter-=50 : this.data.counter=0.1;
            if (this.data.counter >= 0) {
                document.querySelector("#" + this.data.name + "filler").setAttribute("width", this.data.counter/(2000/0.7));
            }
        }
        if(!intro) {
             this.el.classList.remove("clickable");
        }
    }
});

AFRAME.registerComponent('door', {
    schema: {
        hovered: {type: 'boolean', default: false},
        timer: {type: 'number', default: 0},
        counter: {type: 'number', default: 0},
        color: {type: 'string', default: 'tomato'},
        header: {type: 'string', default: ''},
        link: {type: 'string', default: ''},
    },
    init: function() {
        this.el.setAttribute("geometry", "primitive: plane; height: 2; width: 2;");
        switch(this.data.link) {
            case "main": this.el.setAttribute("material", "opacity: 1; src: #prevMain;"); break;
            case "credits": this.el.setAttribute("material", "opacity: 1; src: #prevMain;"); break;
            case "rain": this.el.setAttribute("material", "opacity: 1; src: #prevRain;"); break;
            case "fish": this.el.setAttribute("material", "opacity: 1; src: #prevFish;"); break;
            case "draw": this.el.setAttribute("material", "opacity: 1; src: #prevDraw;"); break;
            case "pipes": this.el.setAttribute("material", "opacity: 1; src: #prevPipes;"); break;
            case "tunnel": this.el.setAttribute("material", "opacity: 1; src: #prevTunnel;"); break;
            default: break;
        }

        var headline = document.createElement('a-entity');
        headline.setAttribute("text", "value: " + this.data.header + "; shader: msdf; font: https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/raleway/Raleway-ExtraBold.json; align: center; color: " + this.data.color)
        headline.setAttribute("scale", "10 10 1");
        headline.setAttribute("position", "0 1.2 0");
        this.el.appendChild(headline);

        var doorL = document.createElement('a-entity');
        doorL.setAttribute("geometry", "primitive: box; width: 1; height: 2; depth: 0.1");
        doorL.setAttribute("material", "shader: flat; color: " + this.data.color);
        doorL.setAttribute("shadow", "cast: true");
        doorL.setAttribute("position", "-0.5 0 0");
        doorL.setAttribute("id", "doorLeft");
        this.el.appendChild(doorL);

        var doorR = document.createElement('a-entity');
        doorR.setAttribute("geometry", "primitive: box; width: 1; height: 2; depth: 0.1");
        doorR.setAttribute("material", "shader: flat; color: " + this.data.color);
        doorR.setAttribute("shadow", "cast: true");
        doorR.setAttribute("position", "0.5 0 0");
        doorR.setAttribute("id", "doorRight");
        this.el.appendChild(doorR);
    },
    update: function() {
        this.el.addEventListener("mouseenter", () => {
            if (!isLoading) {
                openSound.components.sound.playSound();
                this.data.timer = performance.now();
                this.data.hovered = true;
            }
        });
        this.el.addEventListener("mouseleave", () => {
            this.data.timer = performance.now();
            this.data.hovered = false;
        });
    },
    tick: function() {
        if(!intro) this.el.classList.add("clickable");
        if (this.data.hovered) {
            this.data.counter < 2000 ? this.data.counter = performance.now() - this.data.timer : this.data.counter = 2000;
            if (this.data.counter >= 2000) {
                // Navigate to new Room:
                if (!isLoading) enterLoad(this.data.link);
            } else {
                this.el.querySelector('#doorRight').setAttribute("position", map(this.data.counter,0, 2000, 0.5, 1.2) + " 0 0");
                this.el.querySelector('#doorLeft').setAttribute("position", map(this.data.counter,0, 2000, -0.5, -1.2) + " 0 0");
            }
        }
        else {
            this.data.counter >=50 ? this.data.counter-=50 : this.data.counter=0;
            if (this.data.counter >= 0) {
                this.el.querySelector('#doorRight').setAttribute("position", map(this.data.counter,0, 2000, 0.5, 1.2) + " 0 0");
                this.el.querySelector('#doorLeft').setAttribute("position", map(this.data.counter,0, 2000, -0.5, -1.2) + " 0 0");
            }
        }
    }
});

AFRAME.registerComponent('exitsign', { 
    init: function() { 
        let text = document.createElement('a-entity');
        text.setAttribute('text', 'value: TURN\nAROUND\nTO EXIT; align: center; width: 1.6; color: orange; shader: msdf; font: https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/raleway/Raleway-ExtraBold.json')
        text.setAttribute('position', '0 0 -0.8');
        text.setAttribute('rotation', '-90 0 0');

        let arrow = document.createElement('a-image');
        arrow.setAttribute('src', '#arrow');
        arrow.setAttribute('material', 'opacity: 0.1');
        arrow.setAttribute('width', '0.9');
        arrow.setAttribute('height', '0.5');
        arrow.setAttribute('position', '0 0 -0.8');
        arrow.setAttribute('rotation', '-90 0 0');

        this.el.appendChild(arrow);
        this.el.appendChild(text);
    }
});

function rndm(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function map(value, in_min, in_max, out_min, out_max)
{
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function enterLoad(link) {
    isLoading = true;
    if (link !=="intro") {
        popSound.components.sound.playSound();
    }

    let enter = setInterval(function() {
        load >= 1 ? load = 1 : load += 0.01;
    }, 1);

    setTimeout(function() {
        if (link !== "main") {
            ambientSound.components.sound.stopSound();
        } else {
            rainSound.components.sound.stopSound();
            tunnelSound.components.sound.stopSound();
            linesSound.components.sound.stopSound();
            interactionSound.components.sound.stopSound();
            waterSound.components.sound.stopSound();
        }
        let roomRotation = "0 0 0";
        switch (link) {
            case "tunnel": roomRotation = "0 90 0"; break;
            case "fish": roomRotation = "0 45 0"; break;
            case "draw": roomRotation = "0 0 0"; break;
            case "intro": roomRotation = "0 0 0"; break;
            case "main": roomRotation = "0 0 0"; break;
            case "rain": roomRotation = "0 -45 0"; break;
            case "pipes": roomRotation = "0 -90 0"; break;
            case "credits": roomRotation = "0 -180 0"; break;
        }
        document.getElementById("includedScene").setAttribute("rotation", roomRotation);
        // console.log("Loading Room...");
        $("#includedScene").load("./scenes/" + link + ".html", function() {
            setTimeout(function() {
                clearInterval(enter);
                exitLoad();
                // console.log("Exit Loading Room...");
            }, 500);
            if (link === "main") { 
                ambientSound.components.sound.playSound();
            }
        }); 
    }, 900)
}

function exitLoad() {
    isLoading = false;
    let exit = setInterval(function() {
        load <= 0 ? load = 0 : load -= 0.005;
        if (load === 0) {
            clearInterval(exit);
        }             
    }, 1);
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}

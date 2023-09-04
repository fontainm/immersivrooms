let cameraFish;
let cameraFishRot;
let pivotFish;

AFRAME.registerComponent('fish', { 
    init: function() {
        waterSound.components.sound.playSound();
        cameraFish = document.getElementById("camera");
        pivotFish = document.getElementById("fishpivot");
        cameraFishRot = new THREE.Quaternion();

        let loadingText = document.createElement("a-entity");
        loadingText.setAttribute("text", "value: Der Fisch ist auf dem Weg...; align: center");
        loadingText.setAttribute("position", "0 0.1 -1");
        loadingText.setAttribute("animation", "property: text.opacity; to: 0; dur: 2500; easing: easeInQuad");
        cameraFish.appendChild(loadingText);    
    },
    tick: function() {
        cameraFish.object3D.getWorldQuaternion(cameraFishRot);

        let yRotTarget = map(cameraFish.object3D.rotation.y, Math.PI * -2, Math.PI * 2, -360, 360);
        let yPosTarget;
        if (vrActive) yPosTarget = map(cameraFishRot.x, -1, 1, -3.4, 6.6);
        else yPosTarget = map(cameraFishRot.x, -1, 1, -4, 6);
        
        let yPos = lerp(this.el.object3D.position.y, yPosTarget, 0.02);
        let yRot = lerp(map(pivotFish.object3D.rotation.y, -2*Math.PI, 2*Math.PI, -360, 360), yRotTarget, 0.02);

        this.el.setAttribute("position", 0 + " " + yPos +  " -2");
        pivotFish.setAttribute("rotation", "0 " + yRot + " 0");

        let distanceY = (yPosTarget - this.el.object3D.position.y);

        if (yRotTarget <= pivotFish.object3D.rotation.y * 58) { 
            this.el.setAttribute("animation__rot", "property: rotation; to: " + 0 + " -90 0; dur: 500; easing: linear");            
            this.el.setAttribute("rotation", (map(distanceY, -5, 5, -90, 90)) + " -90 0");
            
        } else {
            this.el.setAttribute("animation__rot", "property: rotation; to: " + 0 + " 90 0; dur: 500; easing: linear");            
            this.el.setAttribute("rotation", (map(distanceY, -3, 3, -90, 90)) + " 90 0");
        }      
    }
});

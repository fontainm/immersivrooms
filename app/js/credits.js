let creditsText = [];

AFRAME.registerComponent('credits', { 
    init: function() {
        if (!vrActive) {
            this.el.setAttribute("position", "0 1.5 -0.8")
        }

        if (creditsText.length === 0) {
            creditsText.push({title: "CREATED BY", text: "Mathias Fontain"});
            creditsText.push({title: "MAIN ROOM AMBIENCE SFX", text: "Ambient Wave Single - (8) by Jordan Powell, CC BY NC 3.0\nhttps://freesound.org/people/Erokia/sounds/474353/"});
            creditsText.push({title: "RAIN AMBIENCE SFX", text: "Light Rain by babuababua, CC BY 4.0\nhttps://freesound.org/people/babuababua/sounds/344430/"});
            creditsText.push({title: "FISH 3D MODEL", text: "Fish by Mario, CC BY 4.0, \nhttps://sketchfab.com/3d-models/fish-1c5b8f5f4e354777baeb0278d89e3db7"});
            creditsText.push({title: "THANKS TO", text: "Prof. Dr. rer. nat. Martin Christof Kindsmueller\nMartin Haferanke, M. Sc.\nAll test participants"});
            creditsText.push({title: "", text: "Technische Hochschule Brandenburg, 2020"});
        }

        for(let i = 0; i < creditsText.length; i++) {
            let header = document.createElement("a-text");
            header.setAttribute("value", creditsText[i].title);
            header.setAttribute("color", "rgb(0, 175, 153)");
            header.setAttribute("shader", "msdf");
            header.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/raleway/Raleway-ExtraBold.json");
            header.setAttribute("align", "center");
            header.setAttribute("baseline", "top");
            header.setAttribute("width", "0.9");
            header.setAttribute("position", "0 " + -i/6 + " 0");
            this.el.appendChild(header);
    
            let name = document.createElement("a-text");
            name.setAttribute("value", creditsText[i].text);
            name.setAttribute("shader", "msdf");
            name.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/nunito/Nunito-Light.json");
            name.setAttribute("align", "center");
            name.setAttribute("baseline", "top");
            name.setAttribute("text", "wrapCount: 60");
            name.setAttribute("width", "1.0");
            name.setAttribute("position", "0 " + (-i/6-0.05) + " 0");
            this.el.appendChild(name);
        }
    }
});

{/* <a-text value="STEUERUNG" color="rgb(0, 175, 153)" shader="msdf" font="https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/raleway/Raleway-ExtraBold.json" align="center" position="0 0.1 0"></a-text> */}

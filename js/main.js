"use strict";

//* Connect UI
var form = document.getElementById("form");
var input = form.querySelectorAll("input");
var formDropdown = document.getElementById("formDropdown");
var btnAddStation = document.getElementById("btnAddStation");
var btnUpdate = document.getElementById("btnUpdate");
var btnPrint = document.getElementById("btnPrint");
var pOutput = document.getElementById("pOutput");
//| Canvas
var canvasGfx = document.getElementById("canvasGfx");
var ctx = canvasGfx.getContext("2d");

//* Global variables
var stationArr = [];
var diagramTypeArr = ["rain", "wind", "temp"];
var titleArr = ["Nedbør", "Vind", "Temp"];

//* Create station-objects + class
var stations = function(name, id){
    this.name = name;
    if(id == "x"){ //| dropdown-value
        for (var i = 0; i < stationArr.length; i++) {
            this.id = stationArr[i].id + 1;}
    }else{ this.id = id; }
    this.rain = 0;
    this.wind = 0;
    this.temp = 0;
}
var station1 = new stations("Bergen", 1);
var station2 = new stations("Oslo", 2);
var station3 = new stations("Stavanger", 3);
stationArr.push(station1);
stationArr.push(station2);
stationArr.push(station3);

//* Add new Stations
btnAddStation.onclick = function(){
    var nodeInput = document.createElement("input");
    var nodeBtn = document.createElement("button");
    nodeInput.placeholder = "Station Name";
    nodeInput.className = "newStationInput";
    nodeBtn.innerHTML = "Add";
    form.appendChild(nodeInput);
    form.appendChild(nodeBtn);

    nodeBtn.onclick = function(){
        var newStationInput = document.getElementsByClassName("newStationInput");
        if(newStationInput[0].value != ""){ //* if not empty
            var stationX = new stations(String(newStationInput[0].value), "x");
            //console.log(stationX.id);
            stationArr.push(stationX);
            updateDropdown(stationX.id); //* update and set latest value 
        }
        this.parentNode.removeChild(this);
        form.removeChild(newStationInput[0]);  //* to måter å gjøre det på
    };
};

//* Generate dropdown-options
function updateDropdown(showValue){
    var option = formDropdown.querySelectorAll("option"); //* Get list of options
    for (var i = 1; i < option.length; i++) { //* Clear dropdown
        formDropdown.removeChild(option[i]);
    }
    for (var i = 0, node; i < stationArr.length; i++) { //* Fill dropdown
        node = document.createElement("option");
        node.value = stationArr[i].id;
        node.innerHTML = stationArr[i].name;
        formDropdown.appendChild(node);
    }
    formDropdown.value = showValue;
}
updateDropdown(0); //| insert into dropdown-menu (not updating)

//* Update station-data
btnUpdate.onclick = function(){
    var station = formDropdown.value;
    var rain = parseInt(input[0].value);
    var wind = parseInt(input[1].value);
    var temp = parseInt(input[2].value);
    //| cancel if station is not chosen or if all inputs are empty:
    if(station == 0 || (isNaN(rain) && isNaN(wind) && isNaN(temp))){
        return;
    }else{
        //console.log(rain + ", " + wind + ", " + temp + ", station: " + station);

        //| Search through stations for current station and update values ++
        for (var i = 0; i < stationArr.length; i++) { 
            if(stationArr[i].id == station){
                //* update if not NaN: 
                if(!isNaN(rain)){stationArr[i].rain = rain;}                 if(!isNaN(rain)){stationArr[i].rain = rain;}
                if(!isNaN(wind)){stationArr[i].wind = wind;}
                if(!isNaN(temp)){stationArr[i].temp = temp;}
            }
        }
        //rainDiagram(); //| Update diagram
        diagram(0);
        //console.log(stationArr[station -1]); //| log update
    } 
}; 

//* Print to diagrams
btnPrint.onclick = function(){
    //rainDiagram(); //| old, only-rain-diagram
    var nodeArr = [], i, diagramBtnArr;
    var nodeBtnRain = document.createElement("button");
    var nodeBtnWind = document.createElement("button");
    var nodeBtnTemp = document.createElement("button");

    //| Push to nodeArr
    nodeArr.push(nodeBtnRain);
    nodeArr.push(nodeBtnWind);
    nodeArr.push(nodeBtnTemp);

    for (i = 0; i < nodeArr.length; i++) {
        nodeArr[i].className = "diagramBtn";
        nodeArr[i].style = "width: 83px; margin: .35em .35em 0 0";
        nodeArr[i].innerHTML = titleArr[i];
        nodeArr[i].onclick = function(){ //| Function for delete nodes
            diagramBtnArr = form.querySelectorAll("button.diagramBtn");
            for (var a = 0; a < diagramBtnArr.length; a++) {
                if(this == diagramBtnArr[a]){
                    diagram(a);}
            }
            for (a = 0; a < diagramBtnArr.length; a++) {
                form.removeChild(diagramBtnArr[a]);
            }};
        form.appendChild(nodeArr[i]);
    }
};


//? Midlertidig
function insertDummyValues(){
    for (var i = 0; i < stationArr.length; i++) { 
        //| fill stations with dummy-values
        stationArr[i].rain = 3 + 2*i;
        stationArr[i].wind = 6 + i;
        stationArr[i].temp = 17 - 3*i;
    }
}
insertDummyValues(); //| run dummyValues

//* Draw diagram
function diagram(diagramType){
    var i, 
        typeVal = "",
        floatVal,
        name,
        highestVal = 0, 
        poleHeight, 
        poleWidth, 
        textMargin = 10, 
        valArr = [], 
        value = 0,
        colorArr = ["#00f5", "#0f05", "#f005"];

    ctx.clearRect(0, 0, 1000, 1000);

    //* Read highest value
    for (i = 0; i < stationArr.length; i++) {
        if(diagramType == 0){typeVal = stationArr[i].rain;}else
        if(diagramType == 1){typeVal = stationArr[i].wind;}else
        if(diagramType == 2){typeVal = stationArr[i].temp;}

        if(highestVal < typeVal){
            highestVal = typeVal;}
    }    

    for (i = 0; i < stationArr.length; i++, valArr = []) {

        //| Define Value and Name
        for(var element in stationArr[i]){
            valArr.push(stationArr[i][element]);
        }
        value = valArr.slice(2)[diagramType];
        name = stationArr[i].name;
        //console.log("name: "  + name + ", Arr: " + valArr);
        //console.log(value + "; " + name);

        //| float between 0 and 1 
        floatVal = value / highestVal;    
        poleHeight = floatVal * canvasGfx.offsetHeight - 30; //|30px down from top, space for title
        poleWidth = canvasGfx.offsetWidth/stationArr.length;

        //console.log(highestVal + ", " + floatVal + ", " + poleHeight);
        //| Draw poles
        ctx.fillStyle = colorArr[diagramType];
        ctx.fillRect( //| poles fill
            i * poleWidth, 
            canvasGfx.offsetHeight - poleHeight, 
            poleWidth, 
            poleHeight
        );
        ctx.strokeRect( //| poles stroke
            i * poleWidth, 
            canvasGfx.offsetHeight - poleHeight, 
            poleWidth, 
            poleHeight
        );
        //| Text style
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText( //| Names
            stationArr[i].name, 
            i * poleWidth + 5/stationArr[i].name.length * textMargin, //| further to the right if station name is longer 
            canvasGfx.offsetHeight - textMargin, 
            poleWidth - textMargin
        );
        //| Values
        ctx.fillText(
            value + "mm",  //| value
            i * poleWidth + poleWidth/2 -22, //| center of pole + 22px offset to left 
            canvasGfx.offsetHeight - poleHeight + 20 //| pos at top of pole + 20px offset down
        );
    }
    
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#000";
    ctx.fillText(titleArr[diagramType], 120, 25);

}

const { ipcRenderer } = require('electron');

ipcRenderer.on('action-update', (event, arg) => {
    // alert("Hello, you did something in the first window");
    // console.log(arg);
    document.getElementById(arg.elementID).innerHTML = arg.value;
});

ipcRenderer.on('change-color', (event, arg) => {
    document.getElementById(arg.elementID).style.background = arg.value;
});

//
// read the currently saved team names and colors
//
fs.readFile(obsdir + "/Visitor_Name.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Visitor_Name.txt", "WARRIORS");
        inputVisitorName.value = "VISITORS";
    }
    else {
        inputVisitorName.value = data.toString();
    }
    // send Visitor Name to new Scoreboard
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-Visitor-name", value: inputVisitorName.value });
});
fs.readFile(obsdir + "/Home_Name.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Home_Name.txt", "MUSTANGS");
        inputHomeName.value = "HOME";
    }
    else {
        inputHomeName.value = data.toString();
    }
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-Home-name", value: inputHomeName.value });
});
fs.readFile(obsdir + "/Visitor_Color.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Visitor_Color.txt", "darkgreen");
        inputVisitorColor.value = "black";
    }
    else {
        inputVisitorColor.value = data.toString();
    }
    // send Visitor Name to new Scoreboard
    ipcRenderer.send('change-color', 
        { elementID: "sb-Visitor-name", value: inputVisitorColor.value });
});
fs.readFile(obsdir + "/Home_Color.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Home_Color.txt", "darkgreen");
        inputHomeColor.value = "black";
    }
    else {
        inputHomeColor.value = data.toString();
    }
    // send Visitor Name to new Scoreboard
    ipcRenderer.send('change-color', 
        { elementID: "sb-Home-name", value: inputHomeColor.value });
});
fs.readFile(obsdir + "/Stats_Color.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Stats_Color.txt", "darkgreen");
        inputStatsColor.value = "black";
    }
    else {
        inputStatsColor.value = data.toString();
    }
    // send Visitor Name to new Scoreboard
    ipcRenderer.send('change-color', 
        { elementID: "sb-Stats-name", value: inputStatsColor.value });
});
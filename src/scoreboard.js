const { ipcRenderer } = require('electron');

ipcRenderer.on('action-update', (event, arg) => {
    // alert("Hello, you did something in the first window");
    // console.log(arg);
    if ("elementID" in arg){
        document.getElementById(arg.elementID).innerHTML = arg.value;
    }
    if ("className" in arg) {
        for (const item of document.getElementsByClassName(arg.className)){
            item.innerHTML = arg.value;
        }
    }
});

ipcRenderer.on('change-color', (event, arg) => {
    if ("elementID" in arg){
        document.getElementById(arg.elementID).style.background = arg.value;
    }
    if ("className" in arg) {
        for (const item of document.getElementsByClassName(arg.className)){
            item.style.background = arg.value;
        }
    }
});

ipcRenderer.on('change-foreground-color', (event, arg) => {
    document.getElementById(arg.elementID).style.color = arg.value;
});

ipcRenderer.on('change-font-size', (event, arg) => {
    document.getElementById(arg.elementID).style.fontSize = arg.value;
});

ipcRenderer.on('change-display', (event, arg) => {
    document.getElementById(arg.elementID).style.display = arg.value;
});

const { ipcRenderer } = require('electron');

ipcRenderer.on('action-update', (event, arg) => {
    // alert("Hello, you did something in the first window");
    // console.log(arg);
    document.getElementById(arg.elementID).innerHTML = arg.value;
});

ipcRenderer.on('change-color', (event, arg) => {
    document.getElementById(arg.elementID).style.background = arg.value;
});

ipcRenderer.on('change-foreground-color', (event, arg) => {
    document.getElementById(arg.elementID).style.color = arg.value;
});
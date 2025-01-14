const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const console = require('console');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
;

let windowMain;
let windowScoreboard;
let windowInnings;
let appIcon = 'PED Scoreboard REBORN Logo Transparent.ico';

const createWindow = () => {
    // Create the browser window.
    windowMain = new BrowserWindow({
        icon: appIcon,
        width: 400,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });

    // and load the index.html of the app.
    windowMain.loadFile(path.join(__dirname, 'index.html'));
    windowMain.setPosition(0, 0, false)

    windowScoreboard = new BrowserWindow({
        icon: appIcon,
        width: 600,
        height: 100,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });
    // windowScoreboard.setMenu(null);
    windowScoreboard.loadFile(path.join(__dirname, 'scoreboard.html'));
    windowScoreboard.setPosition(400, 100, false)

    windowInnings = new BrowserWindow({
        icon: appIcon,
        width: 1090,
        height: 260,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });
    // windowInnings.setMenu(null);
    windowInnings.loadFile(path.join(__dirname, 'innings.html'));
    windowInnings.setPosition(400, 300, false)

    // windowscoreShort = new BrowserWindow({
    //   icon: appIcon,
    //   width: 570,
    //   height: 260,
    //   webPreferences: {
    //     nodeIntegration: true,
    //     contextIsolation: false,
    //     devTools: true
    //   }
    // });
    //  windowscoreShort.setMenu(null);
    //  windowscoreShort.loadFile(path.join(__dirname, 'scoreshort.html'));
    // windowscoreShort.setPosition(400, 600, false)


    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on('update-scoreboard', (event, arg) => {
    windowScoreboard.webContents.send('action-update', arg);
    windowInnings.webContents.send('action-update', arg);
    // windowscoreShort.webContents.send('action-update', arg);
});
ipcMain.on('change-color', (event, arg) => {
    windowScoreboard.webContents.send('change-color', arg);
    windowInnings.webContents.send('change-color', arg);
    // windowscoreShort.webContents.send('change-color', arg);
});

ipcMain.on('change-foreground-color', (event, arg) => {
    windowScoreboard.webContents.send('change-foreground-color', arg);
    windowInnings.webContents.send('change-foreground-color', arg);
    // windowscoreShort.webContents.send('change-foreground-color', arg);
});

ipcMain.on('change-font-size', (event, arg) => {
    windowScoreboard.webContents.send('change-font-size', arg);
});

ipcMain.on('change-display', (event, arg) => {
    windowScoreboard.webContents.send('change-display', arg);
    windowInnings.webContents.send('change-display', arg);
});


ipcMain.on('change-score-board-window-size', (event, arg) => {
    windowScoreboard.setSize(arg.width, arg.height, false);
});

ipcMain.on('change-innings-window-size', (event, arg) => {
    windowInnings.setSize(arg.width, arg.height, false);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


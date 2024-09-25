// Requirements
const { clear } = require("console");
const fs = require("fs");

const { ipcRenderer } = require("electron");

// Buttons
const Visitor_Inning_Score = document.getElementById("Visitor_Inning_Score");
const Visitor_Total_Score = document.getElementById("Visitor_Total_Score");
const btnVisitorAdd1 = document.getElementById("btnVisitorAdd1");
const btnVisitorSub1 = document.getElementById("btnVisitorSub1");

const Home_Inning_Score = document.getElementById("Home_Inning_Score");
const Home_Total_Score = document.getElementById("Home_Total_Score");
const btnHomeAdd1 = document.getElementById("btnHomeAdd1");
const btnHomeSub1 = document.getElementById("btnHomeSub1");

const btnInning = document.getElementById("btnInning");
const divInning = document.getElementById("divInning");
const btnInningAdd1 = document.getElementById("btnInningAdd1");
const btnInningSub1 = document.getElementById("btnInningSub1");

const btnNow = document.getElementById("btnNow");
const btnNowAdd1 = document.getElementById("btnNowAdd1");
const btnNowSub1 = document.getElementById("btnNowSub1");

const Visitor_Hits = document.getElementById("Visitor_Hits");
const btnVisitorHitsAdd1 = document.getElementById("btnVisitorHitsAdd1");
const btnVisitorHitsSub1 = document.getElementById("btnVisitorHitsSub1");

const Home_Hits = document.getElementById("Home_Hits");
const btnHomeHitsAdd1 = document.getElementById("btnHomeHitsAdd1");
const btnHomeHitsSub1 = document.getElementById("btnHomeHitsSub1");

const Visitor_Errors = document.getElementById("Visitor_Errors");
const btnVisitorErrorsAdd1 = document.getElementById("btnVisitorErrorsAdd1");
const btnVisitorErrorsSub1 = document.getElementById("btnVisitorErrorsSub1");

const Home_Errors = document.getElementById("Home_Errors");
const btnHomeErrorsAdd1 = document.getElementById("btnHomeErrorsAdd1");
const btnHomeErrorsSub1 = document.getElementById("btnHomeErrorsSub1");

const btnBallAdd = document.getElementById("btnBallAdd");
const btnBalls = document.getElementById("btnBalls");
const btnBallSub = document.getElementById("btnBallSub");

const btnStrikeAdd = document.getElementById("btnStrikeAdd");
const btnStrikes = document.getElementById("btnStrikes");
const btnStrikeSub = document.getElementById("btnStrikeSub");

const btnResetCount = document.getElementById("btnResetCount");

const btnOutAdd = document.getElementById("btnOutAdd");
const btnOuts = document.getElementById("btnOuts");
const btnOutSub = document.getElementById("btnOutSub");

const btnFirstBase = document.getElementById("btnFirstBase");
const btnSecondBase = document.getElementById("btnSecondBase");
const btnThirdBase = document.getElementById("btnThirdBase");

const inputVisitorName = document.getElementById("inputVisitorName");
const inputHomeName = document.getElementById("inputHomeName");
const inputTournamentName = document.getElementById("inputTournamentName");

// const menuVisitorLogo = document.getElementById("menuVisitorLogo");
// const menuHomeLogo = document.getElementById("menuHomeLogo");

const inputVisitorColor = document.getElementById("inputVisitorColor");
const inputHomeColor = document.getElementById("inputHomeColor");
const inputStatsColor = document.getElementById("inputStatsColor");

const btnFinal = document.getElementById("btnFinal");
const inningsToFinal = 5;
const maxInningsScoreboard = 7;
const btnResetGame = document.getElementById("btnResetGame");
const divStatusBar = document.getElementById("divStatusBar");
const btnClearAllBases = document.getElementById("btnClearAllBases");

const selectTemplates = document.getElementById("selectTemplates");

let dummyError = function (err) {
    if (err) {
        console.log(err);
    }
};

//
// does the OBSFiles folder exist?
//
const obsdir = "OBSFiles"
if (fs.existsSync(obsdir)) {
    // exists
}
else {
    // does not exist, create it
    fs.mkdirSync(obsdir, (err) => {
        if (err) {
            console.log("could not make directory");
        }
    });
}

//
// initialize countText & outsText
// do NOT read from files
//
let balls = 0;
let strikes = 0;
let outs = 0;
let countText = "0 - 0";
let outsText = "0 OUT";
let innText = "TOP 1";
let firstBase = false;
let secondBase = false;
let thirdBase = false;
let automationTimeout = 3;

// initialize COUNT file for OBS
fs.writeFile(obsdir + "/Count.txt", countText, dummyError);
ipcRenderer.send('update-scoreboard', 
    { elementID: "sb-count", value: countText });
// initialize OUTS file for OBS
fs.writeFile(obsdir + "/Outs.txt", outsText, dummyError);
ipcRenderer.send('update-scoreboard', 
    { elementID: "sb-outs", value: outsText });

ipcRenderer.send('update-scoreboard',
    { elementID: "sb-count-ball-icon", value: "<img src='ball-0.png' height=50 width=120>" });
ipcRenderer.send('update-scoreboard',
    { elementID: "sb-count-strike-icon", value: "<img src='strike-0.png' height=50 width=94>" });
ipcRenderer.send('update-scoreboard',
    { elementID: "sb-count-out-icon", value: "<img src='out-0.png' height=50 width=94>" });

//
// Initialize Visitor & Home Scores
// update from any files that exist
//
let VisitorScores =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let HomeScores =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let VisitorHit = 0;
let HomeHit = 0;
let VisitorError = 0;
let HomeError = 0;
let initializeTeamScores = function() {
    let i;
    let data;
    for (i = 0; i <= 19; i += 1) {
        try {
            data = fs.readFileSync(obsdir + "/Visitor_" + Number(i+1) + "_Score.txt");
            VisitorScores[i] = Number(data.toString());
        }
        catch {
            // do nothing
        }
        try {
            data = fs.readFileSync(obsdir + "/Home_" + Number(i+1) + "_Score.txt");
            HomeScores[i] = Number(data.toString());
        }
        catch {
            // do nothing
        }
    }
};
initializeTeamScores();

let initializeTeamHits = function() {
    let data;
        try {
            data = fs.readFileSync(obsdir + "/Visitor_Hits.txt");
            // console.log("Visitor Hits: " + data);
            VisitorHit = Number(data.toString());
        }
        catch {
            // do nothing
        }
        try {
            data = fs.readFileSync(obsdir + "/Home_Hits.txt");
            // console.log("Home Hits: " + data);
            HomeHit = Number(data.toString());
        }
        catch {
            // do nothing
        }    
};
initializeTeamHits();

let initializeTeamErrors = function() {
    let data;
        try {
            data = fs.readFileSync(obsdir + "/Visitor_Errors.txt");
            // console.log("Visitor Errors: " + data);
            VisitorError = Number(data.toString());
        }
        catch {
            // do nothing
        }
        try {
            data = fs.readFileSync(obsdir + "/Home_Errors.txt");
            // console.log("Home Errors: " + data);
            HomeError = Number(data.toString());
        }
        catch {
            // do nothing
        }    
};
initializeTeamErrors();

//
// read the currently saved tournament name
//
fs.readFile(obsdir + "/Tournament_Name.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Tournament_Name.txt", "Tournament");
        inputTournamentName.value = "Tournament";
    }
    else {
        inputTournamentName.value = data.toString();
    }
    // send Visitor Name to new Scoreboard
    ipcRenderer.send('update-scoreboard',
        { elementID: "wsb-tournament-container-span", value: inputTournamentName.value });
});

//
// read the currently saved team names and colors
//
fs.readFile(obsdir + "/Visitor_Name.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Visitor_Name.txt", "VISITOR");
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
        fs.writeFileSync(obsdir + "/Home_Name.txt", "HOME");
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
        fs.writeFileSync(obsdir + "/Visitor_Color.txt", "red 80%, white");
        inputVisitorColor.value = "red 80%, white";
    }
    else {
        inputVisitorColor.value = data.toString();
    }

    adjustColor("Visitor", inputVisitorColor.value, true);
});
fs.readFile(obsdir + "/Home_Color.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Home_Color.txt", "purple 80%, white");
        inputHomeColor.value = "purple 80%, white";
    }
    else {
        inputHomeColor.value = data.toString();
    }

    adjustColor("Home", inputHomeColor.value, true);
});
fs.readFile(obsdir + "/Stats_Color.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Stats_Color.txt", "black 80%, grey");
        inputStatsColor.value = "black 80%, grey";
    }
    else {
        inputStatsColor.value = data.toString();
    }

    adjustColor("Stats", inputStatsColor.value, true);
});

fs.readFile(obsdir + "/Templates.txt", function(err, data) {
    if (err) {
        fs.writeFileSync(obsdir + "/Templates.txt", "icon");
    }
    else {
        let objS = document.getElementById("selectTemplates");
        objS.value = data.toString();
        templateChange()
    }


});

//
// figure out the current (editing) inning on startup
// if no inning.txt exists, create it, set to first inning
//
let currentInning;
fs.readFile(obsdir + "/Inning.txt", function (err, data) {
    if (err) {
        // there is no Inning.txt, create it, set to first inning
        fs.writeFileSync(obsdir + "/Inning.txt", "1");
        btnInning.innerHTML = "1";
        divInning.innerHTML = "1";
        currentInning = 1;
    }
    else {
        let inning = data.toString();
        btnInning.innerHTML = inning;
        divInning.innerHTML = inning;
        currentInning = inning;

        // console.log(currentInning);
    }

    // update the visitor score for the current inning
    Visitor_Inning_Score.innerHTML = VisitorScores[currentInning - 1];
    Visitor_Hits.innerHTML = VisitorHit;
    // console.log("Visitor ERRORS: " + VisitorError);
    Visitor_Errors.innerHTML = VisitorError;
    
    // update the home score for the current inning
    Home_Inning_Score.innerHTML = HomeScores[currentInning - 1];
    Home_Hits.innerHTML = HomeHit;
    // console.log("Home ERRORS: " + HomeError);
    Home_Errors.innerHTML = HomeError;

    // update totals ON GRAPHIC!
    updateTotalRuns("Visitor");
    updateTotalRuns("Home");

    updateHits("Visitor", 0);
    updateHits("Home", 0);

    updateErrors("Visitor", 0);
    updateErrors("Home", 0);
});
//
// adjust Inning up or down
// then grab the Visitor/Home runs for that inning and display
//
let adjustInning = function(item, amount) {
    let filename = obsdir + "/Inning.txt";
    currentInning = Number(currentInning) + amount;
    if (currentInning < 1) {
        currentInning = 1;
        // and don't update inning button or text file
    }
    else {
        // update inning button & text file
        adjustFile(item, filename, amount);
        // update inning X RUNS
        document.getElementById("divInning").innerHTML = currentInning.toString();
    }

    // update the visitor score for the current inning
    Visitor_Inning_Score.innerHTML = VisitorScores[currentInning - 1];

    // update the home score for the current inning
    Home_Inning_Score.innerHTML = HomeScores[currentInning - 1];

    // update total scores!
    updateTotalRuns("Visitor");
    updateTotalRuns("Home");
};

//
// figure out the current game status "now" on startup
// if no now.txt exists, create it, set to "TOP 1"
// can possibly automate the text - figure out the inning and whether it's TOP, MID, BOT, END based on now

let nowText = [
    "TOP 1", "MID 1", "BOT 1", "END 1",
    "TOP 2", "MID 2", "BOT 2", "END 2",
    "TOP 3", "MID 3", "BOT 3", "END 3",
    "TOP 4", "MID 4", "BOT 4", "END 4",
    "TOP 5", "MID 5", "BOT 5", "END 5",
    "TOP 6", "MID 6", "BOT 6", "END 6",
    "TOP 7", "MID 7", "BOT 7", "END 7",
    "TOP 8", "MID 8", "BOT 8", "END 8",
    "TOP 9", "MID 9", "BOT 9", "END 9",
    "TOP 10", "MID 10", "BOT 10", "END 10",
    "TOP 11", "MID 11", "BOT 11", "END 11",
    "TOP 12", "MID 12", "BOT 12", "END 12",
    "TOP 13", "MID 13", "BOT 13", "END 13",
    "TOP 14", "MID 14", "BOT 14", "END 14",
    "TOP 15", "MID 15", "BOT 15", "END 15",
    "TOP 16", "MID 16", "BOT 16", "END 16",
    "TOP 17", "MID 17", "BOT 17", "END 17",
    "TOP 18", "MID 18", "BOT 18", "END 18",
    "TOP 19", "MID 19", "BOT 19", "END 19"
];
let now = 0;
fs.readFile(obsdir + "/now.txt", function (err, data) {
    if (err) {
        // there is no now.txt, create it, set to "TOP 1"
        fs.writeFileSync(obsdir + "/now.txt", "TOP 1");
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-progress", value: "TOP 1" });
        ipcRenderer.send('update-scoreboard',
            { elementID: "sb-progress-text", value: "1" });
        ipcRenderer.send('update-scoreboard',
            { elementID: "sb-progress-icon", value: "<img src='inning_top.png' height=90 width=30>" });
        btnNow.innerHTML = "TOP 1";
        now = 0;
    }
    else {
        // console.log(data);
        var thetext = data.toString();
        now = nowText.indexOf(thetext);
        // console.log(thetext);
        btnNow.innerHTML = thetext;

        innText = thetext;

        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-progress", value: thetext });
        progressHeader(now, outsText);
        //
        // do something special if we aren't editing the now inning
        //
    }
});

//
// are we Top, Mid, Bot, End inning?
//
let isTopInning = function(i) {
    if (i % 4 == 0) { return true; }
    else { return false; }
};
let isMidInning = function(i) {
    if (i % 4 == 1) { return true; }
    else { return false; }
};
let isBotInning = function(i) {
    if (i % 4 == 2) { return true; }
    else { return false; }
};
let isEndInning = function(i) {
    if (i % 4 == 3) { return true; }
    else { return false; }
};

//
// progress thru the game
//
let adjustProgress = function(amount) {
    now = Number(now) + amount;
    if (now < 0) {
        now = 0;
        // and don't update progress button or text file
    }
    else {
        // update inning button & text file
        btnNow.innerHTML = nowText[now];
        fs.writeFile(obsdir + "/now.txt", nowText[now], dummyError);
        ipcRenderer.send('update-scoreboard',
            { elementID: "sb-progress", value: nowText[now] });
    }
    currentInning = Math.floor(now/4) + 1;

    console.log(currentInning)
    // update the current inning based on advancing progress
    fs.writeFile(obsdir + "/Inning.txt", currentInning.toString(), dummyError);
    btnInning.innerHTML = currentInning;
    divInning.innerHTML = currentInning;

    let fnVisitor = obsdir + "/Visitor_" + currentInning + "_Score.txt";
    let fnHome = obsdir + "/Home_" + currentInning + "_Score.txt";

    // update the visitor score for the current inning
    Visitor_Inning_Score.innerHTML = VisitorScores[currentInning - 1];

    // update the home score for the current inning
    Home_Inning_Score.innerHTML = HomeScores[currentInning - 1];

    // update total scores!
    updateTotalRuns("Visitor");
    updateTotalRuns("Home");

    // if Mid or End of inning, clear baserunners, Hide Count and Outs
    if (isMidInning(now) || isEndInning(now)) {
        clearAllBases();
        // hide count
        resetCount();
        // hide outs
        resetOuts();
    }

    // if Top or Bot of inning, set Outs to "0 OUT"
    if (isTopInning(now) || isBotInning(now)) {
        setZeroOuts();
    }
    progressHeader(now, outsText);
};

let changeInningsColor = function(team, inning, idx) {
    let objS = document.getElementById("selectTemplates");
    let value = objS.options[objS.selectedIndex].value;

    let nowInning = Math.floor(now/4) + 1;

    let visitGrey = false
    let homeGrey = false
    // if i
    if (inning < nowInning){
        visitGrey = true
        homeGrey = true
    }
    if (inning === nowInning){
        visitGrey = true
        if (isBotInning(now) || isEndInning(now)){
            homeGrey = true
        }
    }
    let setGrey = homeGrey
    let score = HomeScores[inning - 1]
    if (team === "Visitor") {
        setGrey = visitGrey
        score = VisitorScores[inning - 1]
    }
    let teamId = "sb-" + team + "-score" + idx
    if (score === 0) {
        let backGroundColor = inputStatsColor.value;
        let zeroScore = ""
        if (setGrey) {
            if (value === "icon") {
                backGroundColor = "grey 80%, black"
            } else {
                zeroScore = "0"
            }
        }
        if (backGroundColor.includes(",")) {
            backGroundColor = "linear-gradient(" + backGroundColor + ")";
        }
        ipcRenderer.send('change-color', {elementID: teamId, value: backGroundColor});
        ipcRenderer.send('update-scoreboard', {elementID: teamId, value: zeroScore})
        ipcRenderer.send('change-foreground-color', {elementID: teamId, value: "white"});
    } else {
        ipcRenderer.send('update-scoreboard', {elementID: teamId, value: score})
        let backGroundColor = inputStatsColor.value;
        let foreGroundColor = "white"
        if (value === "icon") {
            backGroundColor = "yellow 80%, grey";
            foreGroundColor = "black"
        }
        if (backGroundColor.includes(",")) {
            backGroundColor = "linear-gradient(" + backGroundColor + ")";
        }
        ipcRenderer.send('change-color',{ elementID: teamId, value:  backGroundColor });
        ipcRenderer.send('change-foreground-color',{ elementID: teamId, value: foreGroundColor });
    }
}
//
//
//
let updateTotalRuns = function(team) {
    let i;
    let totalruns = 0;
    let TeamArray;
    let TeamRuns;
    if (team === "Visitor") { TeamArray = VisitorScores; }
    else { TeamArray = HomeScores; }
    for (i = 0; i < currentInning; i += 1) {
        TeamRuns = TeamArray[i];
        totalruns = totalruns + TeamRuns;
    }
    let btnTotalRuns = team + "_Total_Score";
    // set total runs
    document.getElementById(btnTotalRuns).innerHTML = totalruns;

    // add space before single-digit runs
    // nope, OBS is ignoring the space, copying non-breaking space from Word did not work
    if (totalruns < 10) {
        totalruns = " " + totalruns.toString();
    }
    // write the file for OBS
    fs.writeFile(obsdir + "/" + team + "_Total_Score.txt", totalruns.toString(), dummyError);

    // Update the "Innnings" scoreboard if current inning exceeds the max visible innings (in case of "extra innings")
    // If exceeding, increment all innings to show newest inning
    let nowInning = Math.floor(now/4) + 1;
    if (currentInning > maxInningsScoreboard) {
        let j = 1;
        for (j; j <= 7; j++) {
            ipcRenderer.send('update-scoreboard', {elementID: "sb-inning" + j, value: currentInning - maxInningsScoreboard + j})
            changeInningsColor(team, currentInning - maxInningsScoreboard + j, j)
        }
    }
    // If undoing, regress to the last visible set of innings (AKA: make the "newest" inning the previous inning)
    else {
        let j = 1;
        for (j; j <= 7; j++) {
            ipcRenderer.send('update-scoreboard', {elementID: "sb-inning" + j, value: j})
            changeInningsColor(team, j, j)
        }
    }

    // For total runs
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-" + team + "-scoreR", value: totalruns.toString() });
};

// const { desktopCapturer, remote } = require('electron');
// const { Menu } = remote;

// adjust total hits up or down
//
//
//
let updateHits = function(team, amount) {
    if (team === "Visitor") {
        // console.log("HERE");
        VisitorHit = VisitorHit + amount;
        if (VisitorHit < 0) {VisitorHit = 0;}
        Visitor_Hits.innerHTML = VisitorHit.toString();
        // console.log("NEW VALUE:" + Visitor_Hits.innerHTML);

        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-Visitor-scoreH", value: VisitorHit.toString() });
    }
    else if (team === "Home") {
        // console.log("HERE");
        HomeHit = HomeHit + amount;
        if (HomeHit < 0) {HomeHit = 0;}
        Home_Hits.innerHTML = HomeHit.toString();
        // console.log("NEW VALUE:" + Home_Hits.innerHTML);

        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-Home-scoreH", value: HomeHit.toString() });
    }
};


// adjust total errors up or down
//
//
//
let updateErrors = function(team, amount) {
    if (team === "Visitor") {
        // console.log("HERE");
        VisitorError = VisitorError + amount;
        if (VisitorError < 0) {VisitorError = 0;}
        Visitor_Errors.innerHTML = VisitorError.toString();
        // console.log("NEW VALUE:" + Visitor_Errors.innerHTML);

        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-Visitor-scoreE", value: VisitorError.toString() });
    }

    else if (team === "Home") {
        // console.log("HERE2");
        HomeError = HomeError + amount;
        if (HomeError < 0) {HomeError = 0;}
        Home_Errors.innerHTML = HomeError.toString();
        // console.log("NEW VALUE:" + Home_Errors.innerHTML);

        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-Home-scoreE", value: HomeError.toString() });
    }
};

//
// adjust Score up or down
//
let adjustScore = function(item, amount) {
    // IF a true score, update the appropriate Array
    let current = 0;
    let ids;
    if ( item.id === "Visitor_Inning_Score" ) {
        current = VisitorScores;
        ids = "VisitorScores";
    }
    else if ( item.id === "Home_Inning_Score" ) {
        current = HomeScores;
        ids = "HomeScores";
    }

    // console.log("Current Value: " + current);
    current[currentInning - 1] = current[currentInning - 1] + amount;
    if (current[currentInning - 1] < 0) {current[currentInning - 1] = 0; }
    // console.log("NEW VALUE: " + current);

    // write the file for OBS
    let filename = obsdir + "/" + item.id + ".txt";
    filename = filename.replace("Inning", currentInning);
    adjustFile(item, filename, amount);
    // not ready for this yet adjustButton(item, amount);
};


let adjustStats = function(item, amount) {
    let current;
    let ids;
    if (item.id === "Visitor_Hits") {
        current = VisitorHit;

    }
    if (item.id === "Visitor_Errors") {
        current = VisitorError;
        ids = "VisitorError";
    }
    if (item.id === "Home_Hits") {
        current = HomeHit;
    }
    else if (item.id === "Home_Errors") {
        current = HomeError;
        ids = "HomeError";
    }

    // console.log(ids);
    // console.log("Current Value: " + current);
    current = current + amount;
    if (current < 0) {current = 0; }
    // console.log("NEW VALUE: " + current);


    // write the file for OBS
    let filename = obsdir + "/" + item.id + ".txt";
    adjustFile(item, filename, amount);
    // not ready for this yet adjustButton(item, amount);
};


let adjustFile = function(item, filename, amount) {
    // new 2021-05-05 read score
    fs.readFile(filename,
        // callback function
        function(err, data) {
            var oldCount;
            var newCount;
            if (err) {
                // console.log("ERROR");
                oldCount = 0;
            }
            else {
                oldCount = Number(data.toString());
            }
            newCount = oldCount + amount;
            if (newCount < 0) { newCount = 0; }
            item.innerText = newCount;
            fs.writeFileSync(filename, newCount.toString(), dummyError);
        }
    );

    if (item.id === "Visitor_Inning_Score") {
        updateTotalRuns("Visitor");
    }
    else if (item.id === "Home_Inning_Score") {
        updateTotalRuns("Home");
    }
    else if (item.id === "Visitor_Hits") {
        updateHits("Visitor", amount);
    }
    else if (item.id === "Home_Hits") {
        updateHits("Home", amount);
    }
    else if (item.id === "Visitor_Errors") {
        updateErrors("Visitor", amount);
    }
    else if (item.id === "Home_Errors") {
        updateErrors("Home", amount);
    }
};

//
// reset runs
//
let resetGame = function() {
    // reset score Arrays
    VisitorScores =
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    HomeScores =
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // zero out the files
    VisitorHit = 0;
    VisitorError = 0;
    HomeHit = 0;
    HomeError = 0;

    var i;
    for (i = 0; i <= 19; i += 1) {
        fs.writeFileSync(obsdir + "/Visitor_" + Number(i+1) + "_Score.txt", "0", function (err) {
            if (err) { console.log("error writing visitor file"); }
        });
        fs.writeFileSync(obsdir + "/Home_" + Number(i+1) + "_Score.txt", "0", function (err) {
            if (err) { console.log("error writing home file"); }
        });
    }

    // Reset the control panel hits, errors
    fs.writeFileSync(obsdir + "/Visitor_Hits.txt", "0", function (err) {
        if (err) { console.log("error writing visitor file"); }
    });
    fs.writeFileSync(obsdir + "/Visitor_Errors.txt", "0", function (err) {
        if (err) { console.log("error writing visitor file"); }
    });
    fs.writeFileSync(obsdir + "/Home_Hits.txt", "0", function (err) {
        if (err) { console.log("error writing home file"); }
    });
    fs.writeFileSync(obsdir + "/Home_Errors.txt", "0", function (err) {
        if (err) { console.log("error writing home file"); }
    });

    // update the visitor score for the current inning
    Visitor_Inning_Score.innerHTML = VisitorScores[currentInning - 1];
    

    // update the home score for the current inning
    Home_Inning_Score.innerHTML = HomeScores[currentInning - 1];
    
    // update totals ON GRAPHIC!
    updateTotalRuns("Visitor");
    updateTotalRuns("Home");

    updateHits("Visitor", 0);
    updateHits("Home", 0);

    updateErrors("Visitor", 0);
    updateErrors("Home", 0);
    
    // Reset outs, count for start of game
    resetOuts();
    resetCount();
    clearAllBases();

    // Reset innings to beginning (top of the 1st)
    now = 0;
    adjustProgress(0); 

    progressHeader(now, "0 OUT");
};

//
// adjustOuts
//
let timerOutThree;
let adjustOuts = function(amount) {
    if (isMidInning(now) || isEndInning(now)) {
        return;
    }
    var element;
    outs = outs + amount;
    if ((outs < 0) || (outs > 3)) {
        outs = outs - amount;
        return;
    }
    if (outs === 3) {
        adjustProgress(1);
        resetCount();
        resetOuts();
        // show message, timebar
        element = document.createElement("div");
        element.id = "OutThreeMessage"
        element.innerHTML = "3 OUTS = Auto Advance Game Progress<BR>& Reset Count, Outs, Baserunners";
        divStatusBar.appendChild(element);
        runthetimebar("OutThreeTimebar");
        // in 10 seconds: advance progress, reset outs to 0
        timerOutThree = setTimeout(function() { 
            adjustProgress(1);
            divStatusBar.removeChild(element);
            // new - remove timebar
            var divTimeBar = document.getElementById("appendTimeBar");
            if (divTimeBar.childNodes[0]) {
                divTimeBar.removeChild(divTimeBar.childNodes[0]);
            }        
        },
        automationTimeout * 1000);
    }
    else {
        // remove OutThreeMessage and timebar if they were activated
        clearTimeout(timerOutThree);
        element = document.getElementById("OutThreeMessage");
        if (element) {
            element.remove();
        }
        // need to remove timebar
        element = document.getElementById("OutThreeTimebar");
        if (element) {
            element.remove();
        }
    }
    let strOuts = outs + " OUT";
    btnOuts.innerHTML = outs;
    fs.writeFile(obsdir + "/Outs.txt", strOuts, dummyError);

    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-outs", value: strOuts });
    let outValue = "<img src='out-" + outs + ".png' height=50 width=94>"
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-out-icon", value: outValue });
    progressHeader(now, strOuts);
};

// Function for updating scoreboard top icon and text - FOR SCOREBOARDS ONLY
let progressProgress = function(right_now) {
    let inningSuffix = "top";
    if (isMidInning(right_now)) {
        inningSuffix = "mid"
    } else if (isEndInning(right_now)) {
        inningSuffix = "end"
    } else if (isBotInning(right_now)) {
        inningSuffix = "bot"
    }
    let nowInning = Math.floor(now/4) + 1;
    let inningIconValue = "<img src='inning_" + inningSuffix + ".png' height=90 width=30>"
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-progress-text", value: nowInning.toString() });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-progress-icon", value: inningIconValue });
}

// Function for updating scoreboard header - FOR INNINGS, SCORESHORT BOARDS ONLY
let progressHeader = function(right_now, outs) {
    if (!isMidInning(right_now) && !isEndInning(right_now)) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-heading", value: nowText[right_now] });
    }
    else {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-heading", value: nowText[right_now] });
    }
    progressProgress(right_now)
}

//
// resetOuts, setZeroOuts
//
let resetOuts = function() {
    outs = 0;
    outsText = "";
    btnOuts.innerHTML = "0";
    fs.writeFile(obsdir + "/Outs.txt", outsText, dummyError);
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-outs", value: outsText });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-out-icon", value: "<img src='out-0.png' height=50 width=94>" });
};
let setZeroOuts = function() {
    outs = 0;
    outsText = "0 OUT";
    btnOuts.innerHTML = "0";
    fs.writeFile(obsdir + "/Outs.txt", outsText, dummyError);
    ipcRenderer.send('update-scoreboard', 
       { elementID: "sb-outs", value: outsText });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-out-icon", value: "<img src='out-0.png' height=50 width=94>" });
}

//
// resetCount
//
let resetCount = function() {
    countText = "";
    balls = 0;
    strikes = 0;
    btnBalls.innerHTML = "0";
    btnStrikes.innerHTML = "0";
    fs.writeFile(obsdir + "/Count.txt", countText, dummyError);
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-count", value: countText });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-ball-icon", value: "<img src='ball-0.png' height=50 width=120>" });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-strike-icon", value: "<img src='strike-0.png' height=50 width=94>" });
};

//
// adjustCount
// g: balls, strikes, countText
//
let timerBallFour;
let timerStrikeThree;
let adjustCount = function(ballDelta, strikeDelta) {
    // don't adjust anything while in between innings
    if (isMidInning(now) || isEndInning(now)) {
        // flash items red;
        btnBalls.style.backgroundColor = "red";
        btnStrikes.style.backgroundColor = "red";
        btnOuts.style.backgroundColor = "red";
        // return to white after 2 seconds
        setTimeout( function() {
            btnBalls.style.backgroundColor = "white";
            btnStrikes.style.backgroundColor = "white";
            btnOuts.style.backgroundColor = "white";
            }, 2000);
        return;
    }
    let elementBallFourMessage;
    let elementStrikeThreeMessage;
    let elementTimer;
    balls = balls + ballDelta;
    strikes = strikes + strikeDelta;
    if ((balls < 0) || (balls > 4)) {
        balls = balls - ballDelta;
        return;
    }
    if ((strikes < 0) || (strikes > 3)) {
        strikes = strikes - strikeDelta;
        return;
    }
    countText = balls + " - " + strikes;
    btnBalls.innerHTML = balls;
    btnStrikes.innerHTML = strikes;
    fs.writeFile(obsdir + "/Count.txt", countText, dummyError);
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-count", value: countText });
    let ballIconValue = "<img src='ball-" + balls + ".png' height=50 width=120>"
    let strikeIconValue = "<img src='strike-" + strikes + ".png' height=50 width=94>"
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-ball-icon", value: ballIconValue });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-count-strike-icon", value: strikeIconValue });

    if (balls === 4) {
        // reset the Count
        resetCount();
        // create Ball Four Automation Message
        elementBallFourMessage = document.createElement("div");
        elementBallFourMessage.id = "BallFourMessage"
        elementBallFourMessage.innerHTML = "Ball 4 = Runner placed on First,<BR>" +
            "Count resets in " + automationTimeout + " seconds";
        divStatusBar.appendChild(elementBallFourMessage);
        // remove element in 10 seconds
        timerBallFour = setTimeout(function() {
                // remove Ball Four Automation Message
                divStatusBar.removeChild(elementBallFourMessage);
                let divTimeBar = document.getElementById("appendTimeBar");
                if (divTimeBar.childNodes[0]) {
                    divTimeBar.removeChild(divTimeBar.childNodes[0]);
                }            
            },
            automationTimeout * 1000);
        runthetimebar("BallFourTimeBar");
        // advance baserunners & increase score if needed
        if (firstBase && secondBase && thirdBase) {
            // if bases loaded, just increase the score
            if (isTopInning) { 
                // increase Visitor Score
                adjustScore(Visitor_Inning_Score, 1);
            } else {
                // increase Home Score
                adjustScore(Home_Inning_Score, 1);
            }
        } else if ((firstBase && secondBase) || (firstBase && thirdBase) || (secondBase & thirdBase)) {
            // if 2 men on, make bases loaded
            setBase("First");
            setBase("Second");
            setBase("Third");
        } else if (firstBase) {
            // if runner on first, add runner on second
            setBase("Second");
        } else {
            // if runner on second or third, or no runners, just add runner on first
            setBase("First");
        }
    }
    else {
        // clear any message and potential Count reset if we went from 4 to 3 balls
        clearTimeout(timerBallFour);
        elementBallFourMessage = document.getElementById("BallFourMessage");
        if (elementBallFourMessage) {
            elementBallFourMessage.remove();
        }
        // need to remove timebar
        elementTimer = document.getElementById("BallFourTimeBar");
        if (elementTimer) {
            elementTimer.remove();
        }
    }
    if (strikes === 3) {
        // reset the Count
        resetCount();
        // increase outs, reset the Count
        elementStrikeThreeMessage = document.createElement("div");
        elementStrikeThreeMessage.id = "StrikeThreeMessage";
        elementStrikeThreeMessage.innerHTML = "Strike 3 = OUTS Automatically increased;<BR>"
            + "Count resets in " + automationTimeout + " seconds";
        divStatusBar.appendChild(elementStrikeThreeMessage);
        // remove element in 10 seconds
        timerStrikeThree = setTimeout(function() {
                divStatusBar.removeChild(elementStrikeThreeMessage); 
                let divTimeBar = document.getElementById("appendTimeBar");
                if (divTimeBar.childNodes[0]) {
                    divTimeBar.removeChild(divTimeBar.childNodes[0]);
                }    
            }, 
            automationTimeout * 1000);
        adjustOuts(1);
        runthetimebar("StrikeThreeTimebar");
    }
    else {
        // clear any message, potential Count reset, potential NOW advancement
        // if we went from 3 to 2 strikes
        clearTimeout(timerStrikeThree);
        elementStrikeThreeMessage = document.getElementById("StrikeThreeMessage");
        if (elementStrikeThreeMessage) {
            elementStrikeThreeMessage.remove();
            adjustOuts(-1);
        }
        elementTimer = document.getElementById("StrikeThreeTimebar");
        if (elementTimer) {
            elementTimer.remove();
        }
    }
};

//
// adjust team name
//
let adjustTeamName = function(team) {
    let filename = obsdir + "/" + team + "_Name.txt";
    let item = "input" + team + "Name";
    let newTeamName = document.getElementById(item).value;
    fs.writeFile(filename, newTeamName, dummyError);
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-" + team + "-name", value: newTeamName });
};
//
// adjust tournament name
//
let adjustTournamentName = function() {
    let filename = obsdir + "/" + "Tournament_Name.txt";
    let newTournamentName = document.getElementById("inputTournamentName").value;
    fs.writeFile(filename, newTournamentName, dummyError);
    ipcRenderer.send('update-scoreboard',
        { elementID: "wsb-tournament-container-span", value: newTournamentName });
};

//
//
//
let runthetimebar = function (id) {
    let placeholder = document.getElementById("appendTimeBar");
    if (placeholder.childNodes[0]) {
        placeholder.removeChild(placeholder.childNodes[0]);
    }
    let element = document.createElement("DIV");
    // element.innerHTML = "Here is some text";
    element.id = id;
    placeholder.appendChild(element);
};

//
// set a base
//
let setBase = function(base) {
    switch(base) {
        case "First":
            firstBase = true;
            fs.writeFile(obsdir + "/First_Base.txt", "", dummyError);
            btnFirstBase.classList.replace("base-off", "base-on");
            break;
        case "Second":
            secondBase = true;
            fs.writeFile(obsdir + "/Second_Base.txt", "", dummyError);
            btnSecondBase.classList.replace("base-off", "base-on");
            break;
        case "Third":
            thirdBase = true;
            fs.writeFile(obsdir + "/Third_Base.txt", "", dummyError);
            btnThirdBase.classList.replace("base-off", "base-on");
            break;
    }
    // update the new scoreboard
    // generate proper base png
    if (firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-0-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-1-bases.png' height=86 width=116>" });
    }
    if (firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-0-bases.png' height=86 width=116>" });
    }
}

//
// clear a base
//
let clearBase = function(base) {
    switch(base) {
        case "First":
            firstBase = false;
            fs.writeFile(obsdir + "/First_Base.txt", " ", dummyError);
            btnFirstBase.classList.replace("base-on", "base-off");
            break;
        case "Second":
            secondBase = false;
            fs.writeFile(obsdir + "/Second_Base.txt", " ", dummyError);
            btnSecondBase.classList.replace("base-on", "base-off");
            break;
        case "Third":
            thirdBase = false;
            fs.writeFile(obsdir + "/Third_Base.txt", " ", dummyError);
            btnThirdBase.classList.replace("base-on", "base-off");
            break;
    }
    // update the new scoreboard
    // generate proper base png
    if (firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-0-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-1-bases.png' height=86 width=116>" });
    }
    if (firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-0-bases.png' height=86 width=116>" });
    }
}

//
// clear all bases
//
let clearAllBases = function() {
    clearBase("First");
    clearBase("Second");
    clearBase("Third");
    ipcRenderer.send('update-scoreboard', 
        { elementID: "sb-bases", value: "<img src='0-0-0-bases.png' height=86 width=116>" });
}

// 
// toggleBase
//
let toggleBase = function(base) {
    switch(base) {
        case "First":
            firstBase = !firstBase;
            if (firstBase) {
                fs.writeFile(obsdir + "/First_Base.txt", "", dummyError);
                btnFirstBase.classList.replace("base-off", "base-on");
            }
            else {
                fs.writeFile(obsdir + "/First_Base.txt", "", dummyError);
                btnFirstBase.classList.replace("base-on", "base-off");
            }
            break;
        case "Second":
            secondBase = !secondBase;
            if (secondBase) {
                fs.writeFile(obsdir + "/Second_Base.txt", "", dummyError);
                btnSecondBase.classList.replace("base-off", "base-on");
            }
            else {
                fs.writeFile(obsdir + "/Second_Base.txt", "", dummyError);
                btnSecondBase.classList.replace("base-on", "base-off");
            }
            break;
        case "Third":
            thirdBase = !thirdBase;
            if (thirdBase) {
                fs.writeFile(obsdir + "/Third_Base.txt", "", dummyError);
                btnThirdBase.classList.replace("base-off", "base-on");
            }
            else {
                fs.writeFile(obsdir + "/Third_Base.txt", "", dummyError);
                btnThirdBase.classList.replace("base-on", "base-off");
            }
            break;
    }
    // generate proper base png
    if (firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-0-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-2-1-bases.png' height=86 width=116>" });
    }
    if (firstBase && !secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-0-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-0-bases.png' height=86 width=116>" });
    }
    if (firstBase && secondBase && thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='3-2-1-bases.png' height=86 width=116>" });
    }
    if (!firstBase && !secondBase && !thirdBase) {
        ipcRenderer.send('update-scoreboard', 
            { elementID: "sb-bases", value: "<img src='0-0-0-bases.png' height=86 width=116>" });
    }
}

// changing colors
let adjustColor = function(team, color, read) {
    var filename = obsdir + "/" + team + "_Color.txt";
    // var item = "input" + team + "Color";
    // var newColor_Old = document.getElementById(item).value;
    var oldColor = color;

    
    // console.log(color + " || Type: " + typeof(color));
    
    if (color.includes(",")) {
        // console.log("TRUE");
        color = "linear-gradient(" + color + ")";
        // console.log(color + " || Type: " + typeof(color));
    }


    if (read === false) {
        fs.writeFile(filename, oldColor, dummyError);
    } 
    
    fs.readFile(filename, function(err, data) {
        if (err) {
            return;
        }
        else {
            // console.log(filename + ": " + data.toString());
        }
    })
    if (team === "Home" || team === "Visitor") {
        ipcRenderer.send('change-color', 
        { elementID: "sb-" + team + "-name", value: color });
        ipcRenderer.send('change-color', 
            { elementID: "sb-" + team + "-scoreR", value: color });
        ipcRenderer.send('change-color', 
            { elementID: "sb-" + team + "-scoreH", value: color });
        ipcRenderer.send('change-color', 
            { elementID: "sb-" + team + "-scoreE", value: color });
    }
    

    else {
        ipcRenderer.send('change-color', 
            { elementID: "sb-Stats-name", value: color });
        ipcRenderer.send('change-color',
            { elementID: "sb-Stats-name-classic", value: color });
        ipcRenderer.send('change-color',
            { elementID: "sb-heading", value: color });
            ipcRenderer.send('change-color', 
            { elementID: "sb-scoreR", value: color });
        ipcRenderer.send('change-color', 
            { elementID: "sb-scoreH", value: color });
        ipcRenderer.send('change-color', 
            { elementID: "sb-scoreE", value: color });

    var i;
        for (i = 1; i <= maxInningsScoreboard; i++) {
            ipcRenderer.send('change-color', 
                { elementID: "sb-inning" + i, value: color });
            ipcRenderer.send('change-color', 
                { elementID: "sb-Visitor-score" + i, value: color });
            ipcRenderer.send('change-color', 
                { elementID: "sb-Home-score" + i, value: color });
        }
    }

    if (color != oldColor) {
        color = oldColor;
    }
};
    
//
//
//
let setFinal = function(progress, inningsToFinal) {
    let finalInn = Math.floor(progress/4) + 1;
    let finalStr = "F/" + finalInn
    // if (finalInn === inningsToFinal) {
    //     finalStr = "F"
    // }
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-progress", value: finalStr });
    ipcRenderer.send('update-scoreboard',
        { elementID: "sb-heading", value: finalStr });
    resetCount();
    clearAllBases();
    resetOuts();
};

function templateChange() {
    let objS = document.getElementById("selectTemplates");
    let value = objS.options[objS.selectedIndex].value;
    fs.writeFileSync(obsdir + "/Templates.txt", value);
    if (value === "classic") {
        ipcRenderer.send('change-innings-window-size',
            { width: 1090, height: 260 });
        ipcRenderer.send('change-score-board-window-size',
            { width: 650, height: 155 });
        ipcRenderer.send('change-display',
            { elementID: "wsb-tournament-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "csb-main-container", value: "inline-grid" });
        ipcRenderer.send('change-display',
            { elementID: "sb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "inning-main-container", value: "inline-grid" });
    } else if  (value === "icon") {
        ipcRenderer.send('change-innings-window-size',
            { width: 1090, height: 260 });
        ipcRenderer.send('change-display',
            { elementID: "wsb-tournament-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "csb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "sb-main-container", value: "inline-grid" });
        ipcRenderer.send('change-display',
            { elementID: "inning-main-container", value: "inline-grid" });
        ipcRenderer.send('change-score-board-window-size',
            { width: 600, height: 102 });
    } else if  (value === "wbsc_blue") {
        ipcRenderer.send('change-score-board-window-size',
            { width: 405, height: 185 });
        ipcRenderer.send('change-innings-window-size',
            { width: 1020, height: 175 });
        ipcRenderer.send('change-display',
            { elementID: "wsb-tournament-container", value: "inline-grid" });
        ipcRenderer.send('change-display',
            { elementID: "sb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "csb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "inning-main-container", value: "none" });

        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-tournament-container-span", value: "#e5ad1a" });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-Visitor-scoreR", value: "black" });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-Home-scoreR", value: "black" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Visitor-scoreR", value: "linear-gradient(#ffe52e, #e5ad1a)" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Home-scoreR", value: "linear-gradient(#ffe52e, #e5ad1a)" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Stats-name", value: "linear-gradient(#3f57ad, #1b2b69)" });
        ["wsb-outs","wsb-count", "wsb-progress-text", "wsb-progress-icon"].forEach((v, index) => {
            ipcRenderer.send('change-foreground-color',
                { elementID: v, value: "white" });
        });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-progress-text", value: "white" });

        ipcRenderer.send('change-color',
            { elementID: "wsb-innings-container", value: "linear-gradient(#face23,#e79126 ,transparent 50%)" });

        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-innings-container", value: "black" });
        ["wsb-Visitor-name","wsb-Home-name"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "#3C5694" });
        });
        ["wsb-Visitor-score-container","wsb-Home-score-container"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "linear-gradient(#5067A7, #283865)" });
        });
        ["wsb-Visitor-rhe-container","wsb-Home-rhe-container"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "linear-gradient(#face23,#e79126)" });
        });
        let i;
        for (i = 1; i <= maxInningsScoreboard; i++) {
            ipcRenderer.send('change-color',
                { elementID: "sb-Visitor-score" + i, value: "#3C5694" });
            ipcRenderer.send('change-color',
                { elementID: "sb-Home-score" + i, value: "#3C5694" });
            ipcRenderer.send('change-foreground-color',
                { elementID: "sb-Visitor-score" + i, value: "white" });
            ipcRenderer.send('change-foreground-color',
                { elementID: "sb-Home-score" + i, value: "white" });
        }
        ["wsb-Visitor-scoreRR","wsb-Visitor-scoreH", "wsb-Visitor-scoreE", "wsb-Home-scoreRR","wsb-Home-scoreH", "wsb-Home-scoreE"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "#F3D922" });
            ipcRenderer.send('change-foreground-color',
                { elementID: v, value: "black" });
        });

    } else if  (value === "wbsc_silver") {
        ipcRenderer.send('change-score-board-window-size',
            { width: 405, height: 185 });
        ipcRenderer.send('change-innings-window-size',
            { width: 1020, height: 175 });
        ipcRenderer.send('change-display',
            { elementID: "wsb-tournament-container", value: "inline-grid" });
        ipcRenderer.send('change-display',
            { elementID: "sb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "csb-main-container", value: "none" });
        ipcRenderer.send('change-display',
            { elementID: "inning-main-container", value: "none" });


        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-tournament-container-span", value: "white" });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-Visitor-scoreR", value: "white" });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-Home-scoreR", value: "white" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Visitor-scoreR", value: "linear-gradient(#d32f6e, #8c0c3d)" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Home-scoreR", value: "linear-gradient(#d32f6e, #8c0c3d)" });
        ipcRenderer.send('change-color',
            { elementID: "wsb-Stats-name", value: "#c8c7cc" });

        ["wsb-outs","wsb-count", "wsb-progress-text", "wsb-progress-icon"].forEach((v, index) => {
            ipcRenderer.send('change-foreground-color',
                { elementID: v, value: "black" });
        });
        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-progress-text", value: "#314b6f" });

        ipcRenderer.send('change-color',
            { elementID: "wsb-innings-container", value: "#c8c7cc" });

        ipcRenderer.send('change-foreground-color',
            { elementID: "wsb-innings-container", value: "#314b6f" });
        ["wsb-Visitor-name","wsb-Home-name"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "#9795A9" });
        });
        ["wsb-Visitor-score-container","wsb-Home-score-container"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "linear-gradient(#CBCED8, #5A677D)" });
        });
        ["wsb-Visitor-rhe-container","wsb-Home-rhe-container"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "linear-gradient(#d32f6e, #8c0c3d)" });
        });
        let i;
        for (i = 1; i <= maxInningsScoreboard; i++) {
            ipcRenderer.send('change-color',
                { elementID: "sb-Visitor-score" + i, value: "#B1B5BE" });
            ipcRenderer.send('change-color',
                { elementID: "sb-Home-score" + i, value: "#B1B5BE" });
            ipcRenderer.send('change-foreground-color',
                { elementID: "sb-Visitor-score" + i, value: "#314b6f" });
            ipcRenderer.send('change-foreground-color',
                { elementID: "sb-Home-score" + i, value: "#314b6f" });
        }
        ["wsb-Visitor-scoreRR","wsb-Visitor-scoreH", "wsb-Visitor-scoreE", "wsb-Home-scoreRR","wsb-Home-scoreH", "wsb-Home-scoreE"].forEach((v, index) => {
            ipcRenderer.send('change-color',
                { elementID: v, value: "#AF1C58" });
            ipcRenderer.send('change-foreground-color',
                { elementID: v, value: "white" });
        });
    }
    updateTotalRuns("Visitor");
    updateTotalRuns("Home");
}
// const actionsList = [];
// const lastAction = document.querySelector('input')
// if (document.onclick) {
//     lastAction = onclick;
// }
// else if (document.event.key) {
//     lastAction = key;
// }

// function undoLast(lastAction) {

// }

//
// onclicks for all buttons
//
btnInningAdd1.onclick = function() { adjustInning(btnInning, 1); };
btnInningSub1.onclick = function() { adjustInning(btnInning, -1); };
btnNowAdd1.onclick = function() { adjustProgress(1); };
btnNowSub1.onclick = function() { adjustProgress(-1); };
btnVisitorAdd1.onclick = function() { adjustScore(Visitor_Inning_Score, 1); };
btnVisitorSub1.onclick = function() { adjustScore(Visitor_Inning_Score, -1); };
btnHomeAdd1.onclick = function() { adjustScore(Home_Inning_Score, 1); };
btnHomeSub1.onclick = function() { adjustScore(Home_Inning_Score, -1); };
btnVisitorHitsAdd1.onclick = function() { adjustStats(Visitor_Hits, 1); };
btnVisitorHitsSub1.onclick = function() { adjustStats(Visitor_Hits, -1); };
btnHomeHitsAdd1.onclick = function() { adjustStats(Home_Hits, 1); };
btnHomeHitsSub1.onclick = function() { adjustStats(Home_Hits, -1); };
btnVisitorErrorsAdd1.onclick = function() { adjustStats(Visitor_Errors, 1); };
btnVisitorErrorsSub1.onclick = function() { adjustStats(Visitor_Errors, -1); };
btnHomeErrorsAdd1.onclick = function() { adjustStats(Home_Errors, 1); };
btnHomeErrorsSub1.onclick = function() { adjustStats(Home_Errors, -1); };
btnResetGame.onclick = function() { resetGame(); };
btnOutAdd.onclick = function() { adjustOuts(1); };
btnOutSub.onclick = function() { adjustOuts(-1); };
btnBallAdd.onclick = function() { adjustCount(1, 0); };
btnBallSub.onclick = function() { adjustCount(-1, 0); };
btnStrikeAdd.onclick = function() { adjustCount(0, 1); };
btnStrikeSub.onclick = function() { adjustCount(0, -1); };
btnFirstBase.onclick = function() { toggleBase("First"); };
btnSecondBase.onclick = function() { toggleBase("Second"); };
btnThirdBase.onclick = function() { toggleBase("Third"); };
inputVisitorName.onchange = function() { adjustTeamName("Visitor"); };
inputHomeName.onchange = function() { adjustTeamName("Home"); };
inputTournamentName.onchange = function() { adjustTournamentName("Home"); };
inputVisitorColor.onchange = function() { adjustColor("Visitor", document.getElementById("inputVisitorColor").value, false); };
inputHomeColor.onchange = function() { adjustColor("Home", document.getElementById("inputHomeColor").value, false); };
inputStatsColor.onchange = function() { adjustColor("Stats", document.getElementById("inputStatsColor").value, false); };
btnResetCount.onclick = function() { resetCount(); };
btnClearAllBases.onclick = function() { clearAllBases(); };
btnFinal.onclick = function() { setFinal(now, inningsToFinal); };

selectTemplates.onchange = function () {templateChange();}

// keyboard shortcuts
document.addEventListener('keyup', function (event) {
    if (event.key === ']') { 
        adjustProgress(1);
        return;
    }
    if (event.key === '[') { 
        adjustProgress(-1);
        return;
    }
    if (isMidInning(now) || isEndInning(now)) {
        // ignore if middle or end of inning
        return;
    }
    if (event.target.tagName === "INPUT") {
        // ignore the keypress! we are probably editing an INPUT
        return;
    }
    if (event.key === 'b') { adjustCount(1, 0); }
    if (event.key === 's') { adjustCount(0, 1); }
    if (event.key === 'o') { adjustOuts(1); }
    if (event.key === 'c') { resetCount(); }
    if (event.key === 'r') {
        // if top, add visitor run
        if (isTopInning(now)) { adjustScore(Visitor_Inning_Score, 1); }
        // if bottom, add home run
        if (isBotInning(now)) { adjustScore(Home_Inning_Score, 1); }
    }
    if (event.key === 't') {
        // if top, add visitor run
        if (isTopInning(now)) { adjustScore(Visitor_Inning_Score, -1); }
        // if bottom, add home run
        if (isBotInning(now)) { adjustScore(Home_Inning_Score, -1); }
    }
    if (event.key === 'h') {
        // if top, add visitor hit
        if (isTopInning(now)) { adjustScore(Visitor_Hits, 1); }
        // if bottom, add home hit
        if (isBotInning(now)) { adjustScore(Home_Hits, 1); }
    }
    if (event.key === 'j') {
        // if top, add visitor hit
        if (isTopInning(now)) { adjustScore(Visitor_Hits, -1); }
        // if bottom, add home hit
        if (isBotInning(now)) { adjustScore(Home_Hits, -1); }
    }
    if (event.key === 'e') {
        // if top, add visitor error
        if (isTopInning(now)) { adjustScore(Home_Errors, 1); }
        // if bottom, add home error
        if (isBotInning(now)) { adjustScore(Visitor_Errors, 1); }
    }
    if (event.key === 'w') {
        // if top, add visitor error
        if (isTopInning(now)) { adjustScore(Home_Errors, -1); }
        // if bottom, add home error
        if (isBotInning(now)) { adjustScore(Visitor_Errors, -1); }
    }

    if (event.key === '1') { toggleBase("First"); }
    if (event.key === '2') { toggleBase("Second"); }
    if (event.key === '3') { toggleBase("Third"); }
})
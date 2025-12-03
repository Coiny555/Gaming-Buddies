const {app, BrowserWindow} = require("electron");

let win = null;

const YourBioWindow = () => { //Opens a GUI for User(you) bio.
    win = new BrowserWindow({
        width: 800, //In pixels
        height: 600,
        resizable: false, //Debating on if wanting to use true.
        webPreferences: {
            nodeIntegration: true //Have node functions and node API's
        }
    })

    win.loadFile('YourBio.html'); //Load html file, put that in the quotation marks!
};

const YourFriendWindow = () => { //Opens a GUI for User(you) bio.
    win = new BrowserWindow({
        width: 800, //In pixels
        height: 600,
        resizable: false, //Debating on if wanting to use true.
        webPreferences: {
            nodeIntegration: true //Have node functions and node API's
        }
    })

    win.loadFile('FriendBio.html'); //Load html file, put that in the quotation marks!
};


app.whenReady().then(YourBioWindow);
app.whenReady().then(YourFriendWindow);



// For users to edit their own bios.
function EditBio(){

}


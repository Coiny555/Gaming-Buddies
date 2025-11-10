const {app, BrowserWindow} = require("electron");

let win = null;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800, //In pixels
        height: 600,
        resizable: false, //Will change to true soon.
        webPreferences: {
            nodeIntegration: true //Have node functions and node API's
        }
    })

    win.loadFile('YourBio.html'); //Load html file, put that in the quotation marks!
};

app.whenReady().then(createWindow);


// For users to edit their own bios.
function EditBio(){

}


const ipc = require('electron').ipcRenderer;

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

function handleKeyPress (event) {
    // You can put code here to handle the keypress.
    console.log(`You pressed ${event.key}`)
  }
  
  window.addEventListener('keyup', handleKeyPress, true)

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        ipc.send('minimize');
    });

    document.getElementById('max-button').addEventListener("click", event => {
        ipc.send('maximize');
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        ipc.send('resize');
    });

    document.getElementById('close-button').addEventListener("click", event => {
        console.log('close button clicked');
        ipc.send('close');
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    //toggleMaxRestoreButtons();
    ipc.on('isMaximized', ()=> { toggleMaxRestoreButtons(true) });
    ipc.on('isRestored', ()=> { toggleMaxRestoreButtons(false) });

    function toggleMaxRestoreButtons(isMaximized) {
        if (isMaximized) {
            document.body.classList.add('maximized');
            console.log('maximized');
        } else {
            document.body.classList.remove('maximized');
            console.log('restored');
        }
    }

}

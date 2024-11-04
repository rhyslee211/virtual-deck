const { app, BrowserWindow , globalShortcut } = require('electron/main')
const path = require('node:path')
const ipc = require('electron').ipcMain
const { fork } = require('child_process')
const fs = require('fs')

let server;
let win;

function createWindow () {

  server = fork(path.join(__dirname, '../src/server.js'))

  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, '../src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false
  })

  //startURL = 'http://localhost:3000';

  win.loadFile(path.join(__dirname, "../build/index.html"));

  ipc.on('close', () => {
    win.close()
  })


  ipc.on('minimize', () => {
    win.minimize()
  })

  ipc.on('maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipc.on('resize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  win.on('maximize', () => {
    win.webContents.send('isMaximized')
  })

  win.on('unmaximize', () => {
    win.webContents.send('isRestored')
  })
}

ipc.on('request-server-info', (event) => {
  event.server.send('server-info', server)
})


app.whenReady().then(() => {
  createWindow()

  const userDataPath = app.getPath('userData');

  console.log(userDataPath);

  ipc.handle('register-shortcuts', async (event, macros) => {

    globalShortcut.unregisterAll();

    macros.forEach(macro => {
      globalShortcut.register(macro.keys, () => {
        win.webContents.send('shortcut-pressed', macro.command);
      });
    });
  });

  ipc.handle('save-macros', async (event,macros) => {
    // Save macros

    const filePath = path.join(userDataPath, 'macros.json');
    const jsonData = JSON.stringify(macros);

    try {
      fs.writeFileSync(filePath, jsonData);
      return 'Data successfully saved!';
    } catch (error) {
      console.error('Error writing file:', error);
      console.error(filePath);
      console.log(jsonData);
      throw error;
    }

  });

  ipc.handle('load-macros', async () => {
    const filePath = path.join(userDataPath, 'macros.json');

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      console.error(filePath)
      throw error;
    }
  });

  ipc.handle('save-settings', async (event, settings) => {
    const filePath = path.join(userDataPath, 'settings.json');
    const jsonData = JSON.stringify(settings);

    try {
      fs.writeFileSync(filePath, jsonData);
      return 'Settings successfully saved!';
    } catch (error) {
      console.error('Error writing file:', error);
      console.error(filePath);
      console.log(jsonData);
      throw error;
    }
  });

  ipc.handle('load-settings', async () => {
    const filePath = path.join(userDataPath, 'settings.json');

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      console.error(filePath)
      throw error;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    server.kill();
    globalShortcut.unregisterAll();
  }
})
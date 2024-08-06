const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const ipc = require('electron').ipcMain
const { fork } = require('child_process')

let server;

function createWindow () {

  server = fork(path.join(__dirname, '/src/server.js'))

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, '/src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false
  })

  win.loadFile('./src/index.html')

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
  }
})
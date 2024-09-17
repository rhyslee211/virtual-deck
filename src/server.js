// server.js
const express = require('express');
const {default: OBSWebSocket} = require('obs-websocket-js');
const os = require('os');
//const OBSWebSocket = require('obs-websocket-js').default;
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;
//const server = getLocalIpAddress();
//const server = "localhost";
const server = "0.0.0.0"

const obs = new OBSWebSocket();
//let OBS_WEBSOCKET_ADDRESS = 'ws://localhost:4455';
//let OBS_WEBSOCKET_PASSWORD = 'your_password';
let OBS_WEBSOCKET_ADDRESS = '';
let OBS_WEBSOCKET_PASSWORD = '';

app.use(express.static(path.join(__dirname, 'public')));

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no external IP is found
}

module.exports = { getLocalIpAddress };

app.get('/mute-mic', async (req, res) => {
  try {
    //const { inputName, inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Mic/Aux' });

    const inputName = req.query.inputName;

    console.log(inputName)

    await obs.call('SetInputMute', {inputName: inputName, inputMuted: true});
    console.log('Mic muted');
    res.status(200).send('Mic muted');
  } catch (error) {
    res.status(500).send('Failed to mute microphone');
    console.log(error);
    //const sources = await obs.call('GetSourceList');
    //console.log(sources.sources.filter(source => source.typeId === 'input' && source.type === 'wasapi_input_capture'));
  }
});

app.get('/unmute-mic', async (req, res) => {
  try {
    //const { inputName, inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Mic/Aux' });

    const inputName = req.query.inputName;

    console.log(inputName)

    await obs.call('SetInputMute', {inputName: inputName, inputMuted: false});
    console.log('Mic unmuted');
    res.status(200).send('Mic unmuted');
  } catch (error) {
    res.status(500).send('Failed to unmute microphone');
    console.log(error);
    //const sources = await obs.call('GetSourceList');
    //console.log(sources.sources.filter(source => source.typeId === 'input' && source.type === 'wasapi_input_capture'));
  }
});

app.get('/toggle-mic', async (req, res) => {
  try {
    const inputName = req.query.inputName;
    const { inputName: name, inputMuted: muted } = await obs.call('ToggleInputMute', { inputName: inputName });
    console.log('Mic toggled', name, muted);
    res.status(200).send('Mic toggled');
  } catch (error) {
    res.status(500).send('Failed to toggle microphone');
    console.log(error);
  }
});

app.get('/start-stream', async (req, res) => {
  try {
    await obs.call('StartStream');
    res.status(200).send('Stream started');
  } catch (error) {
    res.status(500).send('Failed to start stream');
  }
});

app.get('/stop-stream', async (req, res) => {
  try {
    await obs.call('StopStream');
    res.status(200).send('Stream stopped');
  } catch (error) {
    res.status(500).send('Failed to stop stream');
  }
});

app.get('/start-recording', async (req, res) => {
  try {
    await obs.call('StartRecord');
    res.status(200).send('recording started');
  } catch (error) {
    res.status(500).send('Failed to start recording');
  }
});

app.get('/stop-recording', async (req, res) => {
  try {
    await obs.call('StopRecord');
    res.status(200).send('Recording stopped');
  } catch (error) {
    res.status(500).send('Failed to stop recording');
  }
});

app.get('/switch-scene', async (req, res) => {
  try {
    const sceneName = req.query.sceneName;
    await obs.call('SetCurrentProgramScene', { 'sceneName': sceneName });
    res.status(200).send('Scene switched');
  } catch (error) {
    res.status(500).send('Failed to switch scene');
    console.log(error);
  }
});

app.get('/set-videocapture-on', async (req, res) => {
  try {
    let sceneName = "";
    let sceneItemId = 0;
    let cameraName = req.query.cameraName;
    
    await obs.call('GetCurrentProgramScene').then((data) => {
      //console.log(data);
      sceneName = data.sceneName;
    });

    //console.log(sceneName);

    sceneItemId = (await obs.call('GetSceneItemId', { 'sceneName': sceneName, 'sourceName': cameraName })).sceneItemId;

    console.log(sceneName, sceneItemId);

    await obs.call('SetSceneItemEnabled', {
      'sceneName': sceneName, // Replace with the scene that contains the camera
      'sceneItemId': sceneItemId,  // Replace with the camera source name
      'sceneItemEnabled': true  // Set to false to hide the camera
    });

    res.status(200).send('Video capture on');
  }
  catch (error) {
    res.status(500).send('Failed to set video capture on');
    console.log(error);
  }

});

app.get('/set-videocapture-off', async (req, res) => {
  try {
    let sceneName = "";
    let sceneItemId = 0;
    let cameraName = req.query.cameraName;
    
    await obs.call('GetCurrentProgramScene').then((data) => {
      //console.log(data);
      sceneName = data.sceneName;
    });

    //console.log(sceneName);

    sceneItemId = (await obs.call('GetSceneItemId', { 'sceneName': sceneName, 'sourceName': cameraName })).sceneItemId;

    console.log(sceneName, sceneItemId);

    await obs.call('SetSceneItemEnabled', {
      'sceneName': sceneName, // Replace with the scene that contains the camera
      'sceneItemId': 12,  // Replace with the camera source name
      'sceneItemEnabled': false  // Set to false to hide the camera
    });

    res.status(200).send('Video capture off');
  }
  catch (error) {
    res.status(500).send('Failed to set video capture off');
    console.log(error);
  }

});
  

app.get('/check-connection', async (req, res) => {
  try {
    await obs.call('GetVersion');
    res.status(200).send('Connected to OBS WebSocket');
  } catch (error) {
    res.status(500).send('OBS WebSocket not connected');
    console.log(error);
  }
});

app.get('/connect-to-obs', async (req, res) => {
  OBS_WEBSOCKET_ADDRESS = 'ws://localhost:' + req.query.port;
  OBS_WEBSOCKET_PASSWORD = req.query.password;

  try {
    await obs.connect(OBS_WEBSOCKET_ADDRESS, OBS_WEBSOCKET_PASSWORD);
    res.status(200).send('Connected to OBS WebSocket');
  } catch (error) {
    res.status(500).send('Failed to connect to OBS WebSocket');
    console.log(error);
  }
});

app.get('/run-application', async (req, res) => {
  exec(req.query.application, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Failed to run application: ${req.query.application}`);
      console.error(`Failed to run application: ${req.query.application}`);
      return;
    }
    res.status(200).send(`Running application: ${req.query.application}`);
    console.log(`Running application: ${req.query.application}`);
  });
});

app.get('/open-url', async (req, res) => {
  exec(`start ${req.query.url}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Failed to open URL: ${req.query.url}`);
      console.error(`Failed to open URL: ${req.query.url}`);
      return;
    }
    res.status(200).send(`Opening URL: ${req.query.url}`);
    console.log(`Opening URL: ${req.query.url}`);
  });
});

app.get('/run-script', async (req, res) => {
  exec(req.query.script, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Failed to run script: ${req.query.script}`);
      console.error(`Failed to run script: ${req.query.script}`);
      return;
    }
    res.status(200).send(`Running script: ${req.query.script}`);
    console.log(`Running script: ${req.query.script}`);
  });
});

function connectToOBS() {

  obs.connect(OBS_WEBSOCKET_ADDRESS, OBS_WEBSOCKET_PASSWORD)
    .then(() => {
      console.log('Connected to OBS WebSocket');
    })
    .catch(err => {
      console.error('Failed to connect to OBS WebSocket:', err);
    });
}

obs.on('ConnectionOpened', () => {
  console.log('Connection Opened');
});

obs.on('Identified', () => {
  console.log('Identified, good to go!')

  // Send some requests.
  obs.call('GetSceneList').then((data) => {
    console.log('Scenes:', data);
  });
  obs.call('GetInputList').then((data) => {
    console.log('Inputs:', data);
  });
});

connectToOBS();

obs.on('SwitchScenes', data => {
  console.log('SwitchScenes', data);
});

app.listen(port, server, () => {
  console.log(`Server running at http://${server}:${port}`);
});


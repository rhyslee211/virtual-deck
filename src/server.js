// server.js
const express = require('express');
const {default: OBSWebSocket} = require('obs-websocket-js');
const os = require('os');
//const OBSWebSocket = require('obs-websocket-js').default;
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


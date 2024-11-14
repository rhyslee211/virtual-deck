// server.js
const express = require('express');
const {default: OBSWebSocket} = require('obs-websocket-js');
const os = require('os');
//const OBSWebSocket = require('obs-websocket-js').default;
const { exec } = require('child_process');
const path = require('path');
const { unstable_renderSubtreeIntoContainer } = require('react-dom');
const { get } = require('http');
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const open = require('open');
const keytar = require('keytar')


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
let Authorization_Code = '';
let Client_ID = process.env.TWITCH_CLIENT_ID;
let Client_Secret = process.env.TWITCH_CLIENT_SECRET;
let Access_Token = '';
let Refresh_Token = '';
let User_ID = '';
let User_name = '';

//console.log(Client_ID);
//console.log(Client_Secret);

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

async function getRefreshToken() {
  Refresh_Token = await keytar.getPassword('Virtual Deck', 'refresh_token');
}

async function setRefreshToken() {
  keytar.setPassword('Virtual Deck', 'refresh_token', Refresh_Token);
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


app.get('/auth/twitch/allTokens', (req, res) => {
  res.send('Authorization Code: ' + Authorization_Code + ' Access Token: ' + Access_Token + ' Refresh Token: ' + Refresh_Token);
});


app.get('/auth/twitch/authToken/responsehandler', async (req, res) => {

  if(req.query.code === '' || req.query.code === undefined) {
    res.status(500).send('Twitch auth code not received');
  }
  else{
    //res.send('Twitch auth response received: Auth Code - ' + req.query.code);
    Authorization_Code = req.query.code;

    //console.log("Authorization_Code: " + req.query.code);

    try {
      const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
          params: {
              client_id: Client_ID,
              client_secret: Client_Secret,
              code: req.query.code,
              grant_type: 'authorization_code',
              redirect_uri: 'https://localhost:3000/auth/twitch/accessToken/responsehandler',
          },
      });

      Access_Token = tokenResponse.data.access_token; // Get the access token
      Refresh_Token = tokenResponse.data.refresh_token; // Get the refresh token

      setRefreshToken();

      await getUserId(res);


      //res.status(200).send("Twitch connection established. You may close this window now.");

      //console.log(tokenResponse.ok);

      if (tokenResponse.status === 200) {
        //console.log('Access Token:', tokenData.access_token);
        res.send(`
          <script>
            //console.log('Sending message to parent window');
            //console.log(window.opener.document.title)
            try {
              window.opener.postMessage({ twitchConnected: true , twitchUsername: '${User_name}'}, 'file://');
            } catch (error) {
              console.error('Error sending message to parent window:', error);
            }
            console.log('Origin: ',window.location.origin);
            //window.close();
          </script>
      `);
    }      
      // You can now use the access token to access Twitch API on behalf of the user
      //res.send('Access Token: ' + Access_Token);
  } catch (error) {
      console.error('Error getting access token:', error);
      res.status(500).send('Error getting access token');
  }

  }
});

async function getUserId(res) {
  try {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
        }
    });

    User_ID = response.data.data[0].id;
    User_name = response.data.data[0].display_name;
    //res.send('User ID: ' + User_ID);
  } catch (error) {
    console.error('Error getting user ID:', error);
    res.status(500).send('Error getting user ID');
  }
}

app.get('/auth/twitch/getUser', async (req, res) => {

  try {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
        }

    });

    User_ID = response.data.data[0].id;
    User_name = response.data.data[0].display_name;
    res.status(200).send({Username: User_name, UserID: User_ID});
  } catch (error) {
    console.error('Error getting user ID:', error);
    res.status(500).send('Error getting user ID');
  }
});

app.get('/auth/twitch/accessToken/responsehandler', (req, res) => {

  if(req.query.code === '' || req.query.code === undefined) {
    res.status(500).send('Twitch auth code not received');
  }
  else{
    res.send('Twitch auth response received: Auth Code - ' + req.query.code);
    Access_Token = req.query.access_token;
    Refresh_Token = req.query.refresh_token;

    setRefreshToken();
  }
});

app.get('/auth/twitch/authToken/setAuthToken', (req, res) => {
  if(req.query.authCode === '') {
    res.status(500).send('Twitch auth code not received');
  }
  else {
    Authorization_Code = req.query.authCode;
    res.status(200).send(Authorization_Code);
  }
});

app.get('/auth/twitch/revokeToken', (req, res) => {
  
  Authorization_Code = '';
  Access_Token = '';
  Refresh_Token = '';
  User_ID = '';
  User_name = '';

  res.status(200).send('Twitch token revoked');

});

app.get('/auth/twitch/authToken/getAccessToken', (req, res) => {
  getAuthToken(res);
});

app.get('/auth/twitch/validateToken', async (req, res) => {

  try {
    const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
        headers: {
            'Authorization': `Bearer ${Access_Token}`
        }
    });
    //console.log('Token is valid:', response.data);
    res.status(200).send('Token is valid');
  } catch (error) {
    if (error.response && error.response.status === 401) {
        console.log('Access token is invalid or expired.');

        refreshAccessToken(res);

        // Handle token refresh here
    } else {
        console.error('Error validating token:', error);
    }
  }
});

async function getAccessToken(res) {
  try {
    if(Refresh_Token === '') {
      const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${Client_ID}&client_secret=${Client_Secret}&code=${Authorization_Code}&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/twitch/accessToken/responsehandler`;
      res.redirect(tokenUrl);
    }
    else {
      refreshAccessToken(res);
    }
  } catch (error) {
    console.error('Error generating token URL:', error);
  }
}


async function getAuthToken(res) {
  try {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${Client_ID}&redirect_uri=http://localhost:3000/auth/twitch/authToken/responsehandler&scope=user%3Aedit%3Abroadcast+clips%3Aedit+channel%3Aedit%3Acommercial&state=c3ab8aa609ea11e793ae92361f002671`;

    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
  }
}

async function refreshAccessToken(res) {
  try {
    //const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${Client_ID}&client_secret=${Client_Secret}&grant_type=refresh_token&refresh_token=${Refresh_Token}`;
    
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
          client_id: Client_ID,
          client_secret: Client_Secret,
          refresh_token: Refresh_Token,
          grant_type: 'refresh_token'
      },
    });

    res.status(200).send('Access token refreshed');
    
    Access_Token = tokenResponse.data.access_token; // Get the access token
  } catch (error) {
    console.error('Error generating token URL:', error);
    res.status(500).send('Error generating token URL');
  }
}

async function refreshAccessTokenStartup() {
  try {
    //const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${Client_ID}&client_secret=${Client_Secret}&grant_type=refresh_token&refresh_token=${Refresh_Token}`;
    
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
          client_id: Client_ID,
          client_secret: Client_Secret,
          refresh_token: Refresh_Token,
          grant_type: 'refresh_token'
      },
    });

    
    Access_Token = tokenResponse.data.access_token; // Get the access token
  } catch (error) {
    console.error('Error generating token URL:', error);
  }
}


async function validateToken(req, res, next) {
  try {
      const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
          headers: {
              'Authorization': `Bearer ${Access_Token}`
          }
      });
      console.log('Token is valid:', response.data);
      next();
  } catch (error) {
      if (error.response && error.response.status === 401) {
          console.log('Access token is invalid or expired.');

          refreshAccessToken(res);

          // Handle token refresh here
      } else {
          console.error('Error validating token:', error);
      }
    next(error); 
  }
}

async function validateUser(req, res, next) {
  
  try {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
        }
    });

    User_ID = response.data.data[0].id;
    console.log('User ID:', User_ID);

    next();
  }
  catch (error) {
    console.error('Error getting user ID:', error);
    next(error);
  }

}


app.get('/create-stream-marker', validateToken, validateUser, async (req, res) => {
  try {
    const streamMarker = await axios.post('https://api.twitch.tv/helix/streams/markers', null, {
      headers: {
          'Authorization': `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
      },
      params: {
          user_id: User_ID,
          description: 'Stream marker description'
      }
    });

    res.status(200).send('Stream marker created');
    console.log('Stream marker created:', streamMarker.data);
  } catch (error) {
    console.error('Error creating stream marker:', error);
    res.status(500).send('Failed to create stream marker');
  }
});

app.get('/create-stream-clip', validateToken, validateUser, async (req, res) => {
  try {
    const streamClip = await axios.post('https://api.twitch.tv/helix/clips', null, {
      headers: {
          'Authorization': `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
      },
      params: {
          broadcaster_id: User_ID,
          has_delay: false
      }

    });

    open('https://www.twitch.tv/' + User_name + '/clip/' + streamClip.data.id);

    res.status(200).send('Stream clip created');
    console.log('Stream marker created:', streamClip.data);
  } catch (error) {
    console.error('Error creating stream clip:', error);
    res.status(500).send('Failed to create stream clip');
  }
});

app.get('/run-stream-ad', validateToken, validateUser, async (req, res) => {
  try {
    const streamAd = await axios.post('https://api.twitch.tv/helix/channels/commercial', null, {
      headers: {
          'Authorization': `Bearer ${Access_Token}`,
          'Client-ID': Client_ID
      },
      params: {
          broadcaster_id: User_ID,
          length: req.query.duration || 30
      }
    });
    res.status(200).send('Stream ad running');
  } catch (error) {
    console.error('Error running stream ad:', error);
    res.status(500).send('Failed to run stream ad');
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
      console.log(error);
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


async function performStartupActions() {
  //connectToOBS();
  await getRefreshToken();
  if(Refresh_Token !== '') {
    await refreshAccessTokenStartup();
  }
}

performStartupActions();



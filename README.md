# VirtualDeck

## What is VirtualDeck?

VirtualDeck is a stream deck built into your computer. Instead of buying an entire new device, users can assign keybindings and buttons to macros that perform tasks such as:

* Muting mic in OBS
* Switching OBS Scenes
* Starting Applications
* Initiating ad breaks
* Starting and stopping streams/recordings
* Adjusting audio levels
* Adding stream markers

## Built With

* [![JavaScript][JavaScript]][JavaScript-url]
* [![Node][Node]][Node-url]
* [![Express][Express]][Express-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS-shield]][TailwindCSS-url]

## Setting Up Your Virtual Deck

To build your own Virtual Deck, follow the instructions below. Alternatively, you can download a prebuilt release and run it directly—no extra steps required (currently available for Windows only). When running the prebuilt release for the first time, an "Unknown publisher" popup may appear; click "More info" and then "Run anyway" to proceed.

```powershell
npm install
npm run build
npm run electron-start
```

You will also need to create a .env.local file in your repository and store your twitch API Client ID and Secret there. You can get your twitch Client ID and Secret by creating an "Application Integration" app in the [Twitch Dev Portal](https://dev.twitch.tv/) with the following OAuth Redirect URLs.

```plaintext
http://localhost:3000/auth/twitch/authToken/responsehandler
https://localhost:3000/auth/twitch/authToken/responsehandler
http://localhost:3000/auth/twitch/accessToken/responsehandler
https://localhost:3000/auth/twitch/accessToken/responsehandler
```

### `.env.local`
```plaintext
TWITCH_CLIENT_ID={Your_Twitch_Client_ID}
TWITCH_CLIENT_SECRET={Your_Twitch_Client_Secret}
```

## Virtual Deck Setup and Use Guide

Once your Virtual Deck is installed you still need to connect Twitch and set up the OBS websocket in order to use their functions. 

### Connecting Twitch

To connect your twitch account, click the Twitch icon in the bottom left of the screen, or navigate to settings and click the "Connect to Twitch" button. You will then need to log in to Twitch and authorize the Virtual Deck Twitch Application to allow the API connection.

### Connecting OBS

To connect your OBS to Virtual Deck you must go into the Tools -> Websocket Server Settings. In there check the "Enable WebSocket Server" setting. You can leave the Server Port as the default or change it if needed. Then generate a password and copy it.

Now open the settings in Virtual Deck and input your Obs WebSocket Port and Obs WebSocket Password.

### Creating Macros

To create a new macro click the + icon on the Virtual Deck sidebar. This will open a form where you can set up a variety of commands for your macro to execute. Simply select your command from the drop down, and configure all the inputs. Once you have finished configuring all of the inputs click the Save button to save the macro. It will then appear on your Virtual Deck Home Screen, and you can move it around using the Pencil icon.

### Editing Macros

You can edit macros by clicking the Pencil icon on the left sidebar and then selecting the three dots in the top left corner of the macro you wish to edit. This will bring up the Macro Edit form. Once you have made all of your changes, click the Save button to save the edited macro.

## Planned Features

Window allows configuration and button activation. ✅

Small pop up window that allows button activation, and can be hidden with macro.

Ability to control server/application from phone.


[Node]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[Express]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/
[JavaScript]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[JavaScript-url]: https://www.javascript.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS-shield]: https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/

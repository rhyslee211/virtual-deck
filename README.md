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

To build your own Virtual Deck, follow the instructions below. Alternatively, you can download a prebuilt release and run it directly—no extra steps required (currently available for Windows only).

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

## Planned Features

Window allows configuration and button activation. ✅

Small pop up window that allows button activation, and can be hidden with macro. ✅

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

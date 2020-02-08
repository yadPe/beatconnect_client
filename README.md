Beatconnect client [![license](https://img.shields.io/github/license/yadpe/beatconnect_client.svg?style=flat-square)]() <a  href="https://snyk.io/test/github/yadPe/beatconnect_client?targetFile=package.json"><img src="https://snyk.io/test/github/yadPe/beatconnect_client/badge.svg" alt="" data-canonical-src="https://snyk.io/test/github/yadPe/beatconnect_client" style="max-width:100%;"></a> [![CircleCI](https://circleci.com/gh/yadPe/beatconnect_client.svg?style=svg)](https://circleci.com/gh/yadPe/beatconnect_client)
======
The official client for [Beatconnect](https://beatconnect.io) which is a mirror for [Osu!](https://osu.ppy.sh/home) Beatmaps

**Table of contents:**

<!-- toc -->

- [Quick Tour](#quick-tour)
- [Technology](#technology)
- [Documentation](#documentation)
- [Development](#development)
- [Download](#download)
- [License](#license)

<!-- tocstop -->

## Quick Tour
- This App gives you access to all the beatmaps mirrored on [Beatconnect](https://beatconnect.io). You can downloads multiple beatmaps that will be automaticaly imported into osu! </br>
<img src="https://cdn.discordapp.com/attachments/414474227710820352/663024989984915467/unknown_2.jpg">

- You can launch an <b>IRC bot</b> from the app that will make all [available commands](./docs/commands.md) usable to peoples pming you and from all the matches chats that the bot is connected to. (how to connect docs soon..)</br>
Comming with the <b>autobeat</b> feature that send the Beatconnect download link in the #multuplayer channel each time host change the beatmap
<img src="./docs/m3krbwj3sfdG480M.gif">

- Manage connected matchs
<img src="https://cdn.discordapp.com/attachments/414474227710820352/621679191292772352/unknown.png">

## Technology

- The application is powered by **[Electron](https://electronjs.org),
  with [React](https://facebook.github.io/react/),
  [Redux](http://redux.js.org/),
  and [NodeJs](https://nodejs.org)**

- The bot uses a slightly modified version of **[node-irc](https://github.com/yadPe/node-irc) to connect to game IRC.**

## Documentation

**Available ressources:**

- [Connect to a multiplayer match](./docs/connect-to-multiplayer-match.md)
- [Bot commands](./docs/commands.md)

## Development

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* NodeJs v8.10 or higher and npm installed

### Installing

```bash
# Clone this repository
$ git clone https://github.com/yadPe/beatconnect_client.git

# Go into the repository
$ cd beatconnect_client

# Install dependencies
$ npm i

# Start the dev server and launch the app
$ npm run dev

# (if you're running WSL you will have to start electron from within Windows with "npm run electron-dev")
```

## Download 
- Latest release available [here](https://github.com/yadPe/beatconnect_client/releases/latest)

## License

This project is licensed under the GNU V3.0 License.

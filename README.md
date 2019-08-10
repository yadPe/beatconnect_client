# Beatconnect client
The official client for [Beatconnect](https://beatconnect.io) which is a mirror for [Osu!](https://osu.ppy.sh/home) Beatmaps

**Table of contents:**

<!-- toc -->

- [Quick Tour](#quick-tour)
- [Technology](#technology)
- [Development](#development)
- [Download](#download)
- [License](#license)

<!-- tocstop -->

## Quick Tour
- This App gives you access to all the beatmaps mirrored on [Beatconnect](https://beatconnect.io). You can downloads multiple beatmaps that will be automaticaly imported into osu! </br>
<img src="https://cdn.discordapp.com/attachments/414474227710820352/609783969952694283/unknown.png">

- You can launch an <b>IRC bot</b> from the app that will make all [available commands](./docs/commands.md) usable to peoples pming you and from all the matches chats that the bot is connected to. (how to connect docs soon..)</br>
Comming with the <b>autobeat</b> feature that send the Beatconnect download link in the #multuplayer channel each time host change the beatmap
<img src="./docs/m3krbwj3sfdG480M.gif">

- Manage connected matchs
<img src="https://cdn.discordapp.com/attachments/414474227710820352/609813246198939687/unknown.png">

## Technology

- The application is powered by **[Electron](https://electronjs.org),
  with [React](https://facebook.github.io/react/),
  [Redux](http://redux.js.org/),
  and [NodeJs](https://nodejs.org)**

- The bot uses a slightly modified version of **[node-irc](https://github.com/yadPe/node-irc) to connect to game IRC.**

## Development

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* NodeJs v8.10 or higher and npm installed

### Installing

```bash
# Clone this repository
$ git clone https://github.com/yadPe/beatconnect_client.git

# Go into the repository
$ cd beatconnect_irc_bot

# Install dependencies
$ npm i

# Build the react App
$ npm run build

# Run electron
$ electron .
```

## Download 
- Latest release available [here](https://github.com/yadPe/beatconnect_client/releases/latest)

## License

This project is licensed under the GNU V3.0 License.

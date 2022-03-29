# Beatconnect client [![license](https://img.shields.io/github/license/yadpe/beatconnect_client.svg?style=flat-square)]() <a  href="https://snyk.io/test/github/yadPe/beatconnect_client?targetFile=package.json"><img src="https://snyk.io/test/github/yadPe/beatconnect_client/badge.svg" alt="" data-canonical-src="https://snyk.io/test/github/yadPe/beatconnect_client" style="max-width:100%;"></a> [![CircleCI](https://circleci.com/gh/yadPe/beatconnect_client.svg?style=svg)](https://circleci.com/gh/yadPe/beatconnect_client)

The official client for [Beatconnect](https://beatconnect.io) which is a mirror for [Osu!](https://osu.ppy.sh/home) Beatmaps

**Table of contents:**

<!-- toc -->

- [Quick Tour](#quick-tour)
- [Technology](#technology)
- [Documentation](#documentation)
- [Development](#development)
- [Release](#release)
- [Download](#download)
- [License](#license)

<!-- tocstop -->

## Quick Tour

- This App gives you access to all the beatmaps mirrored on [Beatconnect](https://beatconnect.io). You can downloads multiple beatmaps that will be automaticaly imported into osu! </br>
  <img src="https://cdn.discordapp.com/attachments/836936232599945296/836938053917474917/unknown.png">

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

- NodeJs v14 or higher and yarn

### Installing for development

**Note:** Before running beatconnect yourself you will need a [.env](#Env-file) file and a Beatconnect token.

```bash
# Clone this repository
git clone https://github.com/yadPe/beatconnect_client.git

# Go into the repository
cd beatconnect_client

# Install dependencies
yarn

# Start the dev server and launch the app
yarn dev

# (if you're running WSL you will have to start electron from within Windows with "yarn electron-dev")
```

### Building for production

**Given node 14 or superiour and yarn are installed**

You can run `yarn dist:` followed by one of `win`, `linux` or `mac`. It will build beatconnect for x64 platform only by default but if prefixed by `-ia32` builder will also output x86 version.
Build artifacts will by located inside the `dist` folder

**Note:** Before building beatconnect yourself you will need a [.env](#Env-file) file and a Beatconnect token.

Example

```bash
# Build beatconnect as nsis-web installer for Windows x64
yarn dist:win

# Build beatconnect as dmg and mac for OSX x64
yarn dist:mac

# Build beatconnect as AppImage and deb for linux x64 and x86
yarn dist:linux --ia32
```

### Env file

The `.env` file must be located at the root of the project

```
BEATCONNECT_CLIENT_TOKEN=your-beatconnect-token
BEATCONNECT_HOST_URL=https://beatconnect.io/
BEATCONNECT_CLIENT_GA_TRACKING_ID=ga-tracking-id
BEATCONNECT_CLIENT_API_KEY_V1=osu-api-key
BEATCONNECT_CLIENT_DISCORD_APP_ID=discord-app-id
```

## Release

1. Create a branch named `vX.X.X` from latest `master` branch
2. Manually bump the version in `package.json`
3. Run `yarn changelog`
4. Commit and push
5. Open a pull request
6. Once the pull request is merged publish a [new release on Github](https://github.com/yadPe/beatconnect_client/releases/new)
7. A [workflow](https://github.com/yadPe/beatconnect_client/actions/workflows/publish.yml) should have been created and needs to be approved by an admin before run
8. Once the worflow is approved it will build the binaries artifacts for macos, windows and linux then it will upload them to the release you created
9. Voila! Users will now receive the new release via the auto update system

## Download test

- Latest release available [here](https://github.com/yadPe/beatconnect_client/releases/latest)

## License

This project is licensed under the GNU V3.0 License.

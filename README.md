# Beatconnect irc bot

This App gives you access to all the beatmaps mirrored on [Beatconect](https://beatconnect.io). You can downloads multiple beatmaps that will be automaticaly imported into osu! </br>
Plus you can launch an irc bot from the app that will make all [available commands](./doc/commands.md) usable to peoples pming you and from all the matchs chat that the bot is connected to. (how to connect docs soon..)

This is still under development.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* NodeJs v8.10 or higher and npm installed

### Installing

```bash
# Clone this repository
$ git clone https://github.com/yadPe/beatconnect_irc_bot.git

# Go into the repository
$ cd beatconnect_irc_bot

# Install dependencies
$ npm i

# Copy conf_template.js as conf.js then fill it with all the informations needed
$ cp conf_template.js ./src/Bot/conf.js

# Build the react App
$ npm run build

# Run the electron App
$ electron .
```

## License

This project is licensed under the GNU V3.0 License.

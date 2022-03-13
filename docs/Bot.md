# Multiplayer Bot

# Table of Contents
1. [Setup](#setup)
2. [Connect to a match](#connect-to-multiplayer-match)
3. [Commands](#commands)

## Setup

### Requirement 

- Your Osu! IRC credentials user and password these are not the same as your Osu! account credentials (Get them at https://osu.ppy.sh/p/irc)
- A Osu! API key V1 (V2 api is not compatible), it will be used to fetch infos about beatmaps and matchs (Get it at https://osu.ppy.sh/p/api)

### Setup process 

1. Go to the settings section of Beatconnect Client then select the sub section Bot, enter your IRC credentials and api key and tweak other settings if needed.
2. Now go to the Bot main section and start the bot with the toggle on top of the screen, the bot should now connect to IRC and the Osu! account linked to your IRC credentials should appear online in-game.

## Connect to multiplayer match

### With an existing match (recommended) 

1 - In-game create a Match or join an existing one 

2 - The creator of the match must enter `!mp addref <username of the bot>`

3 - Now the bot is allowed to connect to the match. To do so you have two solutions:

- Note that you will need the match id you can get it by accessing the match history that can be found in the match chat by typing `!mp settings` 
- Then you can either: 
    - Send a pm to the bot with the command `!join <match ID>`
    - Enter the `match ID` then click join from the **Bot** section of the client 
    
    
### With a new match 

**The bot can create a match for you and send you an invite when it is ready
Those matches are tournament matches, meaning that you can only create 5 of them and they will continue to live event after all players left until you or the bot close them. 
(The bot will always close an empty match if nobody joins it for 30 sec)**

1 - Send a pm to the bot with the command `!createroom <your match name>`

2 - You will receive an invite from the bot, click on it and start playing


## Commands

**!get** `beatmapset ID`: Return the beatconnect download link for the corresponding beatmapSet.

**!search** `query`: Perform a search as on beatconnect’s website and return the 4 first ranked occurrences and a link to the other results on Beatconnect.

**!beat** : Return the beatconnect download link of the current beatmap in a multiplayer match.

**!createRoom** `room name`: Create a multiplayer room with the specified name and send you an invite once the room is ready.

**!join** `match ID` : Request the bot to connect to the specified match (Bot must be added as match referee before with `!mp addref`).

**!infos** : Return a list of all available commands.

These examples use the `!` prefix you can change it in the settings section of the app ( need a restart of the app to be applied ).

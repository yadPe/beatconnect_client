@module("./discordRPC.js")
external setPlayingSongPresence: (string, string) => unit = "setPlayingSongPresence"
@module("./discordRPC.js")
external clearActivity: unit => unit = "clearActivity"

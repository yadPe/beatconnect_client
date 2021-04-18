[@bs.module "./discordRPC.js"]
external setPlayingSongPresence: (string, string) => unit =
  "setPlayingSongPresence";
[@bs.module "./discordRPC.js"]
external clearActivity: unit => unit = "clearActivity";

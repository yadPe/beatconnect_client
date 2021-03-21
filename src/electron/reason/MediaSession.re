type t;
type navigator;

[@bs.deriving {jsConverter: newType}]
type actionType = [ | `play | `pause | `previoustrack | `nexttrack | `stop];

[@bs.val] external mediaSession: t = "navigator.mediaSession";

[@bs.val] external navigator: navigator = "navigator";

[@bs.send]
external setActionHandler: (t, actionType, option(unit => unit)) => unit =
  "setActionHandler";

let setActionHandler = setActionHandler(mediaSession);

[@bs.set]
external setMediaSessionMetadata: (t, MediaMetadata.t) => unit = "metadata";

let setMediaSessionMetadata = setMediaSessionMetadata(mediaSession);

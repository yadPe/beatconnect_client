type t;
type navigator;

[@bs.val] external mediaSession: t = "navigator.mediaSession";

[@bs.val] external navigator: navigator = "navigator";

[@bs.send]
external setActionHandler: (t, string, unit => unit) => unit =
  "setActionHandler";

[@bs.set]
external setMediaSessionMetadata: (t, MediaMetadata.t) => unit = "metadata";

let setMediaSessionMetadata = (metadata: MediaMetadata.t) =>
  mediaSession->setMediaSessionMetadata(metadata);

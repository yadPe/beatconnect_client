type t
type navigator

@deriving({jsConverter: newType})
type actionType = [#play | #pause | #previoustrack | #nexttrack | #stop]

@val external mediaSession: t = "navigator.mediaSession"

@val external navigator: navigator = "navigator"

@send
external setActionHandler: (t, actionType, option<unit => unit>) => unit = "setActionHandler"

let setActionHandler = setActionHandler(mediaSession)

@set
external setMediaSessionMetadata: (t, MediaMetadata.t) => unit = "metadata"

let setMediaSessionMetadata = setMediaSessionMetadata(mediaSession)

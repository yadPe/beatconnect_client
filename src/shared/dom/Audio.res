type t
type callback<'a> = 'a => unit

type target = {
  readyState: int,
  volume: int,
}

type partialAudioEvent = {target: target}

@new external make: unit => t = "Audio"
@new external makeWithSrc: (~src: string) => t = "Audio"

@get external paused: t => bool = "paused"
@get external getMuted: t => bool = "muted"
@get external getVolume: t => int = "volume"
@set external setSrc: (t, string) => unit = "src"
@set external setVolume: (t, float) => unit = "volume"
@set external setCurrentTime: (t, int) => unit = "currentTime"
@set external setMuted: (t, bool) => unit = "muted"
@send external pause: t => unit = "pause"
@send external play: t => Js.Promise.t<unit> = "play"
@set
external onended: (t, callback<partialAudioEvent>) => unit = "onended"
@set
external onerror: (t, callback<partialAudioEvent>) => unit = "onerror"
@set
external onpause: (t, callback<partialAudioEvent>) => unit = "onpause"
@set
external onplay: (t, callback<partialAudioEvent>) => unit = "onplay"
@set
external oncanplay: (t, callback<partialAudioEvent>) => unit = "oncanplay"
@set
external onvolumechange: (t, callback<partialAudioEvent>) => unit = "onvolumechange"

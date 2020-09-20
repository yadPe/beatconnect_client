type t;
type callback('a) = 'a => unit;

type target = {readyState: int};

type partialAudioEvent = {target};

[@bs.new] external make: unit => t = "Audio";
[@bs.new] external makeWithSrc: (~src: string) => t = "Audio";

[@bs.get] external paused: t => bool = "paused";
[@bs.set] external setSrc: (t, string) => unit = "src";
[@bs.set] external setVolume: (t, float) => unit = "volume";
[@bs.send] external pause: t => unit = "pause";
[@bs.send] external play: t => unit = "play";
[@bs.set]
external onended: (t, callback(partialAudioEvent)) => unit = "onended";
[@bs.set]
external onerror: (t, callback(partialAudioEvent)) => unit = "onerror";
[@bs.set]
external onpause: (t, callback(partialAudioEvent)) => unit = "onpause";
[@bs.set]
external onplay: (t, callback(partialAudioEvent)) => unit = "onplay";
[@bs.set]
external oncanplay: (t, callback(partialAudioEvent)) => unit = "oncanplay";

type t;
type callback('a) = 'a => unit;

[@bs.new] external make: unit => t = "Audio";
[@bs.new] external makeWithSrc: (~src: string) => t = "Audio";

[@bs.get] external paused: t => bool = "paused";
[@bs.set] external setSrc: (t, string) => unit = "src";
[@bs.set] external setVolume: (t, float) => unit = "volume";
[@bs.send] external pause: t => unit = "pause";
[@bs.send] external play: t => unit = "play";
[@bs.set] external onended: (t, callback(Dom.event)) => unit = "onended";
[@bs.set] external onerror: (t, callback(Dom.event)) => unit = "onerror";
[@bs.set] external onpause: (t, callback(Dom.event)) => unit = "onpause";
[@bs.set] external onplay: (t, callback(Dom.event)) => unit = "onplay";
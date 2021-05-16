type t;

[@bs.new] external make: unit => t = "Image";
[@bs.new] external makeWithSize: (~width: int, ~height: int) => t = "Image";

[@bs.send] external decode: t => Js.Promise.t(unit) = "decode";
[@bs.set] external setSrc: (t, string) => unit = "src";

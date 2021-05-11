type t;

[@bs.send] external setTitle: (t, string) => unit = "setTitle";
[@bs.send] external isMaximized: t => bool = "isMaximized";
[@bs.send] external unmaximize: t => unit = "unmaximize";
[@bs.send] external maximize: t => unit = "maximize";
[@bs.send] external close: t => unit = "close";
[@bs.send] external minimize: t => unit = "minimize";
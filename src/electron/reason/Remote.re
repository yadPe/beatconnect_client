type t;

[@bs.module "electron"] external remote: t = "remote";
[@bs.send]
external getCurrentWindow: t => BrowserWindow.t = "getCurrentWindow";
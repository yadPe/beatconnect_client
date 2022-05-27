type t

@module("electron") external remote: t = "remote"
@send
external getCurrentWindow: t => BrowserWindow.t = "getCurrentWindow"

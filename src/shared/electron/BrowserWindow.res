type t

@send external setTitle: (t, string) => unit = "setTitle"
@send external isMaximized: t => bool = "isMaximized"
@send external unmaximize: t => unit = "unmaximize"
@send external maximize: t => unit = "maximize"
@send external close: t => unit = "close"
@send external minimize: t => unit = "minimize"

type t

@new external make: unit => t = "Image"
@new external makeWithSize: (~width: int, ~height: int) => t = "Image"

@send external decode: t => Js.Promise.t<unit> = "decode"
@set external setSrc: (t, string) => unit = "src"

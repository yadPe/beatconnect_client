@deriving(jsConverter)
type jsRenderIconsArgs = {
  name: string,
  color: option<string>,
  width: option<int>,
  height: option<int>,
}

@module("./renderIcons")
external jsRenderIcons: {
  "color": option<string>,
  "height": option<int>,
  "name": string,
  "width": option<int>,
} => React.element = "default"

let make = (
  ~name: string,
  ~color: option<string>=?,
  ~width: option<int>=?,
  ~height: option<int>=?,
  (),
) => {name: name, color: color, width: width, height: height}->jsRenderIconsArgsToJs->jsRenderIcons

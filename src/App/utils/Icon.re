[@bs.deriving jsConverter]
type jsRenderIconsArgs = {
  name: string,
  color: option(string),
  width: option(int),
  height: option(int),
};

[@bs.module "./renderIcons"]
external jsRenderIcons:
  {
    .
    "color": option(string),
    "height": option(int),
    "name": string,
    "width": option(int),
  } =>
  React.element =
  "default";

let make =
    (
      ~name: string,
      ~color: option(string)=?,
      ~width: option(int)=?,
      ~height: option(int)=?,
      (),
    ) =>
  {name, color, width, height}->jsRenderIconsArgsToJs->jsRenderIcons;
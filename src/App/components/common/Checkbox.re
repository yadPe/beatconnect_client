open Css;

let component = ReasonReact.statelessComponent("CheckBox");

let checkBoxStyle = borderColor =>
  style([
    unsafe("-webkit-appearance", "none"),
    margin2(auto, rem(1.)),
    width(px(20)),
    height(px(20)),
    border(px(1), solid, color(borderColor)),
    borderRadius(px(2)),
    verticalAlign(middle),
    backgroundColor(transparent),
  ]);

[@genType]
let make = (~checked, ~disabled, _children) => {
  ...component,
  render: _self => {
    <input className=checkBoxStyle type_="checkbox" checked disabled />;
  },
};

[@bs.deriving abstract]
type jsProps = {
  checked: bool,
  disabled: bool,
  children: array(ReasonReact.reactElement),
};
open Css;

let checkBoxStyle = (~color, ~activeColor) =>
  style([
    unsafe("-webkit-appearance", "none"),
    margin2(~v=auto, ~h=rem(1.)),
    width(px(20)),
    height(px(20)),
    border(px(1), solid, hex(color)),
    borderRadius(px(2)),
    verticalAlign(middle),
    backgroundColor(transparent),
    selector(
      "&:checked",
      [borderColor(hex(activeColor)), backgroundColor(hex(activeColor))],
    ),
  ]);

[@react.component]
[@genType]
let make = (~checked, ~disabled, ~color, ~activeColor) => {
  <input
    className={checkBoxStyle(~color, ~activeColor)}
    type_="checkbox"
    checked
    disabled
  />;
};

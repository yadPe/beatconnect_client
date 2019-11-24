[@bs.module "electron"]
external jsRenderIcons: unit => React.element = "remote";

open Css;
let makeWrapperStyle = (~height as h) =>
  style([
    unsafe("-webkit-app-region", "drag"),
    backgroundColor(hex("171717")),
    height(px(h)),
    width(pct(100.)),
    display(`flex),
    alignItems(center),
  ]);

let makeTitleStyle = () =>
  style([
    paddingLeft(px(12)),
    fontSize(px(12)),
    color(white),
    flex3(~grow=1., ~shrink=1., ~basis=zero),
  ]);

let makeControlStyle = (~bgColor: option(Css.Types.Color.t)=?, ()) =>
  style([
    unsafe("-webkit-app-region", "no-drag"),
    padding2(~v=zero, ~h=px(7)),
    selector(
      "&:hover",
      [
        backgroundColor(
          switch (bgColor) {
          | None => rgba(255, 255, 255, 0.15)
          | Some(c) => c
          },
        ),
      ],
    ),
  ]);

[@react.component]
[@genType]
let make = (~title, ~height: int, _children) => {
  <div className={makeWrapperStyle(~height)}>
    <div className={makeTitleStyle()}> title->React.string </div>
    <div className={makeControlStyle()}>
      {Icon.make(~name="Dash", ~width=12, ~height=12, ())}
    </div>
    <div className={makeControlStyle()}>
      {Icon.make(~name="Square", ~width=12, ~height=12, ())}
    </div>
    <div className={makeControlStyle(~bgColor=red, ())}>
      {Icon.make(~name="Cancel", ~width=12, ~height=12, ())}
    </div>
  </div>;
};

let default = make;
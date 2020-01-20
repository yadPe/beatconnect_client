open Css;
let makeWrapperStyle = (~height as h) =>
  style([
    unsafe("WebkitAppRegion", "drag"),
    backgroundColor(hex("171717")),
    zIndex(100),
    position(fixed),
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
    unsafe("WebkitAppRegion", "no-drag"),
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
let make =
    (
      ~title,
      ~height: int,
      ~onMinimizeClick,
      ~onMaximizeClick,
      ~onCloseClick,
      _children,
    ) => {
  <div className={makeWrapperStyle(~height)}>
    <div className={makeTitleStyle()}> title->React.string </div>
    <div className={makeControlStyle()} onClick=onMinimizeClick>
      {Icon.make(~name="Dash", ~width=12, ~height=12, ())}
    </div>
    <div className={makeControlStyle()} onClick=onMaximizeClick>
      {Icon.make(~name="Square", ~width=12, ~height=12, ())}
    </div>
    <div className={makeControlStyle(~bgColor=red, ())} onClick=onCloseClick>
      {Icon.make(~name="Cancel", ~width=12, ~height=12, ())}
    </div>
  </div>;
};

let default = make;

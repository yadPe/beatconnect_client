open Css;

let makeBaseStyle = () =>
  style([
    border(px(2), solid, hex("2c3e50")),
    borderRadius(rem(0.25)),
    fontSize(rem(0.8)),
    padding3(~top=rem(0.1), ~h=rem(0.45), ~bottom=rem(0.2)),
    display(inlineFlex),
    alignItems(center),
  ]);

let makeStatusStyle = status =>
  switch (status) {
  | "info" => style([backgroundColor(hex("3498db"))])
  | "pending" =>
    style([
      backgroundColor(rgba(241, 196, 15, 0.15)),
      borderColor(rgba(241, 196, 15, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(241, 196, 15, 0.4)),
          borderColor(rgb(241, 196, 15)),
        ],
      ),
    ])
  | "qualified" =>
    style([
      backgroundColor(rgba(241, 196, 15, 0.15)),
      borderColor(rgba(241, 196, 15, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(241, 196, 15, 0.4)),
          borderColor(rgb(241, 196, 15)),
        ],
      ),
    ])
  | "graveyard" =>
    style([
      backgroundColor(rgba(231, 76, 60, 0.15)),
      borderColor(rgba(231, 76, 60, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(231, 76, 60, 0.4)),
          borderColor(rgb(231, 76, 60)),
        ],
      ),
    ])
  | "WIP" =>
    style([
      backgroundColor(rgba(231, 76, 60, 0.15)),
      borderColor(rgba(231, 76, 60, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(231, 76, 60, 0.4)),
          borderColor(rgb(231, 76, 60)),
        ],
      ),
    ])
  | "loved" =>
    style([
      backgroundColor(rgba(222, 90, 148, 0.15)),
      borderColor(rgba(222, 90, 148, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(222, 90, 148, 0.4)),
          borderColor(rgb(222, 90, 148)),
        ],
      ),
    ])
  | "ranked" =>
    style([
      backgroundColor(rgba(46, 204, 113, 0.15)),
      borderColor(rgba(46, 204, 113, 0.8)),
      selector(
        "&:hover",
        [
          backgroundColor(rgba(46, 204, 113, 0.4)),
          borderColor(rgb(46, 204, 113)),
        ],
      ),
    ])
  | _ => style([backgroundColor(hex("2c3e50"))])
  };

let makeStyle = status => [makeBaseStyle(), makeStatusStyle(status)]->merge;

[@react.component]
[@genType]
let make = (~status, _children) => {
  <span className={makeStyle(status)}>
    {status->String.capitalize_ascii->React.string}
  </span>;
};
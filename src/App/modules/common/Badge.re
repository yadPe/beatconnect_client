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

let makeStatusStyle = (status, difficulty) =>
  switch (status) {
  | "info" => style([backgroundColor(hex("3498db"))])
  | "pending" =>
    style([
      backgroundColor(
        difficulty->Belt.Option.mapWithDefault(
          rgba(241, 196, 15),
          PpyHelpers.getBeatmapDifficultyColorRGBA,
          0.5,
        ),
      ),
      borderColor(
        difficulty->Belt.Option.mapWithDefault(
          rgba(241, 196, 15),
          PpyHelpers.getBeatmapDifficultyColorRGBA,
          0.8,
        ),
      ),
      hover([
        backgroundColor(rgba(241, 196, 15, 0.7)),
        borderColor(rgb(241, 196, 15)),
      ]),
    ])
  | "qualified" =>
    style([
      backgroundColor(rgba(241, 196, 15, 0.50)),
      borderColor(rgba(241, 196, 15, 0.8)),
      hover([
        backgroundColor(rgba(241, 196, 15, 0.7)),
        borderColor(rgb(241, 196, 15)),
      ]),
    ])
  | "graveyard" =>
    style([
      backgroundColor(rgba(231, 76, 60, 0.50)),
      borderColor(rgba(231, 76, 60, 0.8)),
      hover([
        backgroundColor(rgba(231, 76, 60, 0.7)),
        borderColor(rgb(231, 76, 60)),
      ]),
    ])
  | "WIP" =>
    style([
      backgroundColor(rgba(231, 76, 60, 0.50)),
      borderColor(rgba(231, 76, 60, 0.8)),
      hover([
        backgroundColor(rgba(231, 76, 60, 0.7)),
        borderColor(rgb(231, 76, 60)),
      ]),
    ])
  | "loved" =>
    style([
      backgroundColor(rgba(222, 90, 148, 0.50)),
      borderColor(rgba(222, 90, 148, 0.8)),
      hover([
        backgroundColor(rgba(222, 90, 148, 0.7)),
        borderColor(rgb(222, 90, 148)),
      ]),
    ])
  | "ranked" =>
    style([
      backgroundColor(
        difficulty->Belt.Option.mapWithDefault(
          rgba(46, 204, 113),
          PpyHelpers.getBeatmapDifficultyColorRGBA,
          0.5,
        ),
      ),
      borderColor(
        difficulty->Belt.Option.mapWithDefault(
          rgba(46, 204, 113),
          PpyHelpers.getBeatmapDifficultyColorRGBA,
          0.8,
        ),
      ),
      hover([
        backgroundColor(rgba(46, 204, 113, 0.7)),
        borderColor(rgb(46, 204, 113)),
      ]),
    ])
  | _ => style([backgroundColor(hex("2c3e50"))])
  };

let makeStyle = (status, difficulty) =>
  [makeBaseStyle(), makeStatusStyle(status, difficulty)]->merge;

[@react.component]
let make =
    (
      ~status,
      ~difficulty: option(float),
      ~difficultyText: option(string),
      ~style=?,
    ) => {
  let (text, setText) = React.useState(() => status);

  React.useEffect1(
    () => {
      setText(_ =>
        switch (difficultyText) {
        | Some(difficultyText) => difficultyText
        | None => status
        }
      );
      None;
    },
    [|difficultyText|],
  );

  <span
    className={makeStyle(status, difficulty)}
    ?style
    onMouseEnter={_ => setText(_ => status)}
    onMouseLeave={_ =>
      setText(_ =>
        switch (difficultyText) {
        | Some(difficultyText) => difficultyText
        | None => status
        }
      )
    }>
    <span> text->React.string </span>
  </span>;
};

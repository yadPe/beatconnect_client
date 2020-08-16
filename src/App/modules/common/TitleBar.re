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
    textOverflow(`ellipsis),
    whiteSpace(`nowrap),
    overflow(`hidden),
    maxWidth(pct(40.)),
    paddingLeft(px(12)),
    fontSize(px(12)),
    color(white),
    flex3(~grow=1., ~shrink=1., ~basis=zero),
  ]);

let makeControlStyle = (~bgColor=?, ~spacer=false, ()) =>
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
    marginLeft(spacer ? `auto : `zero),
  ]);

[@react.component]
[@genType]
let make = (~height: int) => {
  let {AudioPlayerProvider.playingState} =
    AudioPlayerProvider.useAudioPlayer();
  let songTitle = playingState.songTitle;
  let title =
    playingState.isPlaying
      ? {j|Beatconnect \u23F5 $songTitle|j} : "Beatconnect";
  let window = Remote.getCurrentWindow(Remote.remote);
  window->BrowserWindow.setTitle(title);

  let onMinimizeClick = _e => BrowserWindow.minimize(window);
  let onCloseClick = _e => BrowserWindow.close(window);
  let onMaximizeClick = _e =>
    BrowserWindow.isMaximized(window)
      ? BrowserWindow.unmaximize(window) : BrowserWindow.maximize(window);

  <div className={makeWrapperStyle(~height)}>
    <div className={makeTitleStyle()}> title->React.string </div>
    <div
      className={makeControlStyle(~spacer=true, ())} onClick=onMinimizeClick>
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
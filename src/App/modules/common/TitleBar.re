open Css;
let makeWrapperStyle = () =>
  style([
    zIndex(500),
    position(fixed),
    right(zero),
    display(`flex),
    alignItems(center),
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
          | None => rgba(255, 255, 255, 0.25)
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
  let artist = playingState.artist;
  let title = playingState.title;
  let songTitle = {j|$artist - $title|j};
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

  <div className={makeWrapperStyle()}>
    <div
      className={makeControlStyle(~spacer=true, ())} onClick=onMinimizeClick>
      {Icon.make(~name="Dash", ~width=height, ~height, ())}
    </div>
    <div className={makeControlStyle()} onClick=onMaximizeClick>
      {Icon.make(~name="Square", ~width=height, ~height, ())}
    </div>
    <div className={makeControlStyle(~bgColor=red, ())} onClick=onCloseClick>
      {Icon.make(~name="Cancel", ~width=height, ~height, ())}
    </div>
  </div>;
};

let default = make;

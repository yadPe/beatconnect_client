type t;
[@bs.module "electron"] external remote: t = "ipcRenderer";

[@bs.send] external send: (t, string, 'a) => unit = "send";
[@bs.send] external on: (t, string, 'a => unit) => unit = "on";
[@bs.send]
external removeListener: (t, string, 'a => unit) => unit = "removeListener";

type updateThumbBarData = {
  isPlaying: bool,
  canPlayNext: bool,
  canPlayPrev: bool,
};

type channel =
  | UPDATE_THUMB_BAR(updateThumbBarData)
  | UPDATE_PLAY_STATE(bool);

let send = channel => {
  switch (channel) {
  | UPDATE_THUMB_BAR(data) => send(remote, "UPDATE_THUMB_BAR", data)
  | UPDATE_PLAY_STATE(isPlaying) =>
    send(remote, "UPDATE_PLAY_STATE", isPlaying)
  };
};

let on = (channel, callback) => on(remote, channel, callback);
let removeListener = (channel, callback) =>
  removeListener(remote, channel, callback);

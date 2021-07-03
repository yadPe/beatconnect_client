let getThumbUrl = beatmapId => {j|https://b.ppy.sh/thumb/$beatmapId.jpg|j};

let getListCoverUrl = beatmapId => {j|https://assets.ppy.sh/beatmaps/$beatmapId/covers/list@2x.jpg|j};

let resolveThumbnail = (beatmapId, osuPath, fallbackUrl) => {
  let localPath =
    "file://"
    ++ osuPath
    ++ "/Data/bt/"
    ++ beatmapId
    ++ "l.jpg"
    |> Js_global.encodeURI
    |> Js_string.replaceByRe([%re "/\\/g/"], "/");

  let thumbanil = Image.make();
  thumbanil->Image.setSrc(localPath);
  thumbanil->Image.decode
  |> Js_promise.then_(() => Js_promise.resolve(localPath))
  |> Js_promise.catch(_ => Js_promise.resolve(fallbackUrl));
};

let resolveThumbURL = (beatmapId, osuPath) =>
  resolveThumbnail(beatmapId, osuPath, getListCoverUrl(beatmapId));

let getBeatmapDifficultyColorHex = (difficulty: float) => {
  switch (difficulty) {
  | difficulty when difficulty >= 6.5 => "#000"
  | difficulty when difficulty >= 5.3 => "#8866ee"
  | difficulty when difficulty >= 4.0 => "#ff66aa"
  | difficulty when difficulty >= 2.7 => "#ffcc22"
  | difficulty when difficulty >= 2.0 => "#66ccff"
  | _ => "#88b300"
  };
};

let getBeatmapDifficultyColorRGBA = (difficulty: float) => {
  switch (difficulty) {
  | difficulty when difficulty >= 6.5 => Css.rgba(0, 0, 0)
  | difficulty when difficulty >= 5.3 => Css.rgba(136, 102, 238)
  | difficulty when difficulty >= 4.0 => Css.rgba(255, 102, 170)
  | difficulty when difficulty >= 2.7 => Css.rgba(255, 204, 34)
  | difficulty when difficulty >= 2.0 => Css.rgba(102, 204, 255)
  | _ => Css.rgba(136, 179, 0)
  };
};

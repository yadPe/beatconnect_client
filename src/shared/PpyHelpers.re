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

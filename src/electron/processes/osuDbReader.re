type callback('a) = (Js.Nullable.t(Js.Exn.t), 'a) => unit;

[@bs.module "fs"]
external readFile: (string, callback(Buffer.t)) => unit = "readFile";
[@bs.module "fs"]
external writeFile: (string, Buffer.t, callback(string)) => unit =
  "writeFile";
[@bs.module "process"] external on: (string, string => unit) => unit = "on";
[@bs.module "process"] external send: string => unit = "send";

let osuDb =
  readFile("/Users/yannis/Downloads/osu!.db", (err, buffer) =>
    switch (Js.Nullable.toOption(err)) {
    | Some(err) => Js.log(err)
    | None => Js.log(OsuDbParser.read(buffer))
    }
  ) /* on("message"*/;

// let handleMessage = (message) =>
// switch (message) {
//   | "start" => "Yep"
//   | _ =>
//   };
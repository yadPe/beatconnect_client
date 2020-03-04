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
  );

// let handleMessage = (message) =>
// switch (message) {
//   | "start" => "Yep"
//   | _ =>
//   };

// on("message")

// TODO Handle incoming messages from main
// Send messages to main
// Handle those messages in main
// Send back datas from main to renderer 
// All of this on reason via shared channel polymorphic variants and JSON converters 
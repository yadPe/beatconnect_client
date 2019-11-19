open Css;

let makeStyle = strokeDashoffset =>
  style([
    transition(~duration=350, "stroke-dashoffset"),
    transform(rotate(deg(-90.))),
    transformOrigin(pct(50.), pct(50.)),
    unsafe("stroke-dashoffset", strokeDashoffset),
  ]);

[@react.component]
[@genType]
let make = (~radius, ~stroke, ~progress, ~color, _children) => {
  let normalizedRadius = radius -. stroke *. 2.;
  let circumference = normalizedRadius *. 2. *. Js.Math._PI;
  let strokeDashoffset =
    (circumference -. progress /. 100. *. circumference)->Js.Float.toString;
  let size = (radius *. 2.)->Js.Float.toString;

  <svg height=size width=size style={ReactDOMRe.Style.make(~margin="0", ())}>
    <circle
      className={makeStyle(strokeDashoffset)}
      stroke="white"
      fill="transparent"
      strokeWidth={stroke->Js.Float.toString}
      strokeDasharray={j|$circumference $circumference|j}
      r={normalizedRadius->Js.Float.toString}
      cx={radius->Js.Float.toString}
      cy={radius->Js.Float.toString}
    />
  </svg>;
};
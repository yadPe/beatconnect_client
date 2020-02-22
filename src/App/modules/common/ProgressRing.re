open Css;

let makeStyle = strokeDashoffset =>
  style([
    transition(~duration=350, "stroke-dashoffset"),
    transform(rotate(deg(-90.))),
    transformOrigin(pct(50.), pct(50.)),
    unsafe("stroke-dashoffset", strokeDashoffset),
  ]);

let floatToString = Js.Float.toString;

[@react.component]
[@genType]
let make = (~radius, ~stroke, ~progress, _children) => {
  let normalizedRadius = radius -. stroke *. 2.;
  let circumference = normalizedRadius *. 2. *. Js.Math._PI;
  let strokeDashoffset =
    (circumference -. progress /. 100. *. circumference)->floatToString;
  let size = (radius *. 2.)->floatToString;

  <svg height=size width=size style={ReactDOMRe.Style.make(~margin="0", ())}>
    <circle
      className={makeStyle(strokeDashoffset)}
      stroke="white"
      fill="transparent"
      strokeWidth={stroke->floatToString}
      strokeDasharray={j|$circumference $circumference|j}
      r={normalizedRadius->floatToString}
      cx={radius->floatToString}
      cy={radius->floatToString}
    />
  </svg>;
};
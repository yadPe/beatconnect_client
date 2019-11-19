open Css;

let makeStyle = () =>
  style([
    transition(~duration=350, "stroke-dashoffset"),
    transform(rotate(deg(-90.))),
    transformOrigin(pct(50.), pct(50.)),
  ]);

[@react.component]
[@genType]
let make = (~radius, ~stroke, ~progress, ~color: string=?, _children) => {
  let normalizedRadius = radius -. stroke *. 2.;
  let circumference = normalizedRadius *. 2. *. Js.Math._PI;
  let strokeDashoffset = circumference -. progress /. 100. *. circumference;

  let size = (radius *. 2.)->Js.Float.toString;

  <svg height=size width=size>
    <circle
      className={makeStyle()}
      // stroke={color ? color : 'white'}
      fill="transparent"
      strokeWidth=stroke
      // strokeDasharray={`${circumference} ${circumference}`}
      style=strokeDashoffset
      r=normalizedRadius
      cx=radius
      cy=radius
    />
  </svg>;
};
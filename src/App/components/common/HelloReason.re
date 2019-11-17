[@react.component]
[@genType]
let make = (~message, _children) => {
  <p> {React.string("Message from ReasonReact " ++ message)} </p>;
};
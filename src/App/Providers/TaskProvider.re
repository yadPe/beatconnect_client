[@bs.deriving {jsConverter: newType}]
type status = [ | `running | `terminated | `error];

type task = {
  name: string,
  mutable description: string,
  mutable status,
  section: Sections.t,
};

type partialTask = {
  name: string,
  description: option(string),
  status: option(status),
};

type value = {
  add: task => unit,
  update: partialTask => unit,
  terminate: string => unit,
  tasks: Js.Array.t(task),
};

module Provider = {
  let value = {
    add: (task: task) => Js.log(task),
    update: (partialTask: partialTask) => Js.log(partialTask),
    terminate: (taskName: string) => Js.log(taskName),
    tasks: [||],
  };
  let taskContext = React.createContext(value);

  let makeProps = (~value, ~children, ()) => {
    "value": value,
    "children": children,
  };

  let make = React.Context.provider(taskContext);
};

let useTasks = () => React.useContext(Provider.taskContext);

[@react.component]
[@genType]
let make = (~children) => {
  let (tasks, setTasks) =
    React.useState(() => [||]: unit => Js.Array.t(task));
  let add = (task: task) =>
    setTasks(oldTasks => Js.Array.concat([|task|], oldTasks));
  let update = (partialTask: partialTask) => {
    let taskIndex =
      Js.Array.findIndex(
        (task: task) => task.name == partialTask.name,
        tasks,
      );
    if (taskIndex != (-1)) {
      let {description, status} = partialTask;
      let tasksRef = tasks;
      switch (description) {
      | Some(description) => tasksRef[taskIndex].description = description
      | None => ()
      };
      switch (status) {
      | Some(status) => tasksRef[taskIndex].status = status
      | None => ()
      };
      setTasks(_oldTasks => tasksRef);
    };
  };
  let terminate = (taskName: string) =>
    setTasks(oldTasks =>
      Js.Array.filter((task: task) => !(task.name == taskName), oldTasks)
    );
  let value = {add, terminate, update, tasks};
  <Provider value> children </Provider>;
};
[@bs.deriving {jsConverter: newType}]
type status = [ | `running | `terminated | `error];

module Task = {
  type t = {
    name: string,
    description: string,
    status,
    section: Sections.t,
  };

  module Setters = {
    let setName = (name, t) => {...t, name};
    let setDescription = (description, t) => {...t, description};
    let setStatus = (status, t) => {...t, status};
    let setSection = (section, t) => {...t, section};
  };
};

type partialTask = {
  name: string,
  description: option(string),
  status: option(status),
};

type value = {
  add: Task.t => unit,
  update: partialTask => unit,
  terminate: string => unit,
  tasks: Js.Array.t(Task.t),
};

module Provider = {
  let value = {
    add: task => Js.log(task),
    update: partialTask => Js.log(partialTask),
    terminate: taskName => Js.log(taskName),
    tasks: [||],
  };
  let taskContext = React.createContext(value);

  let makeProps = (~value, ~children, ()) => {
    "value": value,
    "children": children,
  };

  let make = React.Context.provider(taskContext);

  let updateTaskAt = (index, tasks, task) =>
    Relude.Array.updateAt(index, _ => task, tasks);
};

let useTasks = () => React.useContext(Provider.taskContext);

[@react.component]
[@genType]
let make = (~children) => {
  let (tasks, setTasks) = React.useState(() => [||]);
  let tasksRef = React.useRef(tasks);
  React.useEffect1(
    () => {
      React.Ref.setCurrent(tasksRef, tasks);
      None;
    },
    [|tasks|],
  );
  let add = (task: Task.t) =>
    setTasks(oldTasks => Js.Array.concat([|task|], oldTasks));
  let update = (partialTask: partialTask) => {
    let tasks = React.Ref.current(tasksRef);
    let taskIndex =
      Js.Array.findIndex(
        (task: Task.t) => task.name == partialTask.name,
        tasks,
      );
    if (taskIndex != (-1)) {
      let {description, status} = partialTask;
      switch (description, status) {
      | (Some(description), Some(status)) =>
        setTasks(tasks =>
          tasks[taskIndex]
          |> Task.Setters.setDescription(description)
          |> Task.Setters.setStatus(status)
          |> Provider.updateTaskAt(taskIndex, tasks)
        )
      | (Some(description), None) =>
        setTasks(tasks =>
          tasks[taskIndex]
          |> Task.Setters.setDescription(description)
          |> Provider.updateTaskAt(taskIndex, tasks)
        )
      | (None, Some(status)) =>
        setTasks(tasks =>
          tasks[taskIndex]
          |> Task.Setters.setStatus(status)
          |> Provider.updateTaskAt(taskIndex, tasks)
        )
      | (None, None) => ()
      };
    };
  };
  let terminate = (taskName: string) =>
    setTasks(oldTasks =>
      Js.Array.filter((task: Task.t) => !(task.name == taskName), oldTasks)
    );
  let value = {add, terminate, update, tasks};
  <Provider value> children </Provider>;
};

@deriving({jsConverter: newType})
type status = [#running | #terminated | #error]

module Task = {
  type t = {
    name: string,
    description: string,
    status: status,
    section: Sections.t,
  }

  module Setters = {
    let setName = (t, name) => {...t, name: name}
    let setDescription = (t, description) => {...t, description: description}
    let setStatus = (t, status) => {...t, status: status}
    let setSection = (t, section) => {...t, section: section}
  }
}

type partialTask = {
  name: string,
  description: option<string>,
  status: option<status>,
}

type value = {
  add: Task.t => unit,
  update: partialTask => unit,
  terminate: string => unit,
  tasks: Js.Array.t<Task.t>,
}

module Provider = {
  let value = {
    add: task => Js.log(task),
    update: partialTask => Js.log(partialTask),
    terminate: taskName => Js.log(taskName),
    tasks: [],
  }
  let taskContext = React.createContext(value)

  let makeProps = (~value, ~children, ()) =>
    {
      "value": value,
      "children": children,
    }

  let make = React.Context.provider(taskContext)

  let updateTaskAt = (task, index, tasks) =>
    tasks->Belt.Array.mapWithIndex((i, currentTask) => i === index ? task : currentTask)
}

let useTasks = () => React.useContext(Provider.taskContext)

@react.component
let make = (~children) => {
  let (tasks, setTasks) = React.useState(() => [])
  let tasksRef = React.useRef(tasks)
  React.useEffect1(() => {
    tasksRef.current = tasks
    None
  }, [tasks])
  let add = (task: Task.t) => setTasks(oldTasks => Js.Array.concat([task], oldTasks))
  let update = (partialTask: partialTask) => {
    let tasks = tasksRef.current
    let taskIndex = Js.Array.findIndex((task: Task.t) => task.name == partialTask.name, tasks)
    if taskIndex != -1 {
      let {description, status} = partialTask
      switch (description, status) {
      | (Some(description), Some(status)) =>
        setTasks(tasks =>
          tasks[taskIndex]
          ->Task.Setters.setDescription(description)
          ->Task.Setters.setStatus(status)
          ->Provider.updateTaskAt(taskIndex, tasks)
        )
      | (Some(description), None) =>
        setTasks(tasks =>
          tasks[taskIndex]
          ->Task.Setters.setDescription(description)
          ->Provider.updateTaskAt(taskIndex, tasks)
        )
      | (None, Some(status)) =>
        setTasks(tasks =>
          tasks[taskIndex]->Task.Setters.setStatus(status)->Provider.updateTaskAt(taskIndex, tasks)
        )
      | (None, None) => ()
      }
    }
  }
  let terminate = (taskName: string) =>
    setTasks(oldTasks => Js.Array.filter((task: Task.t) => !(task.name == taskName), oldTasks))
  let value = {add: add, terminate: terminate, update: update, tasks: tasks}
  <Provider value> children </Provider>
}

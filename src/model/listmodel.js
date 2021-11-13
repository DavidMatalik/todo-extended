import { Item } from './itemmodel.js'

class List extends Item {
  constructor (title) {
    super(title)
    this._active = true
    this._tasks = []
  }

  get active () {
    return this._active
  }

  toggleActive () {
    this._active = !this._active
  }

  get tasks () {
    return this._tasks
  }

  addTask(task) {
    this._tasks.push(task)
  }

  deleteTaskById (id) {
    const taskIndex = this._tasks.findIndex(task => {
      return task.id === id
    })

    this._tasks.splice(taskIndex, 1)
  }

  getTasksByStatus (tasks, status) {
    const statusTasks = []
    tasks.forEach(task => {
      if (task.done === status) {
        statusTasks.push(task)
      }
    })
    return statusTasks
  }
}

export { List }

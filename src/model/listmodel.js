import { Item } from './itemmodel.js'

class List extends Item {
  constructor (...args) {
    super(...args)
    this._active = true
    this.tasks = []
  }

  get active () {
    return this._active
  }

  toggleActive () {
    this._active = !this._active
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

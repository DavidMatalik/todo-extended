import { Item } from './itemmodel.js'

class List extends Item {
  constructor (...args) {
    super(...args)
    this.active = true
    this.tasks = []
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

const Item = require('./itemmodel')

class List extends Item {
  constructor (title, active) {
    super(title)
    this.active = active
    this.tasks = []
  }

  getIdsByStatus (tasks, status) {
    const statusTasksIds = []
    tasks.forEach(task => {
      if (task.done === status) {
        statusTasksIds.push(task.id)
      }
    })
    return statusTasksIds
  }
}

module.exports = List

import { tasksViewFactory, itemsCreationView } from './view.js'
import { tasksModelFactory, itemsCreationModel } from '../model/model.js'
import { tasksControllerFactory, itemsCreationController } from '../controller/controller.js'

// Everything for tasks
const initItem = function () {
  const tasksTargetElement = document.getElementById('tasks')
  const tasksTargetButton = document.getElementById('task-add')
  const tasksTargetField = document.getElementById('task-input')
  const initialTasksData = []

  const tasksViewSpecifics = tasksViewFactory(tasksTargetElement, tasksTargetButton, tasksTargetField)
  const tasksCreationView = itemsCreationView('task')
  const tasksView = Object.assign({}, tasksViewSpecifics, tasksCreationView)

  const tasksModelSpecifics = tasksModelFactory()
  const tasksCreationModel = itemsCreationModel(initialTasksData)
  const tasksModel = Object.assign({}, tasksModelSpecifics, tasksCreationModel)

  const tasksControllerSpecifics = tasksControllerFactory()
  const tasksCreationController = itemsCreationController(tasksView, tasksModel)
  const tasksController = Object.assign({}, tasksControllerSpecifics, tasksCreationController)

  tasksController.initialize()
}

const renderDelete = function (id) {
  document.getElementById(id).remove()
}

const bindDelete = function () {}

export { initItem, renderDelete, bindDelete }

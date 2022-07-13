import { listsViewFactory, itemsCreationView } from './view.js'
import { listsModelFactory, itemsCreationModel } from '../model/model.js'
import { listsControllerFactory, itemsCreationController } from '../controller/controller.js'

// Everything for lists
const initList = function () {
  const listsTargetElement = document.getElementById('lists')
  const listsTargetButton = document.getElementById('list-add')
  const listsTargetField = document.getElementById('list-input')
  const initialListsData = []

  const listsViewSpecifics = listsViewFactory(listsTargetElement, listsTargetButton, listsTargetField)
  const listsCreationView = itemsCreationView('list')
  const listsView = Object.assign({}, listsViewSpecifics, listsCreationView)

  const listsModelSpecifics = listsModelFactory()
  const listsCreationModel = itemsCreationModel(initialListsData)
  const listsModel = Object.assign({}, listsModelSpecifics, listsCreationModel)

  const listsControllerSpecifics = listsControllerFactory()
  const listsCreationController = itemsCreationController(listsView, listsModel)
  const listsController = Object.assign({}, listsControllerSpecifics, listsCreationController)

  listsController.initialize()
}

// Future code
const renderList = function (listName) {
  // not implemented yet

  const listsTargetElement = document.getElementById('lists')

  const p = document.createElement('p')
  const deleteButton = document.createElement('button')

  deleteButton.innerHTML = 'del'
  deleteButton.classList.add('delete-button')

  p.innerHTML = listName
  p.appendChild(deleteButton)

  listsTargetElement.appendChild(p)
}

export { initList, renderList }

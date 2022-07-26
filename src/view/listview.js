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
const renderList = function (id, text) {
  // not implemented yet

  // // sample code
  // const listsTargetElement = document.getElementById('lists')

  // const div = document.createElement('div')
  // const deleteButton = document.createElement('button')

  // deleteButton.innerHTML = 'del'
  // deleteButton.classList.add('delete-button')

  // div.id = id
  // div.innerHTML = text
  // div.appendChild(deleteButton)

  // listsTargetElement.appendChild(div)
}

const renderHighlight = function (id) {

}

export { initList, renderList, renderHighlight }

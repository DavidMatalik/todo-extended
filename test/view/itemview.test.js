import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import { JSDOM } from 'jsdom'
import { describe, it, xit, beforeEach } from 'mocha'
import fs from 'fs'

import { renderDelete, bindDelete } from '../../src/view/itemview.js'

chai.use(chaiDom)

beforeEach(() => {
  const html = fs.readFileSync('./dist/index.html')
  const dom = new JSDOM(html)
  global.window = dom.window
  global.document = dom.window.document
})

const createListDummy = function (id, text) {
  // sample code
  const listsTargetElement = document.getElementById('lists')

  const p = document.createElement('p')
  p.id = id
  p.innerHTML = text

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = 'del'
  deleteButton.classList.add('delete-button')

  p.appendChild(deleteButton)
  const p1 = document.createElement('p')
  listsTargetElement.appendChild(p)
  listsTargetElement.appendChild(p1)
}

const createTaskDummy = (id, text) => {
  // Our real task has probably a more complex structure, adjust this when needed
  const task = document.createElement('p')
  task.id = id
  task.innerHTML = text

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  task.appendChild(checkbox)

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = 'del'
  deleteButton.classList.add('delete-button')

  task.appendChild(deleteButton)

  const listsTargetElement = document.getElementById('tasks')
  listsTargetElement.appendChild(task)
}

describe('item view tests', () => {
  describe('edit item tests', () => {
    xit('should edit the item element after double click on the item element', () => {

    })
  })

  describe('delete item tests', () => {
    it('should delete list element after click on delete list button', () => {
      const lists = document.querySelector('#lists')
      const listName = 'my new List'
      const listId = 'x123'
      createListDummy(listId, listName)
      expect(lists.querySelector('#x123')).to.exist
      renderDelete('x123')
      expect(lists.querySelector('#x123')).not.to.exist
    })
    it('should delete task element after click on delete task button', () => {
      const taskName = 'my new Task'
      const taskId = 't123'
      createTaskDummy(taskId, taskName)
      expect(document.querySelector('#tasks')).to.contain('p')
      renderDelete('t123')
      expect(document.querySelector('#tasks')).not.to.contain('p')
    })
  })

  describe('Bind delete item tests', () => {
    xit('should add an event listener to list delete button', () => {
      const listId = 'xy123'
      const listText = 'Some text'
      createListDummy(listId, listText)

      const list1 = document.querySelector('#xy123')
      const delBtn = list1.querySelector('button')

      let eventCallbackExecuted = false

      const eventCallbackDummy = () => {
        eventCallbackExecuted = true
      }
      const handleDeleteDummy = () => {}

      bindDelete(handleDeleteDummy, eventCallbackDummy)

      expect(eventCallbackExecuted).to.equal(false)

      delBtn.click()

      expect(eventCallbackExecuted).to.equal(true)
    })
    xit('should add an event listener to task delete button', () => {
      const taskId = 'xy123'
      const taskText = 'Some text'
      createListDummy(taskId, taskText)

      const task1 = document.querySelector('#xy123')
      const delBtn = task1.querySelector('button')

      let eventCallbackExecuted = false

      const eventCallbackDummy = () => {
        eventCallbackExecuted = true
      }
      const handleDeleteDummy = () => {}

      bindDelete(handleDeleteDummy, eventCallbackDummy)

      expect(eventCallbackExecuted).to.equal(false)

      delBtn.click()

      expect(eventCallbackExecuted).to.equal(true)
    })
  })
})

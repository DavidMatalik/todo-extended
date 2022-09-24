import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { beforeEach, describe, xit } from 'mocha'

import { bindDone, renderDone, renderTask } from '../../src/view/taskview.js'

chai.use(chaiDom)

beforeEach(() => {
  const html = fs.readFileSync('./dist/index.html')
  const dom = new JSDOM(html)
  global.window = dom.window
  global.document = dom.window.document
})

const createTaskDummy = (id, text) => {
  // Our real task has probably a more complex structure, adjust this when needed
  const task = document.createElement('div')
  task.id = id

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  task.appendChild(checkbox)

  const listsTargetElement = document.getElementById('tasks')
  listsTargetElement.appendChild(task)
}

describe('task view tests', () => {
  xit('should render a task with input text, delete button and checkbox', () => {
    const taskName = 'my new Task'
    const taskId = 'x123'
    renderTask(taskId, taskName)

    expect(document.querySelector('#tasks')).to.contain('div')
    expect(document.querySelector('#x123')).to.contain.text('my new Task')
    expect(document.querySelector('#x123')).to.contain('button')
    expect(document.querySelector('#x123')).to.contain('input')
  })

  describe('renderDone tests', () => {
    xit('should mark a task as done', () => {
      const taskId = 'xy'
      const taskText = 'Some text'
      createTaskDummy(taskId, taskText)

      const doneTask = document.querySelector('#xy')
      const doneTaskCheckbox = doneTask.querySelector('input')

      expect(doneTask.style.textDecoration).to.equal('')
      expect(doneTaskCheckbox.checked).to.equal(false)

      renderDone(taskId)

      expect(doneTask.style.textDecoration).to.equal('line-through')
      expect(doneTaskCheckbox.checked).to.equal(true)
    })
  })

  describe('bindDone tests', () => {
    xit('should add an event listener to task checkbox', () => {
      const taskId = 'xy'
      const taskText = 'Some text'
      createTaskDummy(taskId, taskText)

      const task = document.querySelector('#xy')
      const doneTaskCheckbox = task.querySelector('input')
      let eventCallbackExecuted = false
      const eventCallbackDummy = () => {
        eventCallbackExecuted = true
      }
      const handleDoneDummy = () => {}

      bindDone(handleDoneDummy, eventCallbackDummy)

      expect(eventCallbackExecuted).to.equal(false)

      doneTaskCheckbox.click()

      expect(eventCallbackExecuted).to.equal(true)
    })
  })
})

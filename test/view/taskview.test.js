import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { beforeEach, describe, it, xit } from 'mocha'

import { bindDone, renderDone } from '../../src/view/taskview.js'

chai.use(chaiDom)

beforeEach(() => {
  const html = fs.readFileSync('./dist/index.html')
  const dom = new JSDOM(html)
  global.window = dom.window
  global.document = dom.window.document
  global.getEventListeners = dom.window.getEventListeners
})

const createTaskDummy = (id) => {
  // Our real task has probably a more complex structure, adjust this when needed
  const task = document.createElement('div')
  task.dataset.id = id

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  task.appendChild(checkbox)

  const listsTargetElement = document.getElementById('tasks')
  listsTargetElement.appendChild(task)
}

describe('task view tests', () => {
  describe('renderDone tests', () => {
    xit('should be able to mark a task as done', () => {
      const taskId = '123'
      createTaskDummy(taskId)

      const doneTask = document.querySelector(`[data-id='${taskId}']`)
      const doneTaskCheckbox = doneTask.querySelector('input')

      expect(doneTask.style.textDecoration).to.equal('')
      expect(doneTaskCheckbox.checked).to.equal(false)

      renderDone(taskId)

      expect(doneTask.style.textDecoration).to.equal('line-through')
      expect(doneTaskCheckbox.checked).to.equal(true)
    })
  })

  describe('bindDone tests', () => {
    it('should be able to add an event listener to task checkbox', () => {
      const taskId = '123'
      createTaskDummy(taskId)

      const task = document.querySelector(`[data-id='${taskId}']`)
      const doneTaskCheckbox = task.querySelector('input')
      let eventCallbackExecuted = false
      const eventCallbackDummy = () => {
        eventCallbackExecuted = true
      }
      const handleDoneDummy = () => {}

      bindDone(handleDoneDummy, eventCallbackDummy)
      doneTaskCheckbox.click()

      expect(eventCallbackExecuted).to.equal(true)
    })
  })
})

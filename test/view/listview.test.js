
import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import { JSDOM } from 'jsdom'
import { describe, it, xit, beforeEach } from 'mocha'
import fs from 'fs'

import { renderList, renderHighlight, bindHighlight } from '../../src/view/listview.js'

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
  listsTargetElement.appendChild(p)
}

describe('list view tests', () => {
  describe('render list tests', () => {
    xit('should render a list with input text and delete button after click of add button', () => {
      const listName = 'my new List'
      const id = 'x123'
      renderList(id, listName)
      // ToDo: more tests with chai-dom chained syntax
      // expect(document.querySelector('#lists')).to.contain('div').to.have.id('x123').to.have.text('my new List')
      // expect(document.querySelector('#lists')).to.contain('div').to.contain('button')
      expect(document.querySelector('#lists')).to.contain('div')
      expect(document.querySelector('#x123')).to.contain.text('my new List')
      expect(document.querySelector('#x123')).to.contain('button')
    })

    xit('should highlight the list element', () => {
      const listName = 'my new List'
      const listId = 'x123'
      createListDummy(listId, listName)
      expect(document.querySelector('#x123')).to.have.style('background-color', '')
      renderHighlight(listId)
      expect(document.querySelector('#x123')).to.have.style('background-color', 'aqua')
    })

    xit('should add an event listener to the list element', () => {
      const listName = 'my new List'
      const listId = 'x123'
      createListDummy(listId, listName)

      const list = document.querySelector('#x123')
      let eventCallbackExecuted = false
      const eventCallbackDummy = () => {
        eventCallbackExecuted = true
      }

      const handleHighlightDummy = () => {}

      bindHighlight(handleHighlightDummy, eventCallbackDummy)

      expect(eventCallbackExecuted).to.equal(false)

      list.click()

      expect(eventCallbackExecuted).to.equal(true)
    })
  })
})

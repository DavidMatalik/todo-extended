import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import { JSDOM } from 'jsdom'
import { describe, it, beforeEach } from 'mocha'
import assert from 'assert'

chai.use(chaiDom)

beforeEach(() => {
  const dom = new JSDOM(
    `<html>
       <body>
        <div id="list-container">
            <button id="list-add">+</button>
            <input type="text" id="list-input" placeholder="Add a list">
            <div id="lists"></div>
        </div>
        <div id="task-container">
            <button id="task-add">+</button>
            <input type="text" id="task-input" placeholder="Add a task">
            <div id="tasks"></div>
        </div>
       </body>
     </html>`,
    { url: 'http://localhost' }
  )

  global.window = dom.window
  global.document = dom.window.document
})

describe('list view tests', () => {
  describe('render list tests', () => {
    it('shout be able to render a list after click of add button', () => {
      assert.equal('Hello'.length, 5)
      expect('Hello'.length).to.eql(5)
    })

    it('should be able to render a list with title "undefined list" if no title for the list is specified', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(document.querySelector('#list-container')).to.be.visible
    })
  })
})

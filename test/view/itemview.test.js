import chai, { expect } from 'chai'
import chaiDom from 'chai-dom'
import { JSDOM } from 'jsdom'
import { describe, it, xit, beforeEach } from 'mocha'
import fs from 'fs'

chai.use(chaiDom)

beforeEach(() => {
  const html = fs.readFileSync('./dist/index.html')
  const dom = new JSDOM(html)
  global.window = dom.window
  global.document = dom.window.document
})

describe('item view tests', () => {
  describe('edit list tests', () => {
    xit('should be able to edit the list element after double click on the list element', () => {

    })
  })

  describe('delete list tests', () => {
    xit('should be delete list element after click on delete list button', () => {

    })
  })
})

const Task = require('..src/Model/taskmodel')
const assert = require('assert')

describe('task tests', function () {
  describe('done tests', function () {
    it('should be able to get done', function () {
      const task1 = new Task('task1-title')
      assert.strictEqual(task1.done, false)
    })

    it('should be able to set done', function () {
      const task1 = new Task('task1-title')
      task1.toggleDone()
      assert.strictEqual(task1.done, true)
    })
  })
})

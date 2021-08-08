import { List } from '../src/Model/listmodel.js'
import { describe, it } from 'mocha'
import assert from 'assert'

describe('list tests', function () {
  describe('id tests', function () {
    it('should be able to get tasks by status', function () {
      const task1 = { title: 'task1', id: 'ca55c127-89ff-49b1-a062-5b2e46bb318e', done: true }
      const task2 = { title: 'task2', id: '85ec70e0-7184-4e7d-936a-67b16a9836bf', done: false }
      const task3 = { title: 'task3', id: 'eedb4619-5474-4356-b26d-bb95c11fa85f', done: false }
      const task4 = { title: 'task4', id: '875b6011-ec60-4488-9806-d304f66d3e44', done: true }
      const list1 = [task1, task2, task3, task4]
      const list = new List('MyNewList')
      const tasks = list.getTasksByStatus(list1, true)
      assert.deepStrictEqual(tasks, [{ title: 'task1', id: 'ca55c127-89ff-49b1-a062-5b2e46bb318e', done: true },
        { title: 'task4', id: '875b6011-ec60-4488-9806-d304f66d3e44', done: true }])
    })
  })
  describe('active tests', function () {
    it('should be able to get active value', function () {
      const list1 = new List('list1')
      assert.strictEqual(list1.active, true)
    })
    it('should be able to set active to false', function () {
      const list1 = new List('list1')
      list1.toggleActive()
      assert.strictEqual(list1.active, false)
    })
  })
})

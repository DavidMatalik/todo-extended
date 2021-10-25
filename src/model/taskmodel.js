import { Item } from './itemmodel.js'

class Task extends Item {
  constructor(title) {
    super(title)
    this._done = false
  }

  get done() {
    return this._done
  }

  toggleDone() {
    this._done = !this._done
  }
}

export { Task }

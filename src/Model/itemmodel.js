const { v4: uuidv4 } = require('uuid')

class Item {
  // Generate id by id generator
  // 1: https://github.com/uuidjs/uuid
  // 2: https://gist.github.com/mikelehen/3596a30bd69384624c11
  // 3: https://firebase.google.com/docs/database/admin/save-data#getting-the-unique-key-generated-by-push
  constructor (title) {
    // https://stackoverflow.com/questions/54562790/cannot-set-property-which-only-has-getter-javascript-es6
    this._title = title
    this._id = uuidv4()
  }

  get title () {
    return this._title
  }

  get id () {
    return this._id
  }
}

module.exports = Item

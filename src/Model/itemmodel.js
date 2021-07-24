const { v4: uuidv4 } = require('uuid')

class Item {
  // Generate id by id generator
  // 1: https://github.com/uuidjs/uuid
  // 2: https://gist.github.com/mikelehen/3596a30bd69384624c11
  // 3: https://firebase.google.com/docs/database/admin/save-data#getting-the-unique-key-generated-by-push
  constructor (title) {
    this.title = title
    this.id = uuidv4()
  }

  get getTitle () {
    return this.title
  }

  get getId () {
    return this.id
  }
}

module.exports = Item

import { ref, set, remove } from 'firebase/database'

/**
 * Add user to firebase database
 * @param {Firebase database} database
 * @param {Id of the user} userId
 * @param {Name of the user} name
 * @param {E-Mail of the user} email
 * @param {Url to profile pictore of the user} imageUrl
 */
const writeUserData = function (database, userId, name, email, imageUrl) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl
  })
}

/**
 * Delete the user account in the firebase database and the firebase user authentication.
 * @param {Firebase instance} firebase
 * @param {Firebase database} database
 */
const deleteAccount = function (firebase, database) {
  const user = firebase.auth().currentUser
  // delete user in database
  remove(ref(database, 'users/' + user.uid)).then(function (error) {
    if (error) {
      console.log(error.message)
    } else {
      // delete firebase user authentication
      firebase
        .auth()
        .currentUser.delete()
        .catch(function (error) {
          if (error.code == 'auth/requires-recent-login') {
            // The user's credential is too old. She needs to sign in again.
            firebase
              .auth()
              .signOut()
              .then(function () {
                // The timeout allows the message to be displayed after the UI has
                // changed to the signed out state.
                setTimeout(function () {
                  alert('Please sign in again to delete your account.')
                }, 1)
              })
          }
        })
      alert('Your account was successfully deleted.')
    }
  })
}

export { writeUserData, deleteAccount }

// using ES6 imports:
// full qualified path for webpack esm style
import { firebaseConfig, firebaseUiConfig } from '../auth/config.js'
import { getDatabase } from 'firebase/database'

import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { handleSignedInUser, handleSignedOutUser } from './view/userview.js'
import { deleteAccount } from './model/userdbmapper.js'

// Firebase v9 compat (we use this until firebaseui is fully compatible with v9)
import firebase from 'firebase/compat/app'
// ToDo: check if we need this
import 'firebase/compat/auth'

// #region Firebase UI Part
// Initialize the FirebaseUI Widget using Firebase.
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseUi = new firebaseui.auth.AuthUI(firebaseApp.auth())
const firebaseDatabase = getDatabase(firebaseApp)

// Initializes the app.
const initApp = function () {
  document.getElementById('sign-out').addEventListener('click', function () {
    firebase.auth().signOut()
  })

  document.getElementById('delete-account').addEventListener('click', function () {
    deleteAccount(firebase, firebaseDatabase)
  })
}
window.addEventListener('load', initApp)

// The start method will wait until the DOM is loaded.
firebaseUi.start('#firebaseui-auth-container', firebaseUiConfig)

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function (user) {
  document.getElementById('loader').style.display = 'none'
  user ? handleSignedInUser(user) : handleSignedOutUser(firebaseUi, firebaseUiConfig)
})
//#endregion

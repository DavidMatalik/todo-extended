import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { handleSignedInUser } from '../src/view/userview.js'
import { writeUserData } from '../src/model/userdbmapper.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCGGMhr7m0KCFIM0ZgJOASzE1d2CF3KXJ8',
  authDomain: 'todo-extended.firebaseapp.com',
  databaseURL: 'https://todo-extended-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'todo-extended',
  storageBucket: 'todo-extended.appspot.com',
  messagingSenderId: '462240940597',
  appId: '1:462240940597:web:abbd267b519e7284b7277c'
}

// Firebase UI configuration
const firebaseUiConfig =
{
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      if (authResult.user) {
        handleSignedInUser(authResult.user)
      }

      writeUserData(firebaseDatabase, authResult.user.uid, authResult.user.displayName, authResult.user.email, null)
      document.getElementById('container').removeAttribute('hidden')
      // Do not redirect.
      return false
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none'
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  // signInSuccessUrl: 'https://todo-extended.web.app/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
}

export { firebaseConfig, firebaseUiConfig }

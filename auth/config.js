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

// this is a working example of lazy loading firebase
export async function getFirebaseClient () {
  const { default: firebase } = await import('firebase/app')

  await Promise.all([
    import('firebase/auth'),
    import('firebase/database'),
    import('firebaseui'),
    import('firebaseui/dist/firebaseui.css')
  ])

  firebase.initializeApp(firebaseConfig)

  return firebase
}

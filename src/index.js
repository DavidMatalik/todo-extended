// using ES6 imports:
// full qualified path for webpack esm style
import { getFirebaseClient } from '../auth/config.js'
import { tasksViewFactory, listsViewFactory, itemsCreationView } from './view/view.js'
import { tasksModelFactory, listsModelFactory, itemsCreationModel } from './model/model.js'
import { tasksControllerFactory, listsControllerFactory, itemsCreationController } from './controller/controller.js'

// Shortcuts to DOM Elements.
var containerElement = document.getElementById('container');

// Small Firebase Test
// Lazy load firebase
// this is not working => ToDo: we need to know why
// const firebase = async () => { await getFirebaseClient() }
// console.log(firebase)
// ToDo: We need a better approach
const firebase = await getFirebaseClient()

// Initialize the FirebaseUI Widget using Firebase.
// eslint-disable-next-line no-undef
const ui = new firebaseui.auth.AuthUI(firebase.auth())

const uiConfig =
{
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      if (authResult.user) 
      {
        handleSignedInUser(authResult.user);
      }  

      writeUserData(authResult.user.uid, authResult.user.displayName, authResult.user.email, null)
      containerElement.removeAttribute('hidden')
      // Do not redirect.
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none'
      console.log('uiShown')
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  // signInSuccessUrl: 'https://todo-extended.web.app/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
}

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig)

function writeUserData (userId, name, email, imageUrl) 
{
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  })
}

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) 
{
  containerElement.style.display = 'block';
  document.getElementById('firebaseui-auth-container').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;

  if (user.photoURL) 
  {
    var photoURL = user.photoURL;
    // Append size to the photo URL for Google hosted images to avoid requesting
    // the image with its original resolution (using more bandwidth than needed)
    // when it is going to be presented in smaller size.
    if ((photoURL.indexOf('googleusercontent.com') != -1) ||
        (photoURL.indexOf('ggpht.com') != -1)) 
    {
      photoURL = photoURL + '?sz=' + document.getElementById('photo').clientHeight;
    }
    document.getElementById('photo').src = photoURL;
    document.getElementById('photo').style.display = 'block';
  } 
  else 
  {
    document.getElementById('photo').style.display = 'none';
  }
}

/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() 
{
  containerElement.style.display = 'none';
  document.getElementById('firebaseui-auth-container').style.display = 'block';
  ui.start('#firebaseui-auth-container', uiConfig)
};
  
// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) 
{
  document.getElementById('loader').style.display = 'none';
  // document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
var deleteAccount = function() 
{
  var user = firebase.auth().currentUser;
  // delete user in database
  firebase.database().ref('users/' + user.uid).remove().then(function(error)
  {
    if (error)
    {
      console.log(error.message)
    }
    else
    {
      // delete firebase user authentication
      firebase.auth().currentUser.delete().catch(function(error) 
      {
        if (error.code == 'auth/requires-recent-login') 
        {
          // The user's credential is too old. She needs to sign in again.
          firebase.auth().signOut().then(function() {
            // The timeout allows the message to be displayed after the UI has
            // changed to the signed out state.
            setTimeout(function() 
            {
              alert('Please sign in again to delete your account.')
            }, 1);
          });
        }
      });
      alert('Your account was successfully deleted.')
    }
  });   
};

// Everything for tasks
const tasksTargetElement = document.getElementById('tasks')
const tasksTargetButton = document.getElementById('task-add')
const tasksTargetField = document.getElementById('task-input')
const initialTasksData = []

const tasksViewSpecifics = tasksViewFactory(tasksTargetElement, tasksTargetButton, tasksTargetField)
const tasksCreationView = itemsCreationView('task')
const tasksView = Object.assign({}, tasksViewSpecifics, tasksCreationView)

const tasksModelSpecifics = tasksModelFactory()
const tasksCreationModel = itemsCreationModel(initialTasksData)
const tasksModel = Object.assign({}, tasksModelSpecifics, tasksCreationModel)

const tasksControllerSpecifics = tasksControllerFactory()
const tasksCreationController = itemsCreationController(tasksView, tasksModel)
const tasksController = Object.assign({}, tasksControllerSpecifics, tasksCreationController)

tasksController.initialize()

// Everything for lists
const listsTargetElement = document.getElementById('lists')
const listsTargetButton = document.getElementById('list-add')
const listsTargetField = document.getElementById('list-input')
const initialListsData = []

const listsViewSpecifics = listsViewFactory(listsTargetElement, listsTargetButton, listsTargetField)
const listsCreationView = itemsCreationView('list')
const listsView = Object.assign({}, listsViewSpecifics, listsCreationView)

const listsModelSpecifics = listsModelFactory()
const listsCreationModel = itemsCreationModel(initialListsData)
const listsModel = Object.assign({}, listsModelSpecifics, listsCreationModel)

const listsControllerSpecifics = listsControllerFactory()
const listsCreationController = itemsCreationController(listsView, listsModel)
const listsController = Object.assign({}, listsControllerSpecifics, listsCreationController)

listsController.initialize()


/**
 * Initializes the app.
 */
var initApp = function() {
    document.getElementById('sign-out').addEventListener('click', function() 
    {
      firebase.auth().signOut();
    });

    document.getElementById('delete-account').addEventListener('click', function() 
    {
       deleteAccount();
    });
}
window.addEventListener('load', initApp);

/* logic of todo app

1. Describe in your own words what this app should look like and do

    - Look and Feel:
        Top      - task input field with add button
            Later: search field
        Mid      -tasks with delete button
            Headline with current Listname and editButton/deleteButton
        Right    - clicked task
            TaskName editable
            TaskNotes editable
            Later: change to Project button
        Left     - lists container
            List input field with add button
            Current list highlighted

    - Start screen:
        Defaults to Inbox list

    - Do:

        Create task after user entered one and pressed on add
        Delete task after user clicked on delete of one task
        Show task in Detail on the right side after user clicked on it
            Make taskName editable after user clicked on it
            Make taskNote editable after user clicked on it
        Move task around when user clicks on it and holds click
            Show visual help where task would go
            Place task when user doesn't hold click anymore

        Create list after user entered one and pressed on add
        Make listName editable after user clicked on editButton
            Rename listName after user pressed enter
        Check after user clicked on deleteButton: tasks in this list?
            If yes ask user if really delete it with all containing tasks
                If yes delete list with all containing taks
                If no forget about delete wish of user
            If no delete list

        Later: keep the deleted tasks of the last 3 days in a deletedlist
        --> User can somehow undo deletion

2. Algorithm: Plan how to realize your app - describe code in plain english

- index.js for initializing and connecting everything
        import functions from domStuff
        import functions from todoController
        call renderStartpage
        create

- Module for taskModel
    attr: taskID
    attr: taskName
    attr: taskNote

    func: setTaskID --> automatically when task is created
    func: getTaskID
    func: setTaskName
    func: getTaskName
    func: setTaskNote
    func: getTaskNote
    func: deleteTask

    - Module for taskView, inject: htmlContainer
    attr: onClickRenderDetails = null;

    - Module for taskController

PenguinView.prototype.render = function render(viewModel) {
  this.element.innerHTML = '<h3>' + viewModel.name + '</h3>' +
    '<img class="penguin-image" src="' + viewModel.imageUrl +
      '" alt="' + viewModel.name + '" />' +
    '<p><b>Size:</b> ' + viewModel.size + '</p>' +
    '<p><b>Favorite food:</b> ' + viewModel.favoriteFood + '</p>' +
    '<a id="previousPenguin" class="previous button" href="javascript:void(0);"' +
      ' data-penguin-index="' + viewModel.previousIndex + '">Previous</a> ' +
    '<a id="nextPenguin" class="next button" href="javascript:void(0);"' +
      ' data-penguin-index="' + viewModel.nextIndex + '">Next</a>';

  ??this.previousIndex = viewModel.previousIndex;
  ??this.nextIndex = viewModel.nextIndex;

  var previousPenguin = this.element.querySelector('#previousPenguin');
  previousPenguin.addEventListener('click', this.onClickGetPenguin);
};

var TasksView = function TasksView(htmlElement) {
    this.htmlElement = htmlElement;
    this.onClickAddTask = null;
}

TasksView.prototype.render = function render(viewModel) {
    this.htmlElement = viewModel.forEach(renderOneTask);

    function renderOneTask(task) {
        `<p> ${task}</p>`
    }

    var addTask = this.htmlElement.querySelector('#addTask');
    addTask.addEventListener('click', this.onClickAddTask);
}

var tasksTargetElement = document.getElementById('taskContainer');

var taskView = new TasksView(tasksTargetElement);

taskView.onClickAddTask

var testModel = ['dfdsfsdfsdf', '23432423432df'];

taskView.render(testModel);

2. Algorithm: Plan how to realize your app - describe code in plain english

    - index.js for initializing and connecting everything
        import functions from domStuff
        import functions from todoController
        call renderStartpage
        create

    - Module for taskFactory
        attr: taskID
        attr: taskName
        attr: taskNote

        func: setTaskID --> automatically when task is created
        func: getTaskID
        func: setTaskName
        func: getTaskName
        func: setTaskNote
        func: getTaskNote
        func: deleteTask

    - Module for listFactory
        attr: lListID
        attr: listName
        attr: assignedTasks(array or object?)

        func: addTask
        func: removeTask
        func: changeOrderAssigendTasks(task, new place)
        func: setListID
        func: getListID
        func: setListName
        func: getListName
        func: deletelist

    - Module for renderStartUI
        attr: assignedTasksToList (to all created lists? Or only active one?)
        func: renderStartPage
                call renderListTabs
                call renderActiveListTasks(inbox)
                call highlightActiveListTab
                call initListeners
        func: renderListTabs
        func: renderActiveListTasks(activeList)
        func: highlightActiveListTab

        func: initListeners
            call addListenerToLists
            call
            call
        func: listenToLists        --> call renderAsignedTasks
                                   --> call highlightActiveListTab
        func: listenToOneTask(cl)  --> call renderTaskDetails
        func: listenToOneTaks(clh) --> call moveTask
            to active task
                taskName input field + enter --> changeTaskName
                taskNote input field + enter --> changeTaskNote
        func: listenToListDelete   --> call validateListDelete from TodoController
        func: listenToListEdit     --> call validateListEdit from TodoController
        func: listenToAllTasks     --> call listenToOneTask(cl)
                                   --> call listenToOneTaks(clh)
        func: listenToTaskDelete   --> call deleteTask(task) from todoController
        func: renderTaskDetails(task)
        func: addTasktoView --> display this task next to the already displayed tasks
        func: deleteTaskfromView --> possible without rendering all other tasks?
                                 --> delete task from assignedTaskstoList
        func: moveTaskInList --> change assigned tasks order in temporarily generated array
                                 render the tasks appropriately (rendering all new needed?)

    - Module for todoController

        func: addTask         --> create new task object with taskFactory
                              --> call addTasktoView from domStuff
                              --> put reference to created task into the right list
                              (--> call storeTask from taskStorage)

        func: deleteTask(task)--> delete task object
                              --> call deleteTaskfromView from domStuff
                              --> call deleteTask from right list
                              (--> call deleteTask from taskStorage)

        func: moveTask        --> if inside: call moveTaskinList from domStuff
                                             call list.changeOrderAssignedTasks

                              --> if outside: call newList.addTask
                                              call oldList.deleteTask

        func: addList         --> create new list object with listFactory
        func: list.delete
        func: validateListDelete
        func: validateListEdit

    - At the end: Module for taskStorage

        attr: allTasks (also with reference to the list? Maybe for performance?)
        func: deleteTask (later: put into attr deletedTask for 3 days)
        func: storeTask
        func: getAllTasks

3. Divide your plan further and code

    Kommt das ganze validation Zeugs als best practice in die setter der objects rein?
    Von meinem Verständnis her ja --> Also validation methods oben entsprechend abändern/verschieben.

    - Validate: is there a taskName or listName entered?

    Falls ich assigendTasks mit object löse --> Reihenfolge fürs Rendern?
    Wie die Reihe ist? Oder noch extra attribute wie z.B. Nummer/platz hinzufügen?

*/

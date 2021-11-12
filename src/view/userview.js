/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
 const handleSignedInUser = function(user) 
 {
   document.getElementById('container').style.display = 'block';
   document.getElementById('firebaseui-auth-container').style.display = 'none';
   document.getElementById('name').textContent = user.displayName;
   document.getElementById('email').textContent = user.email;
   document.getElementById('phone').textContent = user.phoneNumber;
 
   if (user.photoURL) 
   {
     let photoURL = user.photoURL;
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
 const handleSignedOutUser = function(firebaseUi, firebaseUiConfig) 
 {
   document.getElementById('container').style.display = 'none';
   document.getElementById('firebaseui-auth-container').style.display = 'block';
   firebaseUi.start('#firebaseui-auth-container', firebaseUiConfig)
   // ToDo: clean up work: delete user information in DOM
 };

 export { handleSignedInUser, handleSignedOutUser }
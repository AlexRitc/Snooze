"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg"); 
const $allStoriesList = $("#all-stories-list"); 

const $loginForm = $("#login-form"); 
const $signupForm = $("#signup-form"); 

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile"); 
const $navLogOut = $("#nav-logout");
function hidePageComponents() {
  const components = [
    $allStoriesList, //list of all stories
    $loginForm, // login form
    $signupForm, // signup form
  ];
  components.forEach(c => c.hide());
}

// The start function that initializes the application
async function start() {
  await checkForRememberedUser(); // Checks if there is a saved user
  await getAndShowStoriesOnStart(); // Retrieves and displays the stories when the application starts

  if (currentUser) updateUIOnUserLogin(); // Updates the UI if there is a logged-in user
}

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");

$(start); 


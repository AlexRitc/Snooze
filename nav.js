"use strict";

const $navSubmit = $("#nav-submit");

function navAllStories(evt) {
  hidePageComponents(); 
  putStoriesOnPage(); 
}

$body.on("click", "#nav-all", navAllStories);

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show(); // Bring up the login form
  $signupForm.show(); // Bring up the signup form
}

$navLogin.on("click", navLoginClick); // When "Login" gets clicked, do navLoginClick

function updateNavOnLogin() {
  $(".main-nav-links").show(); // Bring up main nav links
  $navLogin.hide(); // Get rid of "Login"
  $navLogOut.show(); // Bring up "Logout"
  $navSubmit.show(); // Bring up "Submit"
  $navUserProfile.text(`${currentUser.username}`).show(); // Show the user's name
}

// This is for when "Submit" gets clicked
function navSubmitClick(evt) {
  hidePageComponents(); // Get rid of stuff on the page
  $newStoryForm.show(); // Bring up the new story form
}

$navSubmit.on("click", navSubmitClick); // When "Submit" gets clicked, do navSubmitClick

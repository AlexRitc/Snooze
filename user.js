async function login(evt) {
  evt.preventDefault(); 
  const username = $("#login-username").val(); 
  const password = $("#login-password").val(); 
  currentUser = await User.login(username, password); 
  $loginForm.trigger("reset"); // Clears form
  saveUserCredentialsInLocalStorage(); // Remember the user
  updateUIOnUserLogin(); // Changes stuff in the user interface after login
}

$loginForm.on("submit", login); 

async function signup(evt) {
  evt.preventDefault(); // Stop the form from restarting/refrshing
  const name = $("#signup-name").val(); 
  const username = $("#signup-username").val(); 
  const password = $("#signup-password").val(); 
  currentUser = await User.signup(username, password, name); // Sign the user up
  saveUserCredentialsInLocalStorage(); // Remember the users info
  updateUIOnUserLogin();
  $signupForm.trigger("reset"); // clears the form
}

$signupForm.on("submit", signup);

// This function is for when the logout button is clicked
function logout(evt) {
  localStorage.clear(); // Forgets the user
  location.reload(); // Refreshes the page
}

$navLogOut.on("click", logout); // When the logout button gets clicked, do logout

// This function checks if we remember a user and logs them in
async function checkForRememberedUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;
  currentUser = await User.loginViaStoredCredentials(token, username);
}

// This function remembers a user
function saveUserCredentialsInLocalStorage() {
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken); // Remembersthe token
    localStorage.setItem("username", currentUser.username); // Remembers the username
  }
}

function updateUIOnUserLogin() {
  $allStoriesList.show(); // show the list of stories
  updateNavOnLogin(); // Upates the nav after login
}

const $navSubmitStory = $("#nav-submit-story");

function toggleStoryForm() {
  $submitStoryForm.toggle(); // Show or hide the story form
}

$navSubmitStory.on("click", toggleStoryForm);

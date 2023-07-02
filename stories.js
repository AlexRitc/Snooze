"use strict";

let storyList;

// Function to fetch and display stories when the page initializes
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories(); // Retrieve all stories
  $storiesLoadingMsg.remove(); // Erase the loading alert
  putStoriesOnPage(); // Populate the page with stories
}

// function for favorite stories
function handleFavoriteClick(story) {
  if (currentUser) { // Checking if a user is present
    if (currentUser.isFavorite(story)) {
      currentUser.removeFavorite(story); // remove from favorites
    } else {
      currentUser.addFavorite(story); // make favorite
    }
    putStoriesOnPage(); //refreshes stories with favorites displayed
  }
}

// Function to construct the HTML for a story
function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const isFavorite = currentUser ? currentUser.isFavorite(story) : false; // Checks if current user marked the story as favorite
  const favoriteIconClass = isFavorite ? "fas" : "far"; // Choose correct class for the favorite icon
  const favoriteIcon = `<i class="${favoriteIconClass} fa-star"></i>`; // creaes HTML for favorite icon

  const $story = $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="_blank" class="story-link">
        ${story.title}
      </a>
      <span class="favorite-icon">${favoriteIcon}</span>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);

  $story.find(".favorite-icon").on("click", function (event) {
    event.preventDefault();
    handleFavoriteClick(story);
  });

  return $story;
}

function putStoriesOnPage() {
  $allStoriesList.empty(); // Removes previous stories from the page
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story); // Create HTML for each story
    $allStoriesList.append($story); // add each story to the story list
  }
  $allStoriesList.show(); // makes story list visible
}

const $submitStoryForm = $("#submit-story-form");

// Function executed when a new story form is submitted
async function submitNewStory(evt) {
  evt.preventDefault(); // Stop the form from default submission
  let author = $("#story-author").val(); 
  let title = $("#story-title").val(); 
  let url = $("#story-url").val(); 
  let username = currentUser.username; 
  let story = await storyList.addStory(currentUser, {title, author, url, username}); // add new story
  const $story = generateStoryMarkup(story); // Create HTML for new story
  $allStoriesList.prepend($story); // Add the new story at the beginning of story list
  $submitStoryForm.trigger("reset"); // Reset forms
  $submitStoryForm.hide(); // Hide the form
}

$submitStoryForm.on("submit", submitNewStory);

"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title; 
    this.author = author;
    this.url = url; 
    this.username = username; 
    this.createdAt = createdAt;
  }

  getHostName() {
    return "hostname.com";
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories; // Array of story objects
  }

  // gets all stories from the API
  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // maps the response data to Story objects
    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories); // returns new storses
  }

  // a new story is asded to the API and updates the story list
  async addStory(user, newStory) {
    let storyRequest = {
      token: user.loginToken,
      story: newStory,
    };

    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: storyRequest,
    });

    const story = new Story(response.data.story);
    this.stories.unshift(story); // Add the new story to the beginning lidt
    user.ownStories.unshift(story); // Add the new story to the user's own stories list

    return story; // Return the newly added story
  }
}

class User {
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username; 
    this.name = name; 
    this.createdAt = createdAt; 
    this.favorites = favorites.map(s => new Story(s)); // array of favorite stories
    this.ownStories = ownStories.map(s => new Story(s)); // array of stories posted by the user
    this.loginToken = token;
  }

  // Signs up a new user
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  // Logs in an existing user
  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  // Logs in a user via stored credentials
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  // Adds a story to the user's favorites
  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story);
  }

  // This removes a story from the user's favorites
  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId); // removes the story from the user's list of favorite stories
    await this._addOrRemoveFavorite("remove", story); // Update the API to reflect the change
  }
  
  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add" ? "POST" : "DELETE"; // Determine the HTTP method based on the desired state (add or remove)
    const token = this.loginToken; // Getd the user's authentication token
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }
  
  //checks if its a favorite srory 
  isFavorite(story) {
    return this.favorites.some(s => s.storyId === story.storyId); 
  }
}


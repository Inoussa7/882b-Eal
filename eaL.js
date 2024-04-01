let learningStyles = {};
let languageLearningContent = {};
let grammarLearningContent = {};
let travelResourcesForLearningStyles = {};
let proficiencyLevels = [];
let userProfiles = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchDataAndPopulateUI();
    setupFormListeners();
    setupFormToggles();
    setupViewButtonListener();
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
});

async function fetchDataAndPopulateUI() {
  try {
    const response = await fetch('eaL.json');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    ({ languageLearningContent, grammarLearningContent, learningStyles, travelResourcesForLearningStyles, proficiencyLevels } = data);

    populateProficiencyLevels();
    populateLearningStyles();
    populateCountryDropdown();
    userProfiles = data.users;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function populateCountryDropdown() {
  fetch('https://restcountries.com/v3.1/all')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(countries => {
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
      const dropdown = document.getElementById('countryDropdown');
      countries.forEach(country => dropdown.add(new Option(country.name.common, country.name.common)));
    })
    .catch(error => console.error('Error fetching country list:', error));
}

function populateProficiencyLevels() {
  const dropdown = document.getElementById('proficiencyLevelDropdown');
  proficiencyLevels.forEach(level => dropdown.add(new Option(level, level)));
}

function populateLearningStyles() {
  const dropdown = document.getElementById('learningStyleDropdown');
  Object.entries(learningStyles).forEach(([style, description]) => dropdown.add(new Option(style, style)));
}

function setupFormListeners() {
  document.getElementById('learningForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const learningStyle = document.getElementById('learningStyleDropdown').value;
    const proficiencyLevel = document.getElementById('proficiencyLevelDropdown').value;
    displayLearningContent(learningStyle, proficiencyLevel);
  });

  document.getElementById('signUpForm')?.addEventListener('submit', handleSignupFormSubmit);
  document.getElementById('loginForm')?.addEventListener('submit', handleLoginFormSubmit);
}

function displayLearningContent(learningStyle, proficiencyLevel) {
  const topic = "Travel";
  const content = languageLearningContent[topic]?.[proficiencyLevel] || {};
  const grammar = grammarLearningContent["Tenses"]?.[proficiencyLevel] || {};

  document.getElementById("results").innerHTML = `
    <h3>Writing Prompt:</h3>
    <p>${content.WritingPrompt || "No writing prompt available for this level."}</p>
    <h3>Vocabulary Exercise:</h3>
    <p>${content.VocabularyExercise || "No vocabulary exercise available for this level."}</p>
    <h3>Grammar Explanation:</h3>
    <p>${grammar.Explanation || "No grammar explanation available for this level."}</p>
    <h3>Grammar Exercise:</h3>
    <p>${grammar.Exercise || "No grammar exercise available for this level."}</p>
    <h3>Resources for ${learningStyle} Learners:</h3>
    <p>${Object.entries(travelResourcesForLearningStyles[learningStyle] || {}).map(([key, value]) => `<b>${key}:</b> ${value}<br>`).join('')}</p>
  `;
}

function handleSignupFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newUser = {
    name: formData.get('name'),
    username: formData.get('name'),
    countryofOrigin: formData.get('countryofOrigin'),
    languagesSpoken: formData.get('languagesSpoken').split(','),
    major: formData.get('major'),
    specialization: formData.get('specialization'),
    classes: formData.get('classes').split(',')
  };
  
  userProfiles.push(newUser);
  displayUser(newUser);
  event.target.reset();
}

function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    console.log('Username entered:', username);
    console.log('User profiles:', userProfiles);
    const user = userProfiles.find(user => user.name === username);
    console.log('Matching user:', user);
  
    const loginError = document.getElementById('loginError');
    if (user) {
      loginError.textContent = '';
      displayUser(user);
      document.getElementById('userCards').style.display = 'block';
    } else {
      loginError.textContent = 'Username not found. Please check your username or sign up.';
      document.getElementById('userCards').style.display = 'none';
    }
  }

function displayUser(user) {
  document.getElementById('userCards').innerHTML = `
    <div class="card">
      <div class="card-header">${user.name}</div>
      <div class="card-body">
        <p>Country of Origin: ${user.countryofOrigin}</p>
        <p>Languages Spoken: ${user.languagesSpoken.join(', ')}</p>
        <p>Major: ${user.major}</p>
        <p>Specialization: ${user.specialization}</p>
        <p>Classes: ${user.classes.join(', ')}</p>
      </div>
    </div>
  `;
}

function setupFormToggles() {
  const [signUpButton, loginButton] = document.querySelectorAll('nav li:nth-child(2) a, nav li:nth-child(3) a');
  const [signUpForm, loginForm] = document.querySelectorAll('#signUpForm, #loginForm');

  signUpButton.addEventListener('click', event => {
    event.preventDefault();
    signUpForm.style.display = signUpForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = 'none';
  });

  loginButton.addEventListener('click', event => {
    event.preventDefault();
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    signUpForm.style.display = 'none';
  });
}

function setupViewButtonListener() {
  const viewButton = document.querySelector('nav li:nth-child(4) a');
  viewButton.addEventListener('click', event => {
    event.preventDefault();
    fetchAndDisplayContent();
  });
}

function fetchAndDisplayContent() {
  fetch('/api/content')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const contentElement = document.getElementById('content');
      contentElement.innerHTML = '';

      // Display lessons
      const lessonsHeading = document.createElement('h3');
      lessonsHeading.textContent = 'Lessons:';
      contentElement.appendChild(lessonsHeading);

      data.lessons.forEach(lesson => {
        const lessonElement = document.createElement('div');
        lessonElement.innerHTML = `
          <h4>${lesson.topic}</h4>
          <p>Proficiency Levels:</p>
          <ul>
            ${lesson.proficiencyLevels.map(level => `
              <li>
                <strong>${level.level}</strong>
                <p>${level.overview}</p>
                <p>Grammar: ${level.grammar.title}</p>
                <p>Vocabulary: ${level.vocabulary.title}</p>
              </li>
            `).join('')}
          </ul>
        `;
        contentElement.appendChild(lessonElement);
      });

      // Display users
      const usersHeading = document.createElement('h3');
      usersHeading.textContent = 'Users:';
      contentElement.appendChild(usersHeading);

      data.users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Country of Origin:</strong> ${user.countryofOrigin}</p>
          <p><strong>Languages Spoken:</strong> ${user.languagesSpoken.join(', ')}</p>
          <p><strong>Major:</strong> ${user.major}</p>
          <p><strong>Specialization:</strong> ${user.specialization}</p>
          <p><strong>Classes:</strong> ${user.classes.join(', ')}</p>
        `;
        contentElement.appendChild(userElement);
      });
    })
    .catch(error => {
      console.error('Error fetching content:', error);
      document.getElementById('content').innerHTML = 'An error occurred. Please try again later.';
    });
}
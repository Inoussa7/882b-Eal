let learningStyles = {};
let languageLearningContent = {};
let grammarLearningContent = {};
let travelResourcesForLearningStyles = {};
let proficiencyLevels = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchDataAndPopulateUI();
        setupFormListeners();
        displayRandomAffirmation();
        fetchAndDisplayStatistics();
        setupFormToggles();
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
});

async function fetchDataAndPopulateUI() {
    try {
        const response = await fetch('eaL.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        languageLearningContent = data.languageLearningContent;
        grammarLearningContent = data.grammarLearningContent;
        learningStyles = data.learningStyles;
        travelResourcesForLearningStyles = data.travelResourcesForLearningStyles;
        proficiencyLevels = data.proficiencyLevels;

        populateProficiencyLevels();
        populateLearningStyles();
        populateCountryDropdown();
        handleUserProfiles(data.users);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function handleUserProfiles(users) {
    const storedUserProfiles = JSON.parse(localStorage.getItem('userProfiles'));
    storedUserProfiles ? displayUsers(storedUserProfiles) : (loadUserProfiles(users), displayUsers(users));
}

function loadUserProfiles(users) {
    localStorage.setItem('userProfiles', JSON.stringify(users));
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
    const learningForm = document.getElementById('learningForm');
    learningForm?.addEventListener('submit', event => {
        event.preventDefault();
        const learningStyle = document.getElementById('learningStyleDropdown').value;
        const proficiencyLevel = document.getElementById('proficiencyLevelDropdown').value;
        displayLearningContent(learningStyle, proficiencyLevel);
    });

    const signUpForm = document.getElementById('signUpForm');
    signUpForm?.addEventListener('submit', handleSignupFormSubmit);

    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', handleLoginFormSubmit);

    const updateLearningStyleForm = document.getElementById('updateLearningStyleForm');
    updateLearningStyleForm?.addEventListener('submit', handleUpdateLearningStyleFormSubmit);
}

function displayLearningContent(learningStyle, proficiencyLevel) {
    const topic = "Travel";
    const content = languageLearningContent[topic]?.[proficiencyLevel];
    const grammar = grammarLearningContent["Tenses"]?.[proficiencyLevel];

    if (content) {
        const writingPrompt = content.WritingPrompt || "No writing prompt available for this level.";
        const vocabExercise = content.VocabularyExercise || "No vocabulary exercise available for this level.";

        const grammarExplanation = grammar?.Explanation || "No grammar explanation available for this level.";
        const grammarExercise = grammar?.Exercise || "No grammar exercise available for this level.";

        const resources = travelResourcesForLearningStyles[learningStyle] || {};
        const resourcesFormatted = Object.entries(resources).map(([key, value]) => `<b>${key}:</b> ${value}<br>`).join('');

        document.getElementById("results").innerHTML = `
            <h3>Writing Prompt:</h3>
            <p>${writingPrompt}</p>
            <h3>Vocabulary Exercise:</h3>
            <p>${vocabExercise}</p>
            <h3>Grammar Explanation:</h3>
            <p>${grammarExplanation}</p>
            <h3>Grammar Exercise:</h3>
            <p>${grammarExercise}</p>
            <h3>Resources for ${learningStyle} Learners:</h3>
            <p>${resourcesFormatted}</p>
        `;
    } else {
        document.getElementById("results").innerHTML = "No learning content available for the selected topic and proficiency level.";
    }
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
    
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
    userProfiles.push(newUser);
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    displayUser(newUser);
    event.target.reset();
}

function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
    const user = userProfiles.find(user => user.name === username);

    const loginError = document.getElementById('loginError');
    user ? (loginError.textContent = '', displayUser(user)) : loginError.textContent = 'Username not found. Please check your username or sign up.';
}

function displayUser(user) {
    const userCardsContainer = document.getElementById('userCards');
    userCardsContainer.innerHTML = `
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

function handleUpdateLearningStyleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const learningStyle = formData.get('learningStyle');
    console.log('Updated learning style:', learningStyle);
}

function displayRandomAffirmation() {
    const affirmations = ["You're doing great!", "Keep up the good work!", "Your effort is paying off!"];
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    document.getElementById('affirmationContainer').innerText = affirmations[randomIndex];
}

async function fetchAndDisplayStatistics() {
    try {
        const response = await fetch('statistics.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const statistics = await response.text();
        document.getElementById('statisticsContainer').innerHTML = statistics;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        document.getElementById('statisticsContainer').innerHTML = 'Error loading statistics.';
    }
}

function setupFormToggles() {
    const loginButton = document.querySelector('nav li:nth-child(3) a'); // Select the login button in the navigation menu
    const signUpButton = document.querySelector('nav li:nth-child(2) a'); // Select the sign-up button in the navigation menu
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none'; // Toggle display of login form
        signUpForm.style.display = 'none'; // Hide sign-up form
    });

    signUpButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        signUpForm.style.display = signUpForm.style.display === 'none' ? 'block' : 'none'; // Toggle display of sign-up form
        loginForm.style.display = 'none'; // Hide login form
    });
}

function fetchAndDisplayContent() {
    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => {
        // Select the div and insert the data into it
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = JSON.stringify(data, null, 2);
      })
      .catch(error => console.error(error));
  }
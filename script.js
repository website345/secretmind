// --- CONFIGURATION DES QUESTIONS ---
// Modifie ce tableau pour ajouter tes propres questions et réponses.
const quizData = [
    {
        question: "What is your favorite food?",
        answers: ["Pizza", "Burger", "Pasta", "Sushi"]
    },
    {
        question: "What is your favorite color?",
        answers: ["Blue", "Red", "Black", "Green"]
    },
    {
        question: "What is your favorite drink?",
        answers: ["Water", "Soda", "Juice", "Coffee"]
    },
    {
        question: "What is your favorite animal?",
        answers: ["Dog", "Cat", "Lion", "Dolphin"]
    },
    {
        question: "What is your favorite season?",
        answers: ["Summer", "Winter", "Spring", "Autumn"]
    },
    {
        question: "Do you prefer morning or night?",
        answers: ["Morning", "Night", "Both", "Neither"]
    },
    {
        question: "What type of music do you like?",
        answers: ["Pop", "Rap", "Rock", "Chill"]
    },
    {
        question: "What is your favorite hobby?",
        answers: ["Gaming", "Sports", "Watching movies", "Reading"]
    },
    {
        question: "Which social media do you use the most?",
        answers: ["Instagram", "TikTok", "YouTube", "Snapchat"]
    },
    {
        question: "What is your favorite movie genre?",
        answers: ["Action", "Comedy", "Horror", "Romance"]
    },
    {
        question: "What is your favorite game?",
        answers: ["FIFA", "Fortnite", "Minecraft", "GTA"]
    },
    {
        question: "Where would you like to travel?",
        answers: ["USA", "Dubai", "Japan", "Paris"]
    },
    {
        question: "What is your favorite dessert?",
        answers: ["Ice cream", "Cake", "Chocolate", "Donuts"]
    },
    {
        question: "Do you prefer sweet or salty food?",
        answers: ["Sweet", "Salty", "Both", "Neither"]
    },
    {
        question: "What annoys me the most?",
        answers: ["Noise", "Waiting", "Lies", "Being ignored"]
    },
    {
        question: "What makes me happy?",
        answers: ["Friends", "Money", "Success", "Relaxing"]
    },
    {
        question: "What superpower would I want?",
        answers: ["Flying", "Invisibility", "Time travel", "Mind reading"]
    },
    {
        question: "What is your dream job?",
        answers: ["Content Creator", "Entrepreneur", "Artist", "Doctor"]
    },
    {
        question: "What is your favorite clothing style?",
        answers: ["Streetwear", "Casual", "Classy", "Sportswear"]
    },
    {
        question: "What is your biggest fear?",
        answers: ["Heights", "Spiders", "Failure", "Death"]
    },
    {
        question: "What is your favorite sport?",
        answers: ["Football", "Basketball", "Tennis", "None"]
    },
    {
        question: "What phone brand do I prefer?",
        answers: ["Apple", "Samsung", "Google", "Other"]
    },
    {
        question: "What is your favorite fast food?",
        answers: ["McDonald", "KFC", "Burger King", "Subway"]
    },
    {
        question: "Where do I spend most of my money?",
        answers: ["Food", "Clothes", "Games", "Tech"]
    },
    {
        question: "What is your favorite fruit?",
        answers: ["Apple", "Banana", "Strawberry", "Mango"]
    },
    {
        question: "What time do you usually wake up?",
        answers: ["Early (before 7 AM)", "Morning (7–9 AM)", "Late (after 9 AM)", "It depends"]
    },
    {
        question: "What is your favorite day of the week?",
        answers: ["Monday", "Wednesday", "Friday", "Sunday"]
    },
    {
        question: "What is your favorite subject?",
        answers: ["Math", "Science", "Languages", "History"]
    },
    {
        question: "What is your favorite snack?",
        answers: ["Chips", "Chocolate", "Cookies", "Popcorn"]
    },
    {
        question: "What is your favorite weather?",
        answers: ["Sunny", "Rainy", "Cloudy", "Windy"]
    },
    {
        question: "Do you like surprises?",
        answers: ["Yes", "No", "Sometimes", "Only good ones"]
    },
    {
        question: "How do you usually communicate?",
        answers: ["Texting", "Calling", "Voice messages", "In person"]
    },
    {
        question: "What is your favorite app?",
        answers: ["TikTok", "Instagram", "YouTube", "WhatsApp"]
    },
    {
        question: "What is your biggest goal?",
        answers: ["Be rich", "Be happy", "Be famous", "Travel the world"]
    },
    {
        question: "What do you do first in the morning?",
        answers: ["Check phone", "Eat breakfast", "Go back to sleep", "Get ready"]
    },
    {
        question: "What is your favorite type of content?",
        answers: ["Videos", "Photos", "Stories", "Live streams"]
    },
    {
        question: "What is your favorite place to relax?",
        answers: ["Home", "Beach", "Park", "Bed"]
    }
];
// -----------------------------------

const TARGET_QUESTIONS = 10;

// State
let isChallengeMode = false;
let creatorName = "";
let correctAnswers = [];
let questionOrder = [];
let unusedPool = [];

let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

// DOM Elements
const homeView = document.getElementById('home-view');
const quizView = document.getElementById('quiz-view');
const mainActionBtn = document.getElementById('main-action-btn');
const btnText = mainActionBtn.querySelector('.btn-text');
const challengeSubtitle = document.getElementById('challenge-subtitle');

const nameStep = document.getElementById('name-step');
const questionStep = document.getElementById('question-step');
const resultStep = document.getElementById('result-step');

const namePrompt = document.getElementById('name-prompt');
const playerNameInput = document.getElementById('player-name');
const beginQuizBtn = document.getElementById('begin-quiz-btn');

const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const progressFill = document.getElementById('progress-fill');

const btnBack = document.getElementById('btn-back');
const btnSkip = document.getElementById('btn-skip');

const resultTitle = document.getElementById('result-title');
const scoreDisplay = document.getElementById('score-display');
const finalScoreEl = document.getElementById('final-score');
const totalScoreEl = document.getElementById('total-score');
const engagementText = document.getElementById('engagement-text');
const actionSection = document.getElementById('action-section');

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const creatorParam = urlParams.get('c');
    const answersParam = urlParams.get('a');
    const orderParam = urlParams.get('q');

    // Track total visits
    try {
        let visits = parseInt(localStorage.getItem('site_visits') || '0');
        localStorage.setItem('site_visits', visits + 1);
    } catch(e) {}

    if (creatorParam && answersParam && orderParam) {
        isChallengeMode = true;
        creatorName = decodeURIComponent(creatorParam);
        try {
            correctAnswers = atob(answersParam).split(',').map(Number);
            questionOrder = atob(orderParam).split(',').map(Number);

            totalScoreEl.textContent = questionOrder.length * 2;
            btnSkip.style.display = 'none';

            // UI Updates for Challenge Mode
            challengeSubtitle.textContent = `${creatorName} challenged you! Prove you know them.`;
            challengeSubtitle.style.display = 'block';
            btnText.textContent = "ACCEPT CHALLENGE";
            namePrompt.textContent = "What's your name, challenger?";

            // Track challenges taken
            try {
                let challenges = parseInt(localStorage.getItem('challenges_taken') || '0');
                localStorage.setItem('challenges_taken', challenges + 1);
            } catch(e) {}

        } catch (e) {
            console.error("Invalid link");
            isChallengeMode = false;
        }
    } else {
        // UI Updates for Creation Mode
        challengeSubtitle.style.display = 'none';
        btnText.textContent = "CREATE MY FRIENDSHIP QUIZ";
        namePrompt.textContent = "What's your name, creator?";

        totalScoreEl.textContent = TARGET_QUESTIONS * 2;
        btnSkip.style.display = 'inline-block';

        // Setup random question order
        let shuffled = Array.from({ length: quizData.length }, (_, i) => i);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        questionOrder = shuffled.slice(0, TARGET_QUESTIONS);
        unusedPool = shuffled.slice(TARGET_QUESTIONS);
    }
}

function showView(viewElement) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    viewElement.classList.add('active-view');
}

function showQuizStep(stepElement) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active-step'));
    stepElement.classList.add('active-step');
}

mainActionBtn.addEventListener('click', () => {
    showView(quizView);
    showQuizStep(nameStep);
});

beginQuizBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) return alert("Please enter a name!");

    // Store player name
    if (!isChallengeMode) {
        creatorName = name;
        
        // Track quizzes created
        try {
            let quizzes = parseInt(localStorage.getItem('quizzes_created') || '0');
            localStorage.setItem('quizzes_created', quizzes + 1);
        } catch(e) {}
    }

    startQuiz();
});

// Navigation logic
btnBack.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    } else {
        showQuizStep(nameStep);
    }
});

btnSkip.addEventListener('click', () => {
    if (unusedPool.length > 0) {
        questionOrder[currentQuestionIndex] = unusedPool.pop();
        userAnswers[currentQuestionIndex] = undefined;
        loadQuestion();
    } else {
        alert("No more alternative questions available!");
    }
});

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    showQuizStep(questionStep);
    loadQuestion();
}

function loadQuestion() {
    const originalIndex = questionOrder[currentQuestionIndex];
    const q = quizData[originalIndex];
    if (isChallengeMode) {
        questionText.textContent = `What did ${creatorName} answer to: "${q.question}"`;
    } else {
        questionText.textContent = q.question;
    }

    answersContainer.innerHTML = '';

    // Progress
    const progress = ((currentQuestionIndex) / questionOrder.length) * 100;
    progressFill.style.width = `${progress}%`;

    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.classList.add('answer-btn');
        btn.textContent = answer;
        btn.addEventListener('click', () => handleAnswer(index));
        answersContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex) {
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);

    userAnswers[currentQuestionIndex] = selectedIndex;

    if (selectedIndex !== -1) {
        if (isChallengeMode) {
            const correctIndex = correctAnswers[currentQuestionIndex];
            if (selectedIndex === correctIndex) {
                buttons[selectedIndex].classList.add('correct');
            } else {
                buttons[selectedIndex].classList.add('wrong');
                if (correctIndex !== -1 && buttons[correctIndex]) {
                    buttons[correctIndex].classList.add('correct');
                }
            }
        } else {
            buttons[selectedIndex].classList.add('selected');
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questionOrder.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, selectedIndex === -1 ? 0 : (isChallengeMode ? 1200 : 600));
}

function showResults() {
    progressFill.style.width = `100%`;
    showQuizStep(resultStep);

    actionSection.innerHTML = '';

    let answeredCount = 0;
    for (let i = 0; i < questionOrder.length; i++) {
        if (userAnswers[i] !== undefined && userAnswers[i] !== -1) {
            answeredCount++;
        }
    }

    if (answeredCount < questionOrder.length) {
        resultTitle.textContent = "INCOMPLETE!";
        scoreDisplay.style.display = 'none';
        engagementText.textContent = `You must answer all ${questionOrder.length} questions. You missed ${questionOrder.length - answeredCount} question(s).`;

        const goBackBtn = document.createElement('button');
        goBackBtn.classList.add('action-btn', 'primary-btn');
        goBackBtn.textContent = "COMPLETE QUIZ";
        goBackBtn.addEventListener('click', () => {
            let firstUnanswered = 0;
            for (let i = 0; i < questionOrder.length; i++) {
                if (userAnswers[i] === undefined || userAnswers[i] === -1) {
                    firstUnanswered = i;
                    break;
                }
            }
            currentQuestionIndex = firstUnanswered;
            showQuizStep(questionStep);
            loadQuestion();
        });
        actionSection.appendChild(goBackBtn);
        return;
    }

    if (isChallengeMode) {
        // Calculate score safely at the end
        score = 0;
        for (let i = 0; i < questionOrder.length; i++) {
            if (userAnswers[i] !== undefined && userAnswers[i] !== -1 && userAnswers[i] === correctAnswers[i]) {
                score += 2;
            }
        }

        resultTitle.textContent = "CHALLENGE RESULT";
        scoreDisplay.style.display = 'block';
        finalScoreEl.textContent = score;
        engagementText.textContent = `You know ${creatorName} ${Math.round((score / (questionOrder.length * 2)) * 100)}% well!`;

        const shareScoreBtn = document.createElement('button');
        shareScoreBtn.classList.add('action-btn', 'share-wa-btn');
        shareScoreBtn.style.marginBottom = '1rem';
        shareScoreBtn.textContent = "SEND SCORE (WHATSAPP)";
        shareScoreBtn.addEventListener('click', () => {
            const text = `I just took your secretmind quiz and got ${score}/${questionOrder.length * 2}! 🧠 Can anyone beat me?`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
        actionSection.appendChild(shareScoreBtn);

        const shareTiktokIgBtn = document.createElement('button');
        shareTiktokIgBtn.classList.add('action-btn', 'share-ig-btn');
        shareTiktokIgBtn.style.marginBottom = '1rem';
        shareTiktokIgBtn.textContent = "SEND SCORE";
        shareTiktokIgBtn.addEventListener('click', async () => {
            const text = `I just took your secretmind quiz and got ${score}/${questionOrder.length * 2}! 🧠 Can anyone beat me?`;

            // Ouvre le menu de partage natif (parfait pour envoyer sur TikTok/IG sur mobile)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Quiz Score',
                        text: text
                    });
                } catch (err) {
                    console.log('Share canceled', err);
                }
            } else {
                // Sur PC, on copie simplement le texte
                navigator.clipboard.writeText(text).then(() => {
                    shareTiktokIgBtn.textContent = "SCORE COPIED !";
                    shareTiktokIgBtn.classList.add('btn-copied');
                    setTimeout(() => {
                        shareTiktokIgBtn.textContent = "SEND SCORE";
                        shareTiktokIgBtn.classList.remove('btn-copied');
                    }, 2000);
                });
            }
        });
        actionSection.appendChild(shareTiktokIgBtn);

        const createOwnBtn = document.createElement('button');
        createOwnBtn.classList.add('action-btn');
        createOwnBtn.textContent = "CREATE YOUR OWN QUIZ";
        createOwnBtn.addEventListener('click', () => {
            window.location.href = window.location.origin + window.location.pathname;
        });
        actionSection.appendChild(createOwnBtn);
    } else {
        resultTitle.textContent = "QUIZ CREATED!";
        scoreDisplay.style.display = 'none';
        engagementText.textContent = "Your quiz is ready. Share the link with your friends to see who knows you best!";

        const encodedAnswers = btoa(userAnswers.join(','));
        const encodedOrder = btoa(questionOrder.join(','));
        const link = `${window.location.origin}${window.location.pathname}?c=${encodeURIComponent(creatorName)}&q=${encodedOrder}&a=${encodedAnswers}`;

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('action-btn', 'primary-btn');
        copyBtn.textContent = "COPY LINK";
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(`🔥 Prove you know me! Click here to take my friendship challenge: ${link}`)
                .then(() => {
                    copyBtn.textContent = "LINK COPIED! ✅";
                    copyBtn.classList.add('btn-copied');
                    setTimeout(() => {
                        copyBtn.textContent = "COPY LINK";
                        copyBtn.classList.remove('btn-copied');
                    }, 2000);
                })
                .catch(() => alert("Error copying link. Link: " + link));
        });
        actionSection.appendChild(copyBtn);
    }
}

// Initialize logic
init();

// --- THEME TOGGLE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = 'dark';
try {
    currentTheme = localStorage.getItem('theme') || 'dark';
} catch(e) {}

if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggleBtn.textContent = 'Dark Mode';
} else {
    themeToggleBtn.textContent = 'Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggleBtn.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    } catch(e) {}
});

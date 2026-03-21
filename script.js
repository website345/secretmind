// ============================================================
// LANGUAGE STATE
// ============================================================
let currentLang = 'fr';
try { currentLang = localStorage.getItem('lang') || 'fr'; } catch(e) {}
let T = TRANSLATIONS[currentLang];

// ============================================================
// LANGUAGE OVERLAY (shown on every entry)
// ============================================================
const langOverlay = document.getElementById('lang-overlay');

document.querySelectorAll('.lang-overlay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const chosen = btn.dataset.lang;
        langOverlay.style.opacity = '0';
        langOverlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            langOverlay.classList.add('hidden');
            langOverlay.style.opacity = '';
        }, 300);
        applyLanguage(chosen);
    });
});

// ============================================================
// QUIZ STATE
// ============================================================
const TARGET_QUESTIONS = 10;

let isChallengeMode = false;
let creatorName = "";
let correctAnswers = [];
let questionOrder = [];
let unusedPool = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

// ============================================================
// DOM Elements
// ============================================================
const homeView       = document.getElementById('home-view');
const quizView       = document.getElementById('quiz-view');
const mainActionBtn  = document.getElementById('main-action-btn');
const btnText        = mainActionBtn.querySelector('.btn-text');
const challengeSubtitle = document.getElementById('challenge-subtitle');

const nameStep       = document.getElementById('name-step');
const questionStep   = document.getElementById('question-step');
const resultStep     = document.getElementById('result-step');

const nameTitleEl    = document.getElementById('name-title');
const namePrompt     = document.getElementById('name-prompt');
const playerNameInput = document.getElementById('player-name');
const beginQuizBtn   = document.getElementById('begin-quiz-btn');
const nameErrorEl    = document.getElementById('name-error');

const questionText   = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const progressFill   = document.getElementById('progress-fill');

const btnBack        = document.getElementById('btn-back');
const btnSkip        = document.getElementById('btn-skip');

const resultTitle    = document.getElementById('result-title');
const scoreDisplay   = document.getElementById('score-display');
const finalScoreEl   = document.getElementById('final-score');
const totalScoreEl   = document.getElementById('total-score');
const engagementText    = document.getElementById('engagement-text');
const actionSection     = document.getElementById('action-section');
const themeToggleBtn    = document.getElementById('theme-toggle');

// ============================================================
// LANGUAGE SWITCHING
// ============================================================
function applyLanguage(lang) {
    currentLang = lang;
    T = TRANSLATIONS[lang];
    try { localStorage.setItem('lang', lang); } catch(e) {}

    // RTL / LTR
    document.documentElement.dir = T.dir;
    document.documentElement.lang = lang;

    // Static UI strings
    playerNameInput.placeholder = T.namePlaceholder;
    beginQuizBtn.textContent    = T.continueBtn;
    nameErrorEl.textContent     = T.nameError;
    nameTitleEl.textContent     = T.nameTitle;
    btnBack.innerHTML           = T.backBtn;
    btnSkip.innerHTML           = T.skipBtn;

    // Theme button
    const isLight = document.body.classList.contains('light-theme');
    themeToggleBtn.textContent  = isLight ? T.darkMode : T.lightMode;

    // Main button & subtitle (home view)
    if (isChallengeMode) {
        btnText.textContent = T.acceptBtn;
        challengeSubtitle.textContent = T.challengeSubtitle(creatorName);
        namePrompt.textContent = T.namePromptChallenger;
    } else {
        btnText.textContent = T.createBtn;
        namePrompt.textContent = T.namePromptCreator;
    }

    // Highlight active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Rebuild current quiz step if visible
    if (questionStep.classList.contains('active-step')) {
        loadQuestion();
    } else if (resultStep.classList.contains('active-step')) {
        showResults();
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// ============================================================
// INIT
// ============================================================
function init() {
    const urlParams    = new URLSearchParams(window.location.search);
    const creatorParam = urlParams.get('c');
    const answersParam = urlParams.get('a');
    const orderParam   = urlParams.get('q');

    try {
        let visits = parseInt(localStorage.getItem('site_visits') || '0');
        localStorage.setItem('site_visits', visits + 1);
    } catch(e) {}

    if (creatorParam && answersParam && orderParam) {
        isChallengeMode = true;
        creatorName = decodeURIComponent(creatorParam);
        try {
            correctAnswers = atob(answersParam).split(',').map(Number);
            questionOrder  = atob(orderParam).split(',').map(Number);
            totalScoreEl.textContent = questionOrder.length * 2;
            btnSkip.style.display = 'none';
            btnBack.style.display = 'none';
            challengeSubtitle.style.display = 'block';

            try {
                let challenges = parseInt(localStorage.getItem('challenges_taken') || '0');
                localStorage.setItem('challenges_taken', challenges + 1);
            } catch(e) {}
        } catch (e) {
            console.error("Invalid link");
            isChallengeMode = false;
        }
    } else {
        challengeSubtitle.style.display = 'none';
        totalScoreEl.textContent = TARGET_QUESTIONS * 2;
        btnSkip.style.display = 'inline-block';

        const questions = T.questions;
        let shuffled = Array.from({ length: questions.length }, (_, i) => i);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        questionOrder = shuffled.slice(0, TARGET_QUESTIONS);
        unusedPool    = shuffled.slice(TARGET_QUESTIONS);
    }

    // Apply saved lang
    applyLanguage(currentLang);
}

// ============================================================
// VIEW / STEP HELPERS
// ============================================================
function showView(viewElement) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    viewElement.classList.add('active-view');
}

function showQuizStep(stepElement) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active-step'));
    stepElement.classList.add('active-step');
}

// ============================================================
// EVENT LISTENERS
// ============================================================
mainActionBtn.addEventListener('click', () => {
    showView(quizView);
    showQuizStep(nameStep);
});

beginQuizBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) {
        nameErrorEl.style.display = 'block';
        nameErrorEl.style.animation = 'none';
        void nameErrorEl.offsetWidth;
        nameErrorEl.style.animation = 'shake 0.3s ease';
        return;
    }
    nameErrorEl.style.display = 'none';

    if (!isChallengeMode) {
        creatorName = name;
        try {
            let quizzes = parseInt(localStorage.getItem('quizzes_created') || '0');
            localStorage.setItem('quizzes_created', quizzes + 1);
        } catch(e) {}
    }

    startQuiz();
});

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
        alert("No more alternative questions!");
    }
});

// ============================================================
// QUIZ LOGIC
// ============================================================
function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    showQuizStep(questionStep);
    loadQuestion();
}

function loadQuestion() {
    const questions = T.questions;
    const originalIndex = questionOrder[currentQuestionIndex];
    const q = questions[originalIndex];

    if (isChallengeMode) {
        questionText.textContent = T.challengeQuestion(creatorName, q.question);
    } else {
        questionText.textContent = q.question;
    }

    answersContainer.innerHTML = '';

    const progress = (currentQuestionIndex / questionOrder.length) * 100;
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
    }, selectedIndex === -1 ? 0 : (isChallengeMode ? 1500 : 800));
}

function showResults() {
    progressFill.style.width = '100%';
    showQuizStep(resultStep);
    actionSection.innerHTML = '';

    let answeredCount = 0;
    for (let i = 0; i < questionOrder.length; i++) {
        if (userAnswers[i] !== undefined && userAnswers[i] !== -1) answeredCount++;
    }

    if (answeredCount < questionOrder.length) {
        resultTitle.textContent = T.incomplete;
        scoreDisplay.style.display = 'none';
        engagementText.textContent = T.incompleteText(questionOrder.length, questionOrder.length - answeredCount);

        const goBackBtn = document.createElement('button');
        goBackBtn.classList.add('action-btn', 'primary-btn');
        goBackBtn.textContent = T.completeBtn;
        goBackBtn.addEventListener('click', () => {
            let firstUnanswered = 0;
            for (let i = 0; i < questionOrder.length; i++) {
                if (userAnswers[i] === undefined || userAnswers[i] === -1) { firstUnanswered = i; break; }
            }
            currentQuestionIndex = firstUnanswered;
            showQuizStep(questionStep);
            loadQuestion();
        });
        actionSection.appendChild(goBackBtn);
        return;
    }

    if (isChallengeMode) {
        score = 0;
        for (let i = 0; i < questionOrder.length; i++) {
            if (userAnswers[i] !== undefined && userAnswers[i] !== -1 && userAnswers[i] === correctAnswers[i]) score += 2;
        }

        resultTitle.textContent = T.resultTitle;
        scoreDisplay.style.display = 'block';
        finalScoreEl.textContent = score;
        engagementText.textContent = T.engagementScore(creatorName, Math.round((score / (questionOrder.length * 2)) * 100));

        // WhatsApp button
        const shareScoreBtn = document.createElement('button');
        shareScoreBtn.classList.add('action-btn');
        shareScoreBtn.style.background    = 'rgba(37, 211, 102, 0.1)';
        shareScoreBtn.style.borderColor   = '#25D366';
        shareScoreBtn.style.color         = '#25D366';
        shareScoreBtn.style.boxShadow     = '0 0 10px rgba(37, 211, 102, 0.2)';
        shareScoreBtn.textContent = T.whatsappBtn;
        shareScoreBtn.addEventListener('click', () => {
            window.open(`https://wa.me/?text=${encodeURIComponent(T.whatsappText(score, questionOrder.length * 2))}`, '_blank');
        });
        actionSection.appendChild(shareScoreBtn);

        // Share / native share button
        const shareTiktokIgBtn = document.createElement('button');
        shareTiktokIgBtn.classList.add('action-btn');
        shareTiktokIgBtn.style.background  = 'rgba(123, 47, 247, 0.2)';
        shareTiktokIgBtn.style.borderColor = 'var(--secondary-color)';
        shareTiktokIgBtn.style.color       = 'var(--text-color)';
        shareTiktokIgBtn.style.boxShadow   = '0 0 15px rgba(241, 7, 163, 0.3)';
        shareTiktokIgBtn.textContent = T.shareBtn;
        shareTiktokIgBtn.addEventListener('click', async () => {
            const text = T.shareText(score, questionOrder.length * 2);
            if (navigator.share) {
                try { await navigator.share({ title: 'My Quiz Score', text }); } catch(e) {}
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    shareTiktokIgBtn.textContent = T.scoreCopied;
                    shareTiktokIgBtn.style.color = '#0F0F1A';
                    shareTiktokIgBtn.style.backgroundColor = 'var(--accent-color)';
                    setTimeout(() => {
                        shareTiktokIgBtn.textContent = T.shareBtn;
                        shareTiktokIgBtn.style.color = 'var(--text-color)';
                        shareTiktokIgBtn.style.backgroundColor = 'transparent';
                    }, 2000);
                });
            }
        });
        actionSection.appendChild(shareTiktokIgBtn);

        const createOwnBtn = document.createElement('button');
        createOwnBtn.classList.add('action-btn');
        createOwnBtn.textContent = T.createOwnBtn;
        createOwnBtn.addEventListener('click', () => {
            window.location.href = window.location.origin + window.location.pathname;
        });
        actionSection.appendChild(createOwnBtn);

    } else {
        resultTitle.textContent = T.resultCreated;
        scoreDisplay.style.display = 'none';
        engagementText.textContent = T.engagementReady;

        const encodedAnswers = btoa(userAnswers.join(','));
        const encodedOrder   = btoa(questionOrder.join(','));
        const link = `${window.location.origin}${window.location.pathname}?c=${encodeURIComponent(creatorName)}&q=${encodedOrder}&a=${encodedAnswers}&l=${currentLang}`;

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('action-btn', 'primary-btn');
        copyBtn.textContent = T.copyLinkBtn;
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(T.copyLinkText(link))
                .then(() => {
                    copyBtn.textContent = T.linkCopied;
                    copyBtn.style.color = '#0F0F1A';
                    copyBtn.style.background = 'var(--accent-color)';
                    copyBtn.style.boxShadow = '0 0 20px var(--accent-color)';
                    setTimeout(() => {
                        copyBtn.textContent = T.copyLinkBtn;
                        copyBtn.style.color = '';
                        copyBtn.style.background = '';
                        copyBtn.style.boxShadow = '';
                    }, 2000);
                })
                .catch(() => alert("Error copying link. Link: " + link));
        });
        actionSection.appendChild(copyBtn);
    }
}

// ============================================================
// INITIALIZE
// ============================================================
init();

// ============================================================
// THEME TOGGLE
// ============================================================
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || 'light'; } catch(e) {}

if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
    themeToggleBtn.textContent = T.lightMode;
} else {
    document.body.classList.add('light-theme');
    themeToggleBtn.textContent = T.darkMode;
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggleBtn.textContent = isLight ? T.darkMode : T.lightMode;
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch(e) {}
});

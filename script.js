/**
 * Web Developer Internship Project - Interactive Quiz Game Application
 * Main application script coordinating state, timer, dynamic rendering & leaderboard.
 */

import { questionBank } from './questions.js';

// --- STATE MANAGEMENT ---
let state = {
  activeCategory: 'html',
  activeDifficulty: 'easy',
  activeQuestions: [],
  currentIndex: 0,
  userAnswers: {},
  skippedQuestions: new Set(),
  timeRemaining: 0,
  elapsedTime: 0,
  timerId: null,
  scoreRegisterCompleted: false,
  theme: 'light',
  streak: 0,
  hintsRemaining: 2,
  hintUsedForCurrent: false,
  eliminatedOptions: [],
  performanceChart: null,
  trendChart: null,
  powerup5050: 1,
  powerupTime: 1,
  selectedAvatar: '🎮',
  achievements: [],
  practiceMode: false,
  currentUser: null,
  customQuestions: []
};

// --- DOM ELEMENT REFERENCES ---
const el = {
  // Screens
  screenWelcome: document.getElementById('screen-welcome'),
  screenQuiz: document.getElementById('screen-quiz'),
  screenResults: document.getElementById('screen-results'),
  
  // Navigation & Config
  startQuizBtn: document.getElementById('start-quiz-btn'),
  prevQuestionBtn: document.getElementById('prev-question-btn'),
  nextQuestionBtn: document.getElementById('next-question-btn'),
  activeCategoryBadge: document.getElementById('active-category-badge'),
  activeDifficultyBadge: document.getElementById('active-difficulty-badge'),
  themeToggleBtn: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  
  // Quiz Indicators
  timeRemainingLabel: document.getElementById('time-remaining-label'),
  questionProgressText: document.getElementById('question-progress-text'),
  questionProgressPercent: document.getElementById('question-progress-percent'),
  visualProgressBar: document.getElementById('visual-progress-bar'),
  activeQuestionText: document.getElementById('active-question-text'),
  activeOptionsContainer: document.getElementById('active-options-container'),
  validationWarning: document.getElementById('validation-warning'),
  
  // Results Elements
  resultsHeadlineText: document.getElementById('results-headline-text'),
  metricScoreRaw: document.getElementById('metric-score-raw'),
  metricScorePct: document.getElementById('metric-score-pct'),
  metricScoreGrade: document.getElementById('metric-score-grade'),
  metricElapsed: document.getElementById('metric-elapsed'),
  resultsRetryBtn: document.getElementById('results-retry-btn'),
  resultsLeaderboardBtn: document.getElementById('results-leaderboard-btn'),
  resultsReviewAccordion: document.getElementById('results-review-accordion'),
  
  // Quiz screen extras
  streakContainer: document.getElementById('streak-container'),
  streakLabel: document.getElementById('streak-label'),
  hintBtn: document.getElementById('hint-btn'),
  hintsRemaining: document.getElementById('hints-remaining'),
  hintBox: document.getElementById('hint-box'),
  hintText: document.getElementById('hint-text'),
  skipBtn: document.getElementById('skip-question-btn'),
  powerup5050Btn: document.getElementById('powerup-5050'),
  powerupTimeBtn: document.getElementById('powerup-time'),
  powerup5050Count: document.getElementById('powerup-5050-count'),
  powerupTimeCount: document.getElementById('powerup-time-count'),

  // Results extras
  resultsPlayerName: document.getElementById('results-player-name'),
  exportPdfBtn: document.getElementById('export-pdf-btn'),
  shareResultBtn: document.getElementById('share-result-btn'),
  masteryBars: document.getElementById('mastery-bars'),
  practiceModeToggle: document.getElementById('practice-mode-toggle'),
  practiceModeKnob: document.getElementById('practice-mode-knob'),

  // Auth
  navAuthBtn: document.getElementById('nav-auth-btn'),
  navAuthLabel: document.getElementById('nav-auth-label'),
  modalAuth: document.getElementById('modal-auth'),
  authClose: document.getElementById('auth-close'),
  authTabLogin: document.getElementById('auth-tab-login'),
  authTabRegister: document.getElementById('auth-tab-register'),
  authUsername: document.getElementById('auth-username'),
  authPassword: document.getElementById('auth-password'),
  authError: document.getElementById('auth-error'),
  authSubmitBtn: document.getElementById('auth-submit-btn'),
  authLoggedIn: document.getElementById('auth-logged-in'),
  authUserDisplay: document.getElementById('auth-user-display'),
  authStreakDisplay: document.getElementById('auth-streak-display'),
  authLogoutBtn: document.getElementById('auth-logout-btn'),

  // Badges
  navBadgesBtn: document.getElementById('nav-badges-btn'),
  modalBadges: document.getElementById('modal-badges'),
  badgesClose: document.getElementById('badges-close'),
  badgeCollectionGrid: document.getElementById('badge-collection-grid'),

  // Custom Quiz
  navCustomQuizBtn: document.getElementById('nav-custom-quiz-btn'),
  modalCustomQuiz: document.getElementById('modal-custom-quiz'),
  customQuizClose: document.getElementById('custom-quiz-close'),
  cqQuestion: document.getElementById('cq-question'),
  cqOptA: document.getElementById('cq-opt-a'),
  cqOptB: document.getElementById('cq-opt-b'),
  cqOptC: document.getElementById('cq-opt-c'),
  cqOptD: document.getElementById('cq-opt-d'),
  cqAnswer: document.getElementById('cq-answer'),
  cqExplanation: document.getElementById('cq-explanation'),
  cqAddBtn: document.getElementById('cq-add-btn'),
  cqList: document.getElementById('cq-list'),
  cqStartBtn: document.getElementById('cq-start-btn'),

  // Share
  modalShare: document.getElementById('modal-share'),
  shareClose: document.getElementById('share-close'),
  shareCard: document.getElementById('share-card'),
  shareAvatar: document.getElementById('share-avatar'),
  shareName: document.getElementById('share-name'),
  shareScore: document.getElementById('share-score'),
  shareMeta: document.getElementById('share-meta'),
  shareCopyBtn: document.getElementById('share-copy-btn'),
  shareDownloadBtn: document.getElementById('share-download-btn'),

  // Modals
  countdownSplash: document.getElementById('countdown-splash'),
  countdownNumber: document.getElementById('countdown-number'),
  modalAvatar: document.getElementById('modal-avatar'),
  avatarGrid: document.getElementById('avatar-grid'),
  avatarPickBtn: document.getElementById('avatar-pick-btn'),
  avatarConfirmBtn: document.getElementById('avatar-confirm-btn'),
  modalDashboard: document.getElementById('modal-dashboard'),
  dashboardClose: document.getElementById('dashboard-close'),
  dashboardContent: document.getElementById('dashboard-content'),
  dashboardPlayerLabel: document.getElementById('dashboard-player-label'),
  navDashboardBtn: document.getElementById('nav-dashboard-btn'),
  achievementToast: document.getElementById('achievement-toast'),
  achievementTitle: document.getElementById('achievement-title'),
  achievementDesc: document.getElementById('achievement-desc'),
  achievementIcon: document.getElementById('achievement-icon'),
  leaderboardFilterCat: document.getElementById('leaderboard-filter-cat'),
  leaderboardFilterDiff: document.getElementById('leaderboard-filter-diff'),

  // Player name input on welcome screen
  playerNameInput: document.getElementById('player-name-input'),

  // Leaderboard registration
  leaderboardRegisterContainer: document.getElementById('leaderboard-register-container'),
  registerSuccessIndicator: document.getElementById('register-success-indicator'),

  // Setup screen welcome widgets
  setupQuestionCount: document.getElementById('setup-question-count'),
  setupTimeLimit: document.getElementById('setup-time-limit'),
  
  // Modals
  navLeaderboardBtn: document.getElementById('nav-leaderboard-btn'),
  navInfoBtn: document.getElementById('nav-info-btn'),
  modalLeaderboard: document.getElementById('modal-leaderboard'),
  modalInfo: document.getElementById('modal-info'),
  leaderboardClose: document.getElementById('leaderboard-close'),
  leaderboardOk: document.getElementById('leaderboard-ok'),
  leaderboardClearBtn: document.getElementById('leaderboard-clear-btn'),
  leaderboardList: document.getElementById('leaderboard-list'),
  infoClose: document.getElementById('info-close'),
  infoOk: document.getElementById('info-ok'),
  viewRulesLink: document.getElementById('view-rules-link'),
  viewLeaderboardFoot: document.getElementById('view-leaderboard-foot')
};

// --- CONFIG CONSTANTS ---
const SECONDS_PER_QUESTION = 60; // Clock duration allocation per item

// --- HELPER DICTIONARIES ---
const CATEGORY_NAMES = {
  html: 'HTML Markup',
  css: 'CSS Styling',
  javascript: 'JavaScript Engines',
  general: 'General Web Core'
};

// ==================== APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindEvents();
  initSelectionsHighlight();
  syncSetupMetrics();
  initAvatarGrid();
  if (window.lucide) window.lucide.createIcons();
});

function initSelectionsHighlight() {
  // Highlight currently checked category on startup
  const checkedCategory = document.querySelector('input[name="quiz-category"]:checked');
  if (checkedCategory) {
    const label = checkedCategory.closest('.category-pill');
    if (label) {
      label.classList.add('ring-2', 'ring-blue-500', 'border-blue-400');
    }
  }

  // Highlight currently checked difficulty on startup
  const checkedDifficulty = document.querySelector('input[name="quiz-difficulty"]:checked');
  if (checkedDifficulty) {
    const lblSpan = checkedDifficulty.nextElementSibling;
    if (lblSpan) {
      lblSpan.className = 'difficulty-label py-1.5 px-3 block rounded-lg text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 shadow-sm transition-all border border-slate-300/10 font-bold';
    }
  }
}

// ==================== THEME MANAGEMENT ====================
function initTheme() {
  const savedTheme = localStorage.getItem('quiz_theme') || 'light';
  applyTheme(savedTheme);
}

function applyTheme(targetTheme) {
  state.theme = targetTheme;
  localStorage.setItem('quiz_theme', targetTheme);
  
  if (targetTheme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme', 'dark');
    if (el.themeIcon) {
      el.themeIcon.setAttribute('data-lucide', 'sun');
    }
  } else {
    document.body.classList.remove('dark-theme', 'dark');
    document.body.classList.add('light-theme');
    if (el.themeIcon) {
      el.themeIcon.setAttribute('data-lucide', 'moon');
    }
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function toggleTheme() {
  const nextTheme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
}

// ==================== WELCOME SCREEN SYNCS ====================
function syncSetupMetrics() {
  const selectedCategoryEl = document.querySelector('input[name="quiz-category"]:checked');
  const selectedDifficultyEl = document.querySelector('input[name="quiz-difficulty"]:checked');

  if (!selectedCategoryEl || !selectedDifficultyEl) return;

  const cat = selectedCategoryEl.value;
  const diff = selectedDifficultyEl.value;

  const sourcePool = (questionBank[cat] && questionBank[cat][diff]) || [];
  const questionCount = sourcePool.length;
  const timeLimitSeconds = questionCount * SECONDS_PER_QUESTION;

  // Render variables
  if (el.setupQuestionCount) {
    el.setupQuestionCount.textContent = `${questionCount} Questions`;
  }
  if (el.setupTimeLimit) {
    el.setupTimeLimit.textContent = formatMMSS(timeLimitSeconds);
  }
}

// ==================== EVENT BINDING ====================
function bindEvents() {
  // Config selection changes
  document.querySelectorAll('input[name="quiz-category"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Style visual highlight
      document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('ring-2', 'ring-blue-500', 'border-blue-400');
      });
      const selectedLabel = radio.closest('.category-pill');
      if (selectedLabel) {
        selectedLabel.classList.add('ring-2', 'ring-blue-500', 'border-blue-400');
      }
      syncSetupMetrics();
    });
  });

  document.querySelectorAll('input[name="quiz-difficulty"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Style difficulty indicator labels
      document.querySelectorAll('.difficulty-label').forEach(lbl => {
        lbl.className = 'difficulty-label py-1.5 px-3 block rounded-lg text-slate-500 dark:text-slate-400 transition-all';
      });
      const lblSpan = radio.nextElementSibling;
      if (lblSpan) {
        if (radio.value === 'easy') {
          lblSpan.className = 'difficulty-label py-1.5 px-3 block rounded-lg text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 shadow-sm transition-all border border-slate-300/10 font-bold';
        } else if (radio.value === 'medium') {
          lblSpan.className = 'difficulty-label py-1.5 px-3 block rounded-lg text-amber-500 dark:text-amber-400 bg-white dark:bg-slate-800 shadow-sm transition-all border border-slate-300/10 font-bold';
        } else {
          lblSpan.className = 'difficulty-label py-1.5 px-3 block rounded-lg text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-800 shadow-sm transition-all border border-slate-300/10 font-bold';
        }
      }
      syncSetupMetrics();
    });
  });

  el.navAuthBtn.addEventListener('click', () => showModal('auth', true));
  el.authClose.addEventListener('click', () => showModal('auth', false));
  el.authTabLogin.addEventListener('click', () => setAuthTab('login'));
  el.authTabRegister.addEventListener('click', () => setAuthTab('register'));
  el.authSubmitBtn.addEventListener('click', handleAuth);
  el.authLogoutBtn.addEventListener('click', handleLogout);
  el.navBadgesBtn.addEventListener('click', () => { showModal('badges', true); renderBadgeCollection(); });
  el.badgesClose.addEventListener('click', () => showModal('badges', false));
  el.navCustomQuizBtn.addEventListener('click', () => { showModal('custom-quiz', true); loadCustomQuestions(); });
  el.customQuizClose.addEventListener('click', () => showModal('custom-quiz', false));
  el.cqAddBtn.addEventListener('click', addCustomQuestion);
  el.cqStartBtn.addEventListener('click', startCustomQuiz);
  el.shareResultBtn.addEventListener('click', openShareModal);
  el.shareClose.addEventListener('click', () => showModal('share', false));
  el.shareCopyBtn.addEventListener('click', copyShareText);
  el.shareDownloadBtn.addEventListener('click', downloadShareCard);
  el.practiceModeToggle.addEventListener('click', togglePracticeMode);

  // try restore session
  const saved = localStorage.getItem('quiz_token');
  if (saved) restoreSession(saved);

  el.hintBtn.addEventListener('click', useHint);
  el.skipBtn.addEventListener('click', skipQuestion);
  el.powerup5050Btn.addEventListener('click', usePowerup5050);
  el.powerupTimeBtn.addEventListener('click', usePowerupTime);
  el.exportPdfBtn.addEventListener('click', exportResultsPDF);
  el.avatarPickBtn.addEventListener('click', () => showModal('avatar', true));
  el.avatarConfirmBtn.addEventListener('click', () => showModal('avatar', false));
  el.navDashboardBtn.addEventListener('click', () => showDashboard());
  el.dashboardClose.addEventListener('click', () => showModal('dashboard', false));
  el.leaderboardFilterCat.addEventListener('change', renderLeaderboardList);
  el.leaderboardFilterDiff.addEventListener('change', renderLeaderboardList);

  // Action Triggers
  el.startQuizBtn.addEventListener('click', startQuiz);
  el.prevQuestionBtn.addEventListener('click', navigatePrevious);
  el.nextQuestionBtn.addEventListener('click', navigateNextOrSubmit);
  el.themeToggleBtn.addEventListener('click', toggleTheme);

  // Leaderboard Action
  el.leaderboardClearBtn.addEventListener('click', clearLeaderboardScores);
  el.resultsRetryBtn.addEventListener('click', restartToWelcome);
  el.resultsLeaderboardBtn.addEventListener('click', () => showLeaderboardModal(true));

  // Modal events
  el.navLeaderboardBtn.addEventListener('click', () => showLeaderboardModal(true));
  el.viewLeaderboardFoot.addEventListener('click', (e) => {
    e.preventDefault();
    showLeaderboardModal(true);
  });
  el.leaderboardClose.addEventListener('click', () => showLeaderboardModal(false));
  el.leaderboardOk.addEventListener('click', () => showLeaderboardModal(false));

  el.navInfoBtn.addEventListener('click', () => showInfoModal(true));
  el.viewRulesLink.addEventListener('click', (e) => {
    e.preventDefault();
    showInfoModal(true);
  });
  el.infoClose.addEventListener('click', () => showInfoModal(false));
  el.infoOk.addEventListener('click', () => showInfoModal(false));

  // Dynamic window tap outs for modals
  window.addEventListener('click', (e) => {
    if (e.target === el.modalLeaderboard) showLeaderboardModal(false);
    if (e.target === el.modalInfo) showInfoModal(false);
    if (e.target === el.modalDashboard) showModal('dashboard', false);
    if (e.target === el.modalAvatar) showModal('avatar', false);
    if (e.target === el.modalAuth) showModal('auth', false);
    if (e.target === el.modalBadges) showModal('badges', false);
    if (e.target === el.modalCustomQuiz) showModal('custom-quiz', false);
    if (e.target === el.modalShare) showModal('share', false);
  });
}

// ==================== TIMER ENGINE ====================
function startTimer(totalSeconds) {
  state.timeRemaining = totalSeconds;
  state.elapsedTime = 0;
  
  if (state.timerId) clearInterval(state.timerId);

  updateTimerDisplay();

  state.timerId = setInterval(() => {
    state.timeRemaining--;
    state.elapsedTime++;

    updateTimerDisplay();

    // Critical Timer Alert styling (last 30 seconds)
    if (state.timeRemaining <= 30) {
      el.timeRemainingLabel.classList.add('text-red-500', 'animate-pulse');
      document.getElementById('quiz-timer-container').classList.add('border-red-500/40', 'bg-red-500/5');
      if (state.timeRemaining === 30 || state.timeRemaining === 10) playSound('warning');
    } else {
      el.timeRemainingLabel.classList.remove('text-red-500', 'animate-pulse');
      document.getElementById('quiz-timer-container').classList.remove('border-red-500/40', 'bg-red-500/5');
    }

    if (state.timeRemaining <= 0) {
      clearInterval(state.timerId);
      autoSubmitExpiredQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (el.timeRemainingLabel) {
    el.timeRemainingLabel.textContent = formatMMSS(state.timeRemaining);
  }
}

function formatMMSS(seconds) {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ==================== INITIALIZE ACTIVE ASSESSMENT ====================
function startQuiz() {
  const selectedCategoryEl = document.querySelector('input[name="quiz-category"]:checked');
  const selectedDifficultyEl = document.querySelector('input[name="quiz-difficulty"]:checked');

  if (!selectedCategoryEl || !selectedDifficultyEl) return;

  const playerName = el.playerNameInput.value.trim();
  if (!playerName) {
    alert('Please enter your name before starting the quiz.');
    el.playerNameInput.focus();
    return;
  }

  state.activeCategory = selectedCategoryEl.value;
  state.activeDifficulty = selectedDifficultyEl.value;

  // Fetch core selection base pool
  const pool = (questionBank[state.activeCategory] && questionBank[state.activeCategory][state.activeDifficulty]) || [];
  
  if (pool.length === 0) {
    alert("Error: Attempted pool contains void questions. Select alternative parameter sets.");
    return;
  }

  // Shuffle & select maximum 10 questions for realistic layout variance
  state.activeQuestions = [...pool].sort(() => 0.5 - Math.random());
  state.currentIndex = 0;
  state.userAnswers = {};
  state.skippedQuestions = new Set();
  state.scoreRegisterCompleted = false;
  state.streak = 0;
  state.hintsRemaining = 2;
  state.hintUsedForCurrent = false;
  state.eliminatedOptions = [];
  state.powerup5050 = 1;
  state.powerupTime = 1;
  state.achievements = [];

  el.hintsRemaining.textContent = '2';
  el.powerup5050Count.textContent = '(1)';
  el.powerupTimeCount.textContent = '(1)';
  el.streakContainer.classList.add('hidden');
  el.hintBox.classList.add('hidden');

  el.screenWelcome.classList.add('hidden');
  el.screenResults.classList.add('hidden');

  // Configure details & timer
  const totalSeconds = state.activeQuestions.length * SECONDS_PER_QUESTION;

  // Set badges
  el.activeCategoryBadge.textContent = CATEGORY_NAMES[state.activeCategory];
  el.activeDifficultyBadge.textContent = state.activeDifficulty.toUpperCase();
  el.activeDifficultyBadge.className = 'px-2.5 py-1 text-xs font-bold rounded-lg';
  if (state.activeDifficulty === 'easy') {
    el.activeDifficultyBadge.classList.add('bg-emerald-100','dark:bg-emerald-950/40','text-emerald-700','dark:text-emerald-400');
  } else if (state.activeDifficulty === 'medium') {
    el.activeDifficultyBadge.classList.add('bg-amber-100','dark:bg-amber-950/40','text-amber-700','dark:text-amber-400');
  } else {
    el.activeDifficultyBadge.classList.add('bg-rose-100','dark:bg-rose-950/40','text-rose-700','dark:text-rose-400');
  }

  showCountdown(() => {
    el.screenQuiz.classList.remove('hidden');
    if (!state.practiceMode) {
      startTimer(totalSeconds);
    } else {
      el.timeRemainingLabel.textContent = '∞';
      document.getElementById('quiz-timer-container').classList.add('opacity-40');
    }
    renderActiveQuestion();
  });
}

// ==================== RENDERING ACTIVE QUESTION ====================
function renderActiveQuestion() {
  const currentQuestion = state.activeQuestions[state.currentIndex];
  if (!currentQuestion) return;

  // Hide validation warnings
  el.validationWarning.classList.add('hidden');
  el.hintBox.classList.add('hidden');
  state.hintUsedForCurrent = false;
  state.eliminatedOptions = [];

  // Update hint button state
  el.hintBtn.disabled = state.hintsRemaining <= 0;
  el.hintBtn.className = state.hintsRemaining <= 0
    ? 'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/30 border border-slate-200/40 text-slate-400 text-xs font-semibold cursor-not-allowed opacity-50'
    : 'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200/40 dark:border-violet-800/20 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-950/40 transition-all cursor-pointer';

  // Update Progress bars & descriptive indicator totals
  const totalQty = state.activeQuestions.length;
  const displayOrdinal = state.currentIndex + 1;
  const progressPercent = Math.round((state.currentIndex / totalQty) * 100);

  el.questionProgressText.textContent = `Question ${displayOrdinal} of ${totalQty}`;
  el.questionProgressPercent.textContent = `${progressPercent}% Complete`;
  el.visualProgressBar.style.width = `${progressPercent}%`;

  // Render question text statement with difficulty badge
  const diffColor = state.activeDifficulty === 'easy' ? 'text-emerald-500' : state.activeDifficulty === 'medium' ? 'text-amber-500' : 'text-rose-500';
  el.activeQuestionText.innerHTML = `<span class="text-blue-500 dark:text-blue-400 mr-1.5 font-mono">#${displayOrdinal}</span>${currentQuestion.question} <span class="ml-1 text-[10px] font-bold uppercase ${diffColor}">[${state.activeDifficulty}]</span>`;

  // Clear option field and compile specific structural option blocks
  el.activeOptionsContainer.innerHTML = '';

  const savedAnswer = state.userAnswers[currentQuestion.id];

  if (currentQuestion.type === 'single') {
    renderSingleChoiceOptions(currentQuestion, savedAnswer);
  } else if (currentQuestion.type === 'multiple') {
    renderMultipleSelectOptions(currentQuestion, savedAnswer || []);
  } else if (currentQuestion.type === 'blank') {
    renderFillBlankOption(currentQuestion, savedAnswer || '');
  }

  // Control Back button states (disable if at position 0)
  el.prevQuestionBtn.disabled = (state.currentIndex === 0);

  // Alter text/icon labels on right-side navigation to "Submit" if on last question
  const nextBtnText = el.nextQuestionBtn.querySelector('span');
  const nextBtnIcon = el.nextQuestionBtn.querySelector('i');
  
  if (state.currentIndex === totalQty - 1) {
    if (nextBtnText) nextBtnText.textContent = 'Submit Evaluation';
    if (nextBtnIcon) {
      nextBtnIcon.setAttribute('data-lucide', 'check-circle');
    }
  } else {
    if (nextBtnText) nextBtnText.textContent = 'Next';
    if (nextBtnIcon) {
      nextBtnIcon.setAttribute('data-lucide', 'arrow-right');
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Option renderer types
function renderSingleChoiceOptions(q, savedAnswer) {
  q.options.forEach((option, index) => {
    const isSelected = (savedAnswer === option);
    const alphabetLabel = String.fromCharCode(65 + index); // A, B, C, D

    const optionDiv = document.createElement('div');
    optionDiv.id = `opt-container-${index}`;
    optionDiv.className = `option-card flex items-center justify-between p-4 rounded-xl border cursor-pointer ${
      isSelected 
        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/15 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200 font-semibold' 
        : 'border-slate-200 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-300'
    }`;

    optionDiv.innerHTML = `
      <div class="flex items-center space-x-3.5">
        <span class="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
          isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500'
        }">${alphabetLabel}</span>
        <span class="text-sm leading-relaxed">${option}</span>
      </div>
      <div class="flex items-center justify-center w-5.5 h-5.5 rounded-full border ${
        isSelected 
          ? 'border-blue-500 bg-blue-500 text-white' 
          : 'border-slate-300 dark:border-slate-700'
      }">
        ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
      </div>
      <input type="radio" name="options" value="${option.replace(/"/g, '&quot;')}" ${isSelected ? 'checked' : ''} class="sr-only">
    `;

    // Bind item clicks
    optionDiv.addEventListener('click', () => {
      saveUserAnswer(q.id, option);
      // Recurse local card highlighting dynamically without complete repaint
      document.querySelectorAll('.option-card').forEach(card => {
        card.className = 'option-card flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-350 cursor-pointer';
        const numLabel = card.querySelector('span');
        if (numLabel) {
          numLabel.className = 'flex items-center justify-between flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800/60 text-slate-500';
        }
        const checkIconDiv = card.querySelector('div:last-of-type');
        if (checkIconDiv) {
          checkIconDiv.className = 'flex items-center justify-center w-5.5 h-5.5 rounded-full border border-slate-300 dark:border-slate-700';
          checkIconDiv.innerHTML = '';
        }
      });

      optionDiv.className = 'option-card flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50/40 dark:bg-blue-950/15 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200 font-semibold cursor-pointer';
      const indicatorLabel = optionDiv.querySelector('span');
      if (indicatorLabel) {
        indicatorLabel.className = 'flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-blue-500 text-white flex-shrink-0';
      }
      const indicatorCircle = optionDiv.querySelector('div:last-of-type');
      if (indicatorCircle) {
        indicatorCircle.className = 'flex items-center justify-center w-5.5 h-5.5 rounded-full border border-blue-500 bg-blue-500 text-white';
        indicatorCircle.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i>';
      }
      
      const radioInput = optionDiv.querySelector('input');
      if (radioInput) radioInput.checked = true;

      // Clear warning standard
      el.validationWarning.classList.add('hidden');

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });

    el.activeOptionsContainer.appendChild(optionDiv);
  });
}

function renderMultipleSelectOptions(q, savedAnswers) {
  q.options.forEach((option, index) => {
    const isChecked = savedAnswers.includes(option);

    const optionDiv = document.createElement('div');
    optionDiv.className = `option-card flex items-center justify-between p-4 rounded-xl border cursor-pointer ${
      isChecked 
        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/15 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200 font-semibold' 
        : 'border-slate-200 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-300'
    }`;

    optionDiv.innerHTML = `
      <div class="flex items-center space-x-3.5">
        <label class="sr-only">Option checkbox wrapper</label>
        <span class="text-sm leading-relaxed">${option}</span>
      </div>
      <div class="flex items-center justify-center w-5.5 h-5.5 rounded-md border ${
        isChecked 
          ? 'border-blue-500 bg-blue-500 text-white' 
          : 'border-slate-300 dark:border-slate-700'
      }">
        ${isChecked ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
      </div>
      <input type="checkbox" name="options" value="${option.replace(/"/g, '&quot;')}" ${isChecked ? 'checked' : ''} class="sr-only">
    `;

    // Click behavior
    optionDiv.addEventListener('click', () => {
      const checkbox = optionDiv.querySelector('input');
      checkbox.checked = !checkbox.checked;
      
      let answersList = [...(state.userAnswers[q.id] || [])];
      if (checkbox.checked) {
        answersList.push(option);
      } else {
        answersList = answersList.filter(item => item !== option);
      }
      saveUserAnswer(q.id, answersList);

      // Re-trigger styles
      if (checkbox.checked) {
        optionDiv.className = 'option-card flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50/40 dark:bg-blue-950/15 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200 font-semibold cursor-pointer';
        const innerIconBox = optionDiv.querySelector('div:last-of-type');
        innerIconBox.className = 'flex items-center justify-center w-5.5 h-5.5 rounded-md border border-blue-500 bg-blue-500 text-white';
        innerIconBox.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i>';
      } else {
        optionDiv.className = 'option-card flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-300 cursor-pointer';
        const innerIconBox = optionDiv.querySelector('div:last-of-type');
        innerIconBox.className = 'flex items-center justify-center w-5.5 h-5.5 rounded-md border border-slate-300 dark:border-slate-700';
        innerIconBox.innerHTML = '';
      }

      el.validationWarning.classList.add('hidden');

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });

    el.activeOptionsContainer.appendChild(optionDiv);
  });
}

function renderFillBlankOption(q, savedAnswer) {
  const blankWrapper = document.createElement('div');
  blankWrapper.className = 'p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/55 dark:border-slate-800/20 space-y-4';

  blankWrapper.innerHTML = `
    <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1 flex items-center">
      <i data-lucide="keyboard" class="w-4.5 h-4.5 mr-1.5 text-blue-500"></i>
      Provide Your Answer In The Field Below
    </div>
    <div class="relative block">
      <input type="text" id="blank-input" placeholder="${q.placeholder || 'e.g., enter exact syntax key text'}" value="${savedAnswer.replace(/"/g, '&quot;')}" class="w-full bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-slate-800">
    </div>
    <div class="text-[11px] text-slate-400 dark:text-slate-500 leading-normal flex items-center">
      <i data-lucide="info" class="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0"></i>
      <span>Answers are double-vetted to dismiss trailing spacings and uppercase mismatch variations.</span>
    </div>
  `;

  el.activeOptionsContainer.appendChild(blankWrapper);

  // Bind input listeners
  const inputChild = document.getElementById('blank-input');
  inputChild.addEventListener('input', (e) => {
    saveUserAnswer(q.id, e.target.value);
    el.validationWarning.classList.add('hidden');
  });
}

// ==================== STATE HELPERS ====================
function saveUserAnswer(questionId, value) {
  state.userAnswers[questionId] = value;
}

// ==================== NAVIGATION PIPELINES ====================
function navigatePrevious() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderActiveQuestion();
  }
}

function navigateNextOrSubmit() {
  const currentQuestion = state.activeQuestions[state.currentIndex];
  if (!currentQuestion) return;

  const currentAnswer = state.userAnswers[currentQuestion.id];

  // Validation: Check if answer is valid / provided
  let hasValue = false;
  
  if (currentQuestion.type === 'single') {
    hasValue = (currentAnswer !== undefined && currentAnswer !== '');
  } else if (currentQuestion.type === 'multiple') {
    hasValue = (currentAnswer !== undefined && currentAnswer.length > 0);
  } else if (currentQuestion.type === 'blank') {
    hasValue = (currentAnswer !== undefined && currentAnswer.trim() !== '');
  }

  // Prevent skipping required questions
  if (!hasValue) {
    el.validationWarning.classList.remove('hidden');
    // Scroll warning into view for narrow devices
    el.validationWarning.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // Advanced index
  el.validationWarning.classList.add('hidden');

  const totalQty = state.activeQuestions.length;
  if (state.currentIndex === totalQty - 1) {
    // End Quiz Submission trigger
    submitQuiz();
  } else {
    state.currentIndex++;
    renderActiveQuestion();
  }
}

// ==================== RE-EVALUATION SUBMISSIONS ====================
function autoSubmitExpiredQuiz() {
  // Graceful submission on complete clock count out bounds
  alert("Time has officially expired! Let's examine your captured evaluations.");
  submitQuiz();
}

function submitQuiz() {
  if (state.timerId) clearInterval(state.timerId);

  // Score calculation formulas
  let scoreRaw = 0;
  const totalQty = state.activeQuestions.length;

  state.activeQuestions.forEach(q => {
    const userAnswer = state.userAnswers[q.id];
    let isCorrect = false;

    if (q.type === 'single') {
      isCorrect = (userAnswer && userAnswer === q.answer);
    } else if (q.type === 'multiple') {
      if (userAnswer && Array.isArray(userAnswer)) {
        const sortedUser = [...userAnswer].sort();
        const sortedCorrect = [...q.answer].sort();
        isCorrect = (sortedUser.length === sortedCorrect.length && 
                     sortedUser.every((value, index) => value === sortedCorrect[index]));
      }
    } else if (q.type === 'blank') {
      const sanitizedUser = (userAnswer || "").trim().toLowerCase();
      const sanitizedCorrect = q.answer.trim().toLowerCase();
      
      isCorrect = (sanitizedUser === sanitizedCorrect);
      
      // Fallback alternatives check
      if (!isCorrect && q.altAnswers) {
        isCorrect = q.altAnswers.some(ans => sanitizedUser === ans.trim().toLowerCase());
      }
    }

    if (isCorrect) scoreRaw++;
    updateStreak(isCorrect);
  });

  const percentage = Math.round((scoreRaw / totalQty) * 100);
  const grade = determineLetterGrade(percentage);

  checkAchievements(scoreRaw, totalQty, percentage, state.elapsedTime);

  renderResultsScreen(scoreRaw, totalQty, percentage, grade);
  registerLeaderboardScore();
}

function determineLetterGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// ==================== RENDERING COMPARATIVE REVIEW ====================
function renderResultsScreen(scoreRaw, totalQty, percentage, grade) {
  // Animated counters
  el.metricScoreRaw.textContent = `${scoreRaw} / ${totalQty}`;
  animateCounter(el.metricScorePct, percentage, '%');
  el.metricScoreGrade.textContent = grade;
  el.metricElapsed.textContent = formatMMSS(state.elapsedTime);

  // Player name
  const playerName = el.playerNameInput.value.trim();
  el.resultsPlayerName.textContent = `${state.selectedAvatar} Great job, ${playerName}!`;

  // Confetti for high scores
  if (percentage >= 85 && window.confetti) {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }

  // Conditional positive headings
  if (percentage >= 85) {
    el.resultsHeadlineText.textContent = "Prestigious Performance!";
  } else if (percentage >= 70) {
    el.resultsHeadlineText.textContent = "Professional Evaluation Clear!";
  } else if (percentage >= 50) {
    el.resultsHeadlineText.textContent = "Evaluation Complete!";
  } else {
    el.resultsHeadlineText.textContent = "Revision Action Recommended";
  }

  // Compile full accordion review sheets
  el.resultsReviewAccordion.innerHTML = '';

  state.activeQuestions.forEach((q, index) => {
    const userAnswer = state.userAnswers[q.id];
    let isCorrect = false;

    if (q.type === 'single') {
      isCorrect = (userAnswer && userAnswer === q.answer);
    } else if (q.type === 'multiple') {
      if (userAnswer && Array.isArray(userAnswer)) {
        const sortedUser = [...userAnswer].sort();
        const sortedCorrect = [...q.answer].sort();
        isCorrect = (sortedUser.length === sortedCorrect.length && 
                     sortedUser.every((value, i) => value === sortedCorrect[i]));
      }
    } else if (q.type === 'blank') {
      const userStr = (userAnswer || "").trim().toLowerCase();
      isCorrect = (userStr === q.answer.trim().toLowerCase()) || 
                  (q.altAnswers && q.altAnswers.some(ans => userStr === ans.trim().toLowerCase()));
    }

    // Format display lists
    let userDisplayStr = '';
    if (q.type === 'multiple') {
      userDisplayStr = userAnswer ? userAnswer.join(', ') : 'None selected';
    } else {
      userDisplayStr = userAnswer ? userAnswer : 'Blank submission';
    }

    let correctDisplayStr = '';
    if (q.type === 'multiple') {
      correctDisplayStr = q.answer.join(', ');
    } else {
      correctDisplayStr = q.answer;
    }

    const reviewUnit = document.createElement('div');
    reviewUnit.className = `p-4 mb-3 rounded-xl border ${
      isCorrect 
        ? 'border-emerald-200 dark:border-emerald-990/30 bg-emerald-500/5 dark:bg-emerald-950/10' 
        : 'border-rose-200 dark:border-rose-990/30 bg-rose-500/5 dark:bg-rose-950/10'
    }`;

    reviewUnit.innerHTML = `
      <div class="flex items-start justify-between space-x-2">
        <h4 class="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">
          <span class="mr-1 text-slate-400 font-mono">Question ${index + 1}:</span>
          ${q.question}
        </h4>
        <span class="inline-flex items-center space-x-1 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
          isCorrect 
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400' 
            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400'
        }">
          <i data-lucide="${isCorrect ? 'check' : 'x'}" class="w-3.5 h-3.5"></i>
          <span>${isCorrect ? 'Correct' : 'Incorrect'}</span>
        </span>
      </div>

      <!-- Comparison Block columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 pt-3 border-t border-slate-200/10 text-xs">
        <div class="p-2.5 rounded-lg bg-white/20 dark:bg-slate-900/20">
          <span class="text-slate-400 font-medium block text-[10px] uppercase tracking-widest mb-1">Your Answer:</span>
          <span class="font-bold mb-0.5 inline-block ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}" style="text-shadow: none">${userDisplayStr}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white/20 dark:bg-slate-900/20">
          <span class="text-slate-400 font-medium block text-[10px] uppercase tracking-widest mb-1">Correct Answer:</span>
          <span class="font-bold mb-0.5 inline-block text-emerald-600 dark:text-emerald-400" style="text-shadow: none">${correctDisplayStr}</span>
        </div>
      </div>

      <!-- Explanatory description card bubble -->
      <div class="mt-3.5 p-3 rounded-lg bg-white/40 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/10 text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <strong class="text-slate-600 dark:text-slate-300">Explanation:</strong> ${q.explanation}
      </div>
    `;

    el.resultsReviewAccordion.appendChild(reviewUnit);
  });

  // Switch display screens
  el.screenWelcome.classList.add('hidden');
  el.screenQuiz.classList.add('hidden');
  el.screenResults.classList.remove('hidden');

  // Render performance chart
  renderPerformanceChart(state.activeQuestions, state.userAnswers);

  // Render mastery bars
  if (state.currentUser) {
    renderMasteryBars(state.currentUser.mastery || {});
    updateMastery(percentage);
  } else {
    renderMasteryBars({ html: 0, css: 0, javascript: 0, general: 0 });
  }

  // Load player history
  loadPlayerHistory(playerName);

  if (window.lucide) window.lucide.createIcons();
}

// ==================== SOUND EFFECTS ====================
function playSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'correct') {
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'warning') {
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  }
}

// ==================== HINT SYSTEM ====================
function useHint() {
  if (state.hintsRemaining <= 0 || state.hintUsedForCurrent) return;
  const q = state.activeQuestions[state.currentIndex];
  if (!q) return;

  state.hintsRemaining--;
  state.hintUsedForCurrent = true;
  el.hintsRemaining.textContent = state.hintsRemaining;

  let hintMsg = '';
  if (q.type === 'single' || q.type === 'multiple') {
    // Eliminate one wrong option visually
    const wrongOptions = q.options.filter(opt => {
      const correct = Array.isArray(q.answer) ? q.answer : [q.answer];
      return !correct.includes(opt.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    });
    if (wrongOptions.length > 0) {
      const toEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      state.eliminatedOptions = [toEliminate];
      hintMsg = `💡 One wrong option has been crossed out.`;
      // Grey out eliminated option
      document.querySelectorAll('.option-card').forEach(card => {
        const span = card.querySelector('span:last-of-type') || card.querySelector('span');
        if (card.textContent.includes(toEliminate.replace(/&lt;/g,'<').replace(/&gt;/g,'>'))) {
          card.classList.add('opacity-40', 'pointer-events-none', 'line-through');
        }
      });
    }
  } else if (q.type === 'blank') {
    const answer = q.answer;
    hintMsg = `💡 The answer starts with "${answer[0].toUpperCase()}" and has ${answer.length} characters.`;
  }

  el.hintText.textContent = hintMsg;
  el.hintBox.classList.remove('hidden');
  el.hintBox.classList.add('slide-down');

  if (state.hintsRemaining <= 0) {
    el.hintBtn.disabled = true;
    el.hintBtn.className = 'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/30 border border-slate-200/40 text-slate-400 text-xs font-semibold cursor-not-allowed opacity-50';
  }
}

// ==================== STREAK TRACKER ====================
function updateStreak(isCorrect) {
  if (isCorrect) {
    state.streak++;
    if (state.streak >= 2) {
      el.streakContainer.classList.remove('hidden');
      el.streakLabel.textContent = `${state.streak} Streak!`;
      el.streakContainer.classList.add('streak-pop');
      setTimeout(() => el.streakContainer.classList.remove('streak-pop'), 400);
    }
    playSound('correct');
  } else {
    state.streak = 0;
    el.streakContainer.classList.add('hidden');
    playSound('wrong');
  }
}

// ==================== ANIMATED SCORE COUNTER ====================
function animateCounter(element, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    element.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 30);
}

// ==================== PERFORMANCE CHART ====================
function renderPerformanceChart(questions, userAnswers) {
  const categories = {};
  questions.forEach(q => {
    const cat = q.id.split('_')[0].toUpperCase();
    if (!categories[cat]) categories[cat] = { correct: 0, wrong: 0 };
    const ua = userAnswers[q.id];
    let correct = false;
    if (q.type === 'single') correct = ua === q.answer;
    else if (q.type === 'multiple') {
      if (ua && Array.isArray(ua)) {
        const su = [...ua].sort(), sc = [...q.answer].sort();
        correct = su.length === sc.length && su.every((v, i) => v === sc[i]);
      }
    } else if (q.type === 'blank') {
      const s = (ua || '').trim().toLowerCase();
      correct = s === q.answer.trim().toLowerCase() || (q.altAnswers && q.altAnswers.some(a => s === a.trim().toLowerCase()));
    }
    if (correct) categories[cat].correct++; else categories[cat].wrong++;
  });

  const labels = Object.keys(categories);
  const correctData = labels.map(l => categories[l].correct);
  const wrongData = labels.map(l => categories[l].wrong);

  const canvas = document.getElementById('performance-chart');
  if (state.performanceChart) state.performanceChart.destroy();

  state.performanceChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Correct', data: correctData, backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 },
        { label: 'Wrong', data: wrongData, backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { font: { size: 11 }, color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148,163,184,0.1)' } }
      }
    }
  });
}

function skipQuestion() {
  const totalQty = state.activeQuestions.length;
  if (state.currentIndex < totalQty - 1) {
    state.skippedQuestions.add(state.currentIndex);
    state.currentIndex++;
    renderActiveQuestion();
  }
}

// ==================== POWER-UPS ====================
function usePowerup5050() {
  if (state.powerup5050 <= 0) return;
  const q = state.activeQuestions[state.currentIndex];
  if (!q || q.type === 'blank') return;

  const correct = Array.isArray(q.answer) ? q.answer : [q.answer];
  const wrong = q.options.filter(o => !correct.includes(o.replace(/&lt;/g,'<').replace(/&gt;/g,'>')));
  const toRemove = wrong.sort(() => 0.5 - Math.random()).slice(0, 2);

  document.querySelectorAll('.option-card').forEach(card => {
    toRemove.forEach(r => {
      if (card.textContent.includes(r.replace(/&lt;/g,'<').replace(/&gt;/g,'>'))) {
        card.classList.add('opacity-30', 'pointer-events-none');
      }
    });
  });

  state.powerup5050--;
  el.powerup5050Count.textContent = `(${state.powerup5050})`;
  if (state.powerup5050 <= 0) el.powerup5050Btn.classList.add('opacity-40','pointer-events-none');
}

function usePowerupTime() {
  if (state.powerupTime <= 0) return;
  state.timeRemaining += 30;
  state.powerupTime--;
  el.powerupTimeCount.textContent = `(${state.powerupTime})`;
  if (state.powerupTime <= 0) el.powerupTimeBtn.classList.add('opacity-40','pointer-events-none');
  updateTimerDisplay();
}

// ==================== COUNTDOWN SPLASH ====================
function showCountdown(callback) {
  let count = 3;
  el.countdownSplash.classList.remove('hidden');
  el.countdownNumber.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      el.countdownSplash.classList.add('hidden');
      callback();
    } else {
      el.countdownNumber.textContent = count;
    }
  }, 800);
}

// ==================== AVATAR ====================
const AVATARS = ['🎮','🦁','🐯','🦊','🐺','🦄','🐉','🤖','👾','🧙','🦸','🥷'];

function initAvatarGrid() {
  AVATARS.forEach(av => {
    const btn = document.createElement('button');
    btn.textContent = av;
    btn.className = 'text-2xl p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-all cursor-pointer border-2 border-transparent';
    btn.addEventListener('click', () => {
      document.querySelectorAll('#avatar-grid button').forEach(b => b.classList.remove('border-blue-500'));
      btn.classList.add('border-blue-500');
      state.selectedAvatar = av;
      el.avatarPickBtn.textContent = av;
    });
    el.avatarGrid.appendChild(btn);
  });
}

// ==================== ACHIEVEMENTS ====================
function checkAchievements(scoreRaw, totalQty, percentage, elapsedTime) {
  const badges = [];
  if (percentage === 100) badges.push({ icon: '🏆', title: 'Perfect Score!', desc: 'Answered every question correctly' });
  if (elapsedTime < 60) badges.push({ icon: '⚡', title: 'Speed Demon!', desc: 'Finished in under 1 minute' });
  if (state.hintsRemaining === 2 && state.powerup5050 === 1) badges.push({ icon: '🧠', title: 'No Help Needed!', desc: 'Completed without hints or power-ups' });
  if (state.streak >= 3) badges.push({ icon: '🔥', title: 'On Fire!', desc: `${state.streak} question streak` });

  if (badges.length > 0) {
    showAchievementToast(badges[0]);
  }
  return badges;
}

function showAchievementToast(badge) {
  el.achievementIcon.textContent = badge.icon;
  el.achievementTitle.textContent = badge.title;
  el.achievementDesc.textContent = badge.desc;
  el.achievementToast.classList.remove('hidden');
  setTimeout(() => el.achievementToast.classList.add('hidden'), 4000);
}

// ==================== PERSONAL DASHBOARD ====================
function showDashboard() {
  const name = el.playerNameInput.value.trim();
  if (!name) {
    alert('Enter your name on the welcome screen first to see your stats.');
    return;
  }
  el.dashboardPlayerLabel.textContent = `Stats for ${state.selectedAvatar} ${name}`;
  el.dashboardContent.innerHTML = '<div class="text-xs text-slate-400 text-center p-4">Loading...</div>';
  showModal('dashboard', true);

  fetch(`${API_URL}/dashboard/${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      if (!data) {
        el.dashboardContent.innerHTML = '<div class="text-xs text-slate-400 text-center p-4">No quiz history found for this name.</div>';
        return;
      }
      const trendLabels = data.records.slice(-6).map((_, i) => `#${i+1}`);
      const trendData = data.records.slice(-6).map(r => r.pct);

      el.dashboardContent.innerHTML = `
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-white/40 dark:bg-slate-900/30 p-3 rounded-xl text-center border border-white/50 dark:border-white/5">
            <div class="text-xs text-slate-400 mb-1">Total Quizzes</div>
            <div class="text-2xl font-black text-slate-800 dark:text-white">${data.total}</div>
          </div>
          <div class="bg-white/40 dark:bg-slate-900/30 p-3 rounded-xl text-center border border-white/50 dark:border-white/5">
            <div class="text-xs text-slate-400 mb-1">Best Score</div>
            <div class="text-2xl font-black text-emerald-500">${data.best}%</div>
          </div>
          <div class="bg-white/40 dark:bg-slate-900/30 p-3 rounded-xl text-center border border-white/50 dark:border-white/5">
            <div class="text-xs text-slate-400 mb-1">Average Score</div>
            <div class="text-2xl font-black text-blue-500">${data.avg}%</div>
          </div>
          <div class="bg-white/40 dark:bg-slate-900/30 p-3 rounded-xl text-center border border-white/50 dark:border-white/5">
            <div class="text-xs text-slate-400 mb-1">Fav Category</div>
            <div class="text-sm font-black text-indigo-500">${data.favCat}</div>
          </div>
        </div>
        <div class="p-3 rounded-xl bg-white/40 dark:bg-slate-900/30 border border-white/50 dark:border-white/5">
          <div class="text-xs text-slate-400 mb-2">Score Trend</div>
          <canvas id="trend-chart" height="100"></canvas>
        </div>
      `;

      if (window.Chart) {
        if (state.trendChart) state.trendChart.destroy();
        state.trendChart = new Chart(document.getElementById('trend-chart'), {
          type: 'line',
          data: {
            labels: trendLabels,
            datasets: [{ label: 'Score %', data: trendData, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true, pointRadius: 4 }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
              y: { min: 0, max: 100, ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.1)' } }
            }
          }
        });
      }
    })
    .catch(() => { el.dashboardContent.innerHTML = '<div class="text-xs text-rose-400 text-center p-4">Failed to load stats.</div>'; });
}

// ==================== EXPORT PDF ====================
function exportResultsPDF() {
  if (!window.jspdf) return alert('PDF library not loaded.');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const name = el.playerNameInput.value.trim();
  const pct = el.metricScorePct.textContent;
  const score = el.metricScoreRaw.textContent;
  const grade = el.metricScoreGrade.textContent;
  const elapsed = el.metricElapsed.textContent;

  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('QuizAcademy Result Card', 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(`Player: ${state.selectedAvatar} ${name}`, 20, 35);
  doc.text(`Category: ${CATEGORY_NAMES[state.activeCategory]}`, 20, 45);
  doc.text(`Difficulty: ${state.activeDifficulty.toUpperCase()}`, 20, 55);
  doc.text(`Score: ${score}  |  Percentage: ${pct}  |  Grade: ${grade}`, 20, 65);
  doc.text(`Time Elapsed: ${elapsed}`, 20, 75);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 85);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  let y = 100;
  state.activeQuestions.forEach((q, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const ua = state.userAnswers[q.id];
    const correct = Array.isArray(q.answer) ? q.answer.join(', ') : q.answer;
    doc.text(`Q${i+1}: ${q.question.substring(0, 80)}`, 20, y);
    y += 7;
    doc.text(`  Your Answer: ${Array.isArray(ua) ? ua.join(', ') : (ua || 'Skipped')}`, 20, y);
    y += 7;
    doc.text(`  Correct: ${correct}`, 20, y);
    y += 10;
  });

  doc.save(`quiz-result-${name}-${Date.now()}.pdf`);
}

// ==================== MODAL HELPER ====================
function showModal(type, isOpen) {
  const map = {
    avatar: el.modalAvatar,
    dashboard: el.modalDashboard,
    auth: el.modalAuth,
    badges: el.modalBadges,
    'custom-quiz': el.modalCustomQuiz,
    share: el.modalShare
  };
  const modal = map[type];
  if (!modal) return;
  if (isOpen) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
  else { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

// ==================== PRACTICE MODE ====================
function togglePracticeMode() {
  state.practiceMode = !state.practiceMode;
  el.practiceModeToggle.setAttribute('aria-checked', state.practiceMode);
  if (state.practiceMode) {
    el.practiceModeToggle.classList.replace('bg-slate-300','bg-blue-500');
    el.practiceModeKnob.style.transform = 'translateX(20px)';
  } else {
    el.practiceModeToggle.classList.replace('bg-blue-500','bg-slate-300');
    el.practiceModeKnob.style.transform = 'translateX(0)';
  }
}

// ==================== AUTH ====================
let authMode = 'login';

function setAuthTab(mode) {
  authMode = mode;
  el.authError.classList.add('hidden');
  if (mode === 'login') {
    el.authTabLogin.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm transition-all';
    el.authTabRegister.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition-all';
    el.authSubmitBtn.textContent = 'Login';
  } else {
    el.authTabRegister.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm transition-all';
    el.authTabLogin.className = 'flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition-all';
    el.authSubmitBtn.textContent = 'Register';
  }
}

function handleAuth() {
  const username = el.authUsername.value.trim();
  const password = el.authPassword.value.trim();
  if (!username || !password) {
    el.authError.textContent = 'Username and password are required.';
    el.authError.classList.remove('hidden');
    return;
  }
  const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
  fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, avatar: state.selectedAvatar })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        el.authError.textContent = data.error;
        el.authError.classList.remove('hidden');
        return;
      }
      localStorage.setItem('quiz_token', data.token);
      applyUserSession(data.user);
      el.playerNameInput.value = data.user.username;
      showModal('auth', false);
    })
    .catch(() => {
      el.authError.textContent = 'Server error. Is backend running?';
      el.authError.classList.remove('hidden');
    });
}

function handleLogout() {
  localStorage.removeItem('quiz_token');
  state.currentUser = null;
  el.navAuthLabel.textContent = 'Login';
  el.authLoggedIn.classList.add('hidden');
  el.authUsername.classList.remove('hidden');
  el.authPassword.classList.remove('hidden');
  el.authSubmitBtn.classList.remove('hidden');
  showModal('auth', false);
}

function restoreSession(token) {
  fetch(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(user => {
      if (user && user.username) {
        applyUserSession(user);
        el.playerNameInput.value = user.username;
      }
    })
    .catch(() => localStorage.removeItem('quiz_token'));
}

function applyUserSession(user) {
  state.currentUser = user;
  state.selectedAvatar = user.avatar || '🎮';
  el.avatarPickBtn.textContent = state.selectedAvatar;
  el.navAuthLabel.textContent = user.username;
  el.authUserDisplay.textContent = `${user.avatar} ${user.username}`;
  el.authStreakDisplay.textContent = `🔥 ${user.loginStreak} day login streak`;
  el.authLoggedIn.classList.remove('hidden');
  el.authUsername.classList.add('hidden');
  el.authPassword.classList.add('hidden');
  el.authSubmitBtn.classList.add('hidden');
  el.authError.classList.add('hidden');
}

// ==================== BADGE COLLECTION ====================
const ALL_BADGES = [
  { icon: '🏆', title: 'Perfect Score', desc: 'Score 100%' },
  { icon: '⚡', title: 'Speed Demon', desc: 'Finish in < 1 min' },
  { icon: '🧠', title: 'No Help Needed', desc: 'No hints/power-ups' },
  { icon: '🔥', title: 'On Fire', desc: '3+ streak' },
  { icon: '🌟', title: 'First Quiz', desc: 'Complete first quiz' },
  { icon: '💡', title: 'Hint Master', desc: 'Use all hints' },
  { icon: '🌍', title: 'All Categories', desc: 'Play all categories' },
  { icon: '👑', title: 'Top of Leaderboard', desc: 'Reach #1' }
];

function renderBadgeCollection() {
  const earned = state.currentUser?.badges || [];
  el.badgeCollectionGrid.innerHTML = '';
  ALL_BADGES.forEach(b => {
    const has = earned.includes(b.title);
    const div = document.createElement('div');
    div.className = `text-center p-2 rounded-xl border ${ has ? 'border-amber-300/50 bg-amber-50 dark:bg-amber-950/20' : 'border-slate-200/40 bg-slate-50 dark:bg-slate-900/20 opacity-40' }`;
    div.innerHTML = `<div class="text-2xl mb-1">${b.icon}</div><div class="text-[10px] font-bold text-slate-700 dark:text-slate-300">${b.title}</div><div class="text-[9px] text-slate-400">${b.desc}</div>`;
    el.badgeCollectionGrid.appendChild(div);
  });
}

// ==================== CUSTOM QUIZ ====================
function addCustomQuestion() {
  const token = localStorage.getItem('quiz_token');
  if (!token) { alert('Please login to add custom questions.'); return; }

  const q = el.cqQuestion.value.trim();
  const a = el.cqOptA.value.trim();
  const b = el.cqOptB.value.trim();
  const c = el.cqOptC.value.trim();
  const d = el.cqOptD.value.trim();
  const answerKey = el.cqAnswer.value;
  const explanation = el.cqExplanation.value.trim();

  if (!q || !a || !b || !c || !d || !answerKey) { alert('Fill all fields and select the correct answer.'); return; }

  const optMap = { a, b, c, d };
  const question = { question: q, type: 'single', options: [a, b, c, d], answer: optMap[answerKey], explanation: explanation || 'No explanation provided.' };

  fetch(`${API_URL}/user/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(question)
  })
    .then(res => res.json())
    .then(questions => {
      state.customQuestions = questions;
      [el.cqQuestion, el.cqOptA, el.cqOptB, el.cqOptC, el.cqOptD, el.cqExplanation].forEach(i => i.value = '');
      el.cqAnswer.value = '';
      renderCustomQuestionList(questions);
    })
    .catch(() => alert('Failed to save question.'));
}

function loadCustomQuestions() {
  const token = localStorage.getItem('quiz_token');
  if (!token) { el.cqList.innerHTML = '<p class="text-xs text-slate-400">Login to manage custom questions.</p>'; return; }
  fetch(`${API_URL}/user/questions`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(questions => { state.customQuestions = questions; renderCustomQuestionList(questions); })
    .catch(() => {});
}

function renderCustomQuestionList(questions) {
  el.cqList.innerHTML = '';
  if (!questions.length) return;
  el.cqStartBtn.classList.remove('hidden');
  questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/40 text-xs text-slate-700 dark:text-slate-300';
    div.innerHTML = `<span class="flex-1 truncate">${q.question}</span><button data-id="${q.id}" class="ml-2 text-rose-400 hover:text-rose-600 cursor-pointer cq-delete-btn"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>`;
    el.cqList.appendChild(div);
  });
  document.querySelectorAll('.cq-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteCustomQuestion(btn.dataset.id));
  });
  if (window.lucide) window.lucide.createIcons();
}

function deleteCustomQuestion(id) {
  const token = localStorage.getItem('quiz_token');
  if (!token) return;
  fetch(`${API_URL}/user/questions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(questions => { state.customQuestions = questions; renderCustomQuestionList(questions); })
    .catch(() => {});
}

function startCustomQuiz() {
  if (!state.customQuestions.length) return;
  state.activeQuestions = [...state.customQuestions].sort(() => 0.5 - Math.random());
  state.activeCategory = 'custom';
  state.activeDifficulty = 'custom';
  state.currentIndex = 0;
  state.userAnswers = {};
  state.skippedQuestions = new Set();
  state.scoreRegisterCompleted = false;
  state.streak = 0;
  state.hintsRemaining = 2;
  state.hintUsedForCurrent = false;
  state.eliminatedOptions = [];
  state.powerup5050 = 1;
  state.powerupTime = 1;
  state.achievements = [];

  el.hintsRemaining.textContent = '2';
  el.powerup5050Count.textContent = '(1)';
  el.powerupTimeCount.textContent = '(1)';
  el.streakContainer.classList.add('hidden');
  el.hintBox.classList.add('hidden');
  el.activeCategoryBadge.textContent = 'Custom Quiz';
  el.activeDifficultyBadge.textContent = 'CUSTOM';

  showModal('custom-quiz', false);
  el.screenWelcome.classList.add('hidden');
  el.screenResults.classList.add('hidden');

  showCountdown(() => {
    el.screenQuiz.classList.remove('hidden');
    if (!state.practiceMode) startTimer(state.activeQuestions.length * SECONDS_PER_QUESTION);
    else el.timeRemainingLabel.textContent = '∞';
    renderActiveQuestion();
  });
}

// ==================== SHARE RESULT CARD ====================
function openShareModal() {
  const name = el.playerNameInput.value.trim();
  const pct = el.metricScorePct.textContent;
  const score = el.metricScoreRaw.textContent;
  const grade = el.metricScoreGrade.textContent;
  el.shareAvatar.textContent = state.selectedAvatar;
  el.shareName.textContent = name;
  el.shareScore.textContent = pct;
  el.shareMeta.textContent = `${score} correct • Grade ${grade} • ${CATEGORY_NAMES[state.activeCategory] || 'Custom'} • ${state.activeDifficulty.toUpperCase()}`;
  showModal('share', true);
  if (window.lucide) window.lucide.createIcons();
}

function copyShareText() {
  const name = el.playerNameInput.value.trim();
  const text = `${state.selectedAvatar} ${name} scored ${el.metricScorePct.textContent} on QuizAcademy! Category: ${CATEGORY_NAMES[state.activeCategory] || 'Custom'} • Grade: ${el.metricScoreGrade.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    el.shareCopyBtn.querySelector('span').textContent = 'Copied!';
    setTimeout(() => el.shareCopyBtn.querySelector('span').textContent = 'Copy Text', 2000);
  });
}

function downloadShareCard() {
  if (!window.jspdf) { alert('PDF library not loaded.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [120, 80] });
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 120, 80, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(el.metricScorePct.textContent, 60, 35, { align: 'center' });
  doc.setFontSize(12);
  doc.text(el.playerNameInput.value.trim(), 60, 48, { align: 'center' });
  doc.setFontSize(8);
  doc.text('QuizAcademy', 60, 72, { align: 'center' });
  doc.save(`quiz-share-${Date.now()}.pdf`);
}

// ==================== MASTERY BARS ====================
function renderMasteryBars(mastery) {
  if (!el.masteryBars) return;
  const cats = { 'HTML': mastery.html || 0, 'CSS': mastery.css || 0, 'JavaScript': mastery.javascript || 0, 'General': mastery.general || 0 };
  el.masteryBars.innerHTML = Object.entries(cats).map(([cat, pct]) => `
    <div>
      <div class="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1"><span>${cat}</span><span class="font-bold">${pct}%</span></div>
      <div class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style="width:${pct}%"></div>
      </div>
    </div>
  `).join('');
}

// ==================== UPDATE MASTERY ====================
function updateMastery(percentage) {
  const token = localStorage.getItem('quiz_token');
  if (!token || !state.activeCategory || state.activeCategory === 'custom') return;
  fetch(`${API_URL}/user/mastery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ category: CATEGORY_NAMES[state.activeCategory], pct: percentage })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mastery && state.currentUser) {
        state.currentUser.mastery = data.mastery;
        renderMasteryBars(data.mastery);
      }
    })
    .catch(() => {});
}

// ==================== API BASE URL ====================
const API_URL = 'http://localhost:5000/api';

// ==================== LEADERBOARD LOGGING ACTIONS ====================
function registerLeaderboardScore() {
  if (state.scoreRegisterCompleted) return;

  const candidateName = el.playerNameInput.value.trim();
  if (!candidateName) return;

  const scoreRaw = parseInt(el.metricScoreRaw.textContent.split('/')[0]);
  const scorePct = parseInt(el.metricScorePct.textContent);
  const letterGrade = el.metricScoreGrade.textContent;

  const newRecord = {
    name: candidateName,
    pct: scorePct,
    score: scoreRaw,
    total: state.activeQuestions.length,
    grade: letterGrade,
    category: CATEGORY_NAMES[state.activeCategory],
    difficulty: state.activeDifficulty.toUpperCase(),
    elapsed: state.elapsedTime
  };

  fetch(`${API_URL}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord)
  })
    .then(res => res.json())
    .then(() => {
      state.scoreRegisterCompleted = true;
      el.registerSuccessIndicator.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    })
    .catch(err => alert('Failed to save score: ' + err.message));
}

function clearLeaderboardScores() {
  if (confirm("Are you sure you want to permanently clear the leaderboard? This action cannot be undone.")) {
    fetch(`${API_URL}/leaderboard`, { method: 'DELETE' })
      .then(() => renderLeaderboardList())
      .catch(err => alert('Failed to clear leaderboard: ' + err.message));
  }
}

function renderLeaderboardList() {
  el.leaderboardList.innerHTML = '<div class="text-center text-xs text-slate-400 p-3">Loading...</div>';
  const cat = el.leaderboardFilterCat.value;
  const diff = el.leaderboardFilterDiff.value;
  const params = new URLSearchParams();
  if (cat) params.set('category', cat);
  if (diff) params.set('difficulty', diff);
  fetch(`${API_URL}/leaderboard?${params}`)
    .then(res => res.json())
    .then(data => _displayLeaderboard(data.scores || data, data.avg || 0))
    .catch(err => {
      el.leaderboardList.innerHTML = `<div class="text-center text-rose-400 text-xs p-4">Failed to load leaderboard: ${err.message}</div>`;
    });
}

function loadPlayerHistory(name) {
  fetch(`${API_URL}/history/${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(records => {
      if (records.length <= 1) return;
      const best = Math.max(...records.map(r => r.pct));
      const historyEl = document.createElement('div');
      historyEl.className = 'mb-6 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-white/50 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400';
      historyEl.innerHTML = `
        <div class="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
          <i data-lucide="history" class="w-3.5 h-3.5 mr-1.5"></i> Your Past Attempts
        </div>
        <div class="space-y-1">
          ${records.map((r, i) => `
            <div class="flex justify-between items-center">
              <span>#${i + 1} ${r.category} · ${r.difficulty}</span>
              <span class="font-mono font-bold ${r.pct === best ? 'text-emerald-500' : 'text-slate-500'}">${r.pct}% ${r.pct === best ? '⭐' : ''}</span>
            </div>`).join('')}
        </div>
      `;
      el.leaderboardRegisterContainer.after(historyEl);
      if (window.lucide) window.lucide.createIcons();
    })
    .catch(() => {});
}

function _displayLeaderboard(list, avg = 0) {

  el.leaderboardList.innerHTML = '';
  if (list.length === 0) {
    el.leaderboardList.innerHTML = `
      <div class="dark:bg-slate-900/10 rounded-2xl p-6 text-center border border-dashed border-slate-300 dark:border-slate-850 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
        <i data-lucide="inbox" class="w-8 h-8"></i>
        <div class="text-xs">No records logged in Local Storage yet</div>
      </div>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }

  list.forEach((entry, index) => {
    const isTopThree = (index < 3);
    let ordinalHighlightClass = '';
    let medalColorStr = '';

    if (index === 0) {
      ordinalHighlightClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 scale-105 shadow-sm ring-1 ring-amber-500/20';
      medalColorStr = 'text-amber-500';
    } else if (index === 1) {
      ordinalHighlightClass = 'bg-slate-100 text-slate-850 dark:bg-slate-900 dark:text-slate-300 scale-102';
      medalColorStr = 'text-slate-400';
    } else if (index === 2) {
      ordinalHighlightClass = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400';
      medalColorStr = 'text-orange-600';
    } else {
      ordinalHighlightClass = 'bg-slate-50 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400';
    }

    const durationDisplay = formatMMSS(entry.elapsed);

    const recordDiv = document.createElement('div');
    recordDiv.className = `flex items-center justify-between p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-900/40 relative overflow-hidden bg-white/70 dark:bg-slate-950/20 ${index === 0 ? 'border-amber-400/30' : ''}`;

    recordDiv.innerHTML = `
      <div class="flex items-center space-x-3">
        <!-- Index circular badge -->
        <div class="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold leading-none ${ordinalHighlightClass}">
          ${index + 1}
        </div>
        <div>
          <!-- Student name -->
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <span>${entry.name}</span>
            ${isTopThree ? `<i data-lucide="medal" class="w-3.5 h-3.5 ml-1 flex-shrink-0 ${medalColorStr}"></i>` : ''}
          </h4>
          <!-- Meta stats description -->
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-medium space-x-1 sm:space-x-1.5 mt-0.5">
            <span>${entry.category}</span>
            <span>•</span>
            <span class="font-bold">${entry.difficulty}</span>
          </div>
        </div>
      </div>

      <!-- Stats details columns -->
      <div class="text-right flex items-center space-x-3">
        <div class="text-right">
          <span class="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400 block">${entry.pct}%</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">Elapsed: ${durationDisplay}</span>
        </div>
        <!-- Letter Grade Box -->
        <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black font-mono">
          ${entry.grade}
        </div>
      </div>
    `;

    el.leaderboardList.appendChild(recordDiv);
  });

  // Average score footer
  if (avg > 0) {
    const avgDiv = document.createElement('div');
    avgDiv.className = 'mt-3 pt-3 border-t border-slate-200/20 dark:border-slate-800/30 text-center text-xs text-slate-400 dark:text-slate-500';
    avgDiv.innerHTML = `Global Average Score: <span class="font-bold text-indigo-500">${avg}%</span>`;
    el.leaderboardList.appendChild(avgDiv);
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==================== SCREEN SWITCH NAVIGATION BACK ====================
function restartToWelcome() {
  if (state.timerId) clearInterval(state.timerId);
  
  el.playerNameInput.value = '';
  el.screenQuiz.classList.add('hidden');
  el.screenResults.classList.add('hidden');
  el.screenWelcome.classList.remove('hidden');
  
  syncSetupMetrics();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==================== DIALOG BOX MODALS TRIGGER ====================
function showLeaderboardModal(isOpen) {
  if (!el.modalLeaderboard) return;

  if (isOpen) {
    renderLeaderboardList();
    el.modalLeaderboard.classList.remove('hidden');
    el.modalLeaderboard.classList.add('flex');
  } else {
    el.modalLeaderboard.classList.add('hidden');
    el.modalLeaderboard.classList.remove('flex');
  }
}

function showInfoModal(isOpen) {
  if (!el.modalInfo) return;

  if (isOpen) {
    el.modalInfo.classList.remove('hidden');
    el.modalInfo.classList.add('flex');
  } else {
    el.modalInfo.classList.add('hidden');
    el.modalInfo.classList.remove('flex');
  }
}

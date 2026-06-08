/**
 * Web Developer Internship Project - Interactive Quiz Game Application
 * Main application script coordinating state, timer, dynamic rendering & leaderboard.
 */

import { questionBank } from './questions.js';

// --- STATE MANAGEMENT ---
let state = {
  activeCategory: 'html',
  activeDifficulty: 'easy',
  activeQuestions: [], // Loaded questions array
  currentIndex: 0,      // Current question index
  userAnswers: {},     // Keeps key-value dictionary of { questionId: answerValue }
  timeRemaining: 0,    // quiz seconds remaining
  elapsedTime: 0,      // duration spent
  timerId: null,       // interval reference
  scoreRegisterCompleted: false, // flag for current round leaderboard log
  theme: 'light'       // light or dark
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
  
  // Initialize standard Lucide icons on DOM render
  if (window.lucide) {
    window.lucide.createIcons();
  }
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
  state.scoreRegisterCompleted = false;

  // Configure details & timer
  const totalSeconds = state.activeQuestions.length * SECONDS_PER_QUESTION;
  
  // Set badges
  el.activeCategoryBadge.textContent = CATEGORY_NAMES[state.activeCategory];
  el.activeDifficultyBadge.textContent = state.activeDifficulty.toUpperCase();
  
  // Color classification for difficulty badge
  el.activeDifficultyBadge.className = 'px-2.5 py-1 text-xs font-bold rounded-lg';
  if (state.activeDifficulty === 'easy') {
    el.activeDifficultyBadge.classList.add('bg-emerald-100', 'dark:bg-emerald-950/40', 'text-emerald-700', 'dark:text-emerald-400');
  } else if (state.activeDifficulty === 'medium') {
    el.activeDifficultyBadge.classList.add('bg-amber-100', 'dark:bg-amber-950/40', 'text-amber-700', 'dark:text-amber-400');
  } else {
    el.activeDifficultyBadge.classList.add('bg-rose-100', 'dark:bg-rose-950/40', 'text-rose-700', 'dark:text-rose-400');
  }

  // Transition UI screen layouts
  el.screenWelcome.classList.add('hidden');
  el.screenResults.classList.add('hidden');
  el.screenQuiz.classList.remove('hidden');

  startTimer(totalSeconds);
  renderActiveQuestion();
}

// ==================== RENDERING ACTIVE QUESTION ====================
function renderActiveQuestion() {
  const currentQuestion = state.activeQuestions[state.currentIndex];
  if (!currentQuestion) return;

  // Hide validation warnings
  el.validationWarning.classList.add('hidden');

  // Update Progress bars & descriptive indicator totals
  const totalQty = state.activeQuestions.length;
  const displayOrdinal = state.currentIndex + 1;
  const progressPercent = Math.round((state.currentIndex / totalQty) * 100);

  el.questionProgressText.textContent = `Question ${displayOrdinal} of ${totalQty}`;
  el.questionProgressPercent.textContent = `${progressPercent}% Complete`;
  el.visualProgressBar.style.width = `${progressPercent}%`;

  // Render question text statement
  el.activeQuestionText.innerHTML = `<span class="text-blue-500 dark:text-blue-400 mr-1.5 font-mono">#${displayOrdinal}</span>${currentQuestion.question}`;

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
  });

  const percentage = Math.round((scoreRaw / totalQty) * 100);
  const grade = determineLetterGrade(percentage);

  // Present results panels
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
  // Update scores metrics
  el.metricScoreRaw.textContent = `${scoreRaw} / ${totalQty}`;
  el.metricScorePct.textContent = `${percentage}%`;
  el.metricScoreGrade.textContent = grade;
  
  // Format formatted elapsed duration
  el.metricElapsed.textContent = formatMMSS(state.elapsedTime);

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

  if (window.lucide) {
    window.lucide.createIcons();
  }
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
  el.leaderboardList.innerHTML = '';
  fetch(`${API_URL}/leaderboard`)
    .then(res => res.json())
    .then(list => _displayLeaderboard(list))
    .catch(err => {
      el.leaderboardList.innerHTML = `<div class="text-center text-rose-400 text-xs p-4">Failed to load leaderboard: ${err.message}</div>`;
    });
}

function _displayLeaderboard(list) {

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

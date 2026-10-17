/* ============================================================
   EnglishMaster — app.js
   Logic trang học chính: điều hướng, từ vựng, flashcard, quiz, nghe
   ============================================================ */

(function () {
  'use strict';

  /* ---------------- Kiểm tra đăng nhập ---------------- */
  const session = JSON.parse(localStorage.getItem('em_session') || 'null');

  if (!session || !session.email) {
    const duelHash = /^#duel=[A-Za-z0-9_-]+$/.test(window.location.hash)
      ? window.location.hash
      : '';
    // Chưa đăng nhập -> chuyển tới trang đăng nhập
    window.location.href = 'auth.html' + duelHash;
    return;
  }

  const USERS_KEY = 'em_users';

  /* ---------------- Gộp dữ liệu (cơ bản + nâng cao) ---------------- */
  // TOPICS/VOCABULARY/LISTENING đến từ data.js;
  // ADVANCED_* đến từ vocab-advanced.js; LISTENING_BANK từ listening-data.js
  const ALL_TOPICS = (typeof TOPICS !== 'undefined' ? TOPICS : [])
    .concat(typeof ADVANCED_TOPICS !== 'undefined' ? ADVANCED_TOPICS : []);

  const ALL_VOCAB = (typeof VOCABULARY !== 'undefined' ? VOCABULARY : [])
    .concat(typeof ADVANCED_VOCABULARY !== 'undefined' ? ADVANCED_VOCABULARY : []);

  const ALL_LISTENING = (typeof LISTENING_BANK !== 'undefined' && LISTENING_BANK.length
    ? LISTENING_BANK
    : (typeof LISTENING !== 'undefined' ? LISTENING : []));

  const ALL_NEWS = (typeof NEWS_ARTICLES !== 'undefined' ? NEWS_ARTICLES : []);

  /* ---------------- Tiện ích chung ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function toast(msg, type = '') {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = 'toast ' + type; }, 2400);
  }

  function saveUser(patch) {
    patch.stats = { ...(patch.stats || {}), ...(patch.stats ? patch.stats : {}) };
    localStorage.setItem('em_session', JSON.stringify(patch));
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  // Lấy tên chủ đề từ id (tìm trong cả chủ đề cơ bản và nâng cao)
  function topicName(id) {
    const t = ALL_TOPICS.find(x => x.id === id);
    return t ? t.name : 'Từ vựng';
  }

  function topicEmoji(id) {
    const t = ALL_TOPICS.find(x => x.id === id);
    return t ? t.emoji : '📚';
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /* ---------------- Thống kê người dùng ---------------- */
  function stats() {
    const users = loadUsers();
    const me = users[session.email];
    return {
      learned: (me && me.learned) || 0,
      points: (me && me.points) || 0,
      correct: (me && me.correct) || 0,
      answered: (me && me.answered) || 0,
      streak: (me && me.streak) || 1,
    };
  }

  function updateStats(patch) {
    const users = loadUsers();
    const me = users[session.email] || {};
    Object.keys(patch).forEach(k => {
      me[k] = patch[k] === null ? me[k] : (me[k] || 0) + patch[k];
    });
    users[session.email] = me;
    saveUsers(users);
    renderStats();
  }

  function renderStats() {
    const s = stats();
    $('#statLearned').textContent = s.learned;
    $('#statPoints').textContent = s.points;
    $('#heroScore').textContent = s.points;
    $('#statStreak').textContent = s.streak;
    $('#statAccuracy').textContent =
      s.answered > 0 ? Math.round((s.correct / s.answered) * 100) + '%' : '0%';
  }

  /* ---------------- Thông tin người dùng trên navbar ---------------- */
  function renderUser() {
    const name = session.name || session.email.split('@')[0];
    $('#userName').textContent = name;
    $('#userAvatar').textContent = name.trim().charAt(0).toUpperCase();
    $('#heroGreet').textContent = `Chào ${name}, sẵn sàng học chưa? 👋`;
  }

  /* ============================================================
     ĐIỀU HƯỚNG
     ============================================================ */
  function showSection(id) {
    $$('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if (target) target.classList.add('active');

    $$('.nav-link').forEach(a =>
      a.classList.toggle('active', a.dataset.section === id));

    $('#navLinks').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'flashcard') renderFlashcard();
    if (id === 'quiz') startQuiz();
    if (id === 'duel') renderDuelLobby();
    if (id === 'dictionary') {
      renderDictionaryHistory();
      $('#dictionarySearchInput').focus();
    }
    if (id === 'exam-prep') renderExamPrep();
    if (id === 'listening') initListening();
    if (id === 'news') renderNewsList();
  }

  $$('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(a.dataset.section);
    });
  });

  $$('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.goto));
  });

  $('#hamburger').addEventListener('click', () =>
    $('#navLinks').classList.toggle('open'));

  /* ============================================================
     DASHBOARD — chủ đề
     ============================================================ */
  function renderTopics() {
    const grid = $('#topicGrid');
    grid.innerHTML = '';
    ALL_TOPICS.forEach(t => {
      const count = ALL_VOCAB.filter(v => v.topic === t.id).length;
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.innerHTML = `
        <div class="topic-emoji">${t.emoji}</div>
        <div class="topic-name">${t.name}</div>
        <div class="topic-count">${count} từ vựng</div>`;
      card.addEventListener('click', () => {
        showSection('vocabulary');
        currentTopic = t.id;
        renderVocabChips();
        renderVocab();
      });
      grid.appendChild(card);
    });
  }

  /* ============================================================
     TỪ VỰNG
     ============================================================ */
  let currentTopic = 'all';
  let searchTerm = '';

  function renderVocabChips() {
    const wrap = $('#vocabChips');
    wrap.innerHTML = '';
    const all = [{ id: 'all', name: 'Tất cả', emoji: '🌍' }, ...ALL_TOPICS];
    all.forEach(t => {
      const b = document.createElement('button');
      b.className = 'chip' + (currentTopic === t.id ? ' active' : '');
      b.textContent = `${t.emoji} ${t.name}`;
      b.addEventListener('click', () => {
        currentTopic = t.id;
        renderVocabChips();
        renderVocab();
      });
      wrap.appendChild(b);
    });
  }

  function renderVocab() {
    const grid = $('#vocabGrid');
    grid.innerHTML = '';

    const list = ALL_VOCAB.filter(v => {
      const okTopic = currentTopic === 'all' || v.topic === currentTopic;
      const okSearch = !searchTerm ||
        v.word.toLowerCase().includes(searchTerm) ||
        v.mean.toLowerCase().includes(searchTerm);
      return okTopic && okSearch;
    });

    if (!list.length) {
      grid.innerHTML = '<p class="empty">Không tìm thấy từ nào 😕</p>';
      return;
    }

    // Giới hạn hiển thị để trang mượt khi có hơn 1200 từ
    const MAX_SHOW = 120;
    const shown = list.slice(0, MAX_SHOW);

    shown.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vocab-card';
      card.innerHTML = `
        <div class="vocab-word">
          <span>${v.word}</span>
          <button class="speak-btn" title="Nghe phát âm">🔊</button>
        </div>
        <div class="vocab-ipa">${v.ipa}</div>
        <div class="vocab-mean">${v.mean}</div>
        <div class="vocab-ex">"${v.ex}"</div>`;
      card.querySelector('.speak-btn').addEventListener('click', () => speak(v.word));
      grid.appendChild(card);
    });

    if (list.length > shown.length) {
      const more = document.createElement('div');
      more.className = 'vocab-more';
      more.textContent = `Đang hiển thị ${shown.length}/${list.length} từ — hãy dùng ô tìm kiếm để tra chính xác hơn.`;
      grid.appendChild(more);
    }
  }

  $('#vocabSearch').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderVocab();
  });

  /* ============================================================
     TRA CỨU TỪ VỰNG
     ============================================================ */
  const DICTIONARY_HISTORY_KEY = 'em_dictionary_history_' + session.email;
  const DICTIONARY_HISTORY_LIMIT = 8;
  const DICTIONARY_RESULT_LIMIT = 20;
  let dictionaryMatches = [];
  let selectedDictionaryEntry = null;

  function normalizeDictionaryText(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findDictionaryMatches(query) {
    const normalizedQuery = normalizeDictionaryText(query);
    if (!normalizedQuery) return [];
    const terms = normalizedQuery.split(' ');

    return ALL_VOCAB.map(entry => {
      const word = normalizeDictionaryText(entry.word);
      const meaning = normalizeDictionaryText(entry.mean);
      const example = normalizeDictionaryText(entry.ex);
      const topic = normalizeDictionaryText(topicName(entry.topic));
      const searchableText = [word, meaning, example, topic,
        normalizeDictionaryText(entry.ipa)].join(' ');
      if (!terms.every(term => searchableText.includes(term))) return null;

      let rank = 5;
      if (word === normalizedQuery) rank = 0;
      else if (word.startsWith(normalizedQuery)) rank = 1;
      else if (meaning === normalizedQuery) rank = 2;
      else if (meaning.startsWith(normalizedQuery)) rank = 3;
      else if (word.includes(normalizedQuery)) rank = 4;
      return { entry, rank };
    })
      .filter(Boolean)
      .sort((a, b) => a.rank - b.rank || a.entry.word.localeCompare(b.entry.word))
      .slice(0, DICTIONARY_RESULT_LIMIT)
      .map(item => item.entry);
  }

  function renderDictionaryDetail(entry) {
    const detail = $('#dictionaryDetail');
    detail.innerHTML = '';
    if (!entry) {
      const placeholder = document.createElement('p');
      placeholder.className = 'dictionary-detail-placeholder';
      placeholder.textContent = 'Chọn một kết quả để xem nghĩa, phiên âm, ví dụ và chủ đề.';
      detail.appendChild(placeholder);
      return;
    }

    const heading = document.createElement('div');
    heading.className = 'dictionary-detail-heading';
    const word = document.createElement('h3');
    word.textContent = entry.word;
    const speakButton = document.createElement('button');
    speakButton.className = 'speak-btn';
    speakButton.type = 'button';
    speakButton.title = `Nghe phát âm từ ${entry.word}`;
    speakButton.setAttribute('aria-label', `Nghe phát âm từ ${entry.word}`);
    speakButton.textContent = '🔊';
    speakButton.addEventListener('click', () => speak(entry.word));
    heading.append(word, speakButton);

    const pronunciation = document.createElement('p');
    pronunciation.className = 'dictionary-pronunciation';
    pronunciation.textContent = entry.ipa || 'Chưa có phiên âm';

    const meaningLabel = document.createElement('p');
    meaningLabel.className = 'dictionary-field-label';
    meaningLabel.textContent = 'Nghĩa tiếng Việt';
    const meaning = document.createElement('p');
    meaning.className = 'dictionary-meaning';
    meaning.textContent = entry.mean;

    const exampleLabel = document.createElement('p');
    exampleLabel.className = 'dictionary-field-label';
    exampleLabel.textContent = 'Ví dụ';
    const example = document.createElement('p');
    example.className = 'dictionary-example';
    example.textContent = entry.ex;

    const topic = document.createElement('span');
    topic.className = 'dictionary-topic';
    topic.textContent = `${topicEmoji(entry.topic)} ${topicName(entry.topic)}`;
    detail.append(heading, pronunciation, meaningLabel, meaning, exampleLabel, example, topic);
  }

  function selectDictionaryEntry(entry, remember = false) {
    selectedDictionaryEntry = entry;
    $$('#dictionaryResults .dictionary-result').forEach(button => {
      const isSelected = button.dataset.word === entry.word &&
        button.dataset.topic === entry.topic;
      button.classList.toggle('active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    renderDictionaryDetail(entry);
    if (remember) saveDictionaryHistory(entry);
  }

  function renderDictionaryResults(query) {
    const results = $('#dictionaryResults');
    const empty = $('#dictionaryEmpty');
    const normalizedQuery = normalizeDictionaryText(query);
    results.innerHTML = '';
    dictionaryMatches = findDictionaryMatches(query);

    if (!normalizedQuery) {
      $('#dictionaryCount').textContent =
        'Có thể tra từ, nghĩa tiếng Việt, phiên âm và ví dụ.';
      empty.textContent = 'Nhập từ cần tra để xem kết quả.';
      empty.classList.remove('hidden');
      selectedDictionaryEntry = null;
      renderDictionaryDetail(null);
      return;
    }

    if (!dictionaryMatches.length) {
      $('#dictionaryCount').textContent = 'Không tìm thấy từ phù hợp.';
      empty.textContent = 'Thử tìm bằng từ tiếng Anh hoặc một nghĩa tiếng Việt khác.';
      empty.classList.remove('hidden');
      selectedDictionaryEntry = null;
      renderDictionaryDetail(null);
      return;
    }

    empty.classList.add('hidden');
    const matchCount = dictionaryMatches.length === DICTIONARY_RESULT_LIMIT
      ? `Hiển thị ${DICTIONARY_RESULT_LIMIT} kết quả đầu tiên`
      : `Tìm thấy ${dictionaryMatches.length} kết quả`;
    $('#dictionaryCount').textContent = `${matchCount} cho “${query.trim()}”.`;

    dictionaryMatches.forEach(entry => {
      const button = document.createElement('button');
      button.className = 'dictionary-result';
      button.type = 'button';
      button.dataset.word = entry.word;
      button.dataset.topic = entry.topic;
      button.setAttribute('aria-pressed', 'false');

      const word = document.createElement('span');
      word.className = 'dictionary-result-word';
      word.textContent = entry.word;
      const meaning = document.createElement('span');
      meaning.className = 'dictionary-result-meaning';
      meaning.textContent = entry.mean;
      button.append(word, meaning);
      button.addEventListener('click', () => selectDictionaryEntry(entry, true));
      results.appendChild(button);
    });

    const selectedEntry = dictionaryMatches.find(entry =>
      selectedDictionaryEntry && entry.word === selectedDictionaryEntry.word &&
      entry.topic === selectedDictionaryEntry.topic) || dictionaryMatches[0];
    selectDictionaryEntry(selectedEntry);
  }

  function readDictionaryHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(DICTIONARY_HISTORY_KEY) || '[]');
      return Array.isArray(history)
        ? history.filter(item => item && typeof item.word === 'string' &&
          typeof item.mean === 'string' && typeof item.topic === 'string').slice(0, DICTIONARY_HISTORY_LIMIT)
        : [];
    } catch (error) {
      $('#dictionaryCount').textContent = 'Không thể đọc lịch sử tra cứu trên thiết bị này.';
      return [];
    }
  }

  function saveDictionaryHistory(entry) {
    const history = readDictionaryHistory().filter(item =>
      item.word.toLowerCase() !== entry.word.toLowerCase() || item.topic !== entry.topic);
    history.unshift({
      word: entry.word,
      ipa: entry.ipa,
      mean: entry.mean,
      ex: entry.ex,
      topic: entry.topic,
    });

    try {
      localStorage.setItem(DICTIONARY_HISTORY_KEY,
        JSON.stringify(history.slice(0, DICTIONARY_HISTORY_LIMIT)));
    } catch (error) {
      $('#dictionaryCount').textContent = 'Không thể lưu lịch sử tra cứu trên thiết bị này.';
    }
    renderDictionaryHistory();
  }

  function renderDictionaryHistory() {
    const historyContainer = $('#dictionaryHistory');
    historyContainer.innerHTML = '';
    const history = readDictionaryHistory();
    if (!history.length) {
      const empty = document.createElement('p');
      empty.className = 'dictionary-history-empty';
      empty.textContent = 'Các từ bạn chọn sẽ xuất hiện ở đây.';
      historyContainer.appendChild(empty);
      return;
    }

    history.forEach(item => {
      const entry = ALL_VOCAB.find(v => v.word === item.word && v.topic === item.topic);
      if (!entry) return;
      const button = document.createElement('button');
      button.className = 'dictionary-history-item';
      button.type = 'button';
      const word = document.createElement('strong');
      word.textContent = entry.word;
      const meaning = document.createElement('span');
      meaning.textContent = entry.mean;
      button.append(word, meaning);
      button.addEventListener('click', () => {
        $('#dictionarySearchInput').value = entry.word;
        renderDictionaryResults(entry.word);
        selectDictionaryEntry(entry);
        showSection('dictionary');
      });
      historyContainer.appendChild(button);
    });
  }

  $('#dictionarySearchInput').addEventListener('input', event => {
    renderDictionaryResults(event.target.value);
  });
  $('#dictionarySearchForm').addEventListener('submit', event => {
    event.preventDefault();
    const entry = dictionaryMatches[0];
    if (entry) selectDictionaryEntry(entry, true);
    else $('#dictionarySearchInput').focus();
  });

  /* ============================================================
     LUYỆN THI TOEIC / IELTS / VSTEP
     ============================================================ */
  const EXAM_PROGRESS_KEY = 'em_exam_progress_' + session.email;
  const EXAM_SKILL_KEYS = ['listening', 'reading', 'speaking', 'writing'];
  const EXAM_SKILL_ICONS = {
    listening: '🎧',
    reading: '📖',
    speaking: '🗣️',
    writing: '✍️',
  };
  let selectedExamId = 'toeic';
  let selectedExamSkill = null;
  let examQuestionIndex = 0;
  let examScore = 0;
  let examAnswered = false;
  let examProductionTaskIndex = 0;

  function examProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(EXAM_PROGRESS_KEY) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (error) {
      $('#examOverview').dataset.storageError = 'true';
      return {};
    }
  }

  function recordExamCompletion(skillKey, type) {
    const progress = examProgress();
    const selectedExamProgress = progress[selectedExamId] || {};
    const skillProgress = selectedExamProgress[skillKey] || { attempts: 0, bestScore: 0 };
    skillProgress.attempts += 1;
    if (type === 'objective') skillProgress.bestScore = Math.max(skillProgress.bestScore, examScore);
    selectedExamProgress[skillKey] = skillProgress;
    progress[selectedExamId] = selectedExamProgress;

    try {
      localStorage.setItem(EXAM_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      $('#examOverview').dataset.storageError = 'true';
    }
  }

  function renderExamPrep() {
    const exam = EXAM_PREP_DATA[selectedExamId];
    const progress = examProgress();
    const selectedExamProgress = progress[selectedExamId] || {};
    const tabs = $('#examTabs');
    tabs.innerHTML = '';

    Object.entries(EXAM_PREP_DATA).forEach(([examId, item]) => {
      const tab = document.createElement('button');
      tab.className = 'exam-tab' + (examId === selectedExamId ? ' active' : '');
      tab.type = 'button';
      tab.id = `exam-tab-${examId}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(examId === selectedExamId));
      tab.setAttribute('aria-controls', 'examOverview');
      tab.textContent = item.name;
      tab.addEventListener('click', () => {
        selectedExamId = examId;
        selectedExamSkill = null;
        $('#examActivity').classList.add('hidden');
        renderExamPrep();
      });
      tabs.appendChild(tab);
    });

    $('#examOverview').textContent = '';
    const heading = document.createElement('div');
    heading.className = 'exam-overview-heading';
    const title = document.createElement('h3');
    title.textContent = exam.name;
    const level = document.createElement('span');
    level.className = 'exam-level';
    level.textContent = exam.level;
    heading.append(title, level);

    const description = document.createElement('p');
    description.textContent = exam.subtitle;
    const completed = EXAM_SKILL_KEYS.reduce((total, key) =>
      total + ((selectedExamProgress[key] && selectedExamProgress[key].attempts) || 0), 0);
    const progressLabel = document.createElement('p');
    progressLabel.className = 'exam-overview-progress';
    progressLabel.textContent = `Bạn đã hoàn thành ${completed} lượt luyện ${exam.name}.`;
    $('#examOverview').append(heading, description, progressLabel);
    if ($('#examOverview').dataset.storageError === 'true') {
      const warning = document.createElement('p');
      warning.className = 'exam-storage-warning';
      warning.setAttribute('role', 'status');
      warning.textContent = 'Không thể đọc hoặc lưu tiến độ luyện thi trên thiết bị này.';
      $('#examOverview').appendChild(warning);
    }

    const skills = $('#examSkills');
    skills.innerHTML = '';
    EXAM_SKILL_KEYS.forEach(skillKey => {
      const skill = exam.skills[skillKey];
      const skillProgress = selectedExamProgress[skillKey] || { attempts: 0, bestScore: 0 };
      const card = document.createElement('button');
      card.className = 'exam-skill-card';
      card.type = 'button';
      card.setAttribute('aria-label',
        `Luyện ${skill.label}, ${skillProgress.attempts} lượt đã hoàn thành`);

      const icon = document.createElement('span');
      icon.className = 'exam-skill-icon';
      icon.textContent = EXAM_SKILL_ICONS[skillKey];
      const name = document.createElement('strong');
      name.textContent = skill.label;
      const summary = document.createElement('span');
      summary.textContent = skill.description;
      const attempts = document.createElement('span');
      attempts.className = 'exam-skill-progress';
      attempts.textContent = skillProgress.attempts
        ? `${skillProgress.attempts} lượt hoàn thành${skill.type === 'objective' ? ` · Điểm cao nhất ${skillProgress.bestScore}/${skill.questions.length * 10}` : ''}`
        : 'Chưa có lượt luyện';
      card.append(icon, name, summary, attempts);
      card.addEventListener('click', () => startExamSkill(skillKey));
      skills.appendChild(card);
    });
  }

  function startExamSkill(skillKey) {
    const skill = EXAM_PREP_DATA[selectedExamId].skills[skillKey];
    if (!skill) return;
    selectedExamSkill = skillKey;
    examQuestionIndex = 0;
    examScore = 0;
    examAnswered = false;
    examProductionTaskIndex = 0;
    $('#examActivity').classList.remove('hidden');
    $('#examObjective').classList.toggle('hidden', skill.type !== 'objective');
    $('#examProduction').classList.toggle('hidden', skill.type !== 'production');
    $('#examResult').classList.add('hidden');
    $('#examActivityLabel').textContent = `${EXAM_PREP_DATA[selectedExamId].name} · ${skill.label}`;
    $('#examActivityTitle').textContent = skill.description;
    $('#examSkillsHeading').scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (skill.type === 'objective') drawExamQuestion();
    else drawExamProductionTask();
  }

  function drawExamQuestion() {
    const skill = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill];
    const question = skill.questions[examQuestionIndex];
    examAnswered = false;
    $('#examActivityCounter').textContent =
      `Câu ${examQuestionIndex + 1}/${skill.questions.length} · Điểm ${examScore}`;
    $('#examQuestion').textContent = question.question;
    $('#examOptions').innerHTML = '';
    $('#examExplanation').classList.add('hidden');
    $('#examExplanation').textContent = '';
    $('#examNextBtn').disabled = true;
    $('#examNextBtn').textContent =
      examQuestionIndex === skill.questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo →';

    const passage = $('#examPassage');
    passage.textContent = question.passage || '';
    passage.classList.toggle('hidden', !question.passage);

    const audioWrap = $('#examAudioWrap');
    audioWrap.classList.toggle('hidden', !question.audio);
    if (question.audio) audioWrap.dataset.audio = question.audio;

    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option';
      button.type = 'button';
      button.textContent = option;
      button.addEventListener('click', () => selectExamOption(index, button, question));
      $('#examOptions').appendChild(button);
    });
  }

  function selectExamOption(selectedIndex, selectedButton, question) {
    if (examAnswered) return;
    examAnswered = true;
    const correct = selectedIndex === question.answer;
    $$('#examOptions .option').forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
    });

    if (correct) {
      examScore += 10;
      updateStats({ correct: 1, answered: 1, points: 10 });
    } else {
      selectedButton.classList.add('wrong');
      updateStats({ answered: 1 });
    }

    const explanation = $('#examExplanation');
    explanation.textContent = `${correct ? 'Chính xác! +10 điểm. ' : 'Chưa chính xác. '}${question.explanation}`;
    explanation.classList.remove('hidden');
    explanation.classList.toggle('correct', correct);
    explanation.classList.toggle('incorrect', !correct);
    $('#examActivityCounter').textContent =
      `Câu ${examQuestionIndex + 1}/${EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill].questions.length} · Điểm ${examScore}`;
    $('#examNextBtn').disabled = false;
  }

  function finishExamObjective() {
    const skill = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill];
    const maximum = skill.questions.length * 10;
    const percentage = Math.round((examScore / maximum) * 100);
    recordExamCompletion(selectedExamSkill, skill.type);
    $('#examObjective').classList.add('hidden');
    $('#examResult').classList.remove('hidden');
    $('#examResultIcon').textContent = percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪';
    $('#examResultTitle').textContent = `${EXAM_PREP_DATA[selectedExamId].name} ${skill.label}: ${examScore}/${maximum} điểm`;
    $('#examResultText').textContent = `Bạn trả lời đúng ${percentage}% câu hỏi. Xem lại phần giải thích và luyện thêm để củng cố kiến thức.`;
    renderExamPrep();
  }

  function updateExamWordCount() {
    const answer = $('#examAnswer').value.trim();
    const words = answer ? answer.split(/\s+/).length : 0;
    const task = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill].tasks[examProductionTaskIndex];
    $('#examWordCount').textContent = `${words} từ · tối thiểu ${task.minWords} từ`;
    $('#examWordCount').classList.toggle('meets-minimum', words >= task.minWords);
    $('#examSubmitProduction').disabled = words < task.minWords ||
      !!$$('#examChecklistItems input:not(:checked)').length;
  }

  function drawExamProductionTask() {
    const skill = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill];
    const task = skill.tasks[examProductionTaskIndex];
    $('#examActivityCounter').textContent =
      `Đề ${examProductionTaskIndex + 1}/${skill.tasks.length}`;
    $('#examProductionFeedback').classList.add('hidden');
    $('#examProductionFeedback').textContent = '';
    $('#examPrompt').innerHTML = '';
    const title = document.createElement('h4');
    title.textContent = task.title;
    const prompt = document.createElement('p');
    prompt.textContent = task.prompt;
    $('#examPrompt').append(title, prompt);
    $('#examAnswerLabel').textContent = skill.answerLabel;
    $('#examAnswer').value = '';
    $('#examChecklistTitle').textContent = 'Tự đánh giá trước khi hoàn thành';
    $('#examChecklistItems').innerHTML = '';

    skill.checklist.forEach((criterion, index) => {
      const label = document.createElement('label');
      label.className = 'exam-checklist-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `examChecklist${index}`;
      checkbox.addEventListener('change', updateExamWordCount);
      const text = document.createElement('span');
      text.textContent = criterion;
      label.append(checkbox, text);
      $('#examChecklistItems').appendChild(label);
    });
    updateExamWordCount();
  }

  function finishExamProductionTask() {
    const taskCount = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill].tasks.length;
    if (examProductionTaskIndex + 1 < taskCount) {
      examProductionTaskIndex++;
      drawExamProductionTask();
      return;
    }

    recordExamCompletion(selectedExamSkill, 'production');
    $('#examSubmitProduction').disabled = true;
    $('#examProductionFeedback').textContent =
      'Bạn đã hoàn thành các đề luyện. Hãy xem lại checklist và tiếp tục luyện nói/viết để cải thiện câu trả lời.';
    $('#examProductionFeedback').classList.remove('hidden');
    $('#examResult').classList.remove('hidden');
    $('#examResultIcon').textContent = '✍️';
    $('#examResultTitle').textContent = `Đã hoàn thành phần ${EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill].label}`;
    $('#examResultText').textContent = 'Đây là phần tự luyện, không chấm điểm tự động. Hãy dùng checklist để tự rà soát câu trả lời.';
    renderExamPrep();
  }

  $('#examBackBtn').addEventListener('click', () => {
    $('#examActivity').classList.add('hidden');
    $('#examSkillsHeading').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#examNextBtn').addEventListener('click', () => {
    const skill = EXAM_PREP_DATA[selectedExamId].skills[selectedExamSkill];
    examQuestionIndex++;
    if (examQuestionIndex >= skill.questions.length) finishExamObjective();
    else drawExamQuestion();
  });
  $('#examAudioPlay').addEventListener('click', () => {
    const audio = $('#examAudioWrap').dataset.audio;
    if (audio) speak(audio);
  });
  $('#examAnswer').addEventListener('input', updateExamWordCount);
  $('#examSubmitProduction').addEventListener('click', finishExamProductionTask);
  $('#examPracticeAgain').addEventListener('click', () => {
    if (selectedExamSkill) startExamSkill(selectedExamSkill);
  });

  /* ============================================================
     FLASHCARD
     ============================================================ */
  let fcList = [];
  let fcIdx = 0;

  function renderFlashcard() {
    if (!fcList.length) {
      fcList = shuffle(ALL_VOCAB).slice(0, 20);
      fcIdx = 0;
    }
    drawFlashcard();
  }

  function drawFlashcard() {
    const v = fcList[fcIdx];
    if (!v) return;
    $('#fcTag').textContent = topicName(v.topic);
    $('#fcWord').textContent = v.word;
    $('#fcIpa').textContent = v.ipa;
    $('#fcMeaning').textContent = v.mean;
    $('#fcExample').textContent = '"' + v.ex + '"';
    $('#fcIndex').textContent = fcIdx + 1;
    $('#fcTotal').textContent = fcList.length;
    $('#flashcard').classList.remove('flipped');
  }

  $('#flashcard').addEventListener('click', function () {
    this.classList.toggle('flipped');
  });

  $('#fcNext').addEventListener('click', () => {
    fcIdx = (fcIdx + 1) % fcList.length;
    drawFlashcard();
  });

  $('#fcPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    fcIdx = (fcIdx - 1 + fcList.length) % fcList.length;
    drawFlashcard();
  });

  $('#fcSpeak').addEventListener('click', (e) => {
    e.stopPropagation();
    speak(fcList[fcIdx].word);
  });

  $('#fcKnown').addEventListener('click', (e) => {
    e.stopPropagation();
    updateStats({ learned: 1, points: 10 });
    toast('Tuyệt vời! +10 điểm 🎉', 'ok');
    fcIdx = (fcIdx + 1) % fcList.length;
    drawFlashcard();
  });

  /* ============================================================
     QUIZ
     ============================================================ */
  let quizList = [];
  let quizIdx = 0;
  let quizScore = 0;
  let quizAnswered = false;

  function startQuiz() {
    quizList = buildQuizQuestions(8);
    quizIdx = 0;
    quizScore = 0;
    $('#quizCard').classList.remove('hidden');
    $('#quizResult').classList.add('hidden');
    $('#qTotal').textContent = quizList.length;
    $('#qScore').textContent = '0';
    drawQuestion();
  }

  function drawQuestion() {
    const q = quizList[quizIdx];
    if (!q) return finishQuiz();

    quizAnswered = false;
    $('#qNumber').textContent = quizIdx + 1;
    $('#qQuestion').textContent = q.question;
    $('#qFeedback').textContent = '';
    $('#qFeedback').className = 'quiz-feedback';
    $('#qNext').disabled = true;
    $('#qProgress').style.width = (quizIdx / quizList.length) * 100 + '%';

    const box = $('#qOptions');
    box.innerHTML = '';
    q.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt;
      b.addEventListener('click', () => selectOption(i, b));
      box.appendChild(b);
    });
  }

  function selectOption(i, btn) {
    if (quizAnswered) return;
    quizAnswered = true;

    const q = quizList[quizIdx];
    const buttons = $$('#qOptions .option');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.answer) b.classList.add('correct');
    });

    const fb = $('#qFeedback');
    if (i === q.answer) {
      quizScore += 10;
      $('#qScore').textContent = quizScore;
      fb.textContent = 'Chính xác! +10 điểm 🎉';
      fb.className = 'quiz-feedback ok';
      updateStats({ correct: 1, answered: 1, points: 10 });
    } else {
      btn.classList.add('wrong');
      fb.textContent = 'Sai rồi! Đáp án đúng đã được đánh dấu xanh.';
      fb.className = 'quiz-feedback no';
      updateStats({ answered: 1 });
    }

    $('#qNext').disabled = false;
  }

  $('#qNext').addEventListener('click', () => {
    quizIdx++;
    if (quizIdx >= quizList.length) finishQuiz();
    else drawQuestion();
  });

  function finishQuiz() {
    $('#qProgress').style.width = '100%';
    $('#quizCard').classList.add('hidden');
    const res = $('#quizResult');
    res.classList.remove('hidden');

    const max = quizList.length * 10;
    const pct = Math.round((quizScore / max) * 100);
    let emoji = '😅', title = 'Cố gắng thêm nhé!';
    if (pct >= 80) { emoji = '🏆'; title = 'Xuất sắc!'; }
    else if (pct >= 50) { emoji = '👍'; title = 'Khá tốt!'; }

    $('#resultEmoji').textContent = emoji;
    $('#resultTitle').textContent = title;
    $('#resultText').textContent =
      `Bạn đạt ${quizScore}/${max} điểm (${pct}%). Hãy luyện tập thêm để nhớ từ lâu hơn!`;
  }

  $('#quizRestart').addEventListener('click', startQuiz);

  /* ============================================================
     THI ĐẤU CÙNG BẠN BÈ
     ============================================================ */
  const DUEL_RESULTS_KEY = 'em_duel_results_' + session.email;
  let activeDuel = null;
  let duelQuestionIndex = 0;
  let duelScore = 0;
  let duelAnswered = false;
  let duelStartedAt = 0;
  let currentDuelResult = null;

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function encodeDuel(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeDuel(encoded) {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function validDuel(payload) {
    if (!payload || payload.version !== 1 ||
        typeof payload.id !== 'string' || !/^[a-z0-9-]{8,80}$/i.test(payload.id) ||
        typeof payload.hostName !== 'string' || payload.hostName.length > 60 ||
        !Array.isArray(payload.questions) || payload.questions.length !== 8) return false;

    const validQuestions = payload.questions.every(question =>
      question && typeof question.question === 'string' &&
      question.question.length > 0 && question.question.length <= 250 &&
      Array.isArray(question.options) && question.options.length === 4 &&
      question.options.every(option =>
        typeof option === 'string' && option.length > 0 && option.length <= 200) &&
      Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    if (!validQuestions) return false;
    if (payload.result === undefined) return true;

    const result = payload.result;
    return result && typeof result.name === 'string' &&
      result.name.length > 0 && result.name.length <= 60 &&
      typeof result.playerId === 'string' &&
      /^[a-z0-9-]{8,100}$/i.test(result.playerId) &&
      Number.isInteger(result.score) && result.score >= 0 &&
      result.score <= payload.questions.length * 10 &&
      Number.isFinite(result.durationMs) && result.durationMs >= 0 &&
      result.durationMs <= 3600000 &&
      typeof result.completedAt === 'string' && result.completedAt.length <= 40;
  }

  function duelLink(payload) {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#duel=${encodeDuel(payload)}`;
  }

  function makeDuelQuestions() {
    const vocabulary = ALL_VOCAB.filter(item =>
      item.word && item.mean && item.word.trim() && item.mean.trim());
    const uniqueMeanings = [...new Set(vocabulary.map(item => item.mean))];
    if (vocabulary.length < 8 || uniqueMeanings.length < 4) {
      throw new Error('Chưa đủ dữ liệu từ vựng để tạo thử thách.');
    }

    return shuffle(vocabulary).slice(0, 8).map(item => {
      const wrongAnswers = shuffle(uniqueMeanings.filter(mean => mean !== item.mean)).slice(0, 3);
      const options = shuffle([item.mean, ...wrongAnswers]);
      return {
        question: `Nghĩa của từ "${item.word}" là gì?`,
        options,
        answer: options.indexOf(item.mean),
      };
    });
  }

  function duelStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem(DUEL_RESULTS_KEY) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (error) {
      $('#duelStatus').textContent = 'Không thể đọc kết quả đã lưu trên thiết bị này.';
      return null;
    }
  }

  function saveDuelResult(result) {
    const saved = duelStorage();
    if (!saved) return { result, saved: false };
    const results = Array.isArray(saved[result.challengeId]) ? saved[result.challengeId] : [];
    const previousIndex = results.findIndex(item => item.playerId === result.playerId);
    let bestResult = result;
    if (previousIndex >= 0) {
      const previous = results[previousIndex];
      if (previous.score > result.score ||
          (previous.score === result.score && previous.durationMs <= result.durationMs)) {
        bestResult = previous;
      } else {
        results[previousIndex] = result;
      }
    } else {
      results.push(result);
    }
    saved[result.challengeId] = results.slice(-50);

    let didSave = true;
    try {
      localStorage.setItem(DUEL_RESULTS_KEY, JSON.stringify(saved));
    } catch (error) {
      $('#duelStatus').textContent = 'Không lưu được kết quả. Hãy kiểm tra dung lượng lưu trữ của trình duyệt.';
      didSave = false;
    }
    return { result: bestResult, saved: didSave };
  }

  function participantId() {
    const key = 'em_duel_player_id_' + session.email;
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = createId();
        localStorage.setItem(key, id);
      }
      return id;
    } catch (error) {
      $('#duelStatus').textContent = 'Không thể lưu mã người chơi trên thiết bị này.';
      return createId();
    }
  }

  function renderDuelLobby() {
    const panel = $('#duelInvitePanel');
    if (activeDuel) {
      const invite = {
        version: activeDuel.version,
        id: activeDuel.id,
        hostName: activeDuel.hostName,
        questions: activeDuel.questions,
      };
      $('#duelTitle').textContent = `${activeDuel.hostName} mời bạn thi đấu`;
      $('#duelDescription').textContent =
        `Thử thách gồm ${activeDuel.questions.length} câu trắc nghiệm. Mã thử thách: ${activeDuel.id.slice(0, 8).toUpperCase()}`;
      $('#duelInviteLink').value = duelLink(invite);
      panel.classList.remove('hidden');
      renderDuelLeaderboard();
    } else {
      panel.classList.add('hidden');
      $('#duelLeaderboardPanel').classList.add('hidden');
    }
  }

  function renderDuelLeaderboard() {
    if (!activeDuel) return;
    const allResults = duelStorage();
    if (!allResults) return;
    const results = Array.isArray(allResults[activeDuel.id]) ? allResults[activeDuel.id] : [];
    const list = $('#duelLeaderboard');
    list.innerHTML = '';
    $('#duelLeaderboardPanel').classList.remove('hidden');

    if (!results.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Chưa có kết quả. Hãy hoàn thành thử thách rồi chia sẻ link với bạn.';
      list.appendChild(empty);
      return;
    }

    results.sort((a, b) => b.score - a.score || a.durationMs - b.durationMs)
      .slice(0, 10)
      .forEach((result, index) => {
        const row = document.createElement('li');
        const player = document.createElement('span');
        player.className = 'duel-player';
        player.textContent = `${index + 1}. ${result.name}`;
        const score = document.createElement('span');
        score.className = 'duel-score';
        score.textContent = `${result.score}/${activeDuel.questions.length * 10} điểm · ${Math.round(result.durationMs / 1000)} giây`;
        row.append(player, score);
        list.appendChild(row);
      });
  }

  function showDuelLink(payload) {
    if (!validDuel(payload)) {
      $('#duelStatus').textContent = 'Link không hợp lệ hoặc dữ liệu thử thách đã bị thay đổi.';
      return;
    }
    activeDuel = {
      version: payload.version,
      id: payload.id,
      hostName: payload.hostName,
      questions: payload.questions,
    };
    currentDuelResult = null;
    $('#duelQuizCard').classList.add('hidden');
    $('#duelResult').classList.add('hidden');
    $('#duelResultSharePanel').classList.add('hidden');
    $('#duelLobby').classList.remove('hidden');

    if (payload.result) {
      const saved = saveDuelResult({
        ...payload.result,
        challengeId: payload.id,
      });
      $('#duelStatus').textContent = saved.saved
        ? `Đã nhận kết quả của ${saved.result.name}: ${saved.result.score}/${payload.questions.length * 10} điểm.`
        : 'Đã nhận link kết quả nhưng không lưu được trên thiết bị này.';
    } else {
      $('#duelStatus').textContent = 'Đã tải thử thách. Hãy bắt đầu khi bạn sẵn sàng!';
    }
    renderDuelLobby();
    showSection('duel');
  }

  function copyDuelLink(input, message) {
    input.focus();
    input.select();
    if (!navigator.clipboard || !window.isSecureContext) {
      $('#duelStatus').textContent = `${message} Link đã được chọn; nhấn Ctrl+C để sao chép.`;
      return;
    }
    navigator.clipboard.writeText(input.value).then(() => {
      $('#duelStatus').textContent = message;
      toast(message, 'ok');
    }).catch(() => {
      input.focus();
      input.select();
      $('#duelStatus').textContent = 'Không thể tự sao chép link. Link đã được chọn; nhấn Ctrl+C.';
    });
  }

  function startDuel() {
    if (!activeDuel) {
      $('#duelStatus').textContent = 'Hãy tạo thử thách mới hoặc mở link bạn bè gửi trước.';
      return;
    }
    duelQuestionIndex = 0;
    duelScore = 0;
    duelAnswered = false;
    duelStartedAt = Date.now();
    currentDuelResult = null;
    $('#duelLobby').classList.add('hidden');
    $('#duelResult').classList.add('hidden');
    $('#duelResultSharePanel').classList.add('hidden');
    $('#duelQuizCard').classList.remove('hidden');
    $('#duelQTotal').textContent = activeDuel.questions.length;
    $('#duelQScore').textContent = '0';
    drawDuelQuestion();
  }

  function drawDuelQuestion() {
    const question = activeDuel.questions[duelQuestionIndex];
    if (!question) return finishDuel();
    duelAnswered = false;
    $('#duelQNumber').textContent = duelQuestionIndex + 1;
    $('#duelQQuestion').textContent = question.question;
    $('#duelQFeedback').textContent = '';
    $('#duelQFeedback').className = 'quiz-feedback';
    $('#duelQNext').disabled = true;
    $('#duelQNext').textContent =
      duelQuestionIndex === activeDuel.questions.length - 1 ? 'Xem kết quả' : 'Tiếp theo →';
    $('#duelQProgress').style.width =
      (duelQuestionIndex / activeDuel.questions.length) * 100 + '%';

    const options = $('#duelQOptions');
    options.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option';
      button.textContent = option;
      button.addEventListener('click', () => selectDuelOption(index, button));
      options.appendChild(button);
    });
  }

  function selectDuelOption(selectedIndex, selectedButton) {
    if (duelAnswered) return;
    duelAnswered = true;
    const question = activeDuel.questions[duelQuestionIndex];
    $$('#duelQOptions .option').forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
    });

    const feedback = $('#duelQFeedback');
    if (selectedIndex === question.answer) {
      duelScore += 10;
      $('#duelQScore').textContent = duelScore;
      feedback.textContent = 'Chính xác! +10 điểm 🎉';
      feedback.className = 'quiz-feedback ok';
      updateStats({ correct: 1, answered: 1, points: 10 });
    } else {
      selectedButton.classList.add('wrong');
      feedback.textContent = 'Chưa đúng, đáp án chính xác đã được đánh dấu xanh.';
      feedback.className = 'quiz-feedback no';
      updateStats({ answered: 1 });
    }
    $('#duelQNext').disabled = false;
  }

  function finishDuel() {
    const durationMs = Math.max(0, Date.now() - duelStartedAt);
    const result = {
      challengeId: activeDuel.id,
      playerId: participantId(),
      name: session.name || session.email.split('@')[0],
      score: duelScore,
      durationMs,
      completedAt: new Date().toISOString(),
    };
    const saved = saveDuelResult(result);
    currentDuelResult = saved.result;
    $('#duelQProgress').style.width = '100%';
    $('#duelQuizCard').classList.add('hidden');
    $('#duelResult').classList.remove('hidden');
    $('#duelResultSharePanel').classList.add('hidden');
    $('#duelResultEmoji').textContent =
      duelScore === activeDuel.questions.length * 10 ? '🏆' : '🎉';
    $('#duelResultTitle').textContent = 'Hoàn thành thử thách!';
    $('#duelResultText').textContent =
      `Lần này bạn đạt ${duelScore}/${activeDuel.questions.length * 10} điểm. Điểm tốt nhất của bạn là ${currentDuelResult.score}/${activeDuel.questions.length * 10} trong ${Math.round(currentDuelResult.durationMs / 1000)} giây. Chia sẻ kết quả để so tài với bạn bè!`;
    $('#duelLobby').classList.remove('hidden');
    if (saved.saved) $('#duelStatus').textContent = 'Kết quả đã lưu trên thiết bị này.';
    $('#duelResultLink').value = duelLink({
      ...activeDuel,
      result: {
        playerId: currentDuelResult.playerId,
        name: currentDuelResult.name,
        score: currentDuelResult.score,
        durationMs: currentDuelResult.durationMs,
        completedAt: currentDuelResult.completedAt,
      },
    });
    renderDuelLeaderboard();
  }

  $('#createDuelBtn').addEventListener('click', () => {
    try {
      const name = session.name || session.email.split('@')[0];
      activeDuel = {
        version: 1,
        id: createId(),
        hostName: name.slice(0, 60),
        questions: makeDuelQuestions(),
      };
      $('#duelStatus').textContent = 'Đã tạo thử thách mới. Hãy gửi link cho bạn bè!';
      $('#duelResult').classList.add('hidden');
      $('#duelQuizCard').classList.add('hidden');
      $('#duelLobby').classList.remove('hidden');
      $('#duelResultSharePanel').classList.add('hidden');
      renderDuelLobby();
    } catch (error) {
      $('#duelStatus').textContent = error.message;
    }
  });

  $('#copyDuelInvite').addEventListener('click', () =>
    copyDuelLink($('#duelInviteLink'), 'Đã sao chép link thử thách!'));
  $('#startDuelBtn').addEventListener('click', startDuel);
  $('#duelQNext').addEventListener('click', () => {
    duelQuestionIndex++;
    if (duelQuestionIndex >= activeDuel.questions.length) finishDuel();
    else drawDuelQuestion();
  });
  $('#shareDuelResult').addEventListener('click', () => {
    if (!currentDuelResult || !activeDuel) return;
    $('#duelResultSharePanel').classList.remove('hidden');
    copyDuelLink($('#duelResultLink'), 'Đã sao chép link kết quả!');
  });
  $('#copyDuelResult').addEventListener('click', () =>
    copyDuelLink($('#duelResultLink'), 'Đã sao chép link kết quả!'));
  $('#playDuelAgain').addEventListener('click', startDuel);

  $('#duelImportForm').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const url = new URL($('#duelImportInput').value.trim(), window.location.href);
      const match = url.hash.match(/^#duel=([A-Za-z0-9_-]+)$/);
      if (!match) throw new Error('Link không có dữ liệu thử thách hợp lệ.');
      const payload = decodeDuel(match[1]);
      if (!validDuel(payload)) throw new Error('Link thử thách không hợp lệ hoặc đã bị chỉnh sửa.');
      $('#duelImportInput').value = '';
      showDuelLink(payload);
    } catch (error) {
      $('#duelStatus').textContent = error.message || 'Không thể mở link thử thách.';
    }
  });

  function loadDuelFromAddress() {
    const match = window.location.hash.match(/^#duel=([A-Za-z0-9_-]+)$/);
    if (!match) return;
    try {
      const payload = decodeDuel(match[1]);
      if (!validDuel(payload)) throw new Error('Link thử thách không hợp lệ hoặc đã bị chỉnh sửa.');
      showDuelLink(payload);
    } catch (error) {
      showSection('duel');
      $('#duelStatus').textContent = error.message || 'Không thể mở link thử thách.';
    }
  }

  /* ============================================================
     LUYỆN NGHE
     ============================================================ */
  let listenIdx = 0;
  let listenAnswered = false;

  function initListening() {
    if (listenIdx === 0) {
      // danh sách đã cho sẵn
    }
    $('#listenTotal').textContent = ALL_LISTENING.length;
    drawListening();
  }

  function drawListening() {
    const item = ALL_LISTENING[listenIdx];
    if (!item) { listenIdx = 0; return drawListening(); }

    listenAnswered = false;
    $('#listenIndex').textContent = listenIdx + 1;
    $('#listenFeedback').textContent = '';
    $('#listenFeedback').className = 'quiz-feedback';

    const box = $('#listenOptions');
    box.innerHTML = '';
    item.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt;
      b.addEventListener('click', () => selectListen(i, b));
      box.appendChild(b);
    });

    setTimeout(() => speak(item.text), 250);
  }

  $('#listenPlay').addEventListener('click', () => {
    const item = ALL_LISTENING[listenIdx];
    if (item) speak(item.text);
  });

  function selectListen(i, btn) {
    if (listenAnswered) return;
    listenAnswered = true;

    const item = ALL_LISTENING[listenIdx];
    const buttons = $$('#listenOptions .option');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === item.answer) b.classList.add('correct');
    });

    const fb = $('#listenFeedback');
    if (i === item.answer) {
      fb.textContent = 'Chính xác! +10 điểm 🎉';
      fb.className = 'quiz-feedback ok';
      updateStats({ correct: 1, answered: 1, points: 10 });
    } else {
      btn.classList.add('wrong');
      fb.textContent = 'Chưa đúng, xem lại đáp án màu xanh nhé.';
      fb.className = 'quiz-feedback no';
      updateStats({ answered: 1 });
    }
  }

  $('#listenNext').addEventListener('click', () => {
    listenIdx = (listenIdx + 1) % ALL_LISTENING.length;
    drawListening();
  });

  /* ============================================================
     TEXT-TO-SPEECH
     ============================================================ */
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      toast('Trình duyệt không hỗ trợ đọc văn bản', 'no');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  /* ============================================================
     CHATBOT HỌC TIẾNG ANH
     ============================================================ */
  function normalizeChatText(text) {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function answerChatQuestion(question) {
    const normalized = normalizeChatText(question);
    const paddedQuestion = ` ${normalized} `;

    if (/^(xin chao|chao|hello|hi|hey|good morning|good afternoon)$/.test(normalized)) {
      return 'Xin chào! Bạn có thể hỏi mình nghĩa và cách dùng từ tiếng Anh, ngữ pháp cơ bản, hoặc cách luyện tập trên trang. 😊';
    }

    if (/(ban la ai|ban lam duoc gi|ban co the lam gi|tro giup|help me|what can you do)/.test(normalized)) {
      return 'Mình có thể tra nghĩa, phiên âm và ví dụ cho từ trong kho từ vựng; giải thích một số chủ điểm ngữ pháp; và hướng dẫn bạn dùng Flashcard, Kiểm tra, Luyện nghe hoặc Đọc báo. Hãy thử hỏi “nghĩa của deadline” hoặc “khi nào dùng hiện tại hoàn thành?”.';
    }

    const grammarAnswers = [
      {
        keys: ['hien tai don', 'present simple', 'present tense', 'do va does', 'does va do'],
        answer: 'Thì hiện tại đơn dùng cho thói quen, sự thật và lịch trình. Cấu trúc: S + V(s/es) với he/she/it; các chủ ngữ khác dùng động từ nguyên mẫu. Phủ định dùng do not/does not + V nguyên mẫu; câu hỏi đảo Do/Does lên đầu.\nVí dụ: She works every day. / Does she work every day?'
      },
      {
        keys: ['hien tai tiep dien', 'present continuous', 'present progressive'],
        answer: 'Thì hiện tại tiếp diễn diễn tả việc đang xảy ra hoặc tình huống tạm thời. Cấu trúc: S + am/is/are + V-ing.\nVí dụ: I am studying English now. (Bây giờ tôi đang học tiếng Anh.)'
      },
      {
        keys: ['hien tai hoan thanh', 'present perfect'],
        answer: 'Thì hiện tại hoàn thành diễn tả trải nghiệm, kết quả hiện tại hoặc việc bắt đầu trong quá khứ còn liên quan đến hiện tại. Cấu trúc: S + have/has + V3.\nVí dụ: She has finished her homework. (Cô ấy đã làm xong bài tập.)'
      },
      {
        keys: ['qua khu don', 'past simple', 'did va was', 'did va were'],
        answer: 'Thì quá khứ đơn dùng cho hành động đã kết thúc trong quá khứ. Động từ có quy tắc thường thêm -ed; động từ bất quy tắc dùng cột 2. Câu phủ định và câu hỏi dùng did + động từ nguyên mẫu.\nVí dụ: They visited London last year. / Did they visit London?'
      },
      {
        keys: ['tuong lai don', 'future simple', 'will va going to', 'will hay going to'],
        answer: 'Will thường dùng cho quyết định ngay lúc nói, lời hứa hoặc dự đoán; be going to thường dùng cho dự định đã có hoặc dự đoán có dấu hiệu. Ví dụ: I will help you. / We are going to travel next week.'
      },
      {
        keys: ['a an the', 'mao tu', 'articles', 'a va an', 'the dung khi nao'],
        answer: 'A dùng trước danh từ đếm được số ít bắt đầu bằng âm phụ âm; an dùng trước âm nguyên âm; the dùng khi người nghe biết rõ đối tượng hoặc đối tượng đã được nhắc đến. Chọn a/an theo âm đầu, không chỉ theo chữ cái.\nVí dụ: a university, an apple, the book on the table.'
      },
      {
        keys: ['so sanh hon', 'comparative', 'so sanh nhat', 'superlative'],
        answer: 'So sánh hơn: tính từ ngắn + -er (tall → taller), hoặc more + tính từ dài (more interesting), thường đi với than. So sánh nhất: the + -est hoặc the most + tính từ.\nVí dụ: This book is cheaper than that one. / It is the most interesting book.'
      },
      {
        keys: ['in on at', 'gioi tu in', 'gioi tu on', 'gioi tu at', 'prepositions of time'],
        answer: 'Với thời gian: at dùng cho giờ cụ thể (at 7 o’clock), on dùng cho ngày/ngày tháng (on Monday), in dùng cho tháng, năm, mùa hoặc khoảng thời gian dài (in July, in 2026, in the morning). Có ngoại lệ theo cụm cố định.'
      },
      {
        keys: ['some va any', 'some and any', 'some any', 'much va many', 'much and many', 'much many'],
        answer: 'Some thường dùng trong câu khẳng định và lời mời/đề nghị; any thường dùng trong câu hỏi và phủ định. Many đi với danh từ đếm được số nhiều; much đi với danh từ không đếm được.\nVí dụ: some apples, any questions, many books, much water.'
      },
      {
        keys: ['do va make', 'do hay make', 'do and make', 'make vs do', 'difference between do and make'],
        answer: 'Do thường nói về công việc, nhiệm vụ hoặc hoạt động (do homework, do exercise). Make thường nói về tạo ra hoặc gây ra kết quả (make a cake, make a decision). Một số cụm cần học theo thói quen sử dụng.'
      },
      {
        keys: ['say va tell', 'say hay tell', 'say and tell', 'difference between say and tell'],
        answer: 'Say tập trung vào lời nói và thường không cần tân ngữ chỉ người ngay sau nó (say something; say something to me). Tell thường có người nghe làm tân ngữ (tell me a story; tell her the news).'
      }
    ];
    const grammarMatch = grammarAnswers.find(rule =>
      rule.keys.some(key => paddedQuestion.includes(` ${key} `)));
    if (grammarMatch) return grammarMatch.answer;

    const vocabularyMatch = ALL_VOCAB
      .filter(item => {
        const word = normalizeChatText(item.word);
        const meaning = normalizeChatText(item.mean);
        return (word.length > 1 && paddedQuestion.includes(` ${word} `)) ||
          (meaning.length > 3 && paddedQuestion.includes(` ${meaning} `));
      })
      .sort((a, b) => normalizeChatText(b.word).length - normalizeChatText(a.word).length)[0];

    if (vocabularyMatch) {
      const topic = topicName(vocabularyMatch.topic);
      return `${vocabularyMatch.word} ${vocabularyMatch.ipa} nghĩa là “${vocabularyMatch.mean}” (${topic}).\nVí dụ: ${vocabularyMatch.ex}`;
    }

    if (/(phat am|pronounce|pronunciation|doc tu)/.test(normalized)) {
      return 'Bạn có thể nhấn biểu tượng 🔊 trên thẻ từ vựng hoặc Flashcard để nghe phát âm. Hãy gửi một từ cụ thể, ví dụ “phát âm airport”, để mình tra phiên âm trong kho từ.';
    }

    if (/(flashcard|the ghi nho)/.test(normalized)) {
      return 'Vào mục Flashcard, nhấn vào thẻ để xem nghĩa và ví dụ. Nhấn “Đã nhớ” để đánh dấu từ đã thuộc và nhận 10 điểm.';
    }
    if (/(luyen nghe|listening|nghe tieng anh)/.test(normalized)) {
      return 'Mở mục Nghe, nhấn nút loa để nghe câu tiếng Anh rồi chọn nghĩa tiếng Việt phù hợp. Bạn có thể nghe lại và chuyển sang câu tiếp theo để luyện thêm.';
    }
    if (/(kiem tra|quiz|trac nghiem|bai kiem tra)/.test(normalized)) {
      return 'Mục Kiểm tra tạo một bài trắc nghiệm từ vựng ngẫu nhiên. Chọn đáp án, xem phản hồi rồi nhấn “Tiếp theo”; điểm sẽ được lưu vào tiến độ học của bạn.';
    }
    if (/(doc bao|bai doc|reading|doc hieu)/.test(normalized)) {
      return 'Trong mục Đọc báo, bạn có thể lọc bài theo chủ đề, đọc/nghe từng đoạn, xem từ vựng chú thích và làm câu hỏi đọc hiểu.';
    }
    if (/(tu vung|vocabulary|tra tu|tim tu)/.test(normalized)) {
      return `Kho hiện có ${ALL_VOCAB.length.toLocaleString('vi-VN')} từ thuộc ${ALL_TOPICS.length} chủ đề. Mở mục Từ vựng để tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt; bạn cũng có thể hỏi trực tiếp “${ALL_VOCAB[0] ? ALL_VOCAB[0].word : 'hello'} nghĩa là gì?”.`;
    }
    if (/(hoc tieng anh|nen hoc|cach hoc|lo trinh hoc|study english)/.test(normalized)) {
      return 'Bạn có thể học theo nhịp ngắn mỗi ngày: ôn Flashcard, tra từ mới theo chủ đề, làm một bài Kiểm tra và luyện Nghe. Khi đọc báo, hãy ghi lại từ mới và thử đặt câu của riêng mình.';
    }

    return 'Mình chưa tìm được câu trả lời phù hợp trong dữ liệu hiện có. Mình đang hoạt động offline, nên chưa thể trả lời mọi câu hỏi tự do như một AI trực tuyến. Bạn thử hỏi về nghĩa một từ trong kho, các thì cơ bản, a/an/the, so sánh, giới từ hoặc cách dùng các mục học nhé.';
  }

  function initChatbot() {
    const panel = $('#chatbotPanel');
    const launcher = $('#chatbotLauncher');
    const input = $('#chatbotInput');
    const messages = $('#chatbotMessages');
    const suggestions = $('#chatbotSuggestions');

    function setOpen(open) {
      panel.classList.toggle('hidden', !open);
      launcher.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
    }

    function addMessage(text, sender) {
      const message = document.createElement('div');
      message.className = `chat-message ${sender}`;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      message.appendChild(paragraph);
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function sendQuestion(question) {
      const text = question.trim();
      if (!text) return;
      addMessage(text, 'user');
      suggestions.classList.add('hidden');
      input.value = '';
      addMessage(answerChatQuestion(text), 'bot');
      input.focus();
    }

    launcher.addEventListener('click', () => setOpen(panel.classList.contains('hidden')));
    $('#chatbotClose').addEventListener('click', () => setOpen(false));
    $('#chatbotForm').addEventListener('submit', event => {
      event.preventDefault();
      sendQuestion(input.value);
    });
    suggestions.addEventListener('click', event => {
      const button = event.target.closest('[data-chat-prompt]');
      if (button) sendQuestion(button.dataset.chatPrompt);
    });
  }

  /* ============================================================
     ĐỌC BÁO (NEWS / READING)
     ============================================================ */
  let newsCategory = 'all';
  let newsQuery = '';
  let currentArticle = null;
  let showTranslation = false;

  function renderNewsChips() {
    const wrap = $('#newsChips');
    wrap.innerHTML = '';
    const cats = ['all', ...Array.from(new Set(ALL_NEWS.map(a => a.category)))];
    cats.forEach(c => {
      const b = document.createElement('button');
      b.className = 'chip' + (newsCategory === c ? ' active' : '');
      b.textContent = c === 'all' ? '🌍 Tất cả' : c;
      b.addEventListener('click', () => {
        newsCategory = c;
        renderNewsChips();
        renderNewsList();
      });
      wrap.appendChild(b);
    });
  }

  function renderNewsList() {
    renderNewsChips();
    $('#newsReader').classList.add('hidden');
    const grid = $('#newsGrid');
    grid.classList.remove('hidden');
    grid.innerHTML = '';

    const list = ALL_NEWS.filter(a => {
      const okCat = newsCategory === 'all' || a.category === newsCategory;
      const q = newsQuery.toLowerCase();
      const okQ = !q ||
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return okCat && okQ;
    });

    if (!list.length) {
      grid.innerHTML = '<p class="empty">Không tìm thấy bài báo nào 😕</p>';
      return;
    }

    list.forEach(a => {
      const card = document.createElement('article');
      card.className = 'news-card';
      card.innerHTML = `
        <div class="news-thumb">${a.emoji}</div>
        <div class="news-body">
          <div class="news-tags">
            <span class="news-cat">${a.category}</span>
            <span class="news-level">${a.level}</span>
          </div>
          <h3 class="news-title">${a.title}</h3>
          <p class="news-meta">${a.source} · ${a.readMinutes} phút đọc</p>
        </div>`;
      card.addEventListener('click', () => openArticle(a));
      grid.appendChild(card);
    });
  }

  function openArticle(a) {
    currentArticle = a;
    showTranslation = false;
    window.speechSynthesis && window.speechSynthesis.cancel();

    $('#newsGrid').classList.add('hidden');
    $('#newsReader').classList.remove('hidden');

    $('#rdCategory').textContent = a.category;
    $('#rdLevel').textContent = a.level;
    $('#rdTitle').textContent = a.title;
    $('#rdSource').textContent = a.source;
    $('#rdDate').textContent = a.date;
    $('#rdMinutes').textContent = a.readMinutes;
    $('#rdToggleTrans').textContent = '🇻🇳 Hiện bản dịch';

    // Thân bài: mỗi đoạn có nút nghe riêng
    const body = $('#rdBody');
    body.innerHTML = '';
    a.paragraphs.forEach((p, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'reader-para';
      const txt = document.createElement('p');
      txt.textContent = p;
      const btn = document.createElement('button');
      btn.className = 'speak-inline';
      btn.textContent = '🔊';
      btn.title = 'Nghe đoạn này';
      btn.addEventListener('click', () => speak(p));
      wrap.appendChild(btn);
      wrap.appendChild(txt);
      txt.addEventListener('click', () => speak(p));
      txt.style.cursor = 'pointer';
      body.appendChild(wrap);
    });

    // Từ vựng
    const gl = $('#rdGlossary');
    gl.innerHTML = '';
    a.glossary.forEach(g => {
      const item = document.createElement('div');
      item.className = 'glossary-item';
      item.innerHTML = `
        <div class="gl-word">${g.word} <button class="speak-btn" title="Nghe">🔊</button></div>
        <div class="gl-ipa">${g.ipa}</div>
        <div class="gl-mean">${g.mean}</div>`;
      item.querySelector('.speak-btn').addEventListener('click', () => speak(g.word));
      gl.appendChild(item);
    });

    // Câu hỏi đọc hiểu
    const quiz = $('#rdQuiz');
    quiz.innerHTML = '';
    $('#rdFeedback').textContent = '';
    $('#rdFeedback').className = 'quiz-feedback';

    a.questions.forEach((q, qi) => {
      const block = document.createElement('div');
      block.className = 'reader-q';
      const h = document.createElement('p');
      h.className = 'reader-q-text';
      h.textContent = `${qi + 1}. ${q.q}`;
      block.appendChild(h);

      const opts = document.createElement('div');
      opts.className = 'reader-q-opts';
      q.options.forEach((o, oi) => {
        const b = document.createElement('button');
        b.className = 'option';
        b.textContent = o;
        b.addEventListener('click', () => {
          if (block.dataset.done) return;
          block.dataset.done = '1';
          const btns = opts.querySelectorAll('.option');
          btns.forEach((x, xi) => {
            x.disabled = true;
            if (xi === q.answer) x.classList.add('correct');
          });
          if (oi === q.answer) {
            updateStats({ correct: 1, answered: 1, points: 10 });
            toast('Chính xác! +10 điểm 🎉', 'ok');
          } else {
            b.classList.add('wrong');
            updateStats({ answered: 1 });
          }
        });
        opts.appendChild(b);
      });
      block.appendChild(opts);
      quiz.appendChild(block);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('#newsBack').addEventListener('click', renderNewsList);

  $('#newsSearch').addEventListener('input', (e) => {
    newsQuery = e.target.value.trim();
    renderNewsList();
  });

  $('#rdSpeakAll').addEventListener('click', () => {
    if (currentArticle) speak(currentArticle.paragraphs.join(' '));
  });

  $('#rdStop').addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  });

  $('#rdToggleTrans').addEventListener('click', () => {
    showTranslation = !showTranslation;
    $('#rdToggleTrans').textContent = showTranslation
      ? '🇻🇳 Ẩn bản dịch'
      : '🇻🇳 Hiện bản dịch';
    // Hiển thị/ẩn phần nghĩa tiếng Việt của từ vựng như bản dịch hỗ trợ
    $$('#rdGlossary').forEach(el => el.classList.toggle('show-vi', showTranslation));
    toast(showTranslation
      ? 'Đang bật gợi ý nghĩa tiếng Việt'
      : 'Đã ẩn gợi ý tiếng Việt');
  });

  /* ============================================================
     ĐĂNG XUẤT
     ============================================================ */
  $('#logoutBtn').addEventListener('click', () => {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('em_session');
      window.location.href = 'auth.html';
    }
  });

  /* ============================================================
     KHỞI TẠO
     ============================================================ */
  renderUser();
  renderStats();
  renderTopics();
  renderVocabChips();
  renderVocab();
  renderNewsChips();
  initChatbot();
  loadDuelFromAddress();

})();

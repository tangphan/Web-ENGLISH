/* ============================================================
   EnglishMaster — auth.js
   Xác thực người dùng: đăng ký, đăng nhập, lưu localStorage
   ============================================================ */

(function () {
  'use strict';

  const USERS_KEY = 'em_users';
  const SESSION_KEY = 'em_session';

  const $ = (s) => document.querySelector(s);
  const DUEL_HASH = /^#duel=[A-Za-z0-9_-]+$/.test(window.location.hash)
    ? window.location.hash
    : '';

  /* ---------------- Tiện ích ---------------- */
  function toast(msg, type = '') {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = 'toast ' + type; }, 2600);
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const err = document.querySelector(`.err[data-err="${fieldId}"]`);
    if (input) input.classList.toggle('invalid', !!msg);
    if (err) err.textContent = msg || '';
  }

  function clearErrors(form) {
    form.querySelectorAll('.input').forEach(i => i.classList.remove('invalid'));
    form.querySelectorAll('.err').forEach(e => e.textContent = '');
  }

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* ---------------- Chuyển tab login / register ---------------- */
  function switchTab(which) {
    const isLogin = which === 'login';
    $('#tabLogin').classList.toggle('active', isLogin);
    $('#tabRegister').classList.toggle('active', !isLogin);
    $('#loginForm').classList.toggle('active', isLogin);
    $('#registerForm').classList.toggle('active', !isLogin);
    clearErrors($('#loginForm'));
    clearErrors($('#registerForm'));
  }

  $('#tabLogin').addEventListener('click', () => switchTab('login'));
  $('#tabRegister').addEventListener('click', () => switchTab('register'));
  $('#goRegister').addEventListener('click', (e) => { e.preventDefault(); switchTab('register'); });
  $('#goLogin').addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

  /* ---------------- Hiện / ẩn mật khẩu ---------------- */
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });

  /* ---------------- Đo độ mạnh mật khẩu ---------------- */
  $('#regPassword').addEventListener('input', (e) => {
    const v = e.target.value;
    let score = 0;
    if (v.length >= 6) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const fill = $('#pwMeter');
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#2ec27e'];
    fill.style.width = (score / 4) * 100 + '%';
    fill.style.background = colors[Math.max(0, score - 1)] || '#ef4444';
  });

  /* ---------------- ĐĂNG NHẬP ---------------- */
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors($('#loginForm'));

    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;
    let ok = true;

    if (!email) { setError('loginEmail', 'Vui lòng nhập email.'); ok = false; }
    else if (!isEmail(email)) { setError('loginEmail', 'Email không hợp lệ.'); ok = false; }

    if (!password) { setError('loginPassword', 'Vui lòng nhập mật khẩu.'); ok = false; }
    else if (password.length < 6) { setError('loginPassword', 'Mật khẩu tối thiểu 6 ký tự.'); ok = false; }

    if (!ok) return;

    const users = loadUsers();
    const user = users[email];

    if (!user) {
      setError('loginEmail', 'Tài khoản chưa tồn tại. Hãy đăng ký.');
      return;
    }
    if (user.password !== password) {
      setError('loginPassword', 'Mật khẩu không đúng.');
      return;
    }

    // Tạo session
    const remember = $('#rememberMe').checked;
    const session = { email, name: user.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) localStorage.setItem('em_remember', email);

    toast('Đăng nhập thành công! Đang chuyển hướng...', 'ok');
    setTimeout(() => { window.location.href = 'index.html' + DUEL_HASH; }, 900);
  });

  $('#guestLoginBtn').addEventListener('click', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      email: 'guest@local',
      name: 'Khách',
      guest: true,
    }));
    toast('Đang vào với tư cách khách...', 'ok');
    setTimeout(() => { window.location.href = 'index.html' + DUEL_HASH; }, 500);
  });

  /* ---------------- ĐĂNG KÝ ---------------- */
  $('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors($('#registerForm'));

    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim().toLowerCase();
    const password = $('#regPassword').value;
    const confirm = $('#regConfirm').value;
    const agree = $('#agree').checked;
    let ok = true;

    if (!name) { setError('regName', 'Vui lòng nhập họ tên.'); ok = false; }
    else if (name.length < 2) { setError('regName', 'Tên quá ngắn.'); ok = false; }

    if (!email) { setError('regEmail', 'Vui lòng nhập email.'); ok = false; }
    else if (!isEmail(email)) { setError('regEmail', 'Email không hợp lệ.'); ok = false; }

    if (!password) { setError('regPassword', 'Vui lòng nhập mật khẩu.'); ok = false; }
    else if (password.length < 6) { setError('regPassword', 'Mật khẩu tối thiểu 6 ký tự.'); ok = false; }

    if (!confirm) { setError('regConfirm', 'Vui lòng nhập lại mật khẩu.'); ok = false; }
    else if (confirm !== password) { setError('regConfirm', 'Mật khẩu nhập lại không khớp.'); ok = false; }

    if (!agree) { setError('agree', 'Bạn cần đồng ý điều khoản.'); ok = false; }

    if (!ok) return;

    const users = loadUsers();
    if (users[email]) {
      setError('regEmail', 'Email này đã được đăng ký.');
      return;
    }

    users[email] = {
      name, password,
      learned: 0, points: 0, correct: 0, answered: 0,
      streak: 1,
      createdAt: new Date().toISOString(),
    };
    saveUsers(users);

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }));

    toast('Đăng ký thành công! Chào mừng bạn 🎉', 'ok');
    setTimeout(() => { window.location.href = 'index.html' + DUEL_HASH; }, 1000);
  });

  /* ---------------- Quên mật khẩu (demo) ---------------- */
  $('#forgotLink').addEventListener('click', (e) => {
    e.preventDefault();
    toast('Tính năng demo: vui lòng liên hệ hỗ trợ.', '');
  });

  /* ---------------- Tự điền email đã ghi nhớ ---------------- */
  const remembered = localStorage.getItem('em_remember');
  if (remembered) {
    $('#loginEmail').value = remembered;
    $('#rememberMe').checked = true;
  }

})();

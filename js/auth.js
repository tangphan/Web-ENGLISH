/* ============================================================
   EnglishMaster — auth.js
   Supabase Auth: đăng ký, đăng nhập, duy trì phiên và đăng xuất
   ============================================================ */

(function () {
  'use strict';

  const supabase = window.supabaseClient;
  const $ = selector => document.querySelector(selector);
  const DUEL_HASH = /^#duel=[A-Za-z0-9_-]+$/.test(window.location.hash)
    ? window.location.hash
    : '';

  function setMessage(message, type = '') {
    const element = $('#authMessage');
    element.textContent = message;
    element.className = `auth-message${type ? ` ${type}` : ''}`;
  }

  if (!supabase) {
    setMessage('Không tải được Supabase. Kiểm tra kết nối Internet rồi tải lại trang.', 'error');
    return;
  }

  function setError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.querySelector(`.err[data-err="${fieldId}"]`);
    if (input) input.classList.toggle('invalid', !!message);
    if (error) error.textContent = message || '';
  }

  function clearErrors(form) {
    form.querySelectorAll('.input').forEach(input => input.classList.remove('invalid'));
    form.querySelectorAll('.err').forEach(error => { error.textContent = ''; });
    setMessage('');
  }

  function showAuthenticated(user) {
    $('#authTabs').classList.add('hidden');
    $('#loginForm').classList.remove('active');
    $('#registerForm').classList.remove('active');
    $('#loginForm').classList.add('hidden');
    $('#registerForm').classList.add('hidden');
    $('#authState').classList.remove('hidden');
    $('#authEmail').textContent = user.email || 'Email không khả dụng';
    $('#openAppLink').href = 'index.html' + DUEL_HASH;
    setMessage('');
  }

  function showAuthenticationForms() {
    $('#authTabs').classList.remove('hidden');
    $('#authState').classList.add('hidden');
    $('#loginForm').classList.remove('hidden');
    $('#registerForm').classList.remove('hidden');
    switchTab('login');
  }

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
  $('#goRegister').addEventListener('click', event => {
    event.preventDefault();
    switchTab('register');
  });
  $('#goLogin').addEventListener('click', event => {
    event.preventDefault();
    switchTab('login');
  });

  document.querySelectorAll('.pw-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      button.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });

  $('#regPassword').addEventListener('input', event => {
    const value = event.target.value;
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const fill = $('#pwMeter');
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#2ec27e'];
    fill.style.width = `${(score / 4) * 100}%`;
    fill.style.background = colors[Math.max(0, score - 1)] || '#ef4444';
  });

  $('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    clearErrors(form);

    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;
    let valid = true;

    if (!email) {
      setError('loginEmail', 'Vui lòng nhập email.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('loginEmail', 'Email không hợp lệ.');
      valid = false;
    }
    if (!password) {
      setError('loginPassword', 'Vui lòng nhập mật khẩu.');
      valid = false;
    }
    if (!valid) return;

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Đang đăng nhập...';
    let result;
    try {
      result = await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = 'Đăng nhập';
      setMessage(`Không thể đăng nhập: ${error.message}`, 'error');
      return;
    }
    submitButton.disabled = false;
    submitButton.textContent = 'Đăng nhập';

    const { data, error } = result;
    if (error) {
      setMessage(error.message || 'Không thể đăng nhập. Vui lòng kiểm tra email và mật khẩu.', 'error');
      return;
    }

    if ($('#rememberMe').checked) localStorage.setItem('em_remember', email);
    showAuthenticated(data.user);
    setMessage('Đăng nhập thành công. Phiên được lưu an toàn bởi Supabase.', 'success');
  });

  $('#registerForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    clearErrors(form);

    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim().toLowerCase();
    const password = $('#regPassword').value;
    const confirm = $('#regConfirm').value;
    let valid = true;

    if (name.length < 2) {
      setError('regName', 'Vui lòng nhập họ tên (ít nhất 2 ký tự).');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('regEmail', 'Vui lòng nhập email hợp lệ.');
      valid = false;
    }
    if (password.length < 6) {
      setError('regPassword', 'Mật khẩu tối thiểu 6 ký tự.');
      valid = false;
    }
    if (confirm !== password) {
      setError('regConfirm', 'Mật khẩu nhập lại không khớp.');
      valid = false;
    }
    if (!$('#agree').checked) {
      setError('agree', 'Bạn cần đồng ý điều khoản.');
      valid = false;
    }
    if (!valid) return;

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Đang tạo tài khoản...';
    let result;
    try {
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = 'Tạo tài khoản';
      setMessage(`Không thể tạo tài khoản: ${error.message}`, 'error');
      return;
    }
    submitButton.disabled = false;
    submitButton.textContent = 'Tạo tài khoản';

    const { data, error } = result;
    if (error) {
      setMessage(error.message || 'Không thể tạo tài khoản. Vui lòng thử lại.', 'error');
      return;
    }

    if (data.session) {
      showAuthenticated(data.user);
      setMessage('Tạo tài khoản và đăng nhập thành công.', 'success');
      return;
    }

    switchTab('login');
    $('#loginEmail').value = email;
    setMessage('Tài khoản đã được tạo. Hãy xác minh email từ hộp thư đến rồi đăng nhập.', 'success');
  });

  $('#authSignOut').addEventListener('click', async () => {
    const button = $('#authSignOut');
    button.disabled = true;
    let result;
    try {
      result = await supabase.auth.signOut();
    } catch (error) {
      button.disabled = false;
      setMessage(`Không thể đăng xuất: ${error.message}`, 'error');
      return;
    }
    button.disabled = false;
    const { error } = result;
    if (error) {
      setMessage(`Không thể đăng xuất: ${error.message}`, 'error');
      return;
    }
    showAuthenticationForms();
    setMessage('Bạn đã đăng xuất.', 'success');
  });

  const remembered = localStorage.getItem('em_remember');
  if (remembered) {
    $('#loginEmail').value = remembered;
    $('#rememberMe').checked = true;
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) showAuthenticated(session.user);
    else if (event === 'SIGNED_OUT') showAuthenticationForms();
  });

  document.addEventListener('DOMContentLoaded', async () => {
    let result;
    try {
      result = await supabase.auth.getSession();
    } catch (error) {
      console.error('Unable to restore Supabase session:', error);
      setMessage(`Không thể kiểm tra phiên đăng nhập: ${error.message}`, 'error');
      return;
    }
    const { data, error } = result;
    if (error) {
      console.error('Unable to restore Supabase session:', error);
      setMessage(`Không thể kiểm tra phiên đăng nhập: ${error.message}`, 'error');
      return;
    }
    if (data.session?.user) showAuthenticated(data.session.user);
  });
})();

/* ============================================================
   EnglishMaster — data.js
   Dữ liệu từ vựng, chủ đề, câu hỏi trắc nghiệm & luyện nghe
   ============================================================ */

const TOPICS = [
  { id: 'daily',  name: 'Giao tiếp hằng ngày', emoji: '💬' },
  { id: 'food',   name: 'Đồ ăn & Thức uống',   emoji: '🍔' },
  { id: 'travel', name: 'Du lịch',             emoji: '✈️' },
  { id: 'work',   name: 'Công việc',           emoji: '💼' },
  { id: 'school', name: 'Trường học',          emoji: '🎓' },
  { id: 'nature', name: 'Thiên nhiên',         emoji: '🌿' },
];

const VOCABULARY = [
  // ---- Giao tiếp hằng ngày ----
  { topic: 'daily',  word: 'Hello',    ipa: '/həˈloʊ/',     mean: 'Xin chào',        ex: 'Hello, how are you today?' },
  { topic: 'daily',  word: 'Thanks',   ipa: '/θæŋks/',      mean: 'Cảm ơn',          ex: 'Thanks for your help!' },
  { topic: 'daily',  word: 'Sorry',    ipa: '/ˈsɒri/',      mean: 'Xin lỗi',         ex: 'Sorry, I am late.' },
  { topic: 'daily',  word: 'Please',   ipa: '/pliːz/',      mean: 'Làm ơn',          ex: 'Please open the door.' },
  { topic: 'daily',  word: 'Goodbye',  ipa: '/ˌɡʊdˈbaɪ/',   mean: 'Tạm biệt',        ex: 'Goodbye, see you tomorrow!' },
  { topic: 'daily',  word: 'Welcome',  ipa: '/ˈwelkəm/',    mean: 'Chào mừng',       ex: 'Welcome to our home.' },

  // ---- Đồ ăn & Thức uống ----
  { topic: 'food',   word: 'Apple',    ipa: '/ˈæpl/',       mean: 'Quả táo',         ex: 'I eat an apple every day.' },
  { topic: 'food',   word: 'Bread',    ipa: '/bred/',       mean: 'Bánh mì',         ex: 'She bought fresh bread.' },
  { topic: 'food',   word: 'Coffee',   ipa: '/ˈkɒfi/',      mean: 'Cà phê',          ex: 'A cup of coffee, please.' },
  { topic: 'food',   word: 'Water',    ipa: '/ˈwɔːtər/',    mean: 'Nước',            ex: 'Drink more water.' },
  { topic: 'food',   word: 'Rice',     ipa: '/raɪs/',       mean: 'Cơm, gạo',        ex: 'We eat rice with fish.' },
  { topic: 'food',   word: 'Sugar',    ipa: '/ˈʃʊɡər/',     mean: 'Đường',           ex: 'No sugar in my tea, please.' },

  // ---- Du lịch ----
  { topic: 'travel', word: 'Airport',  ipa: '/ˈeəpɔːt/',    mean: 'Sân bay',         ex: 'The airport is very busy.' },
  { topic: 'travel', word: 'Ticket',   ipa: '/ˈtɪkɪt/',     mean: 'Vé',              ex: 'I bought a train ticket.' },
  { topic: 'travel', word: 'Hotel',    ipa: '/həʊˈtel/',    mean: 'Khách sạn',       ex: 'We stayed at a nice hotel.' },
  { topic: 'travel', word: 'Luggage',  ipa: '/ˈlʌɡɪdʒ/',    mean: 'Hành lý',         ex: 'Where is my luggage?' },
  { topic: 'travel', word: 'Journey',  ipa: '/ˈdʒɜːni/',    mean: 'Hành trình',      ex: 'The journey was long.' },
  { topic: 'travel', word: 'Passport', ipa: '/ˈpɑːspɔːt/',  mean: 'Hộ chiếu',        ex: 'Show me your passport.' },

  // ---- Công việc ----
  { topic: 'work',   word: 'Office',   ipa: '/ˈɒfɪs/',      mean: 'Văn phòng',       ex: 'I work in a big office.' },
  { topic: 'work',   word: 'Meeting',  ipa: '/ˈmiːtɪŋ/',    mean: 'Cuộc họp',        ex: 'The meeting starts at 9.' },
  { topic: 'work',   word: 'Salary',   ipa: '/ˈsæləri/',    mean: 'Tiền lương',      ex: 'He got a higher salary.' },
  { topic: 'work',   word: 'Project',  ipa: '/ˈprɒdʒekt/',  mean: 'Dự án',           ex: 'We finished the project.' },
  { topic: 'work',   word: 'Manager',  ipa: '/ˈmænɪdʒər/',  mean: 'Quản lý',         ex: 'My manager is friendly.' },
  { topic: 'work',   word: 'Deadline', ipa: '/ˈdedlaɪn/',   mean: 'Hạn chót',        ex: 'The deadline is Friday.' },

  // ---- Trường học ----
  { topic: 'school', word: 'Teacher',  ipa: '/ˈtiːtʃər/',   mean: 'Giáo viên',       ex: 'Our teacher is very kind.' },
  { topic: 'school', word: 'Student',  ipa: '/ˈstjuːdnt/',  mean: 'Học sinh',        ex: 'She is a good student.' },
  { topic: 'school', word: 'Library',  ipa: '/ˈlaɪbrəri/',  mean: 'Thư viện',        ex: 'I study in the library.' },
  { topic: 'school', word: 'Homework', ipa: '/ˈhəʊmwɜːk/',  mean: 'Bài tập về nhà',  ex: 'Did you do your homework?' },
  { topic: 'school', word: 'Exam',     ipa: '/ɪɡˈzæm/',     mean: 'Kỳ thi',          ex: 'The exam was difficult.' },
  { topic: 'school', word: 'Lesson',   ipa: '/ˈlesn/',      mean: 'Bài học',         ex: 'Today we learn a new lesson.' },

  // ---- Thiên nhiên ----
  { topic: 'nature', word: 'Mountain', ipa: '/ˈmaʊntɪn/',   mean: 'Núi',             ex: 'We climbed the mountain.' },
  { topic: 'nature', word: 'River',    ipa: '/ˈrɪvər/',     mean: 'Con sông',        ex: 'The river is very wide.' },
  { topic: 'nature', word: 'Forest',   ipa: '/ˈfɒrɪst/',    mean: 'Khu rừng',        ex: 'Many animals live in the forest.' },
  { topic: 'nature', word: 'Ocean',    ipa: '/ˈəʊʃn/',      mean: 'Đại dương',       ex: 'The ocean is deep and blue.' },
  { topic: 'nature', word: 'Weather',  ipa: '/ˈweðər/',     mean: 'Thời tiết',       ex: 'The weather is nice today.' },
  { topic: 'nature', word: 'Flower',   ipa: '/ˈflaʊər/',    mean: 'Bông hoa',        ex: 'She loves the red flower.' },
];

/* ---------------- Câu hỏi luyện nghe ---------------- */
const LISTENING = [
  { text: 'I would like a cup of coffee.',       options: ['Tôi muốn một tách cà phê.', 'Tôi muốn một cốc nước.', 'Tôi muốn một chiếc bánh.'], answer: 0 },
  { text: 'Where is the train station?',         options: ['Nhà ga ở đâu?', 'Khách sạn ở đâu?', 'Sân bay ở đâu?'], answer: 0 },
  { text: 'She works in a big office.',          options: ['Cô ấy làm việc trong một văn phòng lớn.', 'Cô ấy sống trong một ngôi nhà lớn.', 'Cô ấy học ở một trường lớn.'], answer: 0 },
  { text: 'The weather is very nice today.',     options: ['Thời tiết hôm nay rất đẹp.', 'Thời tiết hôm nay rất xấu.', 'Hôm nay trời rất lạnh.'], answer: 0 },
  { text: 'I need to finish my homework.',       options: ['Tôi cần hoàn thành bài tập về nhà.', 'Tôi cần đi ngủ sớm.', 'Tôi cần mua một cuốn sách.'], answer: 0 },
  { text: 'The river is long and wide.',         options: ['Con sông dài và rộng.', 'Ngọn núi cao và đẹp.', 'Khu rừng rất yên tĩnh.'], answer: 0 },
  { text: 'She bought a ticket for the journey.', options: ['Cô ấy mua vé cho chuyến đi.', 'Cô ấy quên hành lý ở sân bay.', 'Cô ấy đổi hộ chiếu mới.'], answer: 0 },
  { text: 'My manager is very friendly.',        options: ['Quản lý của tôi rất thân thiện.', 'Đồng nghiệp của tôi rất nghiêm khắc.', 'Giáo viên của tôi rất tốt bụng.'], answer: 0 },
];

/* ---------------- Sinh câu hỏi trắc nghiệm ---------------- */
function buildQuizQuestions(count = 8) {
  const pool = [];

  VOCABULARY.forEach(item => {
    const others = VOCABULARY.filter(v => v.word !== item.word);
    const distractors = shuffle(others).slice(0, 3).map(v => v.mean);
    const options = shuffle([item.mean, ...distractors]);
    pool.push({
      question: `Nghĩa của từ "${item.word}" là gì?`,
      options,
      answer: options.indexOf(item.mean),
    });
  });

  return shuffle(pool).slice(0, count);
}

/* ---------------- Tiện ích ---------------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

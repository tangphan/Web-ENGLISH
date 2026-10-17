/* Nguồn câu luyện nghe — sinh từ mẫu câu theo chủ đề.
   Mỗi mục: { text, correct, distractors:[d1, d2] }
   Cách sinh: mỗi chủ đề có nhiều "khung câu" (templates) + từ vựng điền vào,
   tạo ra câu tự nhiên, đa dạng, không lặp lại vô nghĩa.
*/

/* ---------- Câu mẫu cố định (chất lượng cao) ---------- */
export const FIXED_SENTENCES = [
  ['I would like a cup of coffee, please.', 'Tôi muốn một tách cà phê.', ['Tôi muốn một cốc nước.', 'Tôi muốn một chiếc bánh.']],
  ['Where is the nearest train station?', 'Nhà ga gần nhất ở đâu?', ['Khách sạn gần nhất ở đâu?', 'Sân bay gần nhất ở đâu?']],
  ['She works in a large international office.', 'Cô ấy làm việc trong một văn phòng quốc tế lớn.', ['Cô ấy sống trong một ngôi nhà lớn.', 'Cô ấy học ở một trường lớn.']],
  ['The weather is very nice today.', 'Thời tiết hôm nay rất đẹp.', ['Thời tiết hôm nay rất xấu.', 'Hôm nay trời rất lạnh.']],
  ['I need to finish my homework before dinner.', 'Tôi cần hoàn thành bài tập trước bữa tối.', ['Tôi cần đi ngủ sớm.', 'Tôi cần mua một cuốn sách mới.']],
  ['The river runs through the whole valley.', 'Con sông chảy qua toàn bộ thung lũng.', ['Ngọn núi cao và rất đẹp.', 'Khu rừng rất yên tĩnh về đêm.']],
  ['She bought a ticket for the morning journey.', 'Cô ấy mua vé cho chuyến đi buổi sáng.', ['Cô ấy quên hành lý ở sân bay.', 'Cô ấy đổi hộ chiếu mới.']],
  ['My manager is very friendly and helpful.', 'Quản lý của tôi rất thân thiện và hay giúp đỡ.', ['Đồng nghiệp của tôi rất nghiêm khắc.', 'Giáo viên của tôi rất tốt bụng.']],
  ['He is reading a book about ancient history.', 'Anh ấy đang đọc một cuốn sách về lịch sử cổ đại.', ['Anh ấy đang xem một bộ phim.', 'Anh ấy đang viết một lá thư.']],
  ['The children are playing in the garden.', 'Bọn trẻ đang chơi trong vườn.', ['Bọn trẻ đang học bài.', 'Bọn trẻ đang ngủ trưa.']],
  ['Please turn off the lights when you leave.', 'Hãy tắt đèn khi bạn rời đi.', ['Hãy mở cửa khi bạn đến.', 'Hãy bật nhạc khi bạn về.']],
  ['The meeting has been moved to Friday.', 'Cuộc họp đã được dời sang thứ Sáu.', ['Cuộc họp đã bị hủy bỏ.', 'Cuộc họp sẽ bắt đầu sớm hơn.']],
  ['I usually wake up at six in the morning.', 'Tôi thường thức dậy lúc sáu giờ sáng.', ['Tôi thường đi ngủ lúc sáu giờ.', 'Tôi thường ăn sáng lúc bảy giờ.']],
  ['This restaurant serves excellent seafood.', 'Nhà hàng này phục vụ hải sản tuyệt vời.', ['Nhà hàng này chỉ bán đồ chay.', 'Nhà hàng này rất đông khách.']],
  ['He has been learning English for three years.', 'Anh ấy đã học tiếng Anh được ba năm.', ['Anh ấy mới bắt đầu học tiếng Anh.', 'Anh ấy dạy tiếng Anh ba năm rồi.']],
  ['Could you please repeat that more slowly?', 'Bạn có thể nhắc lại chậm hơn được không?', ['Bạn có thể nói to hơn được không?', 'Bạn có thể viết ra được không?']],
  ['The company plans to open a new branch.', 'Công ty dự định mở một chi nhánh mới.', ['Công ty dự định sa thải nhân viên.', 'Công ty dự định đóng cửa văn phòng.']],
  ['We should leave before the traffic gets bad.', 'Chúng ta nên đi trước khi kẹt xe.', ['Chúng ta nên ở lại thêm một lát.', 'Chúng ta nên gọi taxi về nhà.']],
  ['My sister is studying medicine at university.', 'Chị tôi đang học y tại trường đại học.', ['Chị tôi đang dạy ở trường.', 'Chị tôi đang làm ở bệnh viện.']],
  ['The package will arrive within three days.', 'Gói hàng sẽ đến trong vòng ba ngày.', ['Gói hàng đã bị thất lạc.', 'Gói hàng sẽ gửi đi tuần sau.']],
  ['Turn left at the next traffic light.', 'Rẽ trái ở đèn giao thông tiếp theo.', ['Rẽ phải ở ngã tư tiếp theo.', 'Đi thẳng qua cây cầu.']],
  ['I forgot to bring my umbrella today.', 'Hôm nay tôi quên mang ô.', ['Hôm nay tôi quên mang ví.', 'Hôm nay tôi quên mang chìa khóa.']],
  ['The museum is closed on Mondays.', 'Bảo tàng đóng cửa vào thứ Hai.', ['Bảo tàng mở cửa cả cuối tuần.', 'Bảo tàng miễn phí vé vào cửa.']],
  ['She speaks three languages fluently.', 'Cô ấy nói thành thạo ba thứ tiếng.', ['Cô ấy đang học hai ngoại ngữ.', 'Cô ấy chỉ nói được tiếng Anh.']],
  ['The train departs from platform number two.', 'Tàu khởi hành từ sân ga số hai.', ['Tàu đến muộn mười lăm phút.', 'Tàu đã bị hủy chuyến.']],
  ['He apologized for arriving so late.', 'Anh ấy xin lỗi vì đến quá muộn.', ['Anh ấy rời đi rất sớm.', 'Anh ấy quên giờ hẹn.']],
  ['We need to buy some vegetables for dinner.', 'Chúng ta cần mua ít rau cho bữa tối.', ['Chúng ta cần nấu bữa sáng.', 'Chúng ta cần dọn dẹp nhà bếp.']],
  ['The manager approved my leave request.', 'Quản lý đã chấp thuận đơn xin nghỉ của tôi.', ['Quản lý từ chối đơn xin nghỉ.', 'Quản lý quên đơn xin nghỉ.']],
  ['This book is much more interesting than that one.', 'Cuốn sách này thú vị hơn cuốn kia nhiều.', ['Cuốn sách này đắt hơn cuốn kia.', 'Cuốn sách này dày hơn cuốn kia.']],
  ['The doctor advised him to rest for a week.', 'Bác sĩ khuyên anh ấy nghỉ ngơi một tuần.', ['Bác sĩ khuyên anh ấy uống nhiều nước.', 'Bác sĩ khuyên anh ấy tập thể dục.']],
  ['Our flight was delayed because of the storm.', 'Chuyến bay của chúng tôi bị hoãn vì bão.', ['Chuyến bay của chúng tôi khởi hành đúng giờ.', 'Chuyến bay của chúng tôi bị hủy.']],
  ['She is looking for a part-time job.', 'Cô ấy đang tìm một công việc bán thời gian.', ['Cô ấy đang tìm một căn hộ.', 'Cô ấy đang tìm một khóa học.']],
  ['Please write your name at the top of the page.', 'Hãy viết tên bạn ở đầu trang.', ['Hãy ký tên ở cuối trang.', 'Hãy ghi ngày tháng vào góc.']],
  ['The price of electricity has gone up again.', 'Giá điện lại tăng lên lần nữa.', ['Giá điện đã giảm xuống.', 'Giá điện không thay đổi.']],
  ['He fixed the broken chair with some tools.', 'Anh ấy sửa chiếc ghế hỏng bằng vài dụng cụ.', ['Anh ấy mua một chiếc ghế mới.', 'Anh ấy vứt chiếc ghế cũ đi.']],
  ['We are planning a trip to the mountains.', 'Chúng tôi đang lên kế hoạch đi du lịch núi.', ['Chúng tôi đang dọn đến thành phố.', 'Chúng tôi đang đi biển cuối tuần.']],
  ['She always keeps her promises.', 'Cô ấy luôn giữ lời hứa của mình.', ['Cô ấy thường quên lời hứa.', 'Cô ấy hay thay đổi kế hoạch.']],
  ['The students are preparing for the final exam.', 'Các học sinh đang chuẩn bị cho kỳ thi cuối kỳ.', ['Các học sinh đang nghỉ hè.', 'Các học sinh đang làm bài tập nhóm.']],
  ['I cannot attend the party this weekend.', 'Tôi không thể tham dự bữa tiệc cuối tuần này.', ['Tôi sẽ đến bữa tiệc sớm.', 'Tôi sẽ tổ chức bữa tiệc.']],
  ['The shop offers a discount on all items.', 'Cửa hàng giảm giá cho tất cả mặt hàng.', ['Cửa hàng chỉ bán đồ cao cấp.', 'Cửa hàng đã hết hàng.']],
];

/* ---------- Khung câu theo chủ đề để sinh tự động ----------
   Mỗi template: { en: hàm nhận item -> câu tiếng Anh,
                   vi: hàm nhận item -> đáp án đúng,
                   d: [hàm tạo đáp án sai 1, hàm tạo đáp án sai 2] }
   item: { en: cụm tiếng Anh, vi: nghĩa tiếng Việt }
*/
export const TEMPLATES = [
  // --- Chủ đề: đồ ăn / nhà hàng ---
  {
    items: [
      { en: 'a bowl of noodles', vi: 'một bát mì' },
      { en: 'a glass of orange juice', vi: 'một ly nước cam' },
      { en: 'a loaf of bread', vi: 'một ổ bánh mì' },
      { en: 'a bottle of water', vi: 'một chai nước' },
      { en: 'a piece of cake', vi: 'một miếng bánh' },
      { en: 'a cup of tea', vi: 'một tách trà' },
      { en: 'a plate of rice', vi: 'một đĩa cơm' },
      { en: 'a slice of pizza', vi: 'một miếng pizza' },
      { en: 'a carton of milk', vi: 'một hộp sữa' },
      { en: 'a handful of nuts', vi: 'một nắm hạt' },
    ],
    en: it => `I would like to order ${it.en}, please.`,
    vi: it => `Tôi muốn gọi ${it.vi}.`,
    wrong: it => [`Tôi muốn trả lại ${it.vi}.`, `Tôi muốn bỏ ${it.vi} đi.`],
  },
  {
    items: [
      { en: 'the soup', vi: 'món súp' },
      { en: 'the grilled fish', vi: 'món cá nướng' },
      { en: 'the fried chicken', vi: 'món gà rán' },
      { en: 'the fresh salad', vi: 'món salad tươi' },
      { en: 'the spicy noodles', vi: 'món mì cay' },
      { en: 'the roasted duck', vi: 'món vịt quay' },
      { en: 'the vegetarian dish', vi: 'món ăn chay' },
      { en: 'the seafood platter', vi: 'đĩa hải sản' },
    ],
    en: it => `This restaurant is famous for ${it.en}.`,
    vi: it => `Nhà hàng này nổi tiếng với ${it.vi}.`,
    wrong: it => [`Nhà hàng này đã ngừng bán ${it.vi}.`, `Nhà hàng này không bao giờ phục vụ ${it.vi}.`],
  },

  // --- Chủ đề: du lịch ---
  {
    items: [
      { en: 'the airport', vi: 'sân bay' },
      { en: 'the train station', vi: 'nhà ga' },
      { en: 'the bus stop', vi: 'trạm xe buýt' },
      { en: 'the city centre', vi: 'trung tâm thành phố' },
      { en: 'the old museum', vi: 'bảo tàng cổ' },
      { en: 'the national park', vi: 'công viên quốc gia' },
      { en: 'the harbour', vi: 'bến cảng' },
      { en: 'the shopping mall', vi: 'trung tâm thương mại' },
    ],
    en: it => `Could you tell me how to get to ${it.en}?`,
    vi: it => `Bạn có thể chỉ tôi đường đến ${it.vi} không?`,
    wrong: it => [`Bạn có thể mua vé cho ${it.vi} không?`, `Bạn có thể dọn dẹp ${it.vi} không?`],
  },
  {
    items: [
      { en: 'two nights', vi: 'hai đêm' },
      { en: 'three days', vi: 'ba ngày' },
      { en: 'one week', vi: 'một tuần' },
      { en: 'a few hours', vi: 'vài giờ' },
      { en: 'ten minutes', vi: 'mười phút' },
      { en: 'the whole weekend', vi: 'cả cuối tuần' },
      { en: 'five nights', vi: 'năm đêm' },
      { en: 'two weeks', vi: 'hai tuần' },
    ],
    en: it => `We will stay there for ${it.en}.`,
    vi: it => `Chúng tôi sẽ ở đó ${it.vi}.`,
    wrong: it => [`Chúng tôi sẽ rời đi sau ${it.vi}.`, `Chúng tôi sẽ trả tiền cho ${it.vi}.`],
  },

  // --- Chủ đề: công việc ---
  {
    items: [
      { en: 'a new project', vi: 'một dự án mới' },
      { en: 'the annual report', vi: 'báo cáo thường niên' },
      { en: 'the marketing plan', vi: 'kế hoạch tiếp thị' },
      { en: 'the client proposal', vi: 'đề xuất cho khách hàng' },
      { en: 'the monthly budget', vi: 'ngân sách hàng tháng' },
      { en: 'the training program', vi: 'chương trình đào tạo' },
      { en: 'the sales strategy', vi: 'chiến lược bán hàng' },
      { en: 'the team schedule', vi: 'lịch làm việc nhóm' },
    ],
    en: it => `We need to discuss ${it.en} tomorrow morning.`,
    vi: it => `Chúng ta cần thảo luận ${it.vi} vào sáng mai.`,
    wrong: it => [`Chúng ta cần hủy ${it.vi} vào sáng mai.`, `Chúng ta cần in ${it.vi} vào sáng mai.`],
  },
  {
    items: [
      { en: 'the deadline', vi: 'hạn chót' },
      { en: 'the contract', vi: 'hợp đồng' },
      { en: 'the invoice', vi: 'hóa đơn' },
      { en: 'the meeting', vi: 'cuộc họp' },
      { en: 'the interview', vi: 'buổi phỏng vấn' },
      { en: 'the presentation', vi: 'bài thuyết trình' },
      { en: 'the salary review', vi: 'việc xem xét lương' },
      { en: 'the job offer', vi: 'lời mời làm việc' },
    ],
    en: it => `The manager has not confirmed ${it.en} yet.`,
    vi: it => `Quản lý vẫn chưa xác nhận ${it.vi}.`,
    wrong: it => [`Quản lý đã quên hoàn toàn ${it.vi}.`, `Quản lý đã ký ${it.vi} rồi.`],
  },

  // --- Chủ đề: trường học ---
  {
    items: [
      { en: 'the final exam', vi: 'kỳ thi cuối kỳ' },
      { en: 'the science project', vi: 'dự án khoa học' },
      { en: 'the history essay', vi: 'bài luận lịch sử' },
      { en: 'the group assignment', vi: 'bài tập nhóm' },
      { en: 'the oral presentation', vi: 'bài thuyết trình miệng' },
      { en: 'the entrance test', vi: 'bài kiểm tra đầu vào' },
      { en: 'the research paper', vi: 'bài nghiên cứu' },
      { en: 'the midterm quiz', vi: 'bài kiểm tra giữa kỳ' },
    ],
    en: it => `All students must prepare for ${it.en}.`,
    vi: it => `Tất cả học sinh phải chuẩn bị cho ${it.vi}.`,
    wrong: it => [`Tất cả học sinh được miễn ${it.vi}.`, `Tất cả học sinh đã hoàn thành ${it.vi}.`],
  },

  // --- Chủ đề: sức khỏe ---
  {
    items: [
      { en: 'drink more water', vi: 'uống nhiều nước hơn' },
      { en: 'get more sleep', vi: 'ngủ nhiều hơn' },
      { en: 'exercise every day', vi: 'tập thể dục mỗi ngày' },
      { en: 'eat more vegetables', vi: 'ăn nhiều rau hơn' },
      { en: 'reduce sugar', vi: 'giảm đường' },
      { en: 'take the medicine', vi: 'uống thuốc' },
      { en: 'avoid stress', vi: 'tránh căng thẳng' },
      { en: 'rest for a few days', vi: 'nghỉ ngơi vài ngày' },
    ],
    en: it => `The doctor told him to ${it.en}.`,
    vi: it => `Bác sĩ bảo anh ấy ${it.vi}.`,
    wrong: it => [`Bác sĩ cấm anh ấy ${it.vi}.`, `Bác sĩ quên nhắc anh ấy ${it.vi}.`],
  },

  // --- Chủ đề: môi trường ---
  {
    items: [
      { en: 'plastic waste', vi: 'rác thải nhựa' },
      { en: 'air pollution', vi: 'ô nhiễm không khí' },
      { en: 'carbon emissions', vi: 'khí thải carbon' },
      { en: 'clean energy', vi: 'năng lượng sạch' },
      { en: 'greenhouse gases', vi: 'khí nhà kính' },
      { en: 'water pollution', vi: 'ô nhiễm nguồn nước' },
      { en: 'forest loss', vi: 'mất rừng' },
      { en: 'renewable power', vi: 'năng lượng tái tạo' },
    ],
    en: it => `The government must tackle ${it.en} urgently.`,
    vi: it => `Chính phủ phải giải quyết ${it.vi} khẩn cấp.`,
    wrong: it => [`Chính phủ đã bỏ qua ${it.vi} hoàn toàn.`, `Chính phủ tài trợ cho ${it.vi}.`],
  },

  // --- Chủ đề: công nghệ ---
  {
    items: [
      { en: 'a new laptop', vi: 'một chiếc laptop mới' },
      { en: 'the latest software', vi: 'phần mềm mới nhất' },
      { en: 'a fast internet connection', vi: 'kết nối internet nhanh' },
      { en: 'a larger screen', vi: 'màn hình lớn hơn' },
      { en: 'the security update', vi: 'bản cập nhật bảo mật' },
      { en: 'a backup drive', vi: 'ổ đĩa sao lưu' },
      { en: 'the mobile app', vi: 'ứng dụng di động' },
      { en: 'a wireless keyboard', vi: 'bàn phím không dây' },
    ],
    en: it => `I think we should buy ${it.en}.`,
    vi: it => `Tôi nghĩ chúng ta nên mua ${it.vi}.`,
    wrong: it => [`Tôi nghĩ chúng ta nên bán ${it.vi}.`, `Tôi nghĩ chúng ta nên vứt ${it.vi}.`],
  },

  // --- Chủ đề: kinh tế / tài chính ---
  {
    items: [
      { en: 'the interest rate', vi: 'lãi suất' },
      { en: 'the exchange rate', vi: 'tỷ giá hối đoái' },
      { en: 'the inflation figures', vi: 'số liệu lạm phát' },
      { en: 'the trade deficit', vi: 'thâm hụt thương mại' },
      { en: 'the stock market', vi: 'thị trường chứng khoán' },
      { en: 'the national budget', vi: 'ngân sách quốc gia' },
      { en: 'the unemployment rate', vi: 'tỷ lệ thất nghiệp' },
      { en: 'the economic forecast', vi: 'dự báo kinh tế' },
    ],
    en: it => `Economists are closely watching ${it.en}.`,
    vi: it => `Các nhà kinh tế đang theo dõi sát ${it.vi}.`,
    wrong: it => [`Các nhà kinh tế đã quên ${it.vi}.`, `Các nhà kinh tế phủ nhận ${it.vi}.`],
  },

  // --- Chủ đề: pháp luật ---
  {
    items: [
      { en: 'the new regulation', vi: 'quy định mới' },
      { en: 'the court ruling', vi: 'phán quyết của tòa' },
      { en: 'the legal contract', vi: 'hợp đồng pháp lý' },
      { en: 'the criminal case', vi: 'vụ án hình sự' },
      { en: 'the witness statement', vi: 'lời khai nhân chứng' },
      { en: 'the appeal process', vi: 'quá trình kháng cáo' },
      { en: 'the property dispute', vi: 'tranh chấp tài sản' },
      { en: 'the employment law', vi: 'luật lao động' },
    ],
    en: it => `The lawyer explained ${it.en} in detail.`,
    vi: it => `Luật sư đã giải thích chi tiết về ${it.vi}.`,
    wrong: it => [`Luật sư đã che giấu ${it.vi}.`, `Luật sư đã bỏ qua ${it.vi}.`],
  },
];

/* ---------- Cấu trúc câu bổ sung (sinh nhiều biến thể hơn) ---------- */
export const STRUCTURES = [
  {
    // "She has lived in X since Y"
    subjects: [
      { en: 'She has lived in', vi: 'Cô ấy đã sống ở' },
      { en: 'He has worked in', vi: 'Anh ấy đã làm việc ở' },
      { en: 'They have stayed in', vi: 'Họ đã ở tại' },
      { en: 'We have studied in', vi: 'Chúng tôi đã học ở' },
    ],
    places: [
      { en: 'London', vi: 'Luân Đôn' },
      { en: 'Tokyo', vi: 'Tokyo' },
      { en: 'New York', vi: 'New York' },
      { en: 'Sydney', vi: 'Sydney' },
      { en: 'Paris', vi: 'Paris' },
      { en: 'Singapore', vi: 'Singapore' },
      { en: 'Berlin', vi: 'Berlin' },
      { en: 'Seoul', vi: 'Seoul' },
    ],
    endEn: 'for many years.',
    endVi: 'được nhiều năm.',
    wrongEnd: ['chỉ vài ngày.', 'một tuần trước.'],
  },
  {
    // "X is more expensive than Y"
    a: [
      { en: 'This hotel', vi: 'Khách sạn này' },
      { en: 'That restaurant', vi: 'Nhà hàng kia' },
      { en: 'The new phone', vi: 'Chiếc điện thoại mới' },
      { en: 'This apartment', vi: 'Căn hộ này' },
    ],
    b: [
      { en: 'the one next door', vi: 'cái bên cạnh' },
      { en: 'the old model', vi: 'mẫu cũ' },
      { en: 'what we expected', vi: 'so với chúng tôi nghĩ' },
      { en: 'any other option', vi: 'mọi lựa chọn khác' },
    ],
    en: (x, y) => `${x.en} is much more expensive than ${y.en}.`,
    vi: (x, y) => `${x.vi} đắt hơn nhiều so với ${y.vi}.`,
    wrong: (x, y) => [`${x.vi} rẻ hơn nhiều so với ${y.vi}.`, `${x.vi} giống hệt ${y.vi}.`],
  },
  {
    // "I have never seen such a X"
    things: [
      { en: 'beautiful sunset', vi: 'hoàng hôn đẹp' },
      { en: 'strange animal', vi: 'con vật lạ' },
      { en: 'large building', vi: 'tòa nhà lớn' },
      { en: 'funny movie', vi: 'bộ phim hài hước' },
      { en: 'difficult question', vi: 'câu hỏi khó' },
      { en: 'crowded market', vi: 'khu chợ đông đúc' },
      { en: 'talented singer', vi: 'ca sĩ tài năng' },
      { en: 'noisy street', vi: 'con phố ồn ào' },
    ],
    en: it => `I have never seen such a ${it.en} before.`,
    vi: it => `Tôi chưa từng thấy ${it.vi} như vậy bao giờ.`,
    wrong: it => [`Tôi thường thấy ${it.vi} mỗi ngày.`, `Tôi đã quên ${it.vi} rồi.`],
  },
  {
    // "If it rains, we will X"
    actions: [
      { en: 'stay at home', vi: 'ở nhà' },
      { en: 'cancel the picnic', vi: 'hủy buổi dã ngoại' },
      { en: 'take a taxi', vi: 'bắt taxi' },
      { en: 'watch a film', vi: 'xem phim' },
      { en: 'cook dinner inside', vi: 'nấu bữa tối trong nhà' },
      { en: 'postpone the match', vi: 'hoãn trận đấu' },
    ],
    en: it => `If it rains tomorrow, we will ${it.en}.`,
    vi: it => `Nếu mai trời mưa, chúng tôi sẽ ${it.vi}.`,
    wrong: it => [`Nếu mai trời mưa, chúng tôi sẽ không ${it.vi}.`, `Nếu mai nắng, chúng tôi sẽ ${it.vi}.`],
  },
];

/* ---------- Nhiều câu cố định chất lượng cao khác ---------- */
export const EXTRA_FIXED = [
  ['Could you send me the report by email?', 'Bạn có thể gửi báo cáo qua email cho tôi không?', ['Bạn có thể in báo cáo ra giấy không?', 'Bạn có thể đọc báo cáo giúp tôi không?']],
  ['The flight to Bangkok takes two hours.', 'Chuyến bay đến Bangkok mất hai tiếng.', ['Chuyến bay đến Bangkok bị hủy.', 'Chuyến bay đến Bangkok rất đắt.']],
  ['I have already finished my assignment.', 'Tôi đã hoàn thành bài tập rồi.', ['Tôi chưa bắt đầu bài tập.', 'Tôi đang làm dở bài tập.']],
  ['She is the most talented student in class.', 'Cô ấy là học sinh tài năng nhất lớp.', ['Cô ấy là học sinh mới của lớp.', 'Cô ấy là lớp trưởng của lớp.']],
  ['We had a wonderful time at the beach.', 'Chúng tôi đã có khoảng thời gian tuyệt vời ở bãi biển.', ['Chúng tôi đã gặp rắc rối ở bãi biển.', 'Chúng tôi đã bỏ lỡ chuyến đi biển.']],
  ['He earns more money than his brother.', 'Anh ấy kiếm được nhiều tiền hơn anh trai mình.', ['Anh ấy kiếm được ít tiền hơn anh trai.', 'Anh ấy và anh trai kiếm bằng nhau.']],
  ['The building was constructed in nineteen ninety.', 'Tòa nhà được xây dựng vào năm một nghìn chín trăm chín mươi.', ['Tòa nhà đã bị phá dỡ năm ngoái.', 'Tòa nhà đang được sửa chữa.']],
  ['Please do not park your car in front of the gate.', 'Xin đừng đỗ xe trước cổng.', ['Xin hãy rửa xe trước cổng.', 'Xin hãy mở cổng giúp tôi.']],
  ['I am looking forward to meeting you next week.', 'Tôi mong được gặp bạn vào tuần sau.', ['Tôi rất tiếc không gặp được bạn.', 'Tôi đã gặp bạn tuần trước.']],
  ['The teacher explained the lesson very clearly.', 'Giáo viên đã giảng bài rất rõ ràng.', ['Giáo viên đã quên giảng bài.', 'Giáo viên giảng bài quá nhanh.']],
  ['There is a small park near my house.', 'Có một công viên nhỏ gần nhà tôi.', ['Có một trường học lớn gần nhà tôi.', 'Không có công viên nào gần nhà tôi.']],
  ['He has to attend an important meeting today.', 'Hôm nay anh ấy phải dự một cuộc họp quan trọng.', ['Hôm nay anh ấy được nghỉ làm.', 'Hôm nay anh ấy tổ chức tiệc.']],
  ['This medicine should be taken after meals.', 'Thuốc này nên uống sau bữa ăn.', ['Thuốc này nên uống trước bữa ăn.', 'Thuốc này chỉ dùng ngoài da.']],
  ['The train was so crowded that I had to stand.', 'Tàu đông đến mức tôi phải đứng.', ['Tàu vắng nên tôi ngồi thoải mái.', 'Tàu đến muộn hai mươi phút.']],
  ['My father taught me how to ride a bicycle.', 'Bố tôi đã dạy tôi cách đi xe đạp.', ['Bố tôi đã mua cho tôi một chiếc xe đạp.', 'Bố tôi cấm tôi đi xe đạp.']],
  ['The company was founded by two young engineers.', 'Công ty được thành lập bởi hai kỹ sư trẻ.', ['Công ty đã bị bán cho nước ngoài.', 'Công ty chỉ có một nhân viên.']],
  ['She apologized for the mistake she made.', 'Cô ấy đã xin lỗi vì lỗi cô ấy gây ra.', ['Cô ấy phủ nhận mọi lỗi lầm.', 'Cô ấy đổ lỗi cho người khác.']],
  ['It is going to rain, so take your coat.', 'Trời sắp mưa nên hãy mang áo khoác.', ['Trời nắng nên hãy mang mũ.', 'Trời lạnh nên hãy ở nhà.']],
  ['The library closes at nine in the evening.', 'Thư viện đóng cửa lúc chín giờ tối.', ['Thư viện mở cửa suốt đêm.', 'Thư viện đóng cửa cả ngày.']],
  ['We discussed the problem for over an hour.', 'Chúng tôi đã thảo luận vấn đề hơn một giờ.', ['Chúng tôi đã giải quyết vấn đề trong một phút.', 'Chúng tôi đã bỏ qua vấn đề.']],
  ['He was promoted to manager last month.', 'Anh ấy được thăng chức quản lý tháng trước.', ['Anh ấy đã xin nghỉ việc tháng trước.', 'Anh ấy bị giáng chức tháng trước.']],
  ['The children were excited about the trip.', 'Bọn trẻ rất háo hức về chuyến đi.', ['Bọn trẻ rất buồn vì chuyến đi.', 'Bọn trẻ không biết về chuyến đi.']],
  ['I prefer tea to coffee in the morning.', 'Tôi thích trà hơn cà phê vào buổi sáng.', ['Tôi ghét cả trà và cà phê.', 'Tôi chỉ uống nước lọc buổi sáng.']],
  ['The road was closed because of the accident.', 'Con đường bị đóng vì tai nạn.', ['Con đường đang được mở rộng.', 'Con đường rất vắng xe.']],
  ['She bought a gift for her mother birthday.', 'Cô ấy mua một món quà cho sinh nhật mẹ.', ['Cô ấy quên sinh nhật của mẹ.', 'Cô ấy tổ chức tiệc cho bạn.']],
  ['This task requires a lot of patience.', 'Nhiệm vụ này đòi hỏi rất nhiều kiên nhẫn.', ['Nhiệm vụ này rất dễ hoàn thành.', 'Nhiệm vụ này không cần kỹ năng.']],
  ['He speaks English with a slight accent.', 'Anh ấy nói tiếng Anh với chút giọng địa phương.', ['Anh ấy nói tiếng Anh hoàn toàn trôi chảy.', 'Anh ấy không nói được tiếng Anh.']],
  ['The meeting will start at nine sharp.', 'Cuộc họp sẽ bắt đầu đúng chín giờ.', ['Cuộc họp sẽ bị hoãn lại.', 'Cuộc họp sẽ kéo dài cả ngày.']],
  ['Trees help clean the air we breathe.', 'Cây cối giúp làm sạch không khí chúng ta hít thở.', ['Cây cối gây ô nhiễm không khí.', 'Cây cối không ảnh hưởng đến không khí.']],
  ['She is responsible for the whole department.', 'Cô ấy chịu trách nhiệm cho cả bộ phận.', ['Cô ấy mới chuyển đến bộ phận.', 'Cô ấy sắp rời bộ phận.']],
];

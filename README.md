# 🌐 TANGLANGUAGE — Web Học Tiếng Anh

Web học tiếng Anh viết bằng **HTML + CSS + JavaScript thuần** (không cần framework, không cần cài đặt gì thêm). Có đầy đủ trang **đăng nhập / đăng ký** và khu vực học tập.

## ✨ Tính năng

### 🔐 Xác thực người dùng
- Đăng ký tài khoản (họ tên, email, mật khẩu, xác nhận mật khẩu)
- Đăng nhập / đăng xuất
- Tiếp tục với tư cách khách, không cần tạo tài khoản; tiến độ khách được lưu riêng trên trình duyệt hiện tại
- Kiểm tra hợp lệ: email đúng định dạng, mật khẩu ≥ 6 ký tự, mật khẩu nhập lại khớp, đồng ý điều khoản
- Thanh đo độ mạnh mật khẩu
- Hiện/ẩn mật khẩu (👁)
- "Ghi nhớ đăng nhập" tự điền email lần sau
- Chặn truy cập trang học nếu chưa có phiên đăng nhập hoặc phiên khách (tự chuyển về trang đăng nhập)
- Dữ liệu lưu trong `localStorage` của trình duyệt

### 📚 Khu vực học tập
| Trang | Nội dung |
|---|---|
| **Trang chủ** | Thống kê tiến độ (từ đã học, điểm, độ chính xác, chuỗi ngày), 29 chủ đề nổi bật |
| **Từ vựng** | **1.200+ từ** theo **29 chủ đề** (cơ bản + nâng cao), lọc theo chủ đề, tìm kiếm, nghe phát âm |
| **Tra cứu** | Tìm từ tiếng Anh hoặc nghĩa tiếng Việt, xem phiên âm, ví dụ, chủ đề và lịch sử tra gần đây |
| **Flashcard** | 20 thẻ lật xem nghĩa, đánh dấu "đã nhớ" để cộng điểm |
| **Kiểm tra** | Trắc nghiệm 8 câu ngẫu nhiên, chấm điểm và xếp loại |
| **Luyện thi** | TOEIC, IELTS, VSTEP với luyện nghe, đọc, nói, viết; bài nghe/đọc có chấm điểm, bài nói/viết có checklist tự đánh giá |
| **Thi đấu** | Tạo thử thách 8 câu bằng link, gửi bạn bè và nhập link kết quả để so điểm |
| **Nghe** | **600 câu** nghe, chọn nghĩa tiếng Việt đúng |
| **Video** | Tìm nguồn video học theo chủ đề/trình độ, xem video YouTube nhúng bằng link và mở lại video gần đây |
| **Đọc báo** | **12 bài báo** tiếng Anh thật, có từ vựng chú thích, nghe từng đoạn và câu hỏi đọc hiểu |
| **Đánh giá** | Gửi đánh giá từ 1–5 sao kèm bình luận và xem phản hồi đã gửi trên trình duyệt |

- 🔊 Phát âm dùng Web Speech API (giọng đọc sẵn có của trình duyệt)
- 🎬 Video dùng trình phát nhúng YouTube; người học có thể tìm nguồn gợi ý hoặc dán link video mình chọn. Cần có kết nối Internet, quyền nhúng phụ thuộc cài đặt của video và YouTube.
- 🎓 Bài luyện chứng chỉ là tài liệu tham khảo do ứng dụng cung cấp, không phải đề thi chính thức; phần nói/viết không được chấm tự động
- 💬 Chatbot hỗ trợ tra từ vựng, giải thích một số chủ điểm ngữ pháp và hướng dẫn sử dụng các mục học (chạy offline, không cần API key)
- 📱 Giao diện responsive, dùng được trên điện thoại
- ⭐ Đánh giá và bình luận được lưu cục bộ trong trình duyệt, chưa đồng bộ giữa các thiết bị
- ⭐ Điểm tổng kết hiển thị trung bình sao từ các đánh giá trên trình duyệt hiện tại

### 📰 Trang Đọc báo — nội dung
- 12 bài theo chủ đề: Công nghệ, Môi trường, Kinh tế, Sức khỏe, Giáo dục, Khoa học, Xã hội, Kinh doanh, Thể thao, Chính trị, Nghệ thuật, Giao thông
- Phân cấp độ: Cơ bản / Trung cấp / Nâng cao
- Mỗi bài có nhiều đoạn, mỗi đoạn có nút 🔊 nghe riêng, có nút nghe cả bài và dừng
- **Từ vựng trong bài**: phiên âm, nghĩa tiếng Việt, nghe phát âm
- **3 câu hỏi đọc hiểu** mỗi bài, chấm điểm và cộng vào tiến độ
- Lọc theo chủ đề + ô tìm kiếm bài báo

### 📊 Số liệu dữ liệu
| Loại | Số lượng |
|---|---|
| Từ vựng (cơ bản + nâng cao) | **1.259 từ** |
| Chủ đề từ vựng | **29 chủ đề** |
| Câu luyện nghe | **600 câu** |
| Bài đọc báo | **12 bài** (36 câu hỏi, 73 từ vựng chú thích) |

## 📁 Cấu trúc thư mục

```
web-LEARNENGLISH/
├── index.html            # Trang học chính (dashboard + từ vựng + tra cứu + video + luyện thi + quiz + nghe + đọc báo)
├── auth.html             # Trang đăng nhập / đăng ký
├── README.md             # Tài liệu này
├── css/
│   └── style.css         # Toàn bộ giao diện
├── js/
│   ├── data.js           # Dữ liệu cơ bản: chủ đề, 36 từ, câu nghe mẫu
│   ├── exam-data.js      # Bài luyện tham khảo TOEIC / IELTS / VSTEP
│   ├── video-data.js     # Nguồn và chủ đề tìm video tiếng Anh
│   ├── vocab-advanced.js # ⚙️ SINH TỰ ĐỘNG — 1.223 từ nâng cao, 23 chủ đề
│   ├── listening-data.js # ⚙️ SINH TỰ ĐỘNG — 600 câu luyện nghe
│   ├── news-data.js      # Bài đọc báo (viết tay)
│   ├── auth.js           # Logic đăng nhập / đăng ký
│   └── app.js            # Logic trang học chính
└── scripts/              # Công cụ sinh dữ liệu (chỉ dùng khi muốn tạo lại)
    ├── gen-data.mjs      # Chạy: node scripts/gen-data.mjs
    ├── raw-vocab*.mjs    # Nguồn từ vựng
    ├── raw-listening.mjs # Nguồn/mẫu câu nghe
    └── validate2.mjs     # Kiểm tra chất lượng dữ liệu
```

## 🚀 Cách chạy

**Cách 1 — Mở trực tiếp:** nhấp đúp vào `auth.html` để mở bằng trình duyệt.

**Cách 2 — Chạy qua server cục bộ** (khuyến nghị, tránh lỗi đường dẫn):

```powershell
# Với Node.js
node -e "const h=require('http'),f=require('fs'),p=require('path');h.createServer((q,s)=>{let u=q.url==='/'?'/index.html':q.url;let fp=p.join(process.cwd(),u);f.readFile(fp,(e,d)=>{if(e){s.writeHead(404);return s.end('404')}const t={'.html':'text/html','.css':'text/css','.js':'text/javascript'}[p.extname(fp)]||'text/plain';s.writeHead(200,{'Content-Type':t+'; charset=utf-8'});s.end(d)})}).listen(8080,()=>console.log('http://localhost:8080'))"
```

Sau đó mở `http://localhost:8080`.

## 📖 Hướng dẫn dùng

1. Mở `auth.html` → chọn **Đăng ký** để tạo tài khoản, hoặc **Tiếp tục với tư cách khách** để vào học ngay.
2. Tự động chuyển sang trang học. Bắt đầu từ **Flashcard** hoặc **Từ vựng**.
3. Làm **Kiểm tra** và **Nghe** để cộng điểm, theo dõi tiến độ ở **Trang chủ**.
4. Vào **Thi đấu** → tạo thử thách → sao chép link gửi cho bạn. Mỗi người mở link và làm cùng bộ câu hỏi; sau đó chia sẻ link kết quả để đối phương nhập vào và so sánh điểm. Nếu bằng điểm, người hoàn thành nhanh hơn xếp trên.
5. Vào **Đọc báo** → chọn một bài → đọc, nghe từng đoạn, tra từ vựng và làm 3 câu hỏi đọc hiểu.
6. Nhấn **Đăng xuất** khi cần; lần sau đăng nhập lại bằng email + mật khẩu đã đăng ký.
7. Nhấn **Hỏi trợ lý** ở góc màn hình để tra từ vựng hoặc hỏi về ngữ pháp và cách luyện tập.

> ⚠️ **Lưu ý:** Đây là bản demo lưu dữ liệu trong trình duyệt (`localStorage`), mật khẩu không mã hóa. Không dùng cho sản phẩm thật — nếu triển khai thực tế cần backend + mã hóa mật khẩu.
>
> Tính năng thi đấu không dùng máy chủ: link chứa bộ câu hỏi và kết quả đã được đóng gói trong URL; bảng xếp hạng được lưu trên thiết bị hiện tại. Để bạn bè mở link, ứng dụng cần được triển khai trên một địa chỉ web dùng chung. Kết quả không được xác minh chống gian lận.
>
> Chatbot hiện chạy offline bằng kho từ vựng và các câu trả lời theo chủ đề được tích hợp sẵn; chatbot chưa phải AI tạo sinh và có thể chưa trả lời được câu hỏi ngoài các chủ đề này.

## 🎨 Tùy chỉnh

- **Thêm từ vựng cơ bản:** sửa mảng `VOCABULARY` trong `js/data.js` (mỗi từ gồm `topic, word, ipa, mean, ex`).
- **Thêm từ vựng nâng cao:** thêm vào `scripts/raw-vocab*.mjs` rồi chạy `node scripts/gen-data.mjs`.
- **Thêm chủ đề:** thêm vào mảng `TOPICS` (`js/data.js`) hoặc `TOPIC_META` (`scripts/gen-data.mjs`).
- **Đổi màu sắc:** sửa các biến CSS trong `:root` ở đầu `css/style.css` (`--primary`, `--accent`, `--grad`...).
- **Thêm câu nghe:** thêm mẫu câu vào `scripts/raw-listening.mjs` rồi chạy lại generator.
- **Thêm bài báo:** thêm một mục vào mảng `NEWS_ARTICLES` trong `js/news-data.js`.

## ⚙️ Công cụ sinh dữ liệu

Các file `js/vocab-advanced.js` và `js/listening-data.js` được **sinh tự động** — đừng sửa tay vì lần chạy sau sẽ ghi đè. Quy trình:

```powershell
# 1. Sửa nguồn từ vựng / mẫu câu trong scripts/raw-*.mjs
# 2. Sinh lại dữ liệu
node scripts/gen-data.mjs
# 3. Kiểm tra chất lượng (đáp án hợp lệ, không trùng lặp)
node scripts/validate2.mjs
```

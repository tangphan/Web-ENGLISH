# 🌐 TANGLANGUAGE — Web Học Tiếng Anh

Web học tiếng Anh với giao diện **HTML + CSS + JavaScript thuần**, trang **đăng nhập / đăng ký** và khu vực học tập. Netlify Functions và Netlify Blobs hỗ trợ xác nhận thanh toán SePay và tải tài liệu sau khi trả tiền.

## ✨ Tính năng

### 🔐 Xác thực người dùng
- Đăng ký tài khoản thật bằng Supabase Auth (họ tên, email, mật khẩu)
- Đăng nhập bằng email và mật khẩu; Supabase duy trì phiên đăng nhập trong trình duyệt
- Đăng xuất và kiểm tra phiên hiện tại bằng Supabase Auth
- Kiểm tra hợp lệ: email đúng định dạng, mật khẩu ≥ 6 ký tự, mật khẩu nhập lại khớp, đồng ý điều khoản
- Thanh đo độ mạnh mật khẩu
- Hiện/ẩn mật khẩu (👁)
- Tùy chọn ghi nhớ email lần sau
- Chặn truy cập trang học nếu chưa có phiên Supabase hợp lệ

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
| **Tài liệu** | Mua cẩm nang học tiếng Anh giá **2.000₫**, quét VietQR MB; backend chỉ mở tải sau khi đối soát giao dịch qua SePay |
| **Đánh giá** | Gửi đánh giá từ 1–5 sao kèm bình luận, lưu theo tài khoản Supabase và xem đánh giá chung |

- 🔊 Phát âm dùng Web Speech API (giọng đọc sẵn có của trình duyệt)
- 🎬 Video dùng trình phát nhúng YouTube; người học có thể tìm nguồn gợi ý hoặc dán link video mình chọn. Cần có kết nối Internet, quyền nhúng phụ thuộc cài đặt của video và YouTube.
- 🎓 Bài luyện chứng chỉ là tài liệu tham khảo do ứng dụng cung cấp, không phải đề thi chính thức; phần nói/viết không được chấm tự động
- 💬 Chatbot hỗ trợ tra từ vựng, giải thích một số chủ điểm ngữ pháp và hướng dẫn sử dụng các mục học (chạy offline, không cần API key)
- 📱 Giao diện responsive, dùng được trên điện thoại
- ⭐ Đánh giá và bình luận được lưu trong Supabase, gắn với user ID xác thực và đồng bộ giữa thiết bị
- ⭐ Điểm tổng kết hiển thị trung bình sao của các đánh giá đã lưu trên Supabase
- 💳 SePay webhook được xác thực bằng API key lưu trong biến môi trường Netlify; trình duyệt không nhận API key.

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
├── netlify.toml          # Cấu hình deploy, Functions và bảo vệ file tài liệu
├── package.json          # Phụ thuộc Netlify Blobs
├── supabase/
│   └── schema.sql        # Bảng đánh giá và chính sách Row Level Security
├── .env.example          # Mẫu tên cấu hình SePay (không chứa khóa bí mật)
├── netlify/
│   ├── functions/
│   │   ├── create-order.js
│   │   ├── get-order-status.js
│   │   ├── sepay-webhook.js
│   │   └── download-document.js
│   └── lib/orders.js     # Dùng chung Netlify Blobs và xác thực mã đơn
├── documents/
│   └── english-study-guide.txt # Tài liệu chỉ tải qua Function sau thanh toán
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

Node.js 20 trở lên được dùng trong quá trình build/deploy Netlify. Dự án khai báo `netlify.toml` để publish website tĩnh, triển khai Functions và đưa file tài liệu vào gói Function tải xuống.

```powershell
npm install
npm install -g netlify-cli
Copy-Item .env.example .env
# Điền SEPAY_WEBHOOK_API_KEY trong .env; giữ file này riêng tư.
netlify link
npm run dev
```

Đặt các biến môi trường sau trong Netlify Site configuration → Environment variables (scope Functions), sau đó deploy lại:

| Biến | Giá trị |
|---|---|
| `SEPAY_ACCOUNT_NUMBER` | **Bắt buộc:** số tài khoản nhận tiền MB (`0329288827`) |
| `SEPAY_BANK_CODE` | Mã ngân hàng VietQR (`MB` nếu bỏ trống) |
| `SEPAY_QR_ACCOUNT` | Số tài khoản in trên QR (mặc định dùng `SEPAY_ACCOUNT_NUMBER`) |
| `SEPAY_WEBHOOK_API_KEY` | Chuỗi bí mật mạnh, tự tạo; phải khớp API key cấu hình ở webhook SePay |

Mỗi đơn được lưu trong Netlify Blobs. Khi SePay gọi webhook thành công, trang đang mở sẽ nhận trạng thái qua polling mỗi 3 giây và gọi Function tải file; mã đơn và poll token không chứa API key SePay.

Không mở `index.html` trực tiếp bằng `file://` để thanh toán: Netlify Functions không chạy trong chế độ này. Chạy `npm run dev` qua Netlify CLI hoặc dùng trang đã deploy. QR hiển thị được lấy từ Function tạo đơn để bảo đảm đúng tài khoản đã cấu hình; nút tải chỉ mở sau khi webhook SePay xác nhận, và có thể nhấn “Tôi đã chuyển khoản — kiểm tra thanh toán” để kiểm tra ngay.

### Cấu hình Supabase Auth và đánh giá

Frontend dùng Supabase URL và publishable key trong `js/supabase-client.js`. Publishable key được thiết kế để sử dụng ở frontend; không đặt `service_role` key vào mã nguồn. Trong Supabase Dashboard:

1. Bảng đánh giá trong Supabase tên `public.rewiews` với các cột `name`, `rating` và `comment`. Mã ứng dụng lấy tên từ tài khoản Supabase rồi ghi cùng đánh giá. Chạy `supabase/schema.sql` để thêm cột `name` nếu bảng đã tồn tại và cấu hình Row Level Security; chỉ người dùng đã xác thực mới đọc/gửi đánh giá.
2. Trong **Authentication → URL Configuration**, đặt Site URL thành domain triển khai (và thêm URL localhost vào Redirect URLs nếu chạy local).
3. Cấu hình SMTP/email trong **Authentication → SMTP Settings** nếu muốn gửi email xác minh đáng tin cậy. Khi bật xác minh email, người dùng phải xác minh trước khi đăng nhập.

Đăng ký, đăng nhập, khôi phục phiên và đăng xuất sử dụng Supabase Auth. Thống kê học vẫn được lưu cục bộ theo user ID trên trình duyệt hiện tại; đánh giá sao, tên hiển thị và bình luận được lưu trên máy chủ Supabase.

### Cấu hình webhook SePay

1. Trong SePay, mở phần quản lý Webhook và tạo webhook mới cho biến động số dư tài khoản ngân hàng.
2. Dán URL này vào địa chỉ webhook: `https://learning-english-tang-education.netlify.app/.netlify/functions/sepay-webhook`.
3. Chọn phương thức `POST` và định dạng dữ liệu JSON. Nếu cấu hình tài khoản/sự kiện, chọn đúng tài khoản MB nhận tiền và sự kiện giao dịch vào.
4. Tạo API key riêng cho webhook. Đặt cùng giá trị vào `SEPAY_WEBHOOK_API_KEY` trong Netlify và trường API key trên SePay. SePay cần gửi header `Authorization: Apikey <API_KEY>`.
5. Lưu webhook, deploy lại Netlify sau khi đặt environment variables, rồi thực hiện giao dịch thử 2.000₫. Kiểm tra Netlify Functions logs nếu webhook không cập nhật đơn.

SePay gọi HTTP 200 cho webhook được xử lý. Giao dịch chỉ khớp khi là tiền vào, số tiền ít nhất 2.000₫, tài khoản đúng (nếu payload có trường tài khoản), đơn còn hiệu lực và nội dung chuyển khoản chứa chính mã `TL` của đơn. Endpoint trạng thái/tải yêu cầu poll token riêng của đơn.

> **Bảo mật:** Không đặt SePay secret trong HTML/JavaScript hoặc commit vào Git. Nếu API token từng được chia sẻ trong chat, ảnh chụp hoặc mã nguồn, hãy thu hồi token đó trong SePay và tạo credential mới. Phần tích hợp webhook này dùng API key webhook riêng, không cần SePay user API token ở frontend.

## 📖 Hướng dẫn dùng

1. Mở `auth.html` → chọn **Đăng ký** để tạo tài khoản Supabase. Nếu xác minh email đang bật, mở email xác minh trước khi đăng nhập.
2. Sau khi đăng nhập, chọn **Vào ứng dụng**. Bắt đầu từ **Flashcard** hoặc **Từ vựng**.
3. Làm **Kiểm tra** và **Nghe** để cộng điểm, theo dõi tiến độ ở **Trang chủ**.
4. Vào **Thi đấu** → tạo thử thách → sao chép link gửi cho bạn. Mỗi người mở link và làm cùng bộ câu hỏi; sau đó chia sẻ link kết quả để đối phương nhập vào và so sánh điểm. Nếu bằng điểm, người hoàn thành nhanh hơn xếp trên.
5. Vào **Đọc báo** → chọn một bài → đọc, nghe từng đoạn, tra từ vựng và làm 3 câu hỏi đọc hiểu.
6. Nhấn **Đăng xuất** khi cần; lần sau đăng nhập lại bằng email + mật khẩu đã đăng ký.
7. Nhấn **Hỏi trợ lý** ở góc màn hình để tra từ vựng hoặc hỏi về ngữ pháp và cách luyện tập.

> ⚠️ **Lưu ý:** Tài khoản và mật khẩu do Supabase Auth quản lý. Thống kê học còn lưu trong `localStorage` trên trình duyệt hiện tại; đánh giá ứng dụng được lưu trên Supabase.
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

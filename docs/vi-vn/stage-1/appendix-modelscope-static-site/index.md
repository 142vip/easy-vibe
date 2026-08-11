---
title: Đăng trang web lên ModelScope
description: Hướng dẫn đầy đủ để đăng HTML hoặc kết quả build Vue, React và Vite bằng Skill chính thức và Static Studio.
---

# Đăng trang web lên ModelScope

Khi trang đã chạy trên máy, bạn cần một địa chỉ mà bạn bè, bạn học hoặc người dùng thật có thể mở.

Bạn có thể thuê máy chủ rồi tự cấu hình tên miền, HTTPS và triển khai. Trong bài này, chúng ta giảm phần vận hành và đăng trang lên **ModelScope Studio**.

ModelScope cung cấp mô hình, tập dữ liệu và cả **Studio** để trình bày ứng dụng. Cộng đồng cũng tổ chức [gặp gỡ nhà phát triển](https://community.modelscope.cn/683562c6870cef7360622f7f.html). Studio giúp tạo địa chỉ chia sẻ mà chưa cần học quản trị máy chủ trước.

> Bài được kiểm tra với giao diện hiện tại, Skills chính thức và tài liệu lệnh vào **11 tháng 8 năm 2026**. Vị trí nút có thể đổi, nhưng luồng vẫn là: tạo Static Studio, tải kết quả build, triển khai và kiểm tra liên kết.

Ngoài Gradio, Streamlit và Docker, Studio hỗ trợ loại `static` cho trang đã build. Nếu kết quả gồm `index.html`, CSS, JavaScript và ảnh, hãy chọn loại này.

Địa chỉ sau khi đăng có dạng:

```text
https://modelscope.cn/studios/ten-cua-ban/ten-studio
```

## Chọn đúng cách đăng

| Dự án | Loại Studio | Chuẩn bị |
| --- | --- | --- |
| HTML, CSS và JavaScript | **Static** | Chuẩn bị tệp, không cần build |
| Vue, React, Vite hoặc Svelte | **Static** | Build trên máy và chỉ đăng nội dung `dist` hoặc `build` |
| Gradio | Gradio | Chuẩn bị `app.py` và `requirements.txt` |
| Streamlit | Streamlit | Chuẩn bị tệp vào và thư viện |
| Backend hoặc gói hệ thống đặc biệt | Docker | Viết Dockerfile và nghe ở cổng được yêu cầu |

Bài này tập trung hai dòng đầu. **Đừng tải mã nguồn Vue hoặc React làm trang Static.** Trình duyệt của khách không chạy `npm install` hay `npm run build` giúp bạn.

## Cách nên dùng: Skill chính thức

ModelScope duy trì [Skills chính thức](https://github.com/modelscope/modelscope-skills).

| Skill | Vai trò | Khi sử dụng |
| --- | --- | --- |
| `ms-hub` | Cổng chung cho kho, mô hình, dữ liệu, Studio, MCP và Skills Center | Kết nối lần đầu và thao tác chung |
| `ms-studio-deploy` | Nhận diện dự án, tạo Studio, đồng bộ Git, triển khai, xem nhật ký và chẩn đoán | **Ưu tiên khi đăng hoặc cập nhật trang trên máy** |

`ms-studio-deploy` nhận diện `static` khi `index.html` ở thư mục gốc. Static Studio không chạy `npm run build`, vì vậy hãy build dự án framework trên máy trước.

### Cài Skills

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Nếu lệnh không có `skills`, dùng trình cài chính thức:

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Skills thường được cài ở `~/.agents/skills/`. Sau đó mở phiên mới trong Codex, Cursor, Claude Code hoặc công cụ tương thích để cập nhật danh sách.

### Đăng bằng Skill

Theo [hướng dẫn `ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md), hãy chuẩn bị:

1. Skill đã cài và một phiên Agent mới.
2. Thư mục sẽ đăng, với `index.html` ngay ở thư mục gốc.
3. ModelScope Access Token đã cấu hình trên máy.

Lấy token ở trang [Access Tokens](https://modelscope.cn/my/myaccesstoken) rồi đặt trong terminal:

```bash
export MODELSCOPE_API_KEY="token-cua-ban"
```

Với HTML đơn giản, mở thẳng thư mục web. Với Vue, React hoặc Vite, build rồi vào thư mục đầu ra:

```bash
npm run build
cd dist
```

Vite thường tạo `dist`. Nếu công cụ tạo `build`, hãy mở thư mục đó trong công cụ hỗ trợ Agent Skills.

#### Yêu cầu ngắn nhất

```text
Hãy dùng Skill ms-studio-deploy để đăng trang này lên Static Studio của ModelScope. Khi chạy được, gửi địa chỉ cho tôi.
```

Skill kiểm tra `index.html` và đăng nhập. Nếu cần Studio mới, nó sẽ hỏi tên và chế độ hiển thị. Hãy bắt đầu ở chế độ riêng tư.

Bạn cũng có thể đưa đủ điều kiện:

```text
Hãy dùng Skill ms-studio-deploy để đăng thư mục này lên Static Studio ở trang ModelScope Trung Quốc.
Đặt tên Studio là my-portfolio và để riêng tư lúc đầu. Sau khi triển khai, kiểm tra trạng thái và nhật ký.
Nếu thất bại, sửa nguyên nhân theo nhật ký, triển khai lại và trả về địa chỉ chạy được.
```

#### AI sẽ làm gì tiếp theo

```text
nhận diện dự án → chọn trang Trung Quốc hoặc quốc tế → đọc tài khoản
→ tạo hoặc dùng lại Studio → kiểm tra tệp nhạy cảm → đồng bộ lên master
→ bắt đầu triển khai → xem trạng thái và nhật ký → chẩn đoán và sửa → trả địa chỉ
```

Kiểm tra riêng tư trước rồi mới chuyển công khai. Trang Static không cần phần cứng trả phí. Với tài nguyên trả phí của loại khác, Skill phải xin phép rõ ràng.

Token dùng cho API và Git push. Không ghi nó vào frontend, README, yêu cầu hay ảnh chia sẻ.

## Cách thủ công: Bước 0 — chuẩn bị trang

Dùng Skill thuận tiện hơn, nhưng cách thủ công giúp hiểu giao diện Studio và dùng được khi không có công cụ Agent.

### Trường hợp A: HTML đơn giản

`index.html` phải ở thư mục gốc của nội dung sẽ đăng:

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

Kiểm tra qua HTTP trước khi đăng:

```bash
cd my-site
python3 -m http.server 8000
```

Mở `http://localhost:8000`. Chỉ nhấp đúp `index.html` là chưa đủ vì `file://` và HTTP xử lý module, CORS và đường dẫn khác nhau.

### Trường hợp B: Vue, React, Vite và tương tự

```bash
npm install
npm run build
```

| Công cụ | Đầu ra thường gặp |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

Đăng **nội dung** đầu ra để `index.html` nằm ngay ở gốc Studio.

```text
Đúng: index.html
Sai: dist/index.html
```

Nếu CSS, JavaScript hoặc ảnh trả về 404, thử base tương đối trong Vite:

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

Build lại. Host tĩnh có thể không chuyển mọi đường dẫn về `index.html`; SPA có thể dùng router Hash như `/#/about`.

## Cách thủ công: Bước 1 — mở Studio và đăng nhập

Mở [ModelScope Studio](https://modelscope.cn/studios). Phần đầu trang trình bày luồng tạo, xây dựng, đăng và chia sẻ.

![Trang chủ ModelScope Studio với quy trình tạo và đăng](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Chọn tạo hoặc mở [Tạo Studio](https://modelscope.cn/studios/create). Trang Trung Quốc `modelscope.cn` và quốc tế `modelscope.ai` không dùng chung tài khoản, token hay nội dung.

## Cách thủ công: Bước 2 — tạo Static Studio

![Biểu mẫu chủ sở hữu, tên, giấy phép, hiển thị và mô tả](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **Chủ sở hữu hoặc tổ chức:** quyết định phần chủ sở hữu trong địa chỉ.
2. **Tên:** dùng chữ thường, số và dấu gạch, ví dụ `my-portfolio`.
3. **Tên hiển thị và mô tả:** viết để khách hiểu.
4. **Hiển thị:** bắt đầu riêng tư, chuyển công khai sau khi kiểm tra.
5. **Giấy phép:** chọn theo dự án.

Chọn **Static** làm loại SDK. Biểu mẫu hiện có Gradio, Streamlit, Static và Docker.

![Chọn Static trong biểu mẫu Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

> Nếu trang cần cơ sở dữ liệu, khóa bí mật hoặc xử lý máy chủ, nó không hoàn toàn tĩnh. Hãy dùng Gradio, Streamlit, Docker hoặc backend riêng. Khóa trong JavaScript frontend không thể giữ bí mật.

Xác nhận và chờ Studio mở.

## Cách thủ công: Bước 3 — tải tệp lên

Trong Static Studio đang chạy, `index.html` và `README.md` nằm ngay ở thư mục gốc.

![Trang tệp Static Studio có index.html ở gốc](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Tải `index.html`, CSS, JavaScript và ảnh trong **Files**. Đừng bọc chúng trong thư mục `dist`, `build` hay dự án khác.

Tải thủ công phù hợp khi ít tệp. Khi nhiều tệp hoặc cập nhật thường xuyên, dùng `ms-studio-deploy` để đồng bộ Git.

## Cách thủ công: Bước 4 — triển khai và kiểm tra

Lưu thường bắt đầu triển khai. Nếu chưa, chọn triển khai, khởi động lại hoặc chạy lại. Khi hoạt động, mở:

```text
https://modelscope.cn/studios/ten-cua-ban/ten-studio
```

- Trang chủ có mở không?
- CSS, JavaScript và ảnh có tải không?
- Console có lỗi 404, CORS hoặc JavaScript không?
- Trang có dùng được ở chiều rộng điện thoại không?
- Studio công khai có mở trong cửa sổ chưa đăng nhập không?

Kiểm tra riêng tư trước, sau đó công khai và thử lại khi chưa đăng nhập.

## Cách thủ công: Bước 5 — cập nhật trang

Sau khi sửa nguồn, kiểm tra trên máy và build lại. Trong **Files**, thay tệp cũ bằng nội dung `dist` hoặc `build` mới rồi triển khai lại.

```text
sửa nguồn → kiểm tra trên máy → build lại → thay tệp Studio
→ triển khai lại → kiểm tra địa chỉ cuối
```

Không tải `node_modules`, cấu hình phát triển hoặc toàn bộ dự án nguồn. Nếu cập nhật nhiều, hãy dùng Skill.

## Dùng Skill để xử lý lỗi

<ModelScopeTroubleshooter />

## Nguồn

- [ModelScope Studio](https://modelscope.cn/studios) (giao diện và ảnh kiểm tra ngày 11-08-2026)
- [Gặp gỡ nhà phát triển ModelScope](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [Hướng dẫn `ms-hub` chính thức](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [Skill `ms-studio-deploy` chính thức](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [Ứng dụng ModelScope Hub](https://github.com/modelscope/modelscope_hub)
- [Ví dụ Static Studio công khai](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)

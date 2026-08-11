---
title: Đăng trang web lên ModelScope
description: Đăng trang tĩnh HTML, Vue, React hoặc Vite bằng ModelScope Studio và Skill triển khai chính thức.
---

# Đăng trang web lên ModelScope

Khi trang đã chạy trên máy, bạn cần một địa chỉ để người khác có thể mở. Trong phụ lục này, chúng ta dùng **ModelScope Studio** thay vì tự cấu hình máy chủ từ đầu.

## 1. Xác định nội dung sẽ đăng

| Dự án | Loại Studio | Nội dung cần chuẩn bị |
| --- | --- | --- |
| HTML, CSS và JavaScript | Static | Tệp web có `index.html` ở thư mục gốc |
| Vue, React, Vite hoặc Svelte | Static | Nội dung trong `dist` hoặc `build` sau khi build |
| Gradio hoặc Streamlit | Loại tương ứng | Tệp vào Python và các thư viện |
| Có backend hoặc gói hệ thống đặc biệt | Docker | Dockerfile và dịch vụ chạy được |

Với dự án framework, hãy đăng **kết quả build**, không phải thư mục mã nguồn.

## 2. Dùng Skill triển khai chính thức

[ModelScope Skills chính thức](https://github.com/modelscope/modelscope-skills) có `ms-studio-deploy`. Skill này nhận diện dự án, tạo Studio, đồng bộ tệp, triển khai và kiểm tra nhật ký.

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Lấy token tại trang [Access Tokens](https://modelscope.cn/my/myaccesstoken) và chỉ lưu trên máy. Không ghi token vào trang web, README hoặc ảnh chụp.

Với Vite, hãy build trước:

```bash
npm run build
cd dist
```

Mở thư mục đầu ra trong công cụ AI rồi nói:

```text
Hãy dùng Skill ms-studio-deploy để đăng thư mục này lên Static Studio của ModelScope. Khi chạy được, gửi liên kết cho tôi.
```

## 3. Đăng thủ công trên trang web

Mở [ModelScope Studio](https://modelscope.cn/studios) và đăng nhập.

![Trang chủ ModelScope Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Trong trang [Tạo Studio](https://modelscope.cn/studios/create), điền chủ sở hữu, tên, mô tả và chế độ hiển thị.

![Biểu mẫu tạo Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

Chọn **Static** làm loại SDK.

![Chọn loại Static](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Sau khi tạo, mở trang tệp rồi tải `index.html`, CSS, JavaScript và ảnh lên. `index.html` phải nằm trực tiếp ở thư mục gốc, không nằm trong một thư mục `dist` khác.

![Trang tệp của Static Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Lưu và chờ triển khai. Ở liên kết cuối, kiểm tra trang chủ, kiểu dáng, ảnh, chiều rộng di động và bảng điều khiển trình duyệt. Với Studio công khai, hãy thử cả khi chưa đăng nhập.

## 4. Cập nhật và xử lý lỗi

Sau khi sửa mã nguồn, hãy kiểm tra trên máy, build lại, thay tệp đã đăng rồi triển khai lại.

- mất kiểu dáng hoặc ảnh: kiểm tra đường dẫn và `base` của Vite;
- tải lại đường dẫn con bị 404: cân nhắc dùng router có Hash;
- chỉ thấy danh sách tệp: kiểm tra `index.html` ở thư mục gốc;
- cần khóa API bí mật: không đặt trong frontend, hãy dùng backend.

Tài liệu chính thức: [ModelScope Studio](https://modelscope.cn/studios), [ModelScope Skills](https://github.com/modelscope/modelscope-skills) và [`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md).

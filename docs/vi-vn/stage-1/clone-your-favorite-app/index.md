---
title: 'Sao chép từ ảnh chụp màn hình: bài tập bắt chước đầu tiên'
description: 'Biến một ảnh chụp sản phẩm thành trang web hoặc trò chơi nhỏ có thể mở và thao tác thật.'
---

# Sao chép từ ảnh chụp màn hình: bài tập bắt chước đầu tiên

Ở bài trước, chúng ta nhờ AI viết chương trình từ một câu. Lần này, điểm bắt đầu dễ quan sát hơn: **chọn một ảnh chụp bạn thích rồi nhờ AI làm dựa trên ảnh đó**.

Ảnh đã thể hiện màu sắc, khoảng cách, nút bấm và bố cục. Việc của bạn là nói rõ muốn biến nó thành sản phẩm có thể thao tác như thế nào.

## 1. Chọn một mục tiêu nhỏ

Lần đầu chỉ cần một màn hình: trang giới thiệu sản phẩm, bảng điều khiển SaaS hoặc trò chơi nhỏ có một thao tác chính. Hãy giữ ảnh gốc để so sánh sau khi hoàn thành.

## 2. Làm ví dụ đầu tiên

Trong bài học, chúng ta dùng màn hình Framer này. Thanh điều hướng, tiêu đề lớn, phong cảnh tím và các nút điều khiển đều nhìn rõ trong một ảnh.

![Màn hình Framer dùng làm tham khảo](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Tham khảo: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Tạo một thư mục trống, mở bằng Trae rồi kéo ảnh vào khung trò chuyện. Nhập:

```text
Hãy làm một trang web giống ảnh này. Khi xong, hãy mở trang cho tôi xem.
```

Chờ Trae tạo và chạy các tệp. Đây là kết quả thực tế trong bài học:

![Trang được tạo và chạy từ ảnh tham khảo](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Chưa cần đọc hết mã. Trước tiên hãy kiểm tra trang có mở được không, nội dung chính có xuất hiện không và cấu trúc có giống ảnh tham khảo không.

Nếu tiêu đề quá nhỏ, chỉ sửa một việc:

```text
Làm tiêu đề ở giữa lớn hơn một chút.
```

## 3. Làm lại với ảnh của bạn

Mở một thư mục trống khác, thêm ảnh đã chọn rồi nói:

```text
Hãy làm một trang web dựa trên ảnh này và mở trang khi hoàn thành.
```

Nếu chỉ muốn học theo phong cách:

```text
Giữ phong cách của ảnh nhưng thay tên và nội dung mới.
```

Khi phiên bản đầu xuất hiện, hãy bấm nút chính và thu hẹp cửa sổ để kiểm tra bố cục.

## 4. Thử bảng điều khiển hoặc trò chơi

Bảng điều khiển Linear có điều hướng bên trái, thẻ và biểu đồ bên phải nên rất phù hợp để học cấu trúc trang.

![Bảng điều khiển Linear tham khảo](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Tham khảo: [Linear Dashboards](https://linear.app/docs/dashboards)_

```text
Hãy làm một bảng điều khiển giống như thế này. Tạm thời dùng dữ liệu mẫu.
```

![Bảng điều khiển được tạo và chạy trong bài học](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Bạn cũng có thể bắt đầu từ một cảnh Minecraft.

![Ảnh Minecraft Creative Mode tham khảo](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Tham khảo: [Ví dụ Minecraft trên Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
Hãy làm một trò chơi khối giống thế này. Nhân vật có thể đi lại và đặt khối.
```

![Trò chơi khối 2D được tạo trong bài học](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Nếu muốn góc nhìn thứ nhất, hãy nói rõ “3D”:

```text
Hãy làm một trò chơi khối 3D giống thế này. Tôi muốn đi lại, xoay góc nhìn và đặt khối.
```

![Trò chơi khối 3D được tạo trong bài học](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. Mỗi lần chỉ sửa một vấn đề

Phiên bản đầu chưa đẹp là bình thường. Hãy mô tả vấn đề dễ thấy nhất bằng lời nói thường ngày:

```text
Thẻ phía trên cao quá. Hãy làm nó thấp hơn.
```

```text
Nút này bấm không có phản hồi. Hãy sửa giúp tôi.
```

Sau mỗi thay đổi, mở và thử lại trang. Đừng gộp nhiều yêu cầu không liên quan vào cùng một tin nhắn.

## 6. Kiểm tra trước khi nộp

- trang vẫn mở sau khi tải lại;
- người khác nhận ra đây là trang web, bảng điều khiển hay trò chơi;
- nút hoặc thao tác chính hoạt động;
- chữ và ảnh không chồng lên nhau nghiêm trọng khi thu hẹp cửa sổ.

Cuối cùng, đặt ảnh tham khảo và kết quả cạnh nhau rồi giải thích một điểm bạn đã yêu cầu sửa. Trình tự rất đơn giản: chọn ảnh, đưa cho AI, yêu cầu phiên bản đầu và sửa từng khác biệt nhìn thấy được.

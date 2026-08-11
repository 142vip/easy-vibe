---
title: 'Làm game platform, pixel art và 3D bằng Godot'
description: 'Học Godot qua ba nguyên mẫu đã chạy thật và tham khảo các trò chơi đã phát hành.'
---

# Làm game platform, pixel art và 3D bằng Godot

Godot là game engine miễn phí, mã nguồn mở, gồm scene, vật lý, animation, âm thanh, script và export. Bài này không giả vờ hoàn tất ba game; ta chạy một platformer 2D, vòng lặp pixel art và greybox 3D.

## 1. Bốn khái niệm

Node làm một việc, scene là cây node tái sử dụng, script tạo hành vi và GDScript là ngôn ngữ script chính của Godot.

![Godot Editor](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. Platformer 2D

Primal Light cho thấy nền đứng, nguy hiểm và mục tiêu rất dễ đọc.

![Primal Light](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> Tạo người chơi, mặt đất, ba platform và đích rõ ràng bằng hình đơn giản.

> Thêm di chuyển trái phải và nhảy, không cho nhảy lần hai trên không.

![Skyline Courier đã chạy](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. Vòng lặp pixel art

Dome Keeper sắp xếp tài nguyên và mục tiêu rõ ràng trong màn hình nhỏ.

![Dome Keeper](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> Tạo scene 320 × 180 với người chơi, rừng, ba vật phẩm và bộ đếm.

![Lantern Woods đã chạy](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

Dùng tỉ lệ phóng nguyên để pixel không bị mờ.

## 4. Greybox 3D

Wrought Flesh giúp quan sát hình khối không gian, ánh sáng và hướng đi. Greybox dùng hộp để thử kích thước và di chuyển trước model cuối.

![Wrought Flesh](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

> Tạo greybox 3D nhỏ với sàn, tường, người chơi, camera và lối ra phát sáng.

![Signal Garden đã chạy](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. Mỗi lần chỉ thay một việc

> Chỉ thêm di chuyển, không sửa level.

> Chỉ sửa lỗi này: 【dán lỗi】 và cho biết cách test lại.

## 6. Export là bước riêng

Cài Export Templates đúng phiên bản và tạo preset. Desktop cần máy sạch không có Godot, Web cần server hoặc HTTPS, Android/iOS cần SDK, ký và thiết bị.

Ba nguyên mẫu đã chạy bằng Godot 4.7.1 trên macOS. Không tuyên bố export Windows, Linux, Web, Android, iOS hay console đã hoàn tất.

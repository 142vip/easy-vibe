---
title: 'Phát hành ứng dụng đã hoàn thành lên các kênh phân phối'
description: 'Từ Release build và ký đến test, duyệt, phát hành theo giai đoạn, giám sát và cập nhật.'
---

# Phát hành ứng dụng đã hoàn thành lên các kênh phân phối

Ứng dụng chạy trên máy của bạn chưa phải sản phẩm người dùng có thể cài an toàn.

> Chọn kênh → cố định danh tính → tạo Release → ký → test → chuẩn bị cửa hàng → gửi duyệt → phát hành dần → giám sát và cập nhật

## 1. Tách đóng gói, ký, phân phối và duyệt

Gói là file cài đặt, chữ ký chứng minh nhà phát hành và chuỗi cập nhật, phân phối đưa file tới người dùng, còn duyệt kiểm tra quy tắc nền tảng.

## 2. Sắp xếp quyền sở hữu và danh tính

Tổ chức phải kiểm soát tài khoản, email, domain, cloud, chứng chỉ và thanh toán với xác thực hai bước. Không đổi Android package name hay Apple Bundle ID sau khi phát hành. Tăng build number mỗi lần gửi.

## 3. Chuẩn bị Release thật

Không dùng localhost, database test hay secret máy chủ. Tạo icon, ảnh chụp thật, mô tả, hỗ trợ, quyền riêng tư và hướng dẫn duyệt từ build ứng viên. Quyền, SDK, khai báo cửa hàng và chính sách riêng tư phải khớp nhau.

## 4. Đường phát hành theo nền tảng

Android thường gửi `.aab` đã ký lên Google Play và bắt đầu bằng test nội bộ. iOS dùng App Store Connect, Xcode Archive, TestFlight và duyệt.

Windows dùng MSIX trong Microsoft Store hoặc installer đã ký trên website. macOS ngoài Store cần Developer ID và notarization. Linux có Flathub, Snap, AppImage, `.deb`, `.rpm`.

Web/PWA phát hành qua HTTPS với DNS, chứng chỉ, biến production, 404, offline, Manifest, Service Worker, giám sát và backup.

## 5. Duyệt và phát hành dần

Lỗi chỉ có ở Release, tài khoản duyệt không dùng được, khai báo riêng tư sai, nút chưa xong, quyền quá rộng và tài sản không có giấy phép là các lỗi phổ biến.

> Đây là thông báo duyệt: 【dán vào】. Xác định quy tắc và hành vi cần sửa, không đoán.

Đi theo thứ tự test của lập trình viên, nội bộ, beta nhỏ, duyệt, một phần người dùng rồi toàn bộ. Ký, riêng tư, giám sát và rollback đều là phần của sản phẩm.

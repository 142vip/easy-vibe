---
title: 'Làm theo ảnh chụp: bài tập mô phỏng đầu tiên'
description: 'Theo từng bước trên lớp để biến một ảnh chụp sản phẩm thành trang web hoặc trò chơi nhỏ có thể mở và tương tác.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Khoảng <strong>2 giờ</strong>'
</script>

# Làm theo ảnh chụp: bài tập mô phỏng đầu tiên

Ở bài trước, chúng ta yêu cầu AI viết một chương trình từ một câu. Lần này, ta bắt đầu bằng thứ dễ nhìn hơn: <strong>chọn một ảnh chụp bạn thích và nhờ AI làm dựa trên ảnh đó.</strong>

Cách này giống như lắp ghép mô hình khi nhìn vào hình mẫu. Bạn không cần mô tả trước từng màu sắc, khoảng cách hay vị trí nút; ảnh chụp đã truyền đạt phần lớn thông tin ấy.

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Làm theo trước, rồi từng bước biến nó thành sản phẩm của riêng bạn 🧱</span>
</div>
</div>

## Bài này giúp bạn làm được gì?

<ChapterIntroduction :duration="duration" :tags="['Làm theo ảnh chụp', 'Lập trình với AI', 'Bài tập nhập môn']" coreOutput="Một dự án nhỏ" expectedOutput="Một trang web hoặc trò chơi nhỏ có thể mở và phản hồi thao tác">

Chúng ta sẽ bắt đầu từ ảnh chụp một sản phẩm thật và tạo một dự án nhỏ chạy trong trình duyệt. Bạn có thể chọn trang chủ sản phẩm, bảng dữ liệu hoặc trò chơi đơn giản.

Bài này chỉ tập trung vào một việc: <strong>tìm ảnh chụp bạn thích, đưa cho AI và dùng lời của mình để nói rõ muốn làm gì.</strong>

Bạn chưa cần biết lập trình hay chuẩn bị tài liệu yêu cầu đầy đủ. Hãy để AI tạo bản đầu tiên, xem kết quả rồi mô tả phần cần thay đổi.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Chọn ảnh', description: 'Tìm một trang bạn thích' },
      { title: 'Đưa cho AI', description: 'Kéo ảnh vào khung chat' },
      { title: 'Nói một câu', description: 'Nhờ AI làm lại' },
      { title: 'Tiếp tục sửa', description: 'Mỗi lần sửa một điểm khác nhau' }
    ]" />
  </ClientOnly>
</div>

## 1. Chọn loại sản phẩm bạn muốn làm

Trước khi mở công cụ, hãy quyết định hôm nay bạn muốn có một kết quả nhỏ nào.

Mục tiêu không phải là sản phẩm đầy đủ mọi tính năng. Ta chỉ cần <strong>một màn hình mở được, dễ hiểu và có một tương tác đơn giản</strong>. Phạm vi càng nhỏ thì lần làm đầu càng dễ thành công.

Bạn có thể chọn một trong ba loại:

- <strong>Trang chủ sản phẩm:</strong> tiêu đề, phần giới thiệu, hình ảnh và nút.
- <strong>Bảng điều khiển SaaS:</strong> thanh bên, thẻ dữ liệu và biểu đồ.
- <strong>Trò chơi đơn giản:</strong> di chuyển, nhấp chuột hoặc một mục tiêu nhỏ.

Khi chọn ảnh tham khảo, hãy kiểm tra ba điều:

1. Chỉ bằng một ảnh chụp, bạn có hiểu được nội dung chính không?
2. Trang đó có điểm nào bạn thật sự thích không?
3. Sau khi làm xong, bạn có nhanh chóng nhận ra kết quả giống đến đâu không?

Nếu thích tiêu đề lớn và màu sắc của một trang chủ, hãy chụp màn hình đầu tiên. Nếu thích thế giới khối trong trò chơi, hãy lưu một ảnh thể hiện rõ thế giới đó.

::: tip Cần giống đến mức nào?
Kết quả càng gần, bạn càng quan sát kỹ chi tiết và càng biết cách mô tả khác biệt cho AI. Cuối cùng, đặt ảnh tham khảo và sản phẩm cạnh nhau: bạn thấy giống 50%, 70% hay 90%?
:::

::: tip Chỉ làm một màn hình
Đừng bắt đầu cùng lúc với đăng nhập, thanh toán, chat, trang quản trị và ứng dụng di động. Bài này chỉ làm lại màn hình đang ở trước mắt.
:::

## 2. Làm một trang web cùng giảng viên

Trước hết, hãy xem toàn bộ quy trình. Khi đã hiểu, bạn sẽ làm lại bằng ảnh của mình.

Giảng viên tạo một thư mục trống và mở nó trong Trae. Dự án có tên `trae-screenshot-demo`; ban đầu chưa có trang web hay mã nguồn.

### 2.1 Đưa ảnh tham khảo cho Trae

Ảnh tham khảo đến từ trang giới thiệu của Framer. Tiêu đề lớn, thanh điều hướng, cảnh núi màu tím và các nút điều khiển nhỏ đều nhìn thấy rõ.

![Ảnh chụp trang web được đưa vào Trae](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Nguồn ảnh: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Sau khi kéo ảnh vào khung chat của Trae, giảng viên chỉ viết một yêu cầu ngắn:

```text
Hãy làm một trang web giống ảnh này. Khi xong, mở trang đó cho tôi xem.
```

Ảnh cho Trae biết trang nên trông như thế nào; câu lệnh nói rõ ảnh cần được biến thành một trang web.

Sau khi gửi, hãy chờ Trae tạo xong tệp. Đừng gửi thêm nhiều yêu cầu khi yêu cầu đầu tiên chưa hoàn tất.

### 2.2 Xem phiên bản đầu tiên

Trae tạo `index.html`, `styles.css` và `script.js`, sau đó mở trang trong trình duyệt. Đây là kết quả thực tế trong bài học:

![Trang Wishlabs được tạo và chạy từ ảnh chụp](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Chưa cần đọc mã. Hãy nhìn trang và so sánh với ảnh tham khảo:

- Không khí bầu trời và núi màu tím vẫn còn.
- Một tiêu đề lớn vẫn nằm ở giữa.
- Phía trên có thanh điều hướng, phía dưới có hàng nút điều khiển.
- Văn bản, nút và hình ảnh tạo thành một màn hình đầu tiên hoàn chỉnh.

Đây chưa phải bản sao chính xác, nhưng đã giữ được cấu trúc và cảm giác dễ thấy nhất. Như vậy là đủ tốt cho phiên bản đầu.

### 2.3 Phiên bản đầu tiên chỉ cần nhìn thấy được

Đừng xóa hết chỉ vì phông chữ hoặc vị trí nút hơi khác. Trước tiên xác nhận trang mở được, sau đó chọn vấn đề rõ nhất.

Nếu tiêu đề quá nhỏ, hãy nói:

```text
Hãy làm tiêu đề ở giữa lớn hơn.
```

Mở lại trang sau khi sửa. Nếu kết quả gần với mong muốn hơn thì lần chỉnh sửa này đã có ích.

::: tip Nói bằng lời bình thường là đủ
Bạn đang cùng Trae làm một sản phẩm, không phải thi viết prompt. Cứ mô tả điều nhìn thấy bằng những từ bạn vẫn dùng hằng ngày.
:::

## 3. Tự làm với ảnh của bạn

Mở Trae, tạo một thư mục trống và mở thư mục đó. Một tên đơn giản như `my-first-page` là đủ.

Sau đó làm theo các bước:

1. Tìm ảnh chụp một trang web hoặc trò chơi bạn thích.
2. Chọn nút hình ảnh cạnh khung chat và chọn ảnh.
3. Xác nhận ảnh đã xuất hiện trong tin nhắn.
4. Viết một yêu cầu ngắn rồi gửi.

```text
Hãy làm một trang web giống ảnh này.
Khi xong, mở trang đó cho tôi xem.
```

Trong bài đầu tiên, bạn chưa cần chỉ định framework, cấu trúc thư mục hay tên tệp. Hãy để Trae tự chọn.

Nếu chỉ muốn dùng phong cách, không muốn sao chép tên và nội dung, hãy thêm:

```text
Dùng phong cách của ảnh này, nhưng thay tên và nội dung bằng nội dung mới.
```

Chờ Trae làm xong. Nếu công cụ hỏi quyền tạo tệp hoặc chạy dự án, hãy đồng ý. Nếu trang không tự mở, nói:

```text
Hãy chạy dự án này. Tôi muốn xem kết quả.
```

Khi trang xuất hiện, dành mười giây để kiểm tra trang mở được, nội dung chính đã có và nút chính phản hồi. Đừng bắt đầu bằng việc sửa năm thứ cùng lúc.

## 4. Cách này cũng dùng được với sản phẩm khác

Làm từ ảnh chụp không chỉ dành cho trang chủ. Để kiểm tra, giảng viên đã tạo thêm hai dự án trống: một bảng dữ liệu và một trò chơi khối.

### Ví dụ 1: bảng điều khiển SaaS

Sản phẩm SaaS thường dùng bảng điều khiển để hiển thị tiến độ dự án, doanh số hoặc người dùng. Trong ảnh Linear này, thanh điều hướng ở bên trái và nội dung ở bên phải.

![Giao diện bảng điều khiển chính thức của Linear](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Tài liệu tham khảo trên lớp: [Linear Dashboards](https://linear.app/docs/dashboards)_

Giảng viên đưa ảnh vào Trae và nói:

```text
Hãy làm một bảng dữ liệu giống bảng này.
Trước mắt dùng dữ liệu mẫu.
```

Trae tạo thanh bên, thẻ dữ liệu và biểu đồ. Đây là trang đang chạy trong trình duyệt:

![Bảng điều khiển được tạo và chạy từ ảnh chụp](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Các con số chưa phải dữ liệu kinh doanh thật, và điều đó không sao. Bài đầu tiên chỉ xây cấu trúc bảng. Khi trang chạy ổn định, bạn mới thay nhãn và số liệu.

### Ví dụ 2: trò chơi khối

Nếu trang web thông thường không làm bạn hứng thú, hãy dùng ảnh trò chơi. Giảng viên chọn một ảnh thế giới khối của Minecraft.

![Giao diện chế độ Sáng tạo của Minecraft](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Tài liệu tham khảo trên lớp: [ví dụ Minecraft trên Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

Yêu cầu vẫn rất ngắn:

```text
Hãy làm một trò chơi khối giống ảnh này.
Nhân vật phải di chuyển và đặt được khối.
```

Trae tạo một trò chơi chạy trong trình duyệt, nhân vật có thể di chuyển, đặt hoặc bỏ khối:

![Trò chơi khối 2D được tạo và chạy từ ảnh chụp](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Kết quả này là <strong>trò chơi 2D nhìn ngang</strong>. Nhân vật di chuyển trên mặt phẳng, không có chiều sâu tiến hoặc lùi. Vì yêu cầu chỉ nói “trò chơi khối”, Trae đã chọn cách hiểu đơn giản hơn.

Mở trang, nhấn các phím mũi tên và nhấp vào cảnh. Nếu nhân vật di chuyển và bạn đặt được khối thì phiên bản 2D đầu tiên đã hoạt động.

### Làm thêm một phiên bản 3D

Nếu muốn góc nhìn thứ nhất gần với Minecraft, hãy ghi rõ “3D” trong yêu cầu. Giảng viên mở một dự án trống mới, thêm cùng ảnh và nói:

```text
Hãy làm một trò chơi khối 3D giống ảnh này.
Người chơi phải đi lại, xoay camera và đặt được khối.
```

Lần này Trae tạo một thế giới khối ba chiều thực sự:

![Trò chơi khối 3D được tạo và chạy từ ảnh chụp](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

Sau khi chọn “Start Game”, dùng `WASD` để đi và chuột để xoay. Chuột trái bỏ khối, chuột phải đặt khối và các phím số đổi loại khối.

Không phải lúc nào 2D hoặc 3D cũng tốt hơn. 2D dễ hơn cho trò chơi đầu tiên. Nếu việc đi sâu vào thế giới là phần quan trọng trong ý tưởng, hãy nói rõ bạn muốn 3D.

::: tip Tạo điểm khác biệt
Ảnh tham khảo chỉ là điểm bắt đầu. Hãy đổi màu sắc, chủ đề, văn bản, hình ảnh hoặc tương tác để kết quả dần trở thành sản phẩm của bạn.
:::

## 5. Nếu phiên bản đầu chưa tốt thì sao?

Phiên bản đầu trông khác hoặc có nút không phản hồi là chuyện bình thường. Một dự án hiếm khi hoàn tất chỉ bằng một câu. Hãy xem, sửa một chút rồi xem lại.

Lỗi thường gặp của người mới là đưa mọi vấn đề vào cùng một tin nhắn. Khi quá nhiều thứ thay đổi cùng lúc, bạn không biết thay đổi nào tạo ra kết quả.

Hãy dùng một quy tắc đơn giản: <strong>mỗi lượt chỉ chọn vấn đề rõ nhất.</strong>

### Trang trông chưa đúng

Nếu thẻ phía trên quá cao:

```text
Thẻ ở trên quá cao. Hãy làm nó thấp hơn.
```

Nếu ảnh chính quá nhỏ:

```text
Ảnh ở giữa quá nhỏ. Hãy làm nó lớn hơn.
```

Nếu nền quá tối:

```text
Nền quá tối. Hãy dùng màu sáng hơn.
```

### Trang hoạt động không đúng

Nếu nút không làm gì:

```text
Nút này không phản hồi khi tôi nhấp. Hãy sửa nó.
```

Nếu nhân vật không di chuyển:

```text
Các phím mũi tên không có tác dụng. Hãy sửa phần di chuyển.
```

### Bạn không biết mô tả vấn đề

Chụp lại trang hiện tại và nói:

```text
Đây là kết quả hiện tại. Hãy so sánh với ảnh tham khảo và sửa điểm khác biệt lớn nhất.
```

Bạn chưa cần biết những từ như “margin” hay “bố cục đáp ứng”. “Trang hơi chật”, “chữ khó đọc” hoặc “trên điện thoại trông lộn xộn” đều là mô tả hữu ích. Sửa xong một vấn đề rồi mới sang vấn đề tiếp theo.

## 6. Kiểm tra trên lớp

Đừng chỉ nhìn ảnh tĩnh. Hãy mở kết quả và tự nhấp hoặc tự chơi.

Kiểm tra bốn điều:

- <strong>Mở được:</strong> tải lại không xuất hiện trang trắng hoặc lỗi.
- <strong>Dễ hiểu:</strong> người khác nhận ra đây là trang chủ, bảng điều khiển hay trò chơi.
- <strong>Có phản hồi:</strong> nút chính hoặc điều khiển cơ bản hoạt động.
- <strong>Vẫn dễ đọc:</strong> thu nhỏ cửa sổ không làm chữ và ảnh chồng lên nhau.

Nếu một mục chưa đạt, hãy nói đúng điều bạn quan sát được và yêu cầu Trae chỉ sửa vấn đề đó. Khi cả bốn mục đều đạt, bài tập hoàn tất.

::: tip Hoàn thành một sản phẩm nhỏ
Đăng nhập, thanh toán, chat nhóm và chơi nhiều người không nằm trong bài hôm nay. Một trang nhỏ đã hoàn thành có giá trị hơn mười phần mở đầu còn dang dở.
:::

## 📚 Bài tập

<StageAssignmentCard title="Tạo trang của bạn từ một ảnh chụp">

  <p>Chọn ảnh một trang web hoặc trò chơi bạn thích, đưa cho AI và chỉ làm lại một màn hình.</p>

  <ol>
    <li>Giữ lại ảnh tham khảo.</li>
    <li>Tạo trang và cải thiện một phần bạn chưa thích.</li>
    <li>Lưu ảnh chụp của phiên bản đã sửa.</li>
  </ol>

  <p>Khi trình bày, đặt ảnh tham khảo và sản phẩm cạnh nhau rồi giải thích thay đổi bạn đã yêu cầu.</p>
</StageAssignmentCard>

## Điều cần nhớ

Chúng ta không bắt đầu bằng mã nguồn mà bằng một ảnh chụp. Toàn bộ bài tập có bốn bước:

1. Chụp hoặc lưu một ảnh.
2. Đưa ảnh cho AI.
3. Mô tả sản phẩm bằng một câu.
4. Mỗi lần sửa một khác biệt có thể nhìn thấy.

Ảnh cho AI biết sản phẩm nên trông thế nào. Lời của bạn cho biết sản phẩm cần làm gì. Khi phiên bản đầu xuất hiện, việc nhấp, quan sát và chụp màn hình sẽ giúp bạn mô tả thay đổi tiếp theo.

Prompt không cần giống tài liệu kỹ thuật. Hãy nói một việc đơn giản, làm cho sản phẩm chạy rồi tiếp tục trò chuyện dựa trên thứ đang ở trước mắt. Việc xây một dự án sẽ bớt xa lạ hơn rất nhiều.

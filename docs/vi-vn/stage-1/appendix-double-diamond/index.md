---
title: 'Mô hình thiết kế Double Diamond'
description: 'Bài viết Double Diamond dành cho người mới. Hiểu 4 giai đoạn Discover, Define, Develop, Deliver, tránh bắt tay vào làm nguyên mẫu khi chưa hiểu rõ vấn đề.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Mô hình thiết kế Double Diamond

<a id="top-dd"></a>

Sau khi phân tích nhu cầu và phỏng vấn người dùng, chúng ta thường có trong tay rất nhiều tư liệu: trải nghiệm của những nhóm người dùng khác nhau, các vấn đề của công cụ hiện tại và một số hướng cải tiến có thể cân nhắc. Khi lượng tư liệu tăng lên, khó khăn tiếp theo là biết nên giữ lại điều gì và loại bỏ điều gì.

Nếu không tách riêng việc “hiểu vấn đề” khỏi việc “thiết kế giải pháp”, chúng ta rất dễ vừa phỏng vấn vừa tìm lý do để bảo vệ tính năng mình vốn ưa thích. Mô hình Double Diamond dùng hai lần mở rộng và thu hẹp để phân tách hai loại công việc này.

Chương này trình bày bốn giai đoạn Discover, Define, Develop và Deliver, đồng thời giải thích đầu vào, đầu ra và những sai lầm thường gặp ở từng giai đoạn.

<a id="dd-what"></a>
## [1. Hai lần mở rộng và thu hẹp](#top-dd)

Mô hình Double Diamond là một quy trình thiết kế kinh điển do **Design Council** Anh quốc phổ biến. Nó vẽ một quy trình thiết kế và đổi mới hoàn chỉnh thành hai hình kim cương liên tiếp.

Lý do là "kim cương", là vì mỗi kim cương đều bao gồm hai động tác trái ngược nhưng đều quan trọng:

- **Phân tán**: Trước mở rộng tầm nhìn, xem nhiều khả năng hơn
- **Tập trung**: Rồi thu hẹp phạm vi, đưa ra đánh giá và lựa chọn

Toàn bộ quá trình gồm 4 bước:

1. **Discover**: Hiểu rộng về người dùng, vấn đề, môi trường và thị trường
2. **Define**: Từ lượng lớn thông tin, tinh lọc ra vấn đề cốt lõi thực sự đáng giải quyết
3. **Develop**: Phân tán nhiều giải pháp xoay quanh vấn đề cốt lõi
4. **Deliver**: Sàng lọc, nguyên mẫu, kiểm thử và giao phó giải pháp phù hợp hơn

Hai giai đoạn đầu xử lý không gian vấn đề; hai giai đoạn sau xử lý không gian giải pháp.

<figure class="field-figure field-figure--diagram">
  <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Sơ đồ Double Diamond chính thức của Design Council: Discover, Define, Develop và Deliver tạo thành hai hình kim cương nối tiếp" loading="lazy" />
  </a>
  <figcaption><strong>Trước hết, hãy nhìn vào sơ đồ gốc:</strong> hình kim cương bên trái mở rộng từ Discover rồi thu hẹp ở Define; hình bên phải lại mở rộng ở Develop và thu hẹp ở Deliver. Design Council cũng lưu ý rằng đây không phải một quy trình tuyến tính chỉ đi về phía trước một lần; khi thử nghiệm phát hiện vấn đề, chúng ta có thể quay lại giai đoạn trước. Nguồn hình: <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

## 2. Vì sao cần tách vấn đề khỏi giải pháp

Nhịp điệu phổ biến nhất khi người mới làm sản phẩm, thường là như thế này:

- Nghĩ ra một ý tưởng
- Thấy hướng này rất ngầu
- Ngay lập tức bắt đầu vẽ nguyên mẫu
- Làm làm thấy chức năng ngày càng nhiều
- Cuối cùng không biết mình đang giải quyết vấn đề gì

Mô hình Double Diamond tách riêng việc “hiểu vấn đề” và việc “thiết kế giải pháp”. Nhờ đó, chúng ta có thể kiểm tra những trường hợp sau:

Điều này nghe rất bình thường, nhưng thực tế rất quan trọng. Vì rất nhiều sản phẩm thất bại, không phải thực hiện không nghiêm túc, mà là:

- Chọn sai vấn đề
- Hiểu sai người dùng
- Khóa giải pháp quá sớm
- Dành nhiều thời gian mài giũa chi tiết, lại không xác minh hướng đi

Vì vậy, trước khi chuyển sang giai đoạn tiếp theo, chúng ta cần kiểm tra:

- Đừng vì ý tưởng thuận tay, thì mặc nhiên vấn đề đã thành lập
- Đừng vì giải pháp có thể làm ra, thì mặc nhiên nó đáng làm
- Đừng vì nguyên mẫu trông hoàn chỉnh, thì mặc nhiên người dùng thực sự cần

Ba lời nhắc này cùng hướng đến một sai lầm: xem lượng công sức đã bỏ ra như bằng chứng rằng hướng đi là đúng. Nguyên mẫu chỉ chứng minh nhóm đã làm ra điều gì; phỏng vấn, quan sát tại hiện trường và việc sử dụng thực tế mới cho biết vấn đề có thật sự tồn tại hay không.

<a id="dd-first"></a>
## [3. Hình kim cương thứ nhất: không gian vấn đề](#top-dd)

Kim cương đầu tiên tập trung vào **bản thân vấn đề**, chứ không phải giải pháp.

Trong hình kim cương này, đầu ra là một định nghĩa vấn đề, không phải nguyên mẫu sản phẩm.

### 3.1 Discover: Trước mở rộng không gian vấn đề

Nhiệm vụ cốt lõi của giai đoạn Discover, là **nghiên cứu rộng, chứ không phải nhanh chóng kết luận**.

Bước này thường làm những việc bao gồm:

- Xem người dùng làm thế nào trong kịch bản thực tế
- Phỏng vấn người dùng tiềm năng, hiểu lần gần nhất họ gặp vấn đề là khi nào
- Quan sát họ hiện đang khắc phục tạm thế nào
- Xem sản phẩm cạnh tranh và giải pháp thay thế đang xử lý thế nào
- Thu thập thông tin thị trường, quy trình, ràng buộc, upstream và downstream

Rất nhiều người sẽ nhầm tưởng Discover là "xem thêm tài liệu". Thực ra then chốt hơn là: **Bạn cần hiểu con người và kịch bản, chứ không chỉ tìm một đống thông tin.**

Ví dụ bạn muốn làm một công cụ "AI giúp sắp xếp biên bản cuộc họp", ở giai đoạn Discover nên quan tâm hơn là:

- Người dùng sau cuộc họp rốt cuộc đau nhất ở đâu
- Là ghi chép khó, hay sắp xếp khó, hay đồng bộ khó
- Hiện họ tự viết, nhờ thực tập sinh viết, nghe lại ghi âm, hay đơn giản không sắp xếp
- Kịch bản cuộc họp nào cần biên bản nhất, kịch bản nào căn bản không cần

Mục tiêu quan trọng nhất của bước này không phải được câu trả lời, mà là **đừng quá sớm tưởng mình đã biết câu trả lời.**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="Không gian workshop nghiên cứu khả dụng của Creative Commons, trên tường có nhiều giấy ghi chú được sắp theo câu hỏi phỏng vấn" loading="lazy" />
  </a>
  <figcaption><strong>Tư liệu Discover trong thực tế thường rất đa dạng.</strong>Trong nghiên cứu khả dụng năm 2018, nhóm Creative Commons đã thực hiện 81 cuộc phỏng vấn và tổng hợp thêm 36 cuộc phỏng vấn có sẵn. Mỗi tờ giấy trong ảnh tương ứng với một câu hỏi; giấy ghi chú lưu câu trả lời và các chấm tròn dùng để đánh dấu, so sánh. Ở thời điểm này, nhóm giữ lại sự khác biệt thay vì vội ép tư liệu thành một đáp án. Ảnh và trường hợp nghiên cứu: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

### 3.2 Define: Từ một đống thông tin tinh lọc ra vấn đề cốt lõi

Nếu Discover là mở rộng tầm nhìn, thì Define là bắt đầu thu hẹp.

Những gì Define cần làm, không phải giữ lại tất cả quan sát, mà là hỏi:

- Vấn đề thực sự đáng ưu tiên giải quyết là cái nào
- Vấn đề nào thường xuất hiện nhất, đau nhất, có giá trị nhất
- Phiên bản đầu tiên của chúng ta thực sự chỉ tập trung vào kịch bản nào

Cốt lõi của bước này, là thu một chủ đề rộng thành một định nghĩa vấn đề rõ ràng.

Ví dụ ban đầu bạn nói:

> Tôi muốn làm một công cụ AI nâng cao hiệu quả họp.

Đến giai đoạn Define, cách diễn đạt tốt hơn có thể trở thành:

> Chúng ta giải quyết trước vấn đề: sau cuộc họp điều phối 30 đến 60 phút của nhóm dự án, không thể xuất biên bản kèm việc cần làm, người phụ trách và thời hạn trong 10 phút.

Lúc này vấn đề bắt đầu rõ hơn:

- Người dùng là ai
- Kịch bản là gì
- Điểm nghẽn là gì
- Tiêu chuẩn thành công là gì

Bản chất của Define, là **từ "nhiều vấn đề" tập trung về "lần này giải quyết vấn đề nào trước".**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="Bức tường tổng hợp nghiên cứu, nơi nhóm Creative Commons sắp xếp, phân cụm và đánh dấu chủ đề trên các giấy ghi chú phỏng vấn" loading="lazy" />
  </a>
  <figcaption><strong>Define không phải là chọn câu nghe thuận tai nhất.</strong>Trong cùng trường hợp nghiên cứu, nhóm đã tổng hợp và phân cụm 117 cuộc phỏng vấn, tìm các mẫu lặp lại rồi rút ra 9 insight. Khoảng trống, cách chia nhóm và màu sắc khác nhau trong ảnh cho thấy những bước trung gian từ câu trả lời thô đến chủ đề và mức ưu tiên. Ảnh và trường hợp nghiên cứu: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption>
</figure>

## 4. Hình kim cương thứ hai: không gian giải pháp

Khi bạn hoàn thành kim cương đầu tiên, mới thực sự phù hợp để bước vào kim cương thứ hai. Vì lúc này bạn giải quyết không phải một hướng mơ hồ, mà là một vấn đề cụ thể đã được tập trung.

### 4.1 Develop: Phân tán giải pháp xoay quanh vấn đề cốt lõi

Trọng tâm giai đoạn Develop, là **xoay quanh cùng một vấn đề, khám phá nhiều giải pháp khả thi.**

Lưu ý, phân tán ở đây và giai đoạn Discover không giống nhau.

- Phân tán của Discover, đang khám phá không gian vấn đề
- Phân tán của Develop, đang khám phá không gian giải pháp

Ví dụ vẫn là biên bản cuộc họp, đến giai đoạn Develop, bạn có thể bắt đầu nghĩ:

- Làm công cụ web, hay plugin cuộc họp
- Là upload ghi âm rồi xử lý, hay ghi nhận thời gian thực
- Chỉ làm tóm tắt, hay tập trung trích xuất việc cần làm
- Nhấn mạnh hiệu quả cá nhân, hay nhấn mạnh đồng bộ nhóm
- Cho người dùng tự do chỉnh sửa, hay trực tiếp xuất template có cấu trúc

Bước này rất phù hợp brainstorm, cũng rất phù hợp cùng nhóm kéo giải pháp ra.

Nhưng ở đây có một tiền đề: **Tất cả giải pháp đều phải phục vụ cùng một vấn đề đã được định nghĩa.**
Nếu vấn đề chưa được định nghĩa rõ, Develop rất dễ lại trở thành chức năng bay tứ tung.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="Bảng ý tưởng trong workshop tư duy thiết kế của Wikimedia Deutschland, với các giấy ghi chú nhiều màu trải trên nhiều hướng giải pháp" loading="lazy" />
  </a>
  <figcaption><strong>Develop trước hết giữ lại nhiều câu trả lời.</strong>Bảng này đến từ workshop tư duy thiết kế của Wikimedia Deutschland. Các ý tưởng được trải ra theo chủ đề và chưa bị thu thành một danh sách tính năng duy nhất. Giá trị của mở rộng không nằm ở số lượng giấy ghi chú, mà ở việc nhóm đã thực sự so sánh nhiều con đường trước khi chọn giải pháp. Ảnh: <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster (WMDE) / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

### 4.2 Deliver: Chọn giải pháp, làm nguyên mẫu, kiểm thử và giao phó

Giai đoạn Deliver là giai đoạn tập trung trong kim cương thứ hai.

Lúc này bạn cần làm không phải tiếp tục nghĩ nhiều hơn, mà bắt đầu đánh giá:

- Giải pháp nào phù hợp nhất với giai đoạn hiện tại
- Phiên bản nào nhỏ nhất nhưng hữu dụng nhất
- Chức năng nào phải làm trước, chức năng nào có thể làm sau
- Làm nguyên mẫu, kiểm thử và xác minh quy mô nhỏ thế nào

Rất nhiều người tưởng Deliver đồng nghĩa với "lên mạng". Thực ra ý nghĩa chính xác hơn của nó là: **Biến một giải pháp thành thứ có thể kiểm thử, có thể xác minh, có thể lặp lại.**

Nó có thể là:

- Một flowchart độ fidelity thấp
- Một nguyên mẫu Figma
- Một MVP có thể chạy
- Một lần kiểm thử người dùng quy mô nhỏ
- Một phiên bản lặp lại sau phản hồi thực tế

Trọng tâm của Deliver không phải "giao phó hoàn hảo", mà là **càng sớm càng tốt đặt giải pháp vào môi trường thực tế để xác minh.**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="Một bàn tay đang viết vào ô nhập liệu của nguyên mẫu giấy, mô phỏng thao tác với giao diện chưa được phát triển" loading="lazy" />
  </a>
  <figcaption><strong>Có thể kiểm thử không có nghĩa là đã viết xong mã.</strong>Với nguyên mẫu giấy, giao diện được vẽ trên giấy; người tham gia nhấn và điền thông tin, còn người nghiên cứu thay trang tiếp theo. Cách này đủ để kiểm tra luồng, câu chữ và thứ tự thao tác, đồng thời tránh việc nhóm dành nhiều tuần triển khai một hướng có thể sai. Ảnh: <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

## 5. Sự khác nhau giữa bốn giai đoạn

Đến đây, chúng ta đã lần lượt xem xét bốn giai đoạn. Hình dưới đặt chúng vào cùng một quy trình. Hãy chọn một giai đoạn rồi so sánh công việc, đầu ra và những việc tạm thời chưa làm ở giai đoạn đó.

<DoubleDiamondNavigator />

## 6. Sai lầm phổ biến nhất với mô hình Double Diamond

### 6.1 Chưa Discover, đã trực tiếp Deliver

Đây là loại phổ biến nhất. Rất nhiều người vừa có ý tưởng đã vẽ nguyên mẫu, viết PRD, kết nối mô hình, làm trang.

Vấn đề không phải bạn làm không nghiêm túc, mà có thể bạn căn bản chưa xác nhận vấn đề có đáng giải quyết hay không.

### 6.2 Discover rất lâu, nhưng luôn không Define

Một cực đoan khác là luôn nghiên cứu, luôn xem tài liệu, luôn phỏng vấn, lại luôn không dám tập trung.

Double Diamond không phải để bạn phân tán vô hạn, mà nhắc bạn: Sau khi phân tán phải bước vào đánh giá và lựa chọn.

### 6.3 Sau khi Define, lại lén sửa vấn đề

Rất nhiều nhóm sẽ ở giai đoạn Develop vì một giải pháp dễ làm hơn, nên ngược lại sửa định nghĩa vấn đề, cho nó phù hợp với giải pháp hiện có.

Điều này rất nguy hiểm. Vì có thể bạn không đang giải quyết vấn đề, mà đang tìm lý do cho giải pháp bạn thích.

### 6.4 Hiểu sai Deliver thành "lên mạng đại toàn"

Deliver không phải nói phải làm xong sản phẩm hoàn chỉnh mới tính kết thúc. Rất nhiều lúc, một nguyên mẫu có thể kiểm thử, một vòng dùng thử người dùng thực tế, đã là một deliver rất tốt.

## 7. Trong sản phẩm AI, dùng mô hình Double Diamond thế nào

Sản phẩm AI đặc biệt dễ rơi vào bẫy "khả năng đi trước", vì khả năng mô hình trông quá hấp dẫn. Bạn sẽ rất muốn trực tiếp đi nghĩ:

- Có nên kết nối đa mô thức không
- Có nên làm Agent không
- Có nên thêm workflow không
- Có nên kết nối giọng nói, hình ảnh, tìm kiếm mạng không

Nhưng mô hình Double Diamond sẽ ép bạn hỏi trước:

- Người dùng rốt cuộc bị kẹt ở khâu nào
- Điểm nghẽn này có phải bắt buộc dùng AI không
- Nếu không dùng AI, phương pháp hiện tại rốt cuộc kém nhất ở đâu
- Sau khi thêm AI vào, tiến triển cốt lõi nhất là gì

Điều này giúp bạn tránh một tình huống phổ biến: **Khả năng rất mạnh, giá trị rất yếu.**

Một trình tự thực dụng là:

1. Ở giai đoạn Discover quan sát người dùng hiện đang xử lý nhiệm vụ thế nào
2. Ở giai đoạn Define viết một kịch bản đau nhất thành một định nghĩa vấn đề rõ ràng
3. Ở giai đoạn Develop rồi đi so sánh khả năng AI nào phù hợp nhất phục vụ vấn đề này
4. Ở giai đoạn Deliver làm một phiên bản tối thiểu, để người dùng thực tế kiểm thử

## 8. Template Double Diamond có thể áp dụng trực tiếp

Nếu bạn đang làm sản phẩm của mình, có thể trước viết theo trình tự dưới đây:

### Discover

- Người dùng tôi quan sát là ai?
- Lần gần nhất họ gặp vấn đề này là khi nào?
- Hiện họ giải quyết thế nào?
- Nơi họ phiền nhất, chậm nhất, không yên tâm nhất là gì?

### Define

- Trong đống vấn đề này, cái nào đáng ưu tiên giải quyết nhất?
- Kịch bản nào tần suất cao nhất, hoặc quan trọng nhất?
- Phiên bản đầu tiên của chúng ta phục vụ ai trước, giải quyết cái gì trước?
- Sau khi giải quyết thành công, trạng thái người dùng sẽ thay đổi thế nào?

### Develop

- Đối với vấn đề này, có những giải pháp khả thi nào?
- Giải pháp nào nhẹ nhất, nhanh nhất, dễ xác minh nhất?
- Cái nào phải làm, cái nào làm sau?

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Những người tham gia workshop tư duy thiết kế của Wikimedia Deutschland cùng làm giải pháp quanh một chiếc bàn" loading="lazy" />
  </a>
  <figcaption><strong>Develop không phải là ngồi chờ một ý tưởng hay xuất hiện.</strong>Những người trong ảnh đang cắt, sắp xếp và tạo mẫu, biến suy nghĩ của nhiều người thành vật có thể thảo luận. Giải pháp càng sớm trở nên hữu hình thì càng dễ so sánh, kết hợp hoặc loại bỏ. Ảnh: Corinna Schuster (WMDE), <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

### Deliver

- Chúng ta nhỏ nhất có thể giao phó gì để xác minh hướng này?
- Là flowchart, nguyên mẫu, hay MVP?
- Cần tìm ai kiểm thử?
- Sau khi kiểm thử đánh giá thế nào: tiếp tục, sửa đổi hay dừng lại?

## 9. Một ví dụ người mới cũng có thể hiểu

Giả sử bạn muốn làm một công cụ AI "giúp sinh viên chuẩn bị CV xin việc".

Rất nhiều người vừa bắt đầu sẽ trực tiếp bước vào kim cương thứ hai, bắt đầu nghĩ:

- Có nên làm làm đẹp một lần không
- Có nên sửa viết thông minh không
- Có nên tự động khớp JD không
- Có nên tạo tự giới thiệu không

Nhưng theo mô hình Double Diamond, quá trình tốt hơn sẽ là như thế này:

### Kim cương đầu tiên

**Discover**

- Đi hỏi sinh viên năm cuối lần gần nhất sửa CV là khi nào
- Xem họ sửa từ CV cũ thành phiên bản mới thế nào
- Hiểu họ phiền nhất là "không biết viết", "không biết sửa", hay "không biết đánh giá tốt chưa"

**Define**

- Cuối cùng tập trung thành một vấn đề cụ thể hơn:
- Không phải "sinh viên không biết làm CV"
- Mà là "sinh viên lần đầu nộp thực tập, rất khó sửa kinh nghiệm hiện có thành diễn đạt phù hợp với vị trí, do đó trì hoãn nộp hồ sơ"

### Kim cương thứ hai

**Develop**

- Nghĩ vài giải pháp: Thư viện template, AI sửa viết, đối chiếu vị trí, đánh giá CV, tham khảo case

**Deliver**

- Phiên bản đầu tiên chỉ làm "sửa viết bullet points kinh nghiệm dựa trên mô tả vị trí"
- Cho 5 sinh viên dùng thử, xem họ có nộp nhanh hơn CV phiên bản đầu tiên không

Bạn sẽ phát hiện, một khi kim cương đầu tiên làm vững, kim cương thứ hai sẽ rõ ràng hơn nhiều.

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Giao diện nguyên mẫu Mitmach-O-Mat vẽ tay, được tạo ra trong workshop tư duy thiết kế của Wikimedia Deutschland" loading="lazy" />
  </a>
  <figcaption><strong>Nguyên mẫu chỉ cần đủ để trả lời một câu hỏi.</strong>Sản phẩm của workshop này chưa có hệ thống hình ảnh hoàn chỉnh; nó chỉ gồm lời chào, nút hành động và một câu hướng dẫn, nhưng đã có thể dùng để quan sát người tham gia có hiểu bước tiếp theo hay không. Trọng tâm của Deliver là nhận phản hồi, không phải làm giao diện trông như thành phẩm ngay từ đầu. Nguyên mẫu: Corinna Schuster / WMDE, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. Sử dụng AI trong quy trình Double Diamond](#top-dd)

AI có thể hỗ trợ sắp xếp thông tin, mở rộng các phương án và chuẩn bị tài liệu kiểm thử, nhưng không thể thay thế bằng chứng từ người dùng hay quyết định của dự án.

Bản thân mô hình Double Diamond không phải công cụ AI, nhưng AI rất phù hợp đóng vai "bộ tăng tốc" trong bốn giai đoạn. Điểm mấu chốt không phải để AI thay bạn quyết định, mà là để nó giúp bạn mở rộng tầm nhìn, sắp xếp thông tin, so sánh giải pháp và tạo tài liệu xác minh.

### 11.1 Ở giai đoạn Discover, dùng AI làm trước một vòng lót thông tin

Trước khi phỏng vấn và nghiên cứu chính thức, bạn có thể để AI giúp bạn làm quét vấn đề nhẹ nhàng, ví dụ:

- Trên thị trường có giải pháp thay thế phổ biến nào
- Người dùng trong cộng đồng công khai thường phàn nàn điều gì nhất
- Vấn đề này thường gặp ở kịch bản và nhóm người nào
- Sản phẩm hiện có thường bỏ qua điều gì

Bước này không thể thay thế nghiên cứu thực tế, nhưng rất phù hợp giúp bạn nhanh chóng xây bản đồ vấn đề.

Một input rất đơn giản có thể là:

```text
Tôi muốn làm một công cụ giúp sinh viên sửa CV.
Bạn trước đừng giúp tôi nghĩ chức năng, trước giúp tôi xem mọi người thường gặp rắc rối gì nhất trên vấn đề này.
```

AI có thể xuất:

```text
Bản đồ vấn đề ban đầu:

1. Không biết nên viết kinh nghiệm gì
2. Không biết sửa cho phù hợp với vị trí thế nào
3. Sửa nhiều phiên bản vẫn không chắc đã đủ tốt
4. Cần người khác giúp xem, nhưng không tiện phiền người ta mãi
5. Vì không chắc chắn, nên cứ kéo dài không nộp
```

Tác dụng của loại output này không phải thay bạn kết luận, mà giúp bạn nhanh bước vào Discover.

### 11.2 Ở giai đoạn Define, để AI giúp bạn tập trung định nghĩa vấn đề

Rất nhiều người sau khi thu thập một đống tài liệu, khó nhất là nén vấn đề thành một câu thực sự rõ ràng. Bạn có thể giao ghi chú nghiên cứu cho AI, để nó giúp bạn nén thành vài định nghĩa vấn đề ứng viên:

```text
Dưới đây là phản hồi người dùng và ghi chú nghiên cứu tôi thu thập được ở giai đoạn Discover:
[Dán nội dung]

Xin giúp tôi làm ba việc:
1. Tổng hợp mô hình vấn đề xuất hiện thường xuyên nhất
2. Theo tần suất vấn đề, mức độ đau và tính khả thi xác minh, sắp xếp ra 3 vấn đề đáng ưu tiên giải quyết
3. Viết mỗi vấn đề thành một định nghĩa vấn đề cụ thể
```

Như vậy bạn sẽ dễ bước vào Define hơn, thay vì luôn dừng ở trạng thái "vấn đề nhiều quá".

Bạn thậm chí có thể viết input rất đơn giản:

```text
Tôi hiện thu thập được các vấn đề:
1. Mọi người không biết CV viết gì
2. Mọi người không biết sửa thế nào
3. Mọi người luôn cảm thấy chưa sửa xong, không dám nộp

Bạn giúp tôi xem, phiên bản đầu tiên phù hợp nhất giải quyết vấn đề nào trước.
```

AI có thể xuất:

```text
Đề xuất vấn đề đáng ưu tiên giải quyết:

"Sinh viên lần đầu nộp thực tập, không chắc CV đã đạt mức có thể nộp chưa, do đó sẽ sửa lặp đi lặp lại và trì hoãn nộp hồ sơ."

Lý do:
1. Vấn đề này cụ thể hơn
2. Nó có thể giải thích hành vi trì hoãn
3. Dễ thiết kế một phiên bản nhỏ để xác minh hơn
```

Loại output này rất hữu ích, vì nó giúp bạn từ đống vấn đề mơ hồ tập trung ra một định nghĩa gần với điểm khởi đầu MVP hơn.

### 11.3 Ở giai đoạn Develop, dùng AI phân tán nhiều giải pháp

Rất nhiều người vừa định nghĩa vấn đề xong, chỉ chăm chăm vào giải pháp đầu tiên nghĩ ra. AI ở bước này rất phù hợp giúp bạn ép phân tán:

```text
Tôi đã định nghĩa một vấn đề cốt lõi: [Định nghĩa vấn đề của bạn]
Xin đừng trực tiếp cho tôi một câu trả lời cuối cùng, mà từ các góc độ sau mỗi loại đề xuất 2-3 hướng giải quyết:
1. MVP nhẹ nhất
2. Giải pháp phù hợp nhất để xác minh nhu cầu
3. Giải pháp phù hợp nhất để nâng cao trải nghiệm
4. Giải pháp không phụ thuộc AI
5. Giải pháp phụ thuộc AI
Cuối cùng xin so sánh ưu điểm, rủi ro và chi phí xác minh của mỗi giải pháp.
```

Như vậy bạn sẽ không quá sớm bị trói vào một giải pháp duy nhất.

Một input đơn giản:

```text
Định nghĩa vấn đề hiện tại của tôi là:
"Sinh viên không chắc CV đã có thể nộp chưa, nên cứ kéo dài không nộp."

Xin giúp tôi nghĩ 4 giải pháp khác nhau, đừng chỉ cho tôi một.
```

AI có thể xuất:

```text
Giải pháp 1: Danh sách kiểm tra CV có thể nộp
Giải pháp 2: Sửa viết dựa trên mô tả vị trí
Giải pháp 3: Người dùng upload CV rồi đưa ra cảnh báo rủi ro
Giải pháp 4: Cung cấp đối chiếu case xuất sắc, giúp người dùng đánh giá khoảng cách
```

Lúc này bạn dễ bước vào "so sánh giải pháp" hơn, thay vì vừa lên chỉ chăm chăm để AI sửa viết một hướng.

### 11.4 Ở giai đoạn Deliver, dùng AI giúp bạn tạo văn bản nguyên mẫu và tài liệu kiểm thử

Khi bạn bước vào giai đoạn Deliver, AI rất phù hợp giúp bạn tăng tốc các công việc này:

- Tạo văn bản trang trong nguyên mẫu độ fidelity thấp
- Sắp xếp script kiểm thử người dùng
- Tạo nhiều phiên bản tiêu đề, nút bấm, mô tả có thể so sánh
- Sắp xếp phản hồi và danh sách vấn đề sau kiểm thử

Ví dụ bạn có thể để AI giúp bạn tạo một script kiểm thử người dùng 20 phút, hoặc giúp bạn gom 5 phản hồi người dùng thành căn cứ đánh giá "tiếp tục làm / sửa hướng / tạm dừng".

Ví dụ một input tối thiểu:

```text
Tôi đã làm một nguyên mẫu rất đơn giản:
Người dùng upload CV, hệ thống báo chỗ nào chưa phù hợp để nộp.

Xin giúp tôi tạo một script kiểm thử người dùng 15 phút.
```

AI có thể xuất:

```text
Script kiểm thử 15 phút:

1. Trước mời người dùng mô tả trải nghiệm nộp CV gần nhất
2. Để người dùng tự hoàn thành upload CV
3. Quan sát họ có hiểu được kết quả phản hồi không
4. Hỏi: Trong những gợi ý này, cái nào hữu ích nhất, cái nào khiến bạn bối rối
5. Hỏi: Nếu lần sau trước khi nộp, bạn có muốn dùng lại không
```

Loại output này rất thực dụng, vì nó có thể giúp bạn từ "tôi làm xong nguyên mẫu rồi" bước đến "tôi tiếp theo kiểm thử thế nào".

### 11.5 Để AI đóng vai "người gác cổng giai đoạn"

Vấn đề phổ biến nhất của mô hình Double Diamond, là người ta sẽ nhảy giai đoạn. Bạn có thể trực tiếp để AI đóng vai người gác cổng, nhắc bạn hiện tại rốt cuộc đang ở bước nào:

```text
Xin đóng vai huấn luyện viên quy trình sản phẩm.
Dưới đây là trạng thái dự án hiện tại của tôi: [Mô tả của bạn]
Xin đánh giá tôi hiện tại giống đang ở Discover, Define, Develop hay Deliver hơn.
Và cho tôi biết:
1. Tôi có phải đã nhảy quá sớm sang giai đoạn tiếp theo không
2. Hành động đáng bổ sung nhất ở giai đoạn hiện tại là gì
3. Những việc nào bây giờ chưa nên làm
```

Điều này đặc biệt hữu ích cho người mới, vì bạn rất dễ "chưa nghĩ rõ vấn đề đã bắt đầu vẽ nguyên mẫu".

## 11. Tóm tắt

- Discover và Define giúp hình thành định nghĩa vấn đề; Develop và Deliver giúp hình thành và kiểm chứng giải pháp.
- Mở rộng dùng để tăng số phương án; thu hẹp dùng để lựa chọn dựa trên bằng chứng.
- Định nghĩa vấn đề nên hoàn tất trước khi khám phá giải pháp, nhưng vẫn có thể được điều chỉnh theo kết quả thử nghiệm sau đó.
- Mục tiêu của Deliver là thu được kết quả kiểm thử phục vụ việc học hỏi, không nhất thiết phải bàn giao một sản phẩm hoàn chỉnh.

## 12. Bài tập

<StageAssignmentCard title="Sắp xếp ý tưởng bằng mô hình Double Diamond">

  <ol>
    <li>Chọn một ý tưởng gần đây chúng ta muốn thực hiện, rồi lần lượt viết bốn bước Discover, Define, Develop và Deliver.</li>
    <li>Thu vấn đề thật sự cần giải quyết thành một câu.</li>
    <li>Đề xuất ba cách làm khác nhau, sau đó chọn một cách.</li>
    <li>Viết ra một phiên bản tối thiểu có thể hoàn thành trong vòng một tuần.</li>
  </ol>

  <p>Điều quan trọng không phải là ghi nhớ bốn từ tiếng Anh, mà là hiểu rõ vấn đề trước khi quyết định sẽ làm gì.</p>
</StageAssignmentCard>

## Đọc thêm

Bài viết này chủ yếu tham khảo tài liệu chính thức của Design Council về Double Diamond, phù hợp để tiếp tục xem:

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure {
  margin: 24px 0 32px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.field-figure > a {
  display: block;
  background: #f4f4f1;
}

.field-figure img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.field-figure--diagram img {
  max-height: 580px;
  padding: 18px;
}

.field-figure--portrait img {
  max-height: 640px;
  object-fit: contain;
}

.field-figure--artifact img {
  padding: 20px;
  background: #f4f1eb;
  object-fit: contain;
}

.field-figure figcaption {
  padding: 13px 16px 15px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.field-figure figcaption strong {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .field-figure {
    margin: 20px 0 28px;
  }

  .field-figure--diagram img {
    padding: 8px;
  }
}
</style>

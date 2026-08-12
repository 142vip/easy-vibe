---
title: 'Lý thuyết nhu cầu Jobs to Be Done'
description: 'Bài nhập môn Jobs to Be Done dành cho người mới bắt đầu. Hiểu rằng người dùng không mua tính năng, mà “thuê” sản phẩm để đạt được một bước tiến trong một hoàn cảnh cụ thể; đồng thời học cách dùng JTBD để phân tích hướng sản phẩm, câu hỏi phỏng vấn và prompt AI.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Lý thuyết nhu cầu Jobs to Be Done

<a id="top-jtbd"></a>

Giả sử chúng ta chuẩn bị làm một công cụ ghi biên bản cuộc họp. Nếu bắt đầu từ tính năng, ta rất dễ liệt kê chuyển lời nói thành văn bản, tóm tắt, trích xuất việc cần làm và xuất tài liệu. Nhưng những tính năng này không trả lời được một câu hỏi cơ bản hơn: tại sao người dùng lại sử dụng công cụ sau khi cuộc họp kết thúc?

Jobs to Be Done (JTBD) trả lời câu hỏi ấy bằng “việc người dùng muốn hoàn thành”. Phương pháp này quan tâm đến hoàn cảnh cụ thể, kết quả mong đợi và cách làm hiện tại, thay vì mặc nhiên cho rằng một tính năng nào đó chắc chắn hữu ích.

Chương này trước hết giới thiệu các khái niệm cơ bản của JTBD, sau đó trình bày cách chuyển mô tả tính năng thành giả thuyết nhu cầu có thể kiểm chứng.

<a id="jtbd-what"></a>
## [1. Chuyển từ tính năng sang công việc](#top-jtbd)

Jobs to Be Done thường được viết tắt là **JTBD**. Phương pháp này xem sản phẩm là công cụ mà người dùng sử dụng để hoàn thành một công việc nào đó.

“Công việc” ở đây không phải là một hành động bề mặt trong danh sách việc cần làm, mà là một **bước tiến** về trạng thái mà người dùng mong muốn. Chẳng hạn:

- Không phải “tôi muốn một công cụ biên bản AI”, mà là “tôi muốn trong vòng 10 phút sau cuộc họp có thể sắp xếp rõ các ý chính, việc cần làm và người phụ trách, để không phải dựa vào trí nhớ mà bổ sung ghi chép”
- Không phải “tôi muốn một ứng dụng ghi chép chi tiêu”, mà là “tôi muốn biết tiền đã được tiêu vào đâu, để cuối tháng không còn lo lắng”
- Không phải “tôi muốn một công cụ tối ưu CV”, mà là “tôi muốn tự tin hơn khi gửi đi một bản CV chỉn chu, thay vì lần nào ứng tuyển cũng nghi ngờ rằng mình viết chưa đủ tốt”

Vì vậy, JTBD phân biệt cách sản phẩm được triển khai với công việc mà người dùng cần hoàn thành.

Đây cũng là lý do nhiều sản phẩm trông rất khác nhau nhưng thực tế lại cạnh tranh cho cùng một job. Khi muốn “bớt buồn chán trên đường đi làm”, người dùng có thể thuê video ngắn, podcast, trò chơi, trò chuyện, thậm chí là một giấc ngủ ngắn. Khi muốn “nhanh chóng hiểu một tệp PDF rất dài”, họ có thể thuê công cụ tóm tắt AI, thực tập sinh, đồng nghiệp, tự cố đọc, hoặc đơn giản là tạm thời không đọc.

Do đó, đối thủ cạnh tranh của một sản phẩm không nhất thiết là một ứng dụng cùng loại; nó còn bao gồm những cách làm khác mà người dùng đang áp dụng.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/customer-journey-map.png" alt="Bản đồ hành trình khách hàng ghi lại nhu cầu, hoạt động, vật dụng, cảm nhận và cơ hội sản phẩm theo từng giai đoạn" loading="lazy" />
  </a>
  <figcaption><strong>Công việc diễn ra trong cả một quá trình.</strong> Bản đồ hành trình khách hàng này chia quá trình sử dụng một công cụ trực tuyến thành nhiều giai đoạn, đồng thời ghi lại nhu cầu, hoạt động thực tế, công cụ đang dùng, cảm nhận và cơ hội ở từng giai đoạn. Nghiên cứu JTBD cũng nên lần theo quá trình ấy để đặt câu hỏi, thay vì chỉ hỏi người dùng thích tính năng nào. Tác giả: Advenio; nguồn ảnh: <a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

## 2. Khác với chân dung người dùng và danh sách tính năng

Khi mới bắt đầu phân tích nhu cầu, nhiều người thường viết chân dung người dùng trước: 25 tuổi, nữ, sống ở thành phố lớn, nhân viên văn phòng, thích công cụ nâng cao hiệu suất và sẵn sàng thử sản phẩm mới. Những thông tin như vậy không hoàn toàn vô ích, nhưng thường **chưa đủ để giải thích vì sao một người lại hành động đúng vào thời điểm này.**

JTBD quan tâm nhiều hơn đến những câu hỏi sau:

- Họ quyết định tìm giải pháp trong hoàn cảnh nào
- Lúc ấy, điều gì thực sự khiến họ mắc kẹt
- Họ muốn đưa việc gì tiến sang bước tiếp theo
- Hiện tại họ đang xoay xở bằng cách bất tiện nào
- Nếu vấn đề được giải quyết tốt, kết quả nào sẽ khiến họ cảm thấy “xứng đáng”

Nói cách khác, **chân dung người dùng giống như “người này đại khái là ai”, còn JTBD giống như “ngay lúc này người này thực sự muốn hoàn thành điều gì”.**

Tương tự, danh sách tính năng cũng dễ khiến chúng ta đi chệch hướng. Người dùng nói “tôi muốn xuất ra Word”, “tôi muốn AI viết lại”, “tôi muốn nhập bằng giọng nói”; đó đều chỉ là biểu hiện bề mặt. JTBD sẽ tiếp tục hỏi sâu hơn:

- Vì sao lúc này cần xuất ra Word chứ không phải PDF?
- Muốn viết lại vì văn phong chưa tốt, hay vì cần điều chỉnh cho những đối tượng khác nhau?
- Muốn nhập bằng giọng nói vì ngại gõ chữ, hay vì thường cần ghi lại ngay khi đang đi bộ, lái xe hoặc vừa họp xong?

Trong nhiều trường hợp, **tính năng chỉ là một bản dịch tạm thời của job**. Nếu chỉ thu thập tính năng, sản phẩm rất dễ trở thành nơi chất thêm mọi thứ người dùng nhắc đến. Khi nhìn thấy job phía sau, chúng ta mới có cơ hội tạo ra một giải pháp thực sự thuận tiện và có sức cạnh tranh.

## 3. Ví dụ: biên bản cuộc họp

Giả sử chúng ta chuẩn bị phát triển một công cụ ghi biên bản cuộc họp. Nếu bắt đầu từ tính năng, ta có thể liệt kê:

- Có hỗ trợ tải tệp âm thanh lên hay không
- Có tích hợp phân tách người nói hay không
- Có xuất ra Markdown hay không
- Có tự động tạo việc cần làm hay không

Đây đều là những cách triển khai có thể lựa chọn. Nhưng công việc của người dùng có thể là:

- Tôi muốn trong vòng 10 phút sau cuộc họp gửi kết quả thảo luận cho những người không tham dự
- Tôi muốn trích xuất rõ việc cần làm, người phụ trách và thời hạn, để nhóm không phải phối hợp dựa vào trí nhớ
- Tôi muốn giảm thời gian lặp lại việc sắp xếp nội dung cuộc họp, dành sức cho quyết định và triển khai

Từ đó, ta có thể nhận ra trọng tâm của phiên bản đầu tiên có lẽ không phải là “hỗ trợ 12 định dạng xuất”, mà là:

- Cấu trúc biên bản phải đủ rõ ràng
- Việc trích xuất đầu việc phải ổn định
- Liên kết chia sẻ phải thuận tiện
- Kết quả đầu ra phải đủ đáng tin để người dùng chuyển thẳng cho cả nhóm

Nhờ vậy, việc lựa chọn tính năng có thể quay về phục vụ công việc của người dùng.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Taking_Notes.JPG" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/meeting-note-taking.jpg" alt="Trong một cuộc họp thực tế, người tham dự đồng thời ghi chép bằng máy tính và giấy bút" loading="lazy" />
  </a>
  <figcaption><strong>Quan sát hiện trường trước, rồi mới nghĩ đến tính năng.</strong> Trong cuộc họp, mọi người vốn đã dùng máy tính, giấy bút và thói quen ghi chép riêng để hoàn thành công việc. Muốn làm sản phẩm biên bản cuộc họp, trước hết cần hiểu họ ghi lại điều gì và sau cuộc họp còn phải sắp xếp ra sao, thay vì mặc nhiên xem “chuyển bản ghi âm thành văn bản” là đáp án. Ảnh: Unclefeet, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>.</figcaption>
</figure>

Phần đối chiếu dưới đây đưa ra ba hoàn cảnh. Khi chuyển đổi giữa các hoàn cảnh, hãy chú ý “tính năng sản phẩm” và “công việc của người dùng” đang mô tả những điều khác nhau như thế nào.

<JtbdProgressLab />

## 4. Năm yếu tố của JTBD

Một mô tả JTBD thường gồm năm yếu tố: hoàn cảnh, tác nhân kích hoạt, bước tiến mong đợi, giải pháp thay thế hiện tại và tiêu chuẩn thành công.

### 4.1 Hoàn cảnh

Người dùng nghĩ đến sản phẩm vào thời điểm nào và trong môi trường nào?

- Sau khi họp xong
- Khi cấp trên đột ngột yêu cầu tài liệu
- Khi chuẩn bị nộp CV vào buổi tối
- Khi cuối tháng nhận ra tiền lại không đủ dùng

**Một nhu cầu không có hoàn cảnh cụ thể thường vẫn chưa đủ chân thực.**

### 4.2 Tác nhân kích hoạt

Điều gì khiến họ quyết định tìm giải pháp ngay lập tức?

- Bị một tài liệu dài làm cho quá tải, không biết nên bắt đầu đọc từ đâu
- Ngày mai phải nộp tài liệu, đến hôm nay mới nhận ra định dạng rất lộn xộn
- Vừa bị quản lý hỏi tiến độ và nhận ra mình chưa sắp xếp thông tin rõ ràng
- Muốn duy trì việc ghi chép, nhưng viết tay, sao chép và sắp xếp đều quá phiền phức

Tác nhân kích hoạt thường đi kèm cảm xúc. Cảm xúc này quan trọng vì nó quyết định tại sao người dùng lại hành động vào chính thời điểm đó.

### 4.3 Bước tiến muốn đạt được

Người dùng không chỉ muốn “thực hiện một thao tác”, mà muốn đưa bản thân sang trạng thái mới nào?

- Từ hỗn độn đến rõ ràng
- Từ lo lắng đến an tâm
- Từ trì hoãn đến bắt đầu
- Từ kém hiệu quả đến thuận tay
- Từ không diễn đạt rõ được đến có thể bàn giao ngay

Ở đây, từ “bước tiến” đặc biệt quan trọng. Bởi thứ nhiều người thực sự mua không phải là công cụ, mà là **sự thay đổi trạng thái**.

### 4.4 Giải pháp thay thế hiện tại

Khi chưa có sản phẩm của chúng ta, họ làm thế nào?

- Sao chép và dán thủ công
- Cố xoay xở bằng Excel hoặc ứng dụng ghi chú
- Nhờ đồng nghiệp giúp đỡ
- Trì hoãn chưa làm
- Liên tục chuyển qua lại giữa nhiều công cụ

Những giải pháp thay thế ấy chính là môi trường cạnh tranh thực tế của sản phẩm.

<figure class="field-figure field-figure--narrow">
  <a href="https://commons.wikimedia.org/wiki/File:Scrum_task_board.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/physical-task-board.jpg" alt="Bảng công việc vật lý trong văn phòng, các tờ giấy ghi chú được di chuyển giữa những cột như cần làm, đang làm và kiểm thử" loading="lazy" />
  </a>
  <figcaption><strong>Giải pháp thay thế không nhất thiết là một ứng dụng khác.</strong> Bảng công việc vật lý này chỉ dùng giấy ghi chú và băng dính thông thường nhưng vẫn hoàn thành công việc “làm cho tiến độ trở nên dễ thấy”. Khi nghiên cứu đối thủ, chúng ta cũng cần tính đến những quy trình thủ công, bảng tính và thói quen cộng tác như vậy. Ảnh: Logan Ingalls, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

### 4.5 Tiêu chuẩn thành công

Kết quả như thế nào mới có thể xem là vấn đề thực sự đã được giải quyết?

- Có kết quả để chia sẻ trong vòng 10 phút
- Có thể gửi cho người khác mà không cần sửa lớn lần nữa
- Không dễ bỏ sót, mắc lỗi hoặc quên việc
- Ngay lần đầu sử dụng đã biết bước tiếp theo cần làm gì

Nếu chưa thể nói rõ “người dùng đánh giá có xứng đáng hay không bằng cách nào”, thì hướng đi này nhiều khả năng vẫn chưa đủ hội tụ.

<a id="jtbd-formula"></a>
## [5. Mẫu câu JTBD](#top-jtbd)

Khi muốn sắp xếp một hướng sản phẩm, trước hết chúng ta có thể dùng mẫu câu rất thực tế sau:

> Khi __________, tôi muốn __________, để có thể __________.
> Hiện tại, tôi chỉ có thể tạm hoàn thành việc này bằng cách __________.

Ví dụ:

> Khi vừa kết thúc một cuộc họp dự án có lượng thông tin lớn, tôi muốn nhanh chóng có một bản biên bản gồm việc cần làm, người phụ trách và thời hạn, để có thể lập tức cập nhật cho nhóm và thúc đẩy thực hiện.
> Hiện tại, tôi chỉ có thể tạm hoàn thành việc này bằng cách nhớ lại, lục tìm lịch sử trò chuyện và tự sắp xếp thủ công.

Một ví dụ khác:

> Khi chuẩn bị ứng tuyển một vị trí mới, tôi muốn nhanh chóng viết lại những kinh nghiệm sẵn có thành phiên bản phù hợp hơn với vị trí ấy, để có thể tự tin gửi đi một bản CV chỉn chu.
> Hiện tại, tôi chỉ có thể liên tục sao chép CV cũ rồi tự sửa câu chữ, càng sửa về sau càng thấy thiếu chắc chắn.

Khi một câu có thể được viết rõ đến mức này, việc thiết kế trang, thiết kế prompt và xác định thứ tự ưu tiên của tính năng về sau đều trở nên dễ dàng hơn nhiều.

## 6. Ba tầng job cần đặc biệt lưu ý khi làm sản phẩm AI

Nhiều sản phẩm AI trông rất mạnh khi trình diễn tính năng nhưng lại không giữ được người dùng sau khi ra mắt. Một nguyên nhân thường gặp là chúng chỉ giải quyết thao tác bề mặt mà chưa giải quyết job sâu hơn.

Ta có thể tạm chia một job thành ba tầng:

### 6.1 Tầng chức năng

Công việc bề mặt nhất là gì?

- Tóm tắt tài liệu
- Viết lại nội dung
- Trích xuất việc cần làm
- Tạo hình ảnh

Đây là tầng mà người dùng dễ diễn đạt thành lời nhất.

### 6.2 Tầng cảm xúc

Người dùng muốn giảm cảm giác khó chịu nào, hoặc muốn có được cảm giác gì?

- Không muốn hoảng hốt như vậy
- Không muốn trông thiếu chuyên nghiệp
- Không muốn lần nào cũng bắt đầu từ con số không
- Muốn có cảm giác kiểm soát tốt hơn

Trong thực tế, ý định trả phí thường có liên hệ rất lớn với tầng cảm xúc.

### 6.3 Tầng xã hội

Người dùng muốn trở thành người như thế nào trong mắt người khác?

- Trông đáng tin cậy hơn
- Có năng lực tổ chức tốt hơn trong nhóm
- Chuyên nghiệp hơn trước khách hàng
- Diễn đạt tốt hơn trên mạng xã hội

Nếu chỉ giải quyết tầng chức năng, sản phẩm rất dễ bị thay thế. Khi đồng thời hiểu tầng cảm xúc và tầng xã hội, chúng ta sẽ dễ tìm thấy giá trị thực sự có khả năng giữ chân người dùng hơn.

## 7. Dùng JTBD để sàng lọc hướng sản phẩm

Đôi khi chúng ta chưa có sản phẩm mà chỉ có từ 3 đến 5 ý tưởng, chưa biết nên làm ý tưởng nào. Lúc này, JTBD rất phù hợp để sàng lọc.

Với mỗi ý tưởng, ta có thể lần lượt đặt năm câu hỏi:

1. Hoàn cảnh tương ứng với ý tưởng này đã đủ cụ thể chưa?
2. Hiện tại người dùng có đang dùng một cách bất tiện nào đó để giải quyết không?
3. Nỗi đau của job này có đủ mạnh, hoặc tần suất có đủ cao không?
4. Nếu làm tốt, người dùng có cảm nhận rõ rằng “trạng thái đã tốt hơn” không?
5. Phiên bản đầu tiên có thể chỉ xoay quanh một bước then chốt của job để tạo ra một phiên bản nhỏ nhưng hữu ích không?

Nếu sau cùng một hướng vẫn chỉ có thể được mô tả là “có vẻ khá thú vị”, nhưng không nói rõ được tác nhân kích hoạt, giải pháp thay thế và tiêu chuẩn thành công, thì nó nhiều khả năng vẫn chỉ là một cảm hứng mơ hồ chứ chưa phải một hướng trưởng thành.

## 8. Những câu hỏi có thể dùng ngay khi phỏng vấn người dùng

Khi bắt đầu nghiên cứu, nhiều người hỏi ngay: “Bạn muốn có tính năng gì?” Cách hỏi này rất dễ chỉ nhận được câu trả lời bề mặt.

JTBD phù hợp hơn với những câu hỏi sau:

- Lần gần nhất bạn gặp vấn đề này là khi nào?
- Lúc đó bạn đang làm gì, và vì sao bị mắc kẹt?
- Cuối cùng bạn đã giải quyết như thế nào?
- Trong quá trình ấy, điểm nào phiền nhất, chậm nhất hoặc khiến bạn thiếu yên tâm nhất?
- Nếu có một công cụ hỗ trợ, kết quả như thế nào sẽ khiến bạn cảm thấy nó thực sự hữu ích?
- Bạn đã thử những cách thay thế nào? Vì sao chúng chưa đủ tốt?

Ưu điểm của cách hỏi này là nó đưa cuộc trò chuyện trở lại trải nghiệm thực tế, thay vì dừng ở những sở thích do người dùng tưởng tượng ra.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/intel-context-observation.jpg" alt="Trong nghiên cứu trải nghiệm người dùng của Intel, một người tham gia chạm trực tiếp vào màn hình máy tính xách tay" loading="lazy" />
  </a>
  <figcaption><strong>Hành vi đôi khi cụ thể hơn câu trả lời.</strong> Khi Intel nghiên cứu thao tác cảm ứng trên máy tính xách tay tại Brazil, Trung Quốc, Italy và Hoa Kỳ, các nhà nghiên cứu quan sát thấy người tham gia đẩy màn hình ra sau rồi dùng hai ngón cái hoặc nhiều tư thế khác nhau để thao tác. Những hành động tại hiện trường như vậy khó được phát hiện chỉ bằng câu hỏi “bạn muốn tính năng gì”, nhưng lại cho thấy cách người dùng thực sự sử dụng sản phẩm. Ảnh: <a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer">Intel Free Press / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

## 9. Dùng AI hỗ trợ phân tích JTBD

JTBD không phải do AI tạo ra, nhưng AI rất phù hợp để hỗ trợ sắp xếp và chắt lọc JTBD.

Chẳng hạn, khi đã thu thập từ 5 đến 10 phản hồi của người dùng, chúng ta có thể đưa chúng cho mô hình và yêu cầu tổng hợp theo cấu trúc sau:

```text
Hãy đóng vai trò trợ lý nghiên cứu sản phẩm.
Tôi sẽ cung cấp một số lời nói nguyên văn của người dùng. Trước hết, đừng đề xuất tính năng,
mà hãy sắp xếp thông tin theo khung Jobs to Be Done:

1. Người dùng đang ở trong hoàn cảnh nào
2. Sự kiện nào kích hoạt họ hành động
3. Bước tiến mà họ thực sự muốn đạt được là gì
4. Giải pháp thay thế hiện tại là gì
5. Tiêu chuẩn thành công mà họ quan tâm nhất là gì
6. Những từ ngữ chỉ cảm xúc nào xuất hiện lặp lại trong các phản hồi

Cuối cùng, hãy tổng hợp thành 3 giả thuyết JTBD đáng được ưu tiên kiểm chứng nhất.
```

Nếu đã có một ý tưởng, chúng ta cũng có thể nhờ AI hỗ trợ thu hẹp phạm vi lần đầu:

```text
Tôi muốn làm một [ý tưởng sản phẩm của bạn].
Đừng trực tiếp đưa ra danh sách tính năng. Hãy dùng phương pháp Jobs to Be Done để phân tích:

1. Sản phẩm này có thể phục vụ những hoàn cảnh cụ thể nào
2. Trong mỗi hoàn cảnh, job cốt lõi mà người dùng muốn hoàn thành là gì
3. Có những giải pháp thay thế hiện tại nào
4. Job nào phù hợp nhất làm điểm khởi đầu cho MVP, và vì sao
5. Hãy viết job cuối cùng được đề xuất thành một câu JTBD rõ ràng
```

Lợi ích của cách làm này là chúng ta không bị AI đưa ngay vào việc “động não 50 tính năng”, mà trước hết làm rõ hướng đi.

## 10. Bốn hiểu lầm phổ biến nhất của người mới

### 10.1 Viết job thành tên tính năng

“Tóm tắt bằng AI”, “phân loại thông minh” và “tự động tạo” đều không phải job; chúng chỉ là những cách triển khai có thể dùng.

### 10.2 Mô tả nhóm người quá rộng

“Tất cả người đi làm”, “tất cả sinh viên” và “tất cả người khởi nghiệp” thường đều quá chung chung. Phạm vi càng rộng, ta càng khó nhìn thấy hoàn cảnh thực tế.

### 10.3 Chỉ nghe người dùng nói mà không quan sát cách họ làm

Người dùng có thể mô tả điều mình muốn, nhưng thứ tự ưu tiên thực sự thường ẩn trong cách họ đang tạm xoay xở để giải quyết vấn đề.

### 10.4 Muốn làm một nền tảng hoàn chỉnh ngay từ đầu

JTBD không yêu cầu bao phủ toàn bộ quy trình ngay từ đầu. Thông thường, chúng ta nên chọn một hoàn cảnh cụ thể và xác định một bước cần được ưu tiên kiểm chứng trong hoàn cảnh ấy.

<a id="jtbd-ai"></a>
## [11. Dùng AI sắp xếp tài liệu JTBD](#top-jtbd)

JTBD không phải do AI tạo ra, nhưng AI rất phù hợp để làm trợ lý nghiên cứu, trợ lý sắp xếp và trợ lý đối chiếu trong phương pháp này. Điểm quan trọng là: **hãy để AI hỗ trợ sắp xếp và mở rộng, chứ không thay chúng ta tưởng tượng về người dùng.**

Ta có thể sử dụng AI theo những cách sau.

### 12.1 Nhờ AI chuyển ý tưởng mơ hồ thành giả thuyết JTBD

Khi trong đầu chỉ có một mô tả mơ hồ, chẳng hạn “tôi muốn làm một công cụ giúp sinh viên tìm nơi thực tập”, trước hết chúng ta có thể nhờ AI chia nó thành một vài job có thể có:

```text
Hiện tại tôi có một ý tưởng sản phẩm còn mơ hồ: [ý tưởng của bạn]
Đừng trực tiếp đưa ra danh sách tính năng. Hãy dùng Jobs to Be Done để phân tích:
1. Ý tưởng này có thể tương ứng với những hoàn cảnh cụ thể nào
2. Trong mỗi hoàn cảnh, bước tiến mà người dùng thực sự muốn đạt được là gì
3. Giải pháp thay thế hiện tại có thể là gì
4. Job nào phù hợp nhất để làm MVP trước
Cuối cùng, hãy viết mỗi job thành một câu JTBD rõ ràng.
```

Ta thậm chí có thể viết đầu vào bằng lời rất đơn giản:

```text
Tôi muốn làm một thứ giúp sinh viên đại học tìm nơi thực tập.
Hiện tại tôi cũng chưa nói rõ được nó cụ thể là gì. Hãy giúp tôi nghĩ xem người dùng thực sự muốn hoàn thành việc gì.
```

Một kết quả hữu ích do AI đưa ra có thể như sau:

```text
Các hướng JTBD có thể có:

1. Khi lần đầu chuẩn bị ứng tuyển thực tập, tôi muốn nhanh chóng biết cần chuẩn bị những tài liệu nào trước,
để không trì hoãn mãi vì thông tin lộn xộn.

2. Khi thấy một vị trí thực tập, tôi muốn nhanh chóng đánh giá liệu vị trí ấy có đáng để ứng tuyển hay không,
để không lãng phí quá nhiều thời gian vào những vị trí không phù hợp.

3. Khi bắt đầu ứng tuyển, tôi muốn chỉnh CV hiện có thành phiên bản phù hợp hơn với vị trí,
để có thể ứng tuyển nhanh hơn và nâng cao tỷ lệ được chọn.
```

Giá trị của kết quả này nằm ở chỗ nó tách một ý tưởng vốn rất rộng thành vài hướng gần với hoàn cảnh thực tế hơn.

### 12.2 Nhờ AI sắp xếp lời nói nguyên văn từ phỏng vấn

Nếu đã thực hiện một vài cuộc phỏng vấn người dùng, chúng ta có thể đưa bản ghi cho AI để chắt lọc những hoàn cảnh, tác nhân kích hoạt, giải pháp thay thế và tiêu chuẩn thành công xuất hiện lặp lại.

```text
Dưới đây là lời nói nguyên văn trong cuộc phỏng vấn 5 người dùng.
Đừng vội đưa ra giải pháp. Hãy sắp xếp theo khung JTBD:
1. Người dùng đang ở trong hoàn cảnh nào
2. Sự kiện nào kích hoạt họ hành động
3. Bước tiến mà họ thực sự muốn đạt được là gì
4. Giải pháp thay thế hiện tại là gì
5. Tiêu chuẩn thành công mà họ quan tâm nhất là gì
6. Những thông tin nào lặp lại ở nhiều người dùng
Cuối cùng, hãy tổng hợp thành 3 giả thuyết JTBD đáng được ưu tiên kiểm chứng nhất.
```

Một đầu vào rất đơn giản cũng có thể được viết như sau:

```text
Tôi đã hỏi 3 người và đại ý họ nói như sau:

1. Mỗi lần ứng tuyển thực tập tôi đều phải sửa lại CV, rất phiền.
2. Điều tôi thực sự sợ là không biết mình viết như vậy có đúng không.
3. Hiện tại tôi thường nhờ anh chị khóa trên xem giúp, nhưng lần nào cũng ngại làm phiền người khác.

Hãy giúp tôi sắp xếp xem điều họ thực sự muốn hoàn thành là gì.
```

AI có thể đưa ra kết quả:

```text
Kết quả sắp xếp:

- Hoàn cảnh chung: cần xử lý CV trước khi ứng tuyển thực tập
- Khó khăn chung: không biết phải sửa thế nào mới “đủ tốt”
- Giải pháp thay thế hiện tại: nhờ anh chị khóa trên xem giúp, tự sửa đi sửa lại
- JTBD có thể có:
  Khi chuẩn bị ứng tuyển thực tập, tôi muốn nhanh chóng đánh giá CV đã đạt mức có thể gửi đi hay chưa,
  để không mắc kẹt mãi ở việc “sửa thêm một chút” rồi chậm trễ không ứng tuyển.
```

Kết quả như vậy hữu ích vì nó giúp chắt lọc từ những lời nói rời rạc thành một nội dung giống “nhu cầu” hơn.

### 12.3 Nhờ AI thực hiện một vòng nghiên cứu trực tuyến nhẹ

Trước khi bắt đầu phỏng vấn trên quy mô lớn, chúng ta có thể nhờ AI quét nhẹ một số thông tin bên ngoài, chẳng hạn:

- Mọi người than phiền về vấn đề này như thế nào trên các diễn đàn hoặc cộng đồng công khai
- Những sản phẩm hiện có trên thị trường chủ yếu đang giải quyết tầng vấn đề nào
- Các giải pháp thay thế phổ biến nhất của người dùng là gì
- Trong những đánh giá thường gặp, người dùng hài lòng và không hài lòng nhất về điều gì

Kiểu nghiên cứu này không thể thay thế phỏng vấn người dùng thực tế, nhưng rất phù hợp để khởi động giai đoạn Discover và giúp chúng ta dựng bản đồ vấn đề ban đầu.

Một đầu vào đơn giản có thể là:

```text
Hãy giúp tôi tìm hiểu:
“Những khó khăn phổ biến nhất khi sinh viên sửa CV và ứng tuyển thực tập là gì?”
Ưu tiên xem lời chia sẻ của chính người dùng trên diễn đàn công khai, bài viết kinh nghiệm và cộng đồng việc làm.
Hãy tổng hợp thành 5 vấn đề phổ biến nhất.
```

AI có thể đưa ra:

```text
Tổng hợp những khó khăn phổ biến:

1. Không biết nên viết gì trong CV vì có quá ít kinh nghiệm
2. Không biết điều chỉnh thế nào cho từng vị trí khác nhau
3. Đã sửa nhiều phiên bản nhưng vẫn không chắc đã đủ tốt hay chưa
4. Không tìm được người đáng tin cậy để xem giúp
5. Quy trình ứng tuyển phức tạp và dễ dẫn đến trì hoãn
```

Không thể xem loại kết quả này là kết luận cuối cùng, nhưng nó phù hợp để giúp chúng ta quyết định nên ưu tiên phỏng vấn loại vấn đề nào trước.

### 12.4 Để AI đóng vai “người phản biện”

Nhiều khi chúng ta quá gắn bó với ý tưởng của mình. Có thể yêu cầu riêng AI đóng vai người chuyên soi vấn đề, buộc giả thuyết phải được diễn đạt rõ ràng hơn:

```text
Hãy đóng vai một cố vấn nghiên cứu sản phẩm rất nghiêm khắc.
Dưới đây là giả thuyết JTBD của tôi: [giả thuyết của bạn]
Hãy phê bình nó từ các góc độ sau:
1. Hoàn cảnh này có quá rộng không
2. Job này có bị viết thành tính năng thay vì một bước tiến thực sự không
3. Giải pháp thay thế có quá yếu không
4. Tiêu chuẩn thành công có chưa đủ rõ không
5. Rủi ro nào trong giả thuyết này cần được kiểm chứng nhất
```

Cách làm này giúp chúng ta sớm nhận ra mình đang quan sát nhu cầu, hay chỉ đang quan sát một phương án mà bản thân yêu thích.

## 12. Tổng kết

- JTBD chuyển đối tượng phân tích từ tính năng sản phẩm sang công việc người dùng muốn hoàn thành.
- Một giả thuyết JTBD cần nêu rõ hoàn cảnh, tác nhân kích hoạt, bước tiến mong đợi, giải pháp thay thế hiện tại và tiêu chuẩn thành công.
- Tính năng sản phẩm là một phương án để hoàn thành công việc, không nên bị đánh đồng với công việc của người dùng.
- JTBD là giả thuyết nhu cầu và vẫn cần được kiểm tra bằng phỏng vấn người dùng cùng bằng chứng hành vi.

## 13. Bài tập

<StageAssignmentCard title="Viết rõ điều người dùng thực sự muốn hoàn thành">

  <ol>
    <li>Chọn một ý tưởng sản phẩm và viết ra hoàn cảnh mà người dùng sẽ cần đến nó.</li>
    <li>Viết rõ kết quả người dùng muốn đạt được và cách họ đang dùng để thay thế.</li>
    <li>Tìm một người có thể gặp vấn đề này và hỏi về trải nghiệm thực tế gần đây nhất của họ.</li>
    <li>Dựa vào lời nói nguyên văn của người đó, viết lại mô tả JTBD ban đầu.</li>
  </ol>

  <p>Cuối cùng, chỉ cần có một câu mà người bình thường có thể hiểu được; không cần viết câu quá phức tạp chỉ để khớp với công thức.</p>
</StageAssignmentCard>

## Đọc thêm

- [Christensen Institute: Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/)
- [Harvard Business School Online: What Is Jobs to Be Done?](https://online.hbs.edu/blog/post/jobs-to-be-done)
- [Intercom: Jobs-to-be-Done: A framework for customer needs](https://www.intercom.com/blog/jobs-to-be-done-framework/)
- [Mural: Jobs to Be Done framework guide](https://www.mural.co/blog/jobs-to-be-done-framework)

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

.field-figure--narrow img {
  max-height: 720px;
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
}
</style>

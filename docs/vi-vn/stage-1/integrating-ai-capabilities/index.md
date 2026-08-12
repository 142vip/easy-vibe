---
title: 'Kết nối năng lực AI cho nguyên mẫu'
description: 'Bắt đầu từ prompt, tài liệu chính thức và bảng điều khiển dịch vụ để thêm văn bản, thị giác, hình ảnh, giọng nói và video vào nguyên mẫu web.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Khoảng <strong>1–2 ngày</strong>'
const relatedArticles =
  relatedArticlesMap['vi-vn/stage-1/integrating-ai-capabilities'] ?? []
</script>

# Kết nối năng lực AI cho nguyên mẫu


## Giới thiệu chương

<ChapterIntroduction :duration="duration" :tags="['Prompt', 'Tài liệu API', 'Bảng điều khiển dịch vụ', 'Đa phương thức']" coreOutput="Kết nối 1–2 năng lực AI thật cho nguyên mẫu" expectedOutput="Nguyên mẫu web gọi được dịch vụ văn bản, hình ảnh, giọng nói hoặc video">

Nguyên mẫu ở chương trước đã đủ để kiểm tra bố cục trang và luồng thao tác, nhưng kết quả sinh ra vẫn là dữ liệu mô phỏng. Trong chương này, chúng ta sẽ nối một thao tác chính với dịch vụ AI thật.

Tích hợp AI không chỉ là sao chép một đoạn mã API. Ba việc phải được xử lý cùng nhau: **mô tả nhiệm vụ thế nào, đọc tài liệu chính thức ra sao và đặt lời gọi an toàn vào luồng sản phẩm ở đâu.**

Chúng ta sẽ học một phương pháp chung rồi lần lượt xem văn bản, hiểu ảnh, sinh ảnh, giọng nói và video. Tên mô hình cùng giao diện bảng điều khiển luôn thay đổi, nên ví dụ ở đây dùng để giải thích cấu trúc. Khi tự kết nối, hãy lấy Model ID và tham số hiện tại từ tài liệu chính thức của dịch vụ.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Nói rõ nhiệm vụ', description: 'Chuẩn bị prompt nghiệp vụ' },
      { title: 'Đọc tài liệu', description: 'Tìm API và tham số' },
      { title: 'Hoàn tất kết nối', description: 'Chạy lời gọi an toàn' },
      { title: 'Mở rộng phương thức', description: 'Ảnh, giọng nói và video' }
    ]" />
  </ClientOnly>
</div>

## 1. Chọn chức năng cần kết nối

Không gian làm nội dung thương mại điện tử ở chương trước đã có thông tin sản phẩm và nút “Tạo nội dung”, nhưng kết quả vẫn là dữ liệu giả. Trước tiên, chúng ta sẽ làm cho nút này hoạt động thật.

Luồng rất đơn giản: người dùng nhập tên, chất liệu và điểm nổi bật, nhấn nút rồi nhận một đoạn giới thiệu sản phẩm. Đầu vào và kết quả đều là chữ, vì vậy cần mô hình sinh văn bản.

Khi chức năng thay đổi, năng lực cần dùng cũng thay đổi:

- Tải ảnh sản phẩm để nhận diện màu và kiểu dáng cần hiểu ảnh.
- Làm áp phích từ dữ liệu sản phẩm cần sinh ảnh.
- Biến bản ghi âm thành biên bản cần chuyển giọng nói thành chữ rồi dùng mô hình văn bản để sắp xếp.
- Biến bài viết thành âm thanh nghe được cần chuyển văn bản thành giọng nói.
- Làm ảnh sản phẩm chuyển động cần sinh video từ ảnh.

Trước khi kết nối, hãy nhìn lại trang: người dùng gửi gì và cuối cùng muốn thấy gì? Khi rõ hai điểm này, bạn thường sẽ biết nên tìm mô hình văn bản, hình ảnh, giọng nói hay video.

<AiCapabilityGuide />

### 1.1 Một chức năng đôi khi gồm nhiều bước

Không phải chức năng nào cũng hoàn thành trong một lần gọi một mô hình. “Tải ảnh và tạo điểm bán hàng” phải hiểu sản phẩm trong ảnh trước, sau đó mới viết từ kết quả. “Trả lời theo tài liệu công ty” cũng phải tìm đúng nội dung trước khi soạn câu trả lời.

Đừng bắt đầu từ tên mô hình. Hãy đi theo thao tác của người dùng: bước nào hiểu nội dung có sẵn, bước nào tạo nội dung mới, bước nào chỉ tìm dữ liệu? Khi cần, nối hai hoặc ba năng lực theo thứ tự.

AI chỉ xử lý phần phù hợp với nó. Đăng nhập, thanh toán, lưu tệp và chuyển trang có quy tắc rõ ràng, vẫn được thực hiện bằng chương trình thông thường.

![Trang thật hiểu ảnh sản phẩm trước khi tạo mô tả](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*Trong nguyên mẫu này, trang nhận diện thông tin sản phẩm trước. Người dùng xác nhận rồi mới tạo mô tả và các điểm nổi bật còn chỉnh sửa được.*

### 1.2 Cần tìm gì trong bảng điều khiển dịch vụ?

Sau khi chọn sinh văn bản, có thể mở DeepSeek, SiliconFlow, Volcengine Ark hoặc MiniMax. Nền tảng cung cấp tài khoản, tính phí và điểm gọi; mô hình được chọn sẽ xử lý yêu cầu.

Lần đầu không cần đọc mọi menu. Hãy tìm bốn mục:

1. Tạo **API Key** cho ứng dụng gọi dịch vụ.
2. Ghi lại **Model ID** định dùng.
3. Tìm ví dụ curl hoặc JavaScript nhỏ nhất trong tài liệu chính thức.
4. Kiểm tra hạn mức, giá và giới hạn gọi.

Ứng dụng gửi dữ liệu sản phẩm cho mô hình qua **API**. Nếu tài liệu có **SDK** JavaScript hoặc Python, bạn cũng có thể dùng; SDK chỉ gói mã gửi yêu cầu cho tiện hơn. Câu “hãy viết tiêu đề và điểm nổi bật từ dữ liệu này” bên trong yêu cầu chính là prompt gửi cho mô hình.

Tên nền tảng, Model ID và địa chỉ API không phải một. Hãy dùng địa chỉ và ID trong ví dụ chính thức, không dùng URL của trang trải nghiệm.

### 1.3 Tạm bỏ qua những API chưa cần

Bảng điều khiển còn có thể hiện Embedding, Rerank, Function Calling, OCR và kiểm duyệt nội dung. Embedding và Rerank dùng cho kho tri thức; OCR đọc PDF hoặc hóa đơn; Function Calling cho phép mô hình dùng tìm kiếm hay cơ sở dữ liệu.

Không cần học tất cả ngay. Hãy nối một API trực tiếp phục vụ chức năng trên trang, rồi quay lại tài liệu khi sản phẩm thực sự cần thêm năng lực.

## 2. Thử kết quả trước khi viết mã

Trước khi viết mã API, hãy thử mô hình ở khu vực trải nghiệm trực tuyến. Điều cần kiểm tra không chỉ là “có viết được không”, mà là có trả đúng định dạng trang cần hay không.

### 2.1 Người dùng chỉ cần nói rõ mong muốn

Trong trang trải nghiệm, hãy nhập như một người dùng thật:

```text
Tôi muốn đăng bán một chiếc ba lô đi làm nhẹ, bằng nylon màu đen,
chủ yếu dùng khi đi làm hằng ngày.
Hãy viết một tiêu đề ngắn và ba điểm nổi bật.
```

Khi đã thành trang, người dùng có thể không cần tự viết đoạn này. Họ nhập tên, chất liệu, màu rồi nhấn “Tạo nội dung”. Chương trình tự thêm quy tắc cố định: không bịa giá và doanh số, giữ tiêu đề ngắn, trả về đúng định dạng.

Nếu trang hiển thị riêng tiêu đề, tóm tắt và điểm nổi bật, chương trình có thể yêu cầu ba trường JSON `title`, `summary`, `selling_points`. Dữ liệu người dùng vẫn tự nhiên còn trang đọc kết quả ổn định.

Trong lần thử đầu, hãy đổi vài sản phẩm và cố tình bỏ một trường để xem mô hình có bịa phần thiếu hay không. Nếu định dạng không ổn định, hãy sửa yêu cầu cố định của chương trình thay vì bắt người dùng học cách viết prompt.

### 2.2 Nối API vào trang

Tài liệu chính thức thường có ví dụ curl, JavaScript hoặc Python. Đưa ví dụ đó cùng chức năng muốn làm cho IDE có AI.

```text
Hãy thêm nút “Tạo nội dung” vào trang chi tiết sản phẩm.

Khi nhấn nút, gửi thông tin sản phẩm hiện tại đến API bên dưới,
rồi hiển thị nội dung được tạo trên trang.

Không đặt API Key trong trình duyệt. Hãy hiển thị trạng thái chờ và lỗi.
Khi xong, cho tôi biết cần cấu hình gì và cách chạy, kiểm tra.

Ví dụ API chính thức:
<dán ví dụ curl hoặc SDK không chứa khóa thật>
```

Khi đã có vị trí trên trang và ví dụ chính thức, IDE không cần đoán định dạng API. Trước tiên xác nhận một yêu cầu trả về bình thường. Khi thêm ảnh, giọng nói hoặc video, thay mô tả chức năng và ví dụ chính thức.

## 3. Gửi yêu cầu đầu tiên theo ví dụ chính thức

Sau khi thử prompt, mở Quick Start hoặc API Reference. Lời gọi đầu tiên chỉ cần bốn điều: địa chỉ gửi, vị trí API Key, giá trị `model` và ví dụ tối thiểu.

Sao chép ví dụ curl, JavaScript hoặc Python chính thức, chỉ thay Model ID và nội dung thử. Hãy nhận một phản hồi bình thường trong terminal trước khi đưa mã vào dự án. Nếu nối trang rồi gặp lỗi, ít nhất bạn biết tài khoản, khóa và mô hình vẫn dùng được.

Xem cả dữ liệu trả về. Văn bản thường nằm trong một trường JSON, ảnh có thể trả URL, âm thanh có thể là dữ liệu nhị phân, còn video thường trả mã nhiệm vụ trước. Trang phải được viết theo phản hồi thật.

### 3.1 Nhờ AI đọc tài liệu dài

Không cần đọc hết tài liệu dài. Đưa liên kết đang xem cho IDE và yêu cầu tìm phần cần cho lời gọi đầu tiên.

```text
Hãy đọc tài liệu API này: <liên kết>

Tôi muốn gọi bằng JavaScript. Cho tôi ví dụ đơn giản nhất,
vị trí đặt API Key và model, cùng cách lấy kết quả.
Chỉ dùng những tham số được ghi trong tài liệu này.
```

## 4. Lần đầu mở bảng điều khiển

Tạo khóa, chọn mô hình và xem mức sử dụng thường nằm trong bảng điều khiển. Tên menu có thể khác nhưng công việc tương tự.

### 4.1 Tạo khóa và xác nhận yêu cầu đã đến

API Key là thông tin xác thực để ứng dụng gọi mô hình. Lưu nó trong biến môi trường cục bộ, không đưa vào ảnh chụp, hội thoại hay mã phía trình duyệt. Nếu nghi bị lộ, thu hồi ngay và tạo khóa mới.

Sau yêu cầu đầu, mở Usage hoặc Billing và tìm bản ghi mới. Ở đó còn có số dư và Quota. Nếu lỗi, hãy phân biệt mã chưa gửi, nền tảng từ chối hay tài khoản hết hạn mức.

![Trang Usage của DeepSeek hiển thị số dư, chi phí tháng và xu hướng lời gọi](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.png)

*Trang Usage của DeepSeek cho biết số lần gọi, chi phí và số dư.*

Nếu lỗi có Request ID hoặc Trace ID, hãy lưu lại để tìm đúng yêu cầu trong nhật ký.

### 4.2 Chọn mô hình và sao chép đúng tên gọi

Danh mục Models cho biết những mô hình văn bản, ảnh, giọng nói và video hiện có. Mở chi tiết và sao chép Model ID dùng trong mã; nó có thể khác tên hiển thị.

![Danh mục SiliconFlow với bộ lọc văn bản, ảnh, video và giọng nói](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*Danh mục SiliconFlow có thể lọc theo loại năng lực.*

Một số nền tảng yêu cầu chọn Region hoặc tạo Deployment rồi mới cấp Base URL và Endpoint. Khi đó hãy làm theo hướng dẫn nhanh, đừng dùng URL của bảng điều khiển làm địa chỉ API.

![Trang kết nối nhanh Volcengine Ark hiển thị API Key và các bước thử](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.png)

*Volcengine Ark đặt tạo khóa, chọn mô hình và ví dụ chạy được trong cùng một luồng.*

### 4.3 Giới hạn sử dụng và tác vụ dài

RPM và TPM là số yêu cầu và token được phép mỗi phút. Dịch vụ ảnh, giọng nói và video còn có thể giới hạn Concurrency, tức số tác vụ chạy đồng thời. Khi vượt giới hạn thường nhận `429`; hãy chờ thay vì bấm liên tục.

Tác vụ dài như video không trả tệp ngay mà trả Task ID. Chương trình dùng nó để hỏi tiến độ, hoặc dùng Callback/Webhook để nền tảng báo cho máy chủ. File ID hay URL tạm có thể hết hạn, vì vậy cần quyết định có chuyển tệp sang kho của mình hay không trước khi phát hành.

Các tham số `max_tokens`, `temperature`, `stream` nên giữ như ví dụ chính thức trong phiên bản đầu. Chỉ đổi `max_tokens` khi kết quả bị cắt và bật `stream` khi cần hiển thị dần; không đổi mọi thứ cùng lúc.

## 5. Đưa ví dụ chính thức vào trang

Khi ví dụ trong terminal chạy được, làm theo thứ tự:

1. Đặt khóa trong `.env.local` hoặc tệp không đưa lên Git.
2. Gọi mô hình từ máy chủ hoặc Serverless Function.
3. Cho trang gọi đường dẫn `/api/...` của bạn, không mang khóa dịch vụ ra trình duyệt.
4. Thêm trạng thái chờ, thành công và thất bại vào nút.
5. Quay lại Usage để xác nhận lời gọi thật.

```text
Trang trình duyệt
    │ chỉ gửi dữ liệu nghiệp vụ
    ▼
Đường dẫn /api của bạn ── đọc API Key từ biến môi trường máy chủ
    │
    ▼
Dịch vụ AI ── trả văn bản, JSON, tệp hoặc task_id
```

::: warning Bảo vệ API Key
Không viết API Key trong mã Vue, React hay HTML chạy ở trình duyệt. Biến có tiền tố `VITE_` hoặc `NEXT_PUBLIC_` vẫn có thể bị đóng gói công khai. Khi triển khai, hãy gọi mô hình từ backend, Serverless Function hoặc cổng được bảo vệ.
:::

### 5.1 Có API không trả kết quả ngay

Văn bản ngắn, hiểu ảnh và nhận dạng âm thanh ngắn thường trả trong một yêu cầu. Hội thoại hoặc giọng nói thời gian thực có thể truyền từng phần để trang hiển thị khi nhận.

Sinh ảnh và video thường bất đồng bộ: yêu cầu đầu chỉ trả `task_id`, sau đó phải hỏi trạng thái xếp hàng, xử lý, thành công hay thất bại. Tác vụ có thể mất hàng chục giây nên trang không nên đứng yên ở một dòng “Đang tải”.

## 6. Kết nối sinh văn bản trước

[Tài liệu DeepSeek API](https://api-docs.deepseek.com/) cung cấp giao diện văn bản tương thích với SDK phổ biến. Mô hình luôn thay đổi; hãy lấy ID hiện tại từ [danh sách mô hình](https://api-docs.deepseek.com/api/list-models).

Trước tiên gửi yêu cầu curl với dữ liệu sản phẩm giống phần trải nghiệm trực tuyến.

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "Trả JSON có title, summary và selling_points. selling_points gồm ba mục. Không bịa giá, doanh số hoặc công dụng."},
      {"role": "user", "content": "Tôi muốn bán ba lô đi làm bằng nylon màu đen. Hãy viết tiêu đề ngắn, một đoạn giới thiệu và ba điểm nổi bật."}
    ],
    "stream": false
  }'
```

Thiết lập khóa trong biến môi trường rồi chạy lệnh. Khi có phản hồi bình thường, đưa cùng ví dụ và yêu cầu ở phần 2 cho IDE. Phiên bản đầu chỉ cần một nút và một sản phẩm cố định; sau đó mới nối toàn bộ biểu mẫu.

### Thử bằng hai sản phẩm

Đổi tên, chất liệu và màu rồi tạo lại. Nếu hai kết quả phù hợp với từng đầu vào và hiển thị đúng, kết nối tối thiểu đã chạy. Tiếp theo xóa một trường để kiểm tra việc bịa giá, công dụng hoặc doanh số. Dùng tạm một khóa sai để kiểm tra thông báo lỗi.

Cuối cùng xác nhận lời gọi trong Usage. Chỉ thấy chữ trên trang chưa chứng minh nó đến từ API; dữ liệu mô phỏng còn sót lại có thể cho giao diện tương tự.

## 7. Hiểu ảnh với Qwen3-VL

Mô hình thị giác nhận một ảnh và một câu hỏi. Hãy hỏi đúng dữ liệu trang cần; “trong ảnh có gì?” thường cho mô tả quá rộng.

```text
Hãy xem ảnh sản phẩm này. Cho biết đó là gì, màu chính,
chất liệu và cấu trúc nhìn thấy được, cùng chữ có trong ảnh.

Phần không rõ thì nói không rõ. Không đoán thương hiệu, giá hoặc doanh số.
Trả JSON để tôi hiển thị trên trang.
```

[Danh mục SiliconFlow](https://cloud.siliconflow.cn/models) cho phép lọc các mô hình thị giác hiện tại. Phần này dùng `Qwen/Qwen3-VL-8B-Instruct` để minh họa cấu trúc; hãy kiểm tra Model ID trước khi chạy.

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Trả JSON về loại sản phẩm, màu, chất liệu và cấu trúc nhìn thấy, cùng chữ trong ảnh. Không đoán phần không rõ."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![Kết nối API hiểu ảnh trong IDE có AI](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*Cho người dùng xác nhận thông tin đã nhận diện trước khi tạo nội dung cuối giúp phát hiện lỗi dễ hơn.*

## 8. Sinh và chỉnh sửa ảnh sản phẩm

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite) có thể sinh ảnh từ chữ hoặc sửa ảnh tham khảo. Với ảnh sản phẩm, ngoài nền, bố cục và ánh sáng còn phải nói rõ phần không được thay đổi.

```text
Biến chiếc ba lô đen trong ảnh tham khảo thành áp phích sản phẩm dọc.
Đặt nó giữa mặt bàn xám nhạt, ánh sáng mềm và chừa khoảng trống phía trên cho tiêu đề.
Không thêm chữ, Logo hay giá; không đổi khóa kéo, quai đeo hoặc túi.
```

Sau lần tạo đầu, kiểm tra sản phẩm có biến dạng hay không trước khi xem nền và bố cục. Đừng bắt đầu bằng quá nhiều từ mô tả phong cách.

Sao chép Model ID và yêu cầu tối thiểu hiện tại từ [bảng điều khiển Volcengine Ark](https://www.volcengine.com/experience/ark?launch=seedream). Không dùng mãi số phiên bản trong một bài hướng dẫn cũ.

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<sao chép Model ID ảnh hiện tại từ bảng điều khiển>",
    "prompt": "Biến ba lô đen tham khảo thành áp phích dọc gọn gàng. Không thêm chữ, Logo hay giá và không đổi cấu trúc ba lô.",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![Kết quả sinh ảnh được nối vào sản phẩm](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

URL ảnh có thể hết hạn. Nguyên mẫu có thể hiển thị trực tiếp; khi phát hành cần quyết định lưu vào kho riêng theo điều khoản dịch vụ và ghi lại prompt, phiên bản mô hình, thời gian tạo.

## 9. Nhận dạng và tổng hợp giọng nói là hai API khác nhau

- **ASR / STT** chuyển lời nói hoặc tệp âm thanh thành chữ.
- **TTS** chuyển văn bản thành giọng nói phát được.

Đầu vào, đầu ra và thao tác khác nhau, vì vậy không nên gộp vào một nút “API giọng nói” mơ hồ.

### 9.1 Giọng nói thành chữ: tải âm thanh và nhận bản chép

[Tài liệu phiên âm SiliconFlow](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions) tải tệp bằng `multipart/form-data`, khác với yêu cầu JSON.

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

```text
Thêm nút “Tải bản ghi âm và chép lời” vào trang hiện tại.

Sau khi người dùng tải tệp mp3, m4a hoặc wav, hãy gọi API bên dưới từ máy chủ,
rồi đặt văn bản trả về vào ô có thể chỉnh sửa.
Giữ API Key trong biến môi trường và cho phép thử lại khi tải hoặc nhận dạng thất bại.

Ví dụ chính thức:
<dán ví dụ curl ở trên>
```

### 9.2 Chuyển chữ thành giọng nói có thể trả âm thanh thay vì JSON

[Tài liệu MiniMax T2A HTTP](https://platform.minimax.io/docs/api-reference/speech-t2a-http) cung cấp tổng hợp giọng nói đồng bộ. Ví dụ hiện tại dùng `speech-2.8-hd`; hãy kiểm tra mô hình và giọng trên nền tảng.

Chỉnh số, chữ viết tắt và nhịp nghỉ cho phù hợp khi đọc, rồi chọn giọng, tốc độ, âm lượng, cảm xúc và định dạng. Không gửi nguyên trang chứa Markdown, URL và chữ trên nút để đọc.

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "Đây là đoạn nghe thử phần giới thiệu sản phẩm.",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<sao chép voice_id từ danh sách giọng>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

Trang âm thanh còn cần phát, dừng, tạo lại và tải xuống. TTS theo luồng dùng WebSocket hoặc HTTP streaming và phát từng phần khi nhận.

::: warning Giọng nói và quyền riêng tư
Trước khi tải bản ghi, hãy giải thích mục đích, thời gian lưu và cách xóa. Nhân bản giọng nói cần sự đồng ý rõ ràng của chủ giọng. Không dùng bản ghi người khác hoặc người nổi tiếng không rõ nguồn gốc.
:::

## 10. Sinh video: tạo tác vụ rồi đợi kết quả

Video thường dùng API bất đồng bộ. [Tài liệu MiniMax](https://platform.minimax.io/docs/guides/video-generation) chia thành ba bước: tạo tác vụ nhận `task_id`, hỏi trạng thái để nhận `file_id`, rồi lấy địa chỉ tải.

### 10.1 Cần mô tả cả cách cảnh thay đổi

Prompt video phải nói rõ vị trí ban đầu, thứ tự chuyển động, hướng máy quay và thời lượng.

```text
Hiển thị chiếc ba lô đen trong sáu giây trên bệ màu xám nhạt.
Máy quay đi chậm từ chính diện sang bên phải rồi tiến lại gần một chút. Giữ khung hình dọc.
Không thay đổi ba lô và không thêm người, chữ hoặc Logo.
```

Nếu có nhiều hành động, bắt đầu bằng một cảnh và một chuyển động chính. Vừa xoay, mở, phóng to và đổi cảnh trong video ngắn sẽ khó giữ hình dạng sản phẩm.

### 10.2 Tạo và kiểm tra là hai yêu cầu

```bash
# Bước 1: tạo tác vụ
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "Hiển thị ba lô đen trên bệ xám nhạt. Máy quay đi từ chính diện sang phải rồi tiến lại gần. Không đổi ba lô và không thêm người, chữ hoặc Logo.",
    "duration": 6,
    "resolution": "1080P"
  }'

# Bước 2: dùng task_id trả về để hỏi trạng thái
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

Trang cần hiển thị `Preparing`, `Queueing`, `Processing`, `Success`, `Fail`. Đặt khoảng hỏi và điều kiện dừng; trong sản phẩm thật có thể dùng `callback_url` để nền tảng báo cho máy chủ.

::: warning Video và tư liệu người thật
Khi dùng ảnh hoặc giọng người thật, nhãn hiệu hay nội dung có bản quyền, hãy xác nhận phạm vi cho phép và quy định nền tảng. Một số dịch vụ yêu cầu xác minh khuôn mặt, đăng ký tư liệu hoặc kiểm duyệt; không được tìm cách bỏ qua ở trình duyệt.
:::

## 11. Chẩn đoán lỗi thường gặp

| Hiện tượng | Kiểm tra trước |
| --- | --- |
| `401 / 403` | Khóa đúng chưa, có quyền không, đặt đúng header chưa |
| `404` | Base URL, Endpoint hoặc Model ID có đổi không |
| `429` | RPM, TPM, số tác vụ đồng thời và cấp tài khoản |
| `400` | Tham số bắt buộc, định dạng tệp, cấu trúc JSON và kích thước |
| `5xx / timeout` | Trạng thái dịch vụ, thời gian chờ và cách thử lại |
| Luôn xếp hàng | Số tác vụ đồng thời, truy vấn trạng thái, hạn mức và tải dịch vụ |
| Báo thành công nhưng trống | Đường dẫn trường phản hồi, dữ liệu nhị phân, URL tạm hết hạn |
| Chạy cục bộ được, triển khai lỗi | Biến môi trường, CORS, giới hạn Serverless và mạng khu vực |

Khi gỡ lỗi hãy lưu thời gian, loại yêu cầu, trạng thái HTTP và Request ID/Trace ID. Không ghi API Key, toàn bộ bản ghi âm người dùng hoặc dữ liệu nghiệp vụ nhạy cảm vào nhật ký.

## 12. 📚 Bài tập chương

<StageAssignmentCard title="Thêm một năng lực AI vào nguyên mẫu">

  <p>Chọn một nút thật sự cần AI. Phiên bản đầu chỉ cần một năng lực, không phải làm cả văn bản, ảnh, giọng nói và video.</p>

  <ol>
    <li>Tìm Model ID hiện tại và ví dụ tối thiểu trong tài liệu chính thức.</li>
    <li>Đưa ví dụ cho IDE có AI và nối vào nút trên trang.</li>
    <li>Đặt API Key trong biến môi trường máy chủ, thêm trạng thái chờ và lỗi.</li>
    <li>Gọi thật một lần rồi xác nhận trong Usage hoặc nhật ký.</li>
  </ol>

  <p>Khi hoàn tất, lưu một ảnh chụp chạy thật và nói trong một câu AI giúp người dùng làm gì trên trang. Hãy kiểm tra quyền trước khi dùng ảnh, giọng nói hoặc tư liệu của người khác.</p>
</StageAssignmentCard>

## Bước tiếp theo

Chương sau đưa các năng lực này trở lại luồng sản phẩm hoàn chỉnh. Chúng ta sẽ thêm dữ liệu, trạng thái và phản hồi để biến một lời gọi API thành nguyên mẫu có thể dùng lặp lại.

<RelatedArticlesSection
  title="Bài viết liên quan"
  description="Từ một năng lực AI đến luồng sản phẩm hoàn chỉnh."
  :items="relatedArticles"
/>

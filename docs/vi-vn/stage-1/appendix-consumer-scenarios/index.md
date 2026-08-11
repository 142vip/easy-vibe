---
title: 'Tham khảo kịch bản sản phẩm AI cho người tiêu dùng'
description: '80 hướng sản phẩm AI cụ thể bắt đầu từ lối sống, cảm xúc, giải trí, học tập, quan hệ, sức khỏe và những cảnh đời thường.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'Khoảng <strong>4 giờ</strong>'
const vibePoint = ref('')
const feeling = ref('')

const scenarios = {
  lifestyle: { name: 'Lối sống', anchor: '#_1-lối-sống', title: 'Trợ lý nghi thức buổi sáng', desc: 'Một nhịp khởi đầu ngắn theo thời tiết và lịch' },
  emotion: { name: 'Đồng hành cảm xúc', anchor: '#_2-đồng-hành-cảm-xúc', title: 'Người lắng nghe ban đêm', desc: 'Giúp sắp xếp suy nghĩ mà không phán xét' },
  entertainment: { name: 'Giải trí', anchor: '#_3-giải-trí-và-thư-giãn', title: 'Quản trò trinh thám nhập vai', desc: 'Câu chuyện ghi nhớ lựa chọn của người chơi' },
  growth: { name: 'Phát triển bản thân', anchor: '#_4-phát-triển-bản-thân', title: 'Huấn luyện viên thói quen dạng trò chơi', desc: 'Biến hành động nhỏ thành nhiệm vụ và tiến bộ' },
  social: { name: 'Tương tác xã hội', anchor: '#_5-tương-tác-xã-hội', title: 'Máy gợi ý chủ đề phá băng', desc: 'Câu mở đầu phù hợp một buổi gặp' },
  creative: { name: 'Biểu đạt sáng tạo', anchor: '#_6-biểu-đạt-sáng-tạo', title: 'Bộ sơ cứu khi cạn ý tưởng', desc: 'Điểm xuất phát mới từ giới hạn và biến thể' },
  travel: { name: 'Khám phá du lịch', anchor: '#_7-khám-phá-du-lịch', title: 'Hướng dẫn đi bộ thành phố', desc: 'Tuyến ngắn theo thời gian và tâm trạng' },
  health: { name: 'Sức khỏe thân tâm', anchor: '#_8-sức-khỏe-thân-tâm', title: 'Đánh thức động lực vận động', desc: 'Bước đầu nhỏ phù hợp trạng thái hôm nay' },
  learning: { name: 'Khám phá kiến thức', anchor: '#_9-khám-phá-kiến-thức', title: 'Bạn học ngôn ngữ theo tình huống', desc: 'Đóng vai những cuộc nói chuyện thật' },
  relationship: { name: 'Chăm sóc quan hệ', anchor: '#_10-chăm-sóc-quan-hệ', title: 'Huấn luyện viên giao tiếp thân mật', desc: 'Chuẩn bị lời khó nói một cách tôn trọng' },
  pet: { name: 'Đồng hành thú cưng', anchor: '#_11-đồng-hành-thú-cưng', title: 'Nhật ký từ góc nhìn thú cưng', desc: 'Biến ảnh và ghi chép thành câu chuyện ấm áp' },
  finance: { name: 'Sức khỏe tài chính', anchor: '#_12-sức-khỏe-tài-chính', title: 'Nhận biết cảm xúc mua sắm', desc: 'Quan sát xung động trước và sau khi mua' },
  career: { name: 'Phát triển nghề nghiệp', anchor: '#_13-phát-triển-nghề-nghiệp', title: 'Người đồng hành lúc mơ hồ nghề nghiệp', desc: 'Sắp xếp kinh nghiệm và giá trị thành lựa chọn' },
  home: { name: 'Không gian nhà', anchor: '#_14-không-gian-nhà', title: 'Nhà thiết kế không khí trong nhà', desc: 'Thay đổi nhỏ theo mùa và cảm xúc' },
  food: { name: 'Ẩm thực', anchor: '#_15-ẩm-thực-và-nấu-nướng', title: 'Bữa một người chữa lành', desc: 'Món đơn giản từ nguyên liệu đang có' },
  fashion: { name: 'Trang phục', anchor: '#_16-trang-phục-và-phong-cách', title: 'Bảng tâm trạng cho trang phục hôm nay', desc: 'Phối đồ đang có theo thời tiết và lịch' }
}

const recommendationMap = {
  healing: { relax: ['emotion', 'health', 'home'], inspire: ['creative', 'growth', 'lifestyle'], connect: ['relationship', 'pet', 'social'], escape: ['travel', 'entertainment', 'lifestyle'] },
  growth: { relax: ['growth', 'health', 'learning'], inspire: ['career', 'learning', 'creative'], connect: ['social', 'relationship', 'career'], escape: ['travel', 'entertainment', 'creative'] },
  social: { relax: ['social', 'food', 'home'], inspire: ['social', 'creative', 'travel'], connect: ['relationship', 'social', 'pet'], escape: ['travel', 'entertainment', 'creative'] },
  explore: { relax: ['travel', 'lifestyle', 'food'], inspire: ['travel', 'creative', 'learning'], connect: ['travel', 'social', 'relationship'], escape: ['travel', 'entertainment', 'creative'] },
  daily: { relax: ['lifestyle', 'home', 'health'], inspire: ['creative', 'food', 'fashion'], connect: ['relationship', 'pet', 'lifestyle'], escape: ['entertainment', 'travel', 'lifestyle'] }
}

const vibeOptions = [
  { label: 'Chữa lành', value: 'healing' },
  { label: 'Trưởng thành', value: 'growth' },
  { label: 'Kết nối', value: 'social' },
  { label: 'Khám phá', value: 'explore' },
  { label: 'Đời thường', value: 'daily' }
]

const feelingOptions = [
  { label: 'Muốn thư giãn', value: 'relax' },
  { label: 'Tìm cảm hứng', value: 'inspire' },
  { label: 'Muốn được kết nối', value: 'connect' },
  { label: 'Muốn tạm thoát ra', value: 'escape' }
]

const recommendations = computed(() => {
  const keys = recommendationMap[vibePoint.value]?.[feeling.value] || []
  return keys.map(key => scenarios[key])
})

const scrollToAnchor = (anchor) => {
  const element = document.querySelector(anchor)
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

# Tham khảo kịch bản sản phẩm AI cho người tiêu dùng

## Dẫn nhập chương

<ChapterIntroduction :duration="duration" :tags="['Ứng dụng cá nhân', 'Lối sống', 'Trải nghiệm cảm xúc', 'Thiết kế bầu không khí']" coreOutput="Khám phá 16 lĩnh vực và 80 kịch bản" expectedOutput="Chọn một hướng để kiểm tra với người dùng thật">

Sản phẩm doanh nghiệp thường hỏi trước về hiệu suất và chi phí. Với người dùng cá nhân, sự nhẹ nhõm, vui, tự tin và lý do quay lại ngày mai cũng rất quan trọng. Danh sách này không phải đáp án để sao chép; hãy chọn một cảnh đời bạn hiểu rồi kiểm tra với người thật.

</ChapterIntroduction>

## Chọn nhanh theo bầu không khí

<el-card shadow="hover" style="margin: 16px 0 24px; border-left: 5px solid #ec4899;">
  <p><strong>Chọn bầu không khí muốn tạo và cảm giác hiện tại của người dùng.</strong></p>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Chọn bầu không khí" style="width: 100%;">
        <el-option v-for="item in vibeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="Chọn cảm giác" style="width: 100%;">
        <el-option v-for="item in feelingOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
  </el-row>
  <div v-if="recommendations.length" style="margin-top: 16px; display: grid; gap: 10px;">
    <button v-for="item in recommendations" :key="item.anchor" type="button" @click="scrollToAnchor(item.anchor)" style="text-align: left; padding: 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); cursor: pointer;">
      <strong>{{ item.title }}</strong><br><span style="font-size: 13px; color: var(--vp-c-text-2);">{{ item.desc }} · {{ item.name }}</span>
    </button>
  </div>
</el-card>

## Xem nhanh các hướng

| Nhóm lĩnh vực | Câu hỏi đầu tiên |
| --- | --- |
| Lối sống, nhà, ăn uống, trang phục | Người dùng nhớ tới trợ giúp này vào lúc nào? |
| Cảm xúc, sức khỏe, tài chính | Có bị hiểu nhầm thành chẩn đoán, điều trị hay cam kết lợi nhuận không? |
| Giải trí, sáng tạo, du lịch | Trong phút đầu đã có kết quả thú vị chưa? |
| Trưởng thành, học tập, nghề nghiệp, xã hội, quan hệ, thú cưng | Sản phẩm có giúp tăng năng lực, đồng thời tôn trọng quyền, riêng tư và an toàn của bên khác không? |

Với mỗi ý tưởng, hãy viết một câu: ai mở nó, khi nào, vì sao và họ đóng lại sau khi điều gì thay đổi?

## 1. Lối sống

### 1.1 Trợ lý đánh thức nghi thức buổi sáng

Từ thời tiết, giấc ngủ, lịch và tâm trạng, ứng dụng đề xuất nghi thức năm phút. Thay vì thêm báo thức, hãy để người dùng chọn một khởi đầu nhỏ và cảm nhận đã hoàn thành.

### 1.2 Người tạo không khí cho cuộc sống một mình

Giờ tan làm và cảm giác mong muốn tạo ra tổ hợp ánh sáng, nhạc, mùi và một việc dọn nhỏ. Luồng cơ bản vẫn phải dùng được như checklist khi không có nhà thông minh.

### 1.3 Máy tạo kế hoạch cuối tuần ở nhà để hồi phục

Năng lượng và ngân sách tạo ra một nhóm phim, đồ ăn, hoạt động nhẹ và thời gian nghỉ. “Không làm gì” cũng là một lựa chọn hợp lệ.

### 1.4 Đài an ủi trước khi ngủ

Độ dài và không khí được chọn để tạo câu chuyện, hơi thở hoặc giọng êm. Không hứa hiệu quả y tế; phải dễ dừng và xóa lịch sử.

### 1.5 Người bắt cảm hứng thẩm mỹ đời sống

Ảnh hoặc ghi chú ngắn trở thành gợi ý màu, bố trí và nghi thức. Hãy tận dụng đồ đang có trước khi thúc đẩy mua thêm.

## 2. Đồng hành cảm xúc

### 2.1 Người lắng nghe ban đêm

Nhận câu chuyện không phán xét rồi tách cảm xúc khỏi sự kiện. Khi có tín hiệu khủng hoảng, ưu tiên kết nối con người và hỗ trợ khẩn cấp địa phương.

### 2.2 Người đồng hành hồi phục sau chia tay

Ghi cảm xúc, trì hoãn xung động liên lạc và một kế hoạch trong ngày giúp vượt giai đoạn đầu. Không tạo chức năng theo dõi hay thao túng người cũ.

### 2.3 Huấn luyện viên thở giảm lo âu

Hình và âm thanh hướng dẫn bài ngắn có thể dừng bất cứ lúc nào. Mô tả là bài tự điều chỉnh tạm thời, không phải điều trị.

### 2.4 Người hướng dẫn xây lại sự tự tin

Thay vì khen chung chung, ứng dụng nhắc lại việc người dùng thật sự đã làm. Không phủ nhận cảm xúc khó chịu; người dùng tự chọn một bước nhỏ kế tiếp.

### 2.5 Trợ lý đọc nhật ký cảm xúc

Hiển thị thời gian, sự kiện và từ ngữ lặp qua nhiều ngày. Mọi diễn giải chỉ là giả thuyết và cho phép người dùng sửa.

## 3. Giải trí và thư giãn

### 3.1 Quản trò trinh thám nhập vai

Nhân vật, manh mối và thời gian phải nhất quán trong khi lựa chọn mở thông tin. Cốt lõi vụ án nằm trong dữ liệu trò chơi, không được mô hình tùy tiện đổi.

### 3.2 NPC có linh hồn trong thế giới mở

NPC nhớ cuộc gặp và thay đổi quan hệ, giọng điệu. Quy tắc thế giới quan trọng phải do hệ thống game quyết định.

### 3.3 Tạo podcast cá nhân hóa

Từ chủ đề quan tâm và nguồn có thể dùng, tạo một đoạn âm thanh ngắn. Phân biệt sự thật, ý kiến, hư cấu và nêu nguồn.

### 3.4 Nhóm tạo không khí concert ảo

Bình chọn, cổ vũ và phản ứng cùng nhau tạo cảm giác hiện trường. Cần giảm tốc chat, kiểm duyệt và chống quấy rối.

### 3.5 Bạn đồng sáng tác tiểu thuyết tương tác

Lựa chọn thay đổi thế giới và quan hệ. Người đọc sửa được thiết lập, câu chữ và quay về nhánh cũ.

## 4. Phát triển bản thân

### 4.1 Người chứng kiến trưởng thành

Ảnh, ghi chú và thành tựu thành dòng thời gian, nhắc lại phiên bản trước ở mốc quan trọng. So sánh với chính mình, không với người khác.

### 4.2 Huấn luyện viên thói quen dạng trò chơi

Hành động nhỏ thành nhiệm vụ. Việc quay lại sau gián đoạn cũng được ghi nhận, thay vì tạo tội lỗi vì mất chuỗi.

### 4.3 Ghép bạn học kỹ năng

Người có mục tiêu, trình độ và thời gian giống nhau nhận nhiệm vụ chung nhỏ. Báo cáo, chặn và riêng tư phải có trước ghép cặp.

### 4.4 Người phát hiện niềm vui nhỏ mỗi ngày

Một ảnh hay một câu làm khoảnh khắc tốt hiện rõ. Ngày khó khăn vẫn được ghi nguyên vẹn, không ép tích cực.

### 4.5 Máy trải nghiệm mô phỏng cuộc đời

Chuyển việc, chuyển nhà hoặc học được mở thành nhiều giả định về chi phí và cảm xúc. Công cụ đặt câu hỏi, không tiên tri.

## 5. Tương tác xã hội

### 5.1 Máy tạo chủ đề phá băng

Loại buổi gặp, mối quan hệ và điều cần tránh tạo ra câu mở nhẹ. Không biến tò mò thành tra hỏi hoặc kiểm tra đối phương.

### 5.2 Người tạo không khí cho nội dung mạng xã hội

Ảnh và giọng nói của người dùng tạo nhiều bản nháp. Người dùng sửa bản cuối; ứng dụng không bịa trải nghiệm chưa xảy ra.

### 5.3 Người lên kế hoạch không khí hẹn hò

Ngân sách, quãng đường và sở thích hai người tạo địa điểm, chủ đề và bất ngờ nhỏ. Đồng thuận và thoải mái quan trọng hơn hiệu ứng.

### 5.4 Người phụ trách không khí tụ họp từ xa

Trò ngắn, thứ tự nói và nghỉ giúp cuộc gặp online. Người ít nói có thể phản ứng bằng nhiều cách mà không bị ép phát biểu.

### 5.5 Trợ lý quản lý năng lượng xã hội

Người hướng nội dự báo năng lượng trước cuộc gặp và đặt thời gian hồi phục. Tính cách không bị mô tả như khuyết điểm cần sửa.

## 6. Biểu đạt sáng tạo

### 6.1 Bộ sơ cứu khi cạn cảm hứng

Chủ đề, hình thức và giới hạn tạo nhiều điểm bắt đầu. Cung cấp vật liệu để chọn và biến đổi thay vì chỉ đưa sản phẩm hoàn chỉnh.

### 6.2 Hướng dẫn khám phá phong cách cá nhân

Tìm màu, hình và từ lặp trong ảnh, cách biểu đạt người dùng thích. Điều quan trọng là vì sao họ thích, không phải điểm xu hướng.

### 6.3 Cố vấn thẩm mỹ cho sổ tay và nhật ký

Mục đích trang và dụng cụ đang có tạo gợi ý bố cục, màu và nội dung. Phương án không phải mua thêm được đưa trước.

### 6.4 Hướng dẫn bố cục và không khí ảnh

Cảnh, ánh sáng và cảm giác mong muốn tạo vị trí và bố cục. Với ảnh người, nhắc đồng ý và riêng tư.

### 6.5 Người ghép nhạc với tâm trạng

Hoạt động và cảm giác được ghép với nhịp, chất nhạc. Không sao chép nhạc có bản quyền; liên kết playlist hợp pháp.

## 7. Khám phá du lịch

### 7.1 Hướng dẫn khám phá khi đi bộ thành phố

Thời gian, khả năng di chuyển và không khí tạo tuyến ba điểm ngắn. Giờ mở, an toàn và khả năng tiếp cận cần dữ liệu mới.

### 7.2 Tạo nhật ký tâm trạng chuyến đi

Ảnh, nơi và câu ngắn thành dòng thời gian có thể sửa. Người dùng chọn mức công khai vị trí.

### 7.3 Trợ lý đồng hành khi du lịch một mình

Check-in, liên hệ khẩn cấp và lưu ý xung quanh tạo cảm giác an tâm. Trong khẩn cấp thật, ưu tiên phương tiện cứu trợ chính thức.

### 7.4 Xem trước không khí điểm đến

Mùa, giờ, âm thanh và tập quán địa phương giúp cảm nhận trước chuyến đi. Phân biệt quảng cáo với trải nghiệm thực.

### 7.5 Hướng dẫn không khí ảnh du lịch

Hướng sáng, giờ đông và đặc điểm nơi tạo gợi ý chụp. Đồng thời kiểm tra quy định vào cửa, drone và chụp người.

## 8. Sức khỏe thân tâm

### 8.1 Người đánh thức động lực vận động

Trạng thái hôm nay dẫn tới bước nhỏ như giãn hai phút. Khi có đau hoặc dấu hiệu nguy hiểm, không thúc tập mà đề xuất tư vấn.

### 8.2 Căn bếp cảm hứng ăn lành mạnh

Hỏi nguyên liệu, thời gian, dị ứng và hạn chế ăn trước khi gợi ý. Không hứa chữa bệnh.

### 8.3 Người tối ưu không khí giấc ngủ

Kiểm tra ánh sáng, tiếng, nhiệt độ và thói quen, mỗi lần thử một thay đổi. Mất ngủ kéo dài thuộc lĩnh vực y tế.

### 8.4 Người hướng dẫn cảm nhận cơ thể

Body scan ngắn giúp nhận căng và mệt. Mô hình không chẩn đoán hay kết luận nguyên nhân.

### 8.5 Trợ lý nhắc chăm sóc bản thân

Nhắc nước, ăn, nghỉ và liên lạc theo nhịp người dùng đặt. Thông báo dễ tắt và không gây tội lỗi.

## 9. Khám phá kiến thức

### 9.1 Hướng dẫn khám phá kiến thức dạng trò chơi

Chia chủ đề thành bản đồ và nhiệm vụ; cho gợi ý trước đáp án. Thành công là giải thích lại bằng lời mình.

### 9.2 Bạn học ngôn ngữ theo tình huống

Đóng vai quán cà phê, phỏng vấn, du lịch. Giải thích lỗi quan trọng sau cuộc nói chuyện thay vì ngắt mọi câu.

### 9.3 Trợ lý thỏa mãn tò mò

Theo chuỗi “tại sao” bằng ví dụ và nguồn. Nói rõ điều chưa chắc và cách kiểm tra.

### 9.4 Kích thích cảm hứng ghi chú đọc sách

Hỏi về câu nổi bật, phản biện và ứng dụng để sắp xếp suy nghĩ. Không kết thúc ở việc thay sách bằng tóm tắt.

### 9.5 Tạo không khí chia sẻ kiến thức

Biến điều học thành thẻ, bài nói ngắn hoặc quiz. Giữ nguồn và phạm vi trích dẫn.

## 10. Chăm sóc quan hệ

### 10.1 Huấn luyện viên giao tiếp thân mật

Tách quan sát, cảm xúc, nhu cầu và đề nghị để chuẩn bị lời khó nói. Mục tiêu là đối thoại hai chiều, không thao túng.

### 10.2 Trợ lý nhắc quan tâm gia đình

Ngoài ngày lễ, nhắc liên hệ ngắn thường ngày và gợi câu phù hợp. Tin tự động luôn phải xác nhận trước gửi.

### 10.3 Người tạo không khí duy trì tình bạn

Sở thích chung, cuộc nói gần nhất và thời gian rảnh tạo một cuộc gặp nhẹ. Không chấm điểm quan hệ.

### 10.4 Người lên kế hoạch tỏ tình và bất ngờ

Sở thích, ngân sách và mức công khai tạo trải nghiệm nhỏ. Tránh áp lực nơi công cộng và quay không đồng ý.

### 10.5 Hướng dẫn làm dịu xung đột

Tách sự kiện khỏi diễn giải, gợi lúc dừng và câu quay lại. Khi có bạo lực hay đe dọa, an toàn trước kỹ thuật nói chuyện.

## 11. Đồng hành thú cưng

### 11.1 Nhật ký nhân hóa thú cưng

Ảnh và ghi chú của chủ thành câu chuyện giọng thú cưng. Không tuyên bố biết cảm xúc thật của nó.

### 11.2 Người giải đọc hành vi thú cưng

Bối cảnh và hành vi tạo giải thích có thể cùng điểm cần theo dõi. Vấn đề sức khỏe chuyển tới bác sĩ thú y.

### 11.3 Lên kế hoạch thời gian bên thú cưng

Tuổi, sức khỏe và không gian tạo trò chơi, tập luyện. Loại thức ăn, đồ chơi nguy hiểm và quá sức.

### 11.4 Tạo câu chuyện kỷ niệm thú cưng

Ảnh, ngày và ký ức thành cuốn sách có thể sửa. Kiểm tra vị trí và khuôn mặt người khác trước công khai.

### 11.5 Hướng dẫn an tâm cho người mới nuôi

Ăn, vệ sinh, tiêm và môi trường thành checklist. Phân biệt kiến thức chung với dấu hiệu cần khám gấp.

## 12. Sức khỏe tài chính

### 12.1 Trợ lý nhận biết cảm xúc tiêu dùng

Tâm trạng, hoàn cảnh và mức hài lòng trước sau mua cho thấy mẫu xung động. Không làm người dùng xấu hổ; cho công cụ trì hoãn quyết định.

### 12.2 Khích lệ trực quan mục tiêu tiết kiệm

Chuyến đi hay quỹ khẩn cấp thành bước nhỏ và hình ảnh. Kế hoạch linh hoạt khi thu nhập đổi.

### 12.3 Học tài chính nhẹ nhàng

Lãi, rủi ro và phân tán được giải thích bằng đời sống, quiz. Không đề xuất sản phẩm cụ thể hay cam kết lợi nhuận.

### 12.4 Người làm dịu lo âu tài chính

Chia lo thành sự thật, việc làm ngay, việc xem sau. Khủng hoảng nợ cần chỉ đường tư vấn uy tín.

### 12.5 Trò chơi trải nghiệm đầu tư nhỏ

Tiền ảo cho thấy biến động và kết quả dài hạn. Điểm game không được hiểu thành năng lực đầu tư thật.

## 13. Phát triển nghề nghiệp

### 13.1 Người đồng hành lúc mơ hồ nghề nghiệp

Kinh nghiệm, sở thích, giới hạn và giá trị được sắp thành lựa chọn cùng bước khám phá. Không định một nghề như số phận.

### 13.2 Người đánh thức cảm giác thành tựu công việc

Việc đã xong và ảnh hưởng lên người khác làm đóng góp vô hình hiện rõ. Không đổ môi trường bất hợp lý thành vấn đề thái độ cá nhân.

### 13.3 Trợ lý không khí giao tiếp nơi làm việc

Chuẩn bị chủ đề, lời cảm ơn và ranh giới trước họp. Bí mật công ty và dữ liệu đồng nghiệp không đưa nguyên vào mô hình.

### 13.4 Máy kích thích ý tưởng nghề phụ

Giao kỹ năng, sở thích, thời gian và khách có thể tiếp cận để tạo thử nghiệm nhỏ. Mục tiêu là kiểm chứng trả tiền đầu, không phải giàu nhanh.

### 13.5 Trạm tiếp sức tự tin trước phỏng vấn

Luyện câu theo vị trí và nhắc lại thế mạnh có bằng chứng. Cấu trúc và ví dụ thật quan trọng hơn thuộc đáp án mẫu.

## 14. Không gian nhà

### 14.1 Nhà thiết kế bầu không khí trong nhà

Ảnh phòng, ngân sách và cảm giác tạo gợi ý ánh sáng, bố trí, hành động nhỏ. Nhà thuê ưu tiên thay đổi hoàn tác được.

### 14.2 Hướng dẫn thay đổi nhà theo bốn mùa

Vải, màu, cây và lưu trữ thay đổi từng chút. Đổi chỗ và luân phiên trước mua mới.

### 14.3 Phép thuật cho không gian nhỏ

Đường đi và đồ dùng thường xuyên quyết định lưu trữ, khu đa dụng. Kiểm tra kích thước và lối an toàn.

### 14.4 Người tạo nghi thức trong nhà

Uống trà, dọn, ăn tối được thêm nhạc, ánh sáng và trình tự ngắn. Phải lặp được mà không chuẩn bị nhiều.

### 14.5 Đồng hành tâm lý khi dọn bỏ

Hỏi công dụng, ký ức và chi phí giữ để chọn giữ, chờ hay tặng. Không ép vứt nhanh.

## 15. Ẩm thực và nấu nướng

### 15.1 Bữa một người chữa lành

Nguyên liệu, thời gian và mức có thể rửa tạo một bữa đơn giản. Ăn một mình không bị mô tả là kém giá trị.

### 15.2 Thiết kế không khí bàn ăn ngày lễ

Số người, văn hóa, ngân sách và phòng tạo menu, bố trí, thứ tự chuẩn bị. Hỏi dị ứng và chế độ ăn trước.

### 15.3 Người ghép món với tâm trạng

Ấm, tươi hoặc no nhanh được nối với nguyên liệu và cách làm. Không biến ăn thành cách duy nhất điều chỉnh cảm xúc.

### 15.4 Xây tự tin cho người mới vào bếp

Mỗi lần học một kỹ thuật và công thức khó thất bại. Bước an toàn lửa, dao và vệ sinh phải nổi bật.

### 15.5 Hướng dẫn không khí ảnh món ăn

Ánh sáng cửa sổ, đặt đĩa và góc chụp được nói đơn giản. Thay đổi tổng hợp khác xa món thật cần ghi rõ.

## 16. Trang phục và phong cách

### 16.1 Bảng tâm trạng trang phục hôm nay

Thời tiết, lịch, cảm giác và đồ đang có tạo hai ba tổ hợp. Giá trị đầu là giảm khó chọn, không phải mua mới.

### 16.2 Người phối tủ đồ capsule

Số ít món hay mặc được lập tổ hợp và chu kỳ giặt. Không ép tối giản trái đời sống thật.

### 16.3 Hành trình khám phá phong cách cá nhân

Ảnh đồ thích và cảm giác khi mặc chỉ ra đường, màu, chất liệu lặp. Không chấm hình thể; tìm điều thoải mái, tự tin.

### 16.4 Sáng tạo mặc mới đồ cũ

Lớp, phụ kiện và sửa nhỏ giúp đồ cũ có cách dùng mới. Có thể gợi sửa và dịch vụ địa phương.

### 16.5 Cố vấn tạo hình dịp đặc biệt

Quy tắc sự kiện, đường đi, thời tiết và cách biểu đạt tạo chuẩn bị. Thoải mái thật đứng trước ánh nhìn người khác.

## Nguyên tắc cốt lõi khi thiết kế sản phẩm cá nhân

### 1. Từ chức năng đến cảm giác

Không chỉ viết sản phẩm làm gì; hãy viết cảm xúc nào thay đổi trước và sau. Chức năng là phương tiện, lời hứa cảm xúc cần kết quả thật.

### 2. Ba tầng tạo bầu không khí

Tầng một là màu, âm và chuyển động; tầng hai là giọng cùng nhịp tương tác; tầng ba là ký ức, nghi thức sau dùng. Nhất quán mạnh hơn trang trí.

### 3. Sức mạnh của ám thị tâm lý

Tiến độ, lựa chọn và hoàn thành nhỏ có thể hỗ trợ hành vi. Khan hiếm giả, tội lỗi, sợ hãi và lời hứa quá mức không phải cách hợp lệ.

### 4. Giúp người dùng trở thành phiên bản tốt hơn của mình

Sản phẩm tốt không làm người dùng lệ thuộc mà giúp họ hiểu, chọn và biểu đạt tốt hơn. Quyền sửa, xóa, xuất cùng giới hạn AI phải được thiết kế từ đầu.

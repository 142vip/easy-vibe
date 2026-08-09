---
title: 'Tham chiếu kịch bản ứng dụng AI (B2B & B2C)'
description: 'Tài liệu này tổng hợp các ứng dụng của mô hình LLM trong kịch bản doanh nghiệp B2B và kịch bản tiêu dùng B2C. B2B bao gồm 19 ngành công nghiệp gồm sản xuất, chăm sóc khách hàng, giáo dục, y tế, tài chính; B2C bao gồm 16 kịch bản tiêu dùng gồm lối sống, đồng hành cảm xúc, giải trí, phát triển cá nhân, cung cấp tài liệu tham khảo toàn diện cho nhà phát triển ứng dụng AI.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = 'Khoảng <strong>6 giờ</strong>'

const interestPoint = ref('')
const purpose = ref('')

// Mỗi ngành có một pool chủ đề
const topicPool = {
  'manufacturing': [
    { title: 'Nền tảng thiết kế hỗ trợ AI ngoại hình xe buýt năng lượng mới', desc: 'Thiết kế khái niệm ngoại hình dựa trên mô hình tạo ảnh' },
    { title: 'Trợ lý thiết kế và kiểm tra bản vẽ thông minh', desc: 'Xây dựng kho kiến thức quy tắc thiết kế doanh nghiệp bằng công nghệ RAG' },
    { title: 'Tự động tạo và quản lý tài liệu kỹ thuật', desc: 'Tự động tạo tài liệu quy cách sản phẩm và hướng dẫn sử dụng dựa trên LLM' },
    { title: 'Trợ lý tự động tạo báo cáo kiểm tra thiết bị sản xuất', desc: 'Mô tả tình trạng thiết bị bằng giọng nói, tạo báo cáo kiểm tra có cấu trúc' },
    { title: 'Trợ lý hỏi đáp chẩn đoán lỗi thiết bị công nghiệp', desc: 'Xây dựng kho kiến thức vector dựa trên lịch sử lỗi thiết bị' }
  ],
  'customer-service': [
    { title: 'Hệ thống phản hồi tự động và tạo ticket chăm sóc khách hàng đa kênh', desc: 'Kết nối tin nhắn đa kênh, LLM hiểu ý định và tạo phản hồi' },
    { title: 'Trợ lý khai thác và theo dõi khách hàng tiềm năng', desc: 'Phân tích lịch sử hội thoại, nhận diện khách hàng có ý định cao' },
    { title: 'Trợ lý tìm kiếm và hỏi đáp kiến thức nội bộ doanh nghiệp', desc: 'Xây dựng kho kiến thức vector dựa trên tài liệu nội bộ' },
    { title: 'Công cụ tóm tắt hội thoại CSKH và tạo ticket', desc: 'Tự động tóm tắt hội thoại và trích xuất thông tin quan trọng' },
    { title: 'Hệ thống kho kiến thức kịch bản CSKH xuất sắc', desc: 'Phân tích ca tốt, đúc kết mẫu kịch bản xuất sắc' }
  ],
  'education': [
    { title: 'Hệ thống lập lộ trình học ngôn ngữ cá nhân hóa và hướng dẫn thông minh', desc: 'Đánh giá trình độ người học, lập kế hoạch học tập hàng ngày' },
    { title: 'Nền tảng soạn giáo án tự động và đẩy tài liệu giảng dạy', desc: 'Tạo khung giáo án theo chương trình học' },
    { title: 'Hệ thống chấm bài tự động và chẩn đoán tình hình học tập', desc: 'Tự động chấm câu hỏi tự luận và tạo đề xuất chấm' },
    { title: 'Xây dựng mô hình năng lực vị trí và bản đồ học tập', desc: 'Phân tích JD vị trí, trích xuất yêu cầu năng lực' },
    { title: 'Thực hành giao tiếp ngoại ngữ 1-1 theo tình huống', desc: 'LLM đóng vai trò khác nhau để hội thoại giao tiếp' }
  ],
  'programming': [
    { title: 'Trợ lý gợi ý code thông minh và sửa Bug tự động', desc: 'Plugin IDE gợi ý code theo thời gian thực' },
    { title: 'Nền tảng xây dựng ứng dụng low-code và tự động hóa quy trình', desc: 'Mô tả yêu cầu bằng ngôn ngữ tự nhiên, chuyển đổi thành cấu hình low-code' },
    { title: 'Hệ thống tạo test case đơn vị', desc: 'AST phân tích mã nguồn, tạo test case cho điều kiện biên' },
    { title: 'Công cụ phân tích code thông minh và chuyển đổi ngôn ngữ', desc: 'Phân tích chất lượng code và đưa ra đề xuất tối ưu' },
    { title: 'Công cụ tự động tạo code giao diện (UI) frontend', desc: 'Nhận diện ảnh thiết kế, tạo CSS responsive' }
  ],
  'healthcare': [
    { title: 'Trợ lý giải thích báo cáo xét nghiệm y khoa thông minh', desc: 'OCR nhận diện chỉ số quan trọng, giải thích giá trị bất thường' },
    { title: 'Chuyên gia tư vấn sức khỏe dựa trên công nghệ truy xuất kiến thức', desc: 'Xây dựng biểu đồ kiến thức y khoa, RAG truy xuất và tạo câu trả lời' },
    { title: 'Nền tảng phân tích quyết định dữ liệu nghiên cứu lâm sàng', desc: 'Tích hợp dữ liệu EMR, hỗ trợ tạo code thống kê phân tích' },
    { title: 'Công cụ tự động tạo báo cáo hình ảnh y khoa', desc: 'Mô tả đặc điểm hình ảnh, tự động tạo báo cáo có cấu trúc' },
    { title: 'Trợ lý nhắc thuốc thông minh quản lý bệnh mãn tính', desc: 'Tạo nhắc thuốc cá nhân hóa, hỗ trợ kiểm tra tương tác thuốc' }
  ],
  'security': [
    { title: 'Engine phát hiện và sửa lỗi bảo mật code', desc: 'SAST quét code, phân tích nguyên lý lỗ hổng' },
    { title: 'Hệ thống nhận diện và chặn email phishing do AI tạo', desc: 'Phân tích nội dung email, nhận diện email phishing do AI tạo' },
    { title: 'Trợ lý tự động tạo báo cáo vận hành bảo mật hàng ngày', desc: 'Tổng hợp log, tự động trích xuất sự kiện quan trọng' },
    { title: 'Trợ lý tạo báo cáo kiểm thử xâm nhập thông minh', desc: 'Tự động tạo báo cáo theo mô tả lỗ hổng' },
    { title: 'Trợ lý truy vấn và phân tích thông tin đe dọa thông minh', desc: 'Kết nối đa nguồn thông tin đe dọa, giải thích nội dung' }
  ],
  'finance': [
    { title: 'Trợ lý tạo báo cáo thẩm tín tín dụng thông minh', desc: 'Nhập dữ liệu tài chính, tự động tạo báo cáo thẩm tín' },
    { title: 'Cố vấn quản lý tài sản ngân hàng tư nhân thông minh', desc: 'Phân tích mức độ rủi ro khách hàng, tạo đề xuất phân bổ tài sản' },
    { title: 'Trợ lý tạo và kiểm tra tuân thủ prospectus IPO thông minh', desc: 'Mẫu template theo module, tự động điền mô tả kinh doanh' },
    { title: 'Hệ thống tự động tạo báo cáo tài chính và cảnh báo bất thường kinh doanh', desc: 'Tự động tạo phân tích tài chính và thảo luận ban quản lý' },
    { title: 'Trợ lý luyện tập kịch bản đại lý bảo hiểm thông minh', desc: 'Mô phỏng hội thoại, đánh giá tính tuân thủ và sức thuyết phục' }
  ],
  'enterprise': [
    { title: 'Nền tảng kiểm tra tuân thủ và đề xuất sửa đổi hợp đồng doanh nghiệp toàn vòng đời', desc: 'So sánh điều khoản với cơ sở dữ liệu luật pháp, tạo báo cáo kiểm tra tuân thủ' },
    { title: 'Chuyển đổi giọng nói hội thoại bán hàng và đề xuất kịch bản', desc: 'Chuyển đổi ASR, phân tích hội thoại và đề xuất kịch bản xuất sắc' },
    { title: 'Hệ thống tạo và thiết kế nội dung marketing thông minh', desc: 'Tạo nội dung marketing và trích xuất điểm bán hàng' },
    { title: 'Nền tảng phân tích quảng cáo đối thủ', desc: 'Thu thập quảng cáo đối thủ, phân tích chiến lược' },
    { title: 'Hệ thống phân tích chủ đề nóng toàn mạng và đề xuất nội dung thông minh', desc: 'Phân tích xu hướng chủ đề nóng và đề xuất góc tiếp cận' }
  ],
  'content': [
    { title: 'Nền tảng hỗ trợ sáng tạo nội dung phim ảnh và tiểu thuyết', desc: 'Cung cấp tóm tắt cốt truyện, thiết lập nhân vật, tạo thoại' },
    { title: 'Trợ lý viết câu chuyện thương hiệu và bài PR doanh nghiệp thông minh', desc: 'Nhập từ khóa thương hiệu, tạo nội dung đa phong cách' },
    { title: 'Hệ thống tương tác livestream và quản lý đẩy stream người ảo', desc: 'Hình ảnh người ảo + giọng nói TTS + hội thoại LLM' },
    { title: 'Tạo kịch bản video ngắn và chỉnh sửa thông minh', desc: 'Tạo kịch bản video ngắn và phân cảnh' },
    { title: 'Hệ thống tạo và thiết kế nội dung marketing thông minh', desc: 'Tạo nội dung marketing và trích xuất điểm bán hàng' }
  ],
  'government': [
    { title: 'Hệ thống điều hướng giọng nói thông minh và phân công tự động đường dây nóng 12345', desc: 'Nhận diện giọng nói, hiểu yêu cầu và phân công thông minh' },
    { title: 'Robot hướng dẫn thông minh và hỏi đáp chính sách tại đại dịch vụ hành chính', desc: 'RAG truy xuất kho kiến thức hành chính' },
    { title: 'Nền tảng đối chiếu và đẩy thông minh chính sách hỗ trợ doanh nghiệp', desc: 'Đối chiếu hồ sơ doanh nghiệp với chính sách phù hợp' },
    { title: 'Trợ lý kiểm tra trước và xác nhận tuân thủ tài liệu hành chính thông minh', desc: 'Nhận diện OCR và trích xuất thông tin quan trọng' },
    { title: 'Nền tảng nhận diện sự kiện lưới đô thị thông minh và điều phối quản lý', desc: 'Nhận diện loại sự kiện và phân công' }
  ],
  'legal': [
    { title: 'Agent phát hiện rủi ro hợp đồng một chạm', desc: 'Đối chiếu danh mục rủi ro để nhận diện vấn đề tiềm ẩn' },
    { title: 'Cố vấn đánh giá tỷ lệ thắng kiện AI cho các vụ án tương tự', desc: 'Trích xuất đặc điểm vụ án, tìm kiếm và đối chiếu vụ án tương tự' },
    { title: 'Radar theo dõi thay đổi luật pháp và phân tích tác động kinh doanh', desc: 'Phân tích nội dung thay đổi và đánh giá tác động kinh doanh' },
    { title: 'Công cụ soạn thư luật sư AIGC tự động', desc: 'Nhập trình bày sự kiện, tạo thư luật sư chuẩn mực' },
    { title: 'Plugin giải thích điều khoản pháp luật phức tạp sang ngôn ngữ dễ hiểu', desc: 'Tạo giải thích dễ hiểu' }
  ],
  'travel': [
    { title: 'Trình tạo lịch trình du lịch lười dựa trên AIGC', desc: 'Tạo lịch trình hàng ngày' },
    { title: 'Robot dự đoán xu hướng giá vé máy bay khách sạn toàn mạng và tự động khóa giá rẻ', desc: 'Mô hình ML dự đoán xu hướng giá' },
    { title: 'Hệ thống hỗ trợ kiểm tra trước tài liệu visa và điền form tự động', desc: 'Nhận diện OCR kiểm tra tính đầy đủ thông tin' },
    { title: 'Trợ lý dịch giọng nói thời gian thực và dịch menu thị giác khi du lịch nước ngoài', desc: 'Dịch giọng nói ngoại tuyến, OCR ảnh menu' },
    { title: 'Trợ lý tự động tạo bài du ký và nội dung mạng xã hội từ dấu chân du lịch', desc: 'Trích xuất thông tin ảnh, tạo nội dung bài du ký' }
  ],
  'emotion': [
    { title: 'Người bạn đồng hành ảo 24 giờ dựa trên mô hình LLM', desc: 'Hệ thống ghi nhớ lưu trữ lịch sử hội thoại' },
    { title: 'Cố vấn AI nhận diện cảm xúc đa phương thức và tư vấn tâm lý', desc: 'Phân tích ngữ điệu giọng nói + nhận diện cảm xúc văn bản' },
    { title: 'Người ảo AI huấn luyện nhận thức và kích thích trí nhớ cho người bệnh Alzheimer', desc: 'Huấn luyện trò chơi nhận thức, ảnh cũ kích thích trí nhớ' },
    { title: 'Huấn luyện viên mô phỏng giao tiếp xã hội AIGC cho người hướng nội', desc: 'Mô phỏng tình huống giao tiếp xã hội ảo' },
    { title: 'Trợ lý theo dõi tâm trạng và kích thích cảm xúc tích cực AI toàn thời gian', desc: 'Phân tích xu hướng tâm trạng và tạo nội dung khích lệ' }
  ],
  'entertainment': [
    { title: 'Engine quyết định tự chủ NPC game thế giới mở dựa trên LLM', desc: 'Cây hành vi NPC kết hợp quyết định LLM' },
    { title: 'Công cụ hỗ trợ DM với diễn biến cốt truyện AIGC cho game kịch bản nhập vai', desc: 'Lựa chọn người chơi kích hoạt nhánh cốt truyện' },
    { title: 'Trình sửa đổi kết thúc truyện tương tác dạng sinh', desc: 'Lựa chọn độc giả ảnh hướng đi cốt truyện' },
    { title: 'Phân tích thị giác CV và bình luận viên AI thông minh cho trận đấu e-sports', desc: 'Phân tích thời gian thực màn hình game' },
    { title: 'Hệ thống tự động tạo sách nói TTS đa vai', desc: 'Phân vai văn bản, tạo giọng nói cá nhân hóa' }
  ],
  'ecommerce': [
    { title: 'Công cụ sản xuất hàng loạt trang chi tiết sản phẩm AIGC tỷ lệ chuyển đổi cao', desc: 'Tạo nội dung điểm bán hàng và mô tả kịch bản' },
    { title: 'Nhà máy tạo video người mẫu ảo thử đồ AI cho ngành may mặc', desc: 'Tạo hiệu ứng thử đồ người mẫu ảo' },
    { title: 'Trợ lý dịch thuật và biên tập bản địa hóa đa ngôn ngữ LLM cho thương mại điện tử xuyên biên giới', desc: 'Dịch mô tả sản phẩm đa ngôn ngữ' },
    { title: 'Hệ thống livestream bán hàng người ảo AIGC toàn thời gian 24 giờ', desc: 'Hình ảnh người ảo + tạo kịch bản thời gian thực' },
    { title: 'Engine dự đoán xu hướng thị trường AI và dự đoán sản phẩm hot', desc: 'Phát hiện xu hướng hot, đề xuất lựa chọn sản phẩm' }
  ],
  'energy': [
    { title: 'Cố vấn phân tích hành vi tiêu điện gia đình và chiến lược tiết kiệm năng lượng AI', desc: 'Phân tích mô hình tiêu điện, tạo đề xuất tiết kiệm' },
    { title: 'Hệ thống nhận diện thị giác CV drone phát hiện lỗi linh kiện quang điện', desc: 'Drone kiểm tra chụp ảnh, phân tích ảnh nhiệt hồng ngoại' },
    { title: 'Agent dự đoán xu hướng giá giao dịch điện thời gian thực AI và chiến lược sinh lời tự động', desc: 'Mô hình dự đoán giá, tạo chiến lược' },
    { title: 'Trợ lý tự động tính toán phát thải carbon toàn chuỗi doanh nghiệp và tạo báo cáo ESG AI', desc: 'Tính toán hệ số phát thải carbon, tạo báo cáo ESG' },
    { title: 'Hệ thống dự đoán phụ tải AI thời tiết cực đoan và chỉ huy điều phối khẩn cấp lưới điện', desc: 'Mô hình dự đoán phụ tải, tạo chiến lược điều phối' }
  ],
  'av-media': [
    { title: 'Công cụ nhận diện đoạn hay AI và tự động cắt video ngắn từ video dài', desc: 'Phân tích nội dung video, nhận diện khung hình quan trọng' },
    { title: 'Trợ lý tách tiếng ồn nền AI và tăng cường giọng nói video', desc: 'Mô hình tách âm thanh, loại bỏ tiếng ồn nền' },
    { title: 'Bàn làm việc phục hồi siêu phân giải 4K và tự động tô màu AI cho video cũ', desc: 'Mô hình siêu phân giải video, tự động tô màu AI' },
    { title: 'Hệ thống kiểm soát cảm xúc và lồng tiếng TTS chuyển văn bản thành giọng người thật', desc: 'Mô hình TTS đa giọng, kiểm soát cảm xúc' },
    { title: 'Trợ lý chuyển đổi giọng nói thông minh và trích xuất việc cần làm từ ghi âm cuộc họp AI', desc: 'Tách và chuyển đổi giọng nói cuộc họp nhiều người' }
  ],
  'ai-marketing': [
    { title: 'Engine AIGC tự động viết nội dung viral trên Xiaohongshu', desc: 'Tạo nội dung review sản phẩm, tối ưu emoji' },
    { title: 'Công cụ bố trí AI poster marketing và thích ứng đa kích thước', desc: 'Khớp mẫu template poster thông minh' },
    { title: 'Nền tảng tạo sáng tạo LOGO thương hiệu AIGC và xây dựng hệ thống VI', desc: 'Tạo sáng tạo LOGO, tạo quy phạm VI' },
    { title: 'Trợ lý theo dõi chủ đề nóng AI toàn mạng và tạo sáng tạo marketing', desc: 'Phân tích góc marketing, tạo đề án sáng tạo' },
    { title: 'Trợ lý tạo sáng tạo kịch bản video ngắn AIGC và hướng dẫn phân cảnh', desc: 'Tạo kịch bản và phân cảnh, đề xuất quay phim' }
  ],
  'data-intelligence': [
    { title: 'Công cụ tự động chuyển đổi ngôn ngữ tự nhiên thành câu lệnh SQL', desc: 'Chuyển đổi truy vấn ngôn ngữ tự nhiên thành SQL' },
    { title: 'Hệ thống kiểm kê và phân loại tài sản dữ liệu doanh nghiệp thông minh', desc: 'Thu thập metadata, phân loại tự động' },
    { title: 'Engine phát hiện bất thường chất lượng dữ liệu và đề xuất sửa chữa tự động', desc: 'Engine quy tắc + mô hình ML phát hiện bất thường' },
    { title: 'Trợ lý tạo báo cáo thông minh và cấu hình trực quan hóa', desc: 'Tạo cấu hình báo cáo theo kiểu hội thoại' },
    { title: 'Trợ lý hỏi đáp về chỉ tiêu dữ liệu thông minh', desc: 'Xây dựng kho kiến thức dựa trên tài liệu định nghĩa chỉ tiêu' }
  ]
}

// Bảng ánh xạ đường dẫn khuyến nghị được xác định trước
const recommendationMap = {
  // Điểm quan tâm: Sáng tạo nội dung
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  // Điểm quan tâm: Dịch vụ kỹ thuật
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  // Điểm quan tâm: Trí tuệ dữ liệu
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  // Điểm quan tâm: Dịch vụ người dùng
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  // Điểm quan tâm: Giải pháp ngành
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: 'Sáng tạo nội dung', value: 'creative-content', desc: 'Nội dung sáng tạo như văn bản, hình ảnh, video' },
  { label: 'Công cụ dịch vụ kỹ thuật', value: 'tech-service', desc: 'Công cụ phát triển, tự động hóa, hỗ trợ code' },
  { label: 'Phân tích trí tuệ dữ liệu', value: 'data-intel', desc: 'Phân tích dữ liệu, dự đoán, quyết định thông minh' },
  { label: 'Trải nghiệm dịch vụ người dùng', value: 'user-service', desc: 'Chăm sóc khách hàng, marketing, trải nghiệm người dùng' },
  { label: 'Giải pháp ngành', value: 'industry-solution', desc: 'Ứng dụng chuyên sâu trong ngành cụ thể' }
]

const purposeOptions = [
  { label: 'Tăng hiệu suất', value: 'increase-efficiency', desc: 'Tự động hóa, tăng tốc quy trình' },
  { label: 'Giảm chi phí', value: 'reduce-cost', desc: 'Giảm nhân lực, tối ưu nguồn lực' },
  { label: 'Cải thiện trải nghiệm', value: 'improve-experience', desc: 'Mức độ hài lòng người dùng, chất lượng dịch vụ' },
  { label: 'Đổi mới kinh doanh', value: 'innovate-business', desc: 'Sản phẩm mới, mô hình mới' }
]

const industries = [
  { key: 'manufacturing', name: 'Sản xuất công nghiệp', anchor: '#_1-san-xuat-cong-nghiep' },
  { key: 'customer-service', name: 'Chăm sóc khách hàng thông minh', anchor: '#_2-cham-soc-khach-hang-thong-minh' },
  { key: 'education', name: 'Ngành giáo dục', anchor: '#_3-nganh-giao-duc' },
  { key: 'programming', name: 'Lập trình thông minh', anchor: '#_4-lap-trinh-thong-minh' },
  { key: 'healthcare', name: 'Y tế', anchor: '#_5-y-te' },
  { key: 'security', name: 'An ninh mạng', anchor: '#_6-an-ninh-mang' },
  { key: 'finance', name: 'Quản lý tài chính, ngân hàng bảo hiểm', anchor: '#_7-quan-ly-tai-chinh-ngan-hang-bao-hiem' },
  { key: 'enterprise', name: 'Dịch vụ doanh nghiệp', anchor: '#_8-dich-vu-doanh-nghiep' },
  { key: 'content', name: 'Sản xuất và vận hành nội dung', anchor: '#_9-san-xuat-va-van-hanh-noi-dung' },
  { key: 'government', name: 'Quản trị hành chính thông minh', anchor: '#_10-quan-tri-hanh-chinh-thong-minh' },
  { key: 'legal', name: 'Pháp lý và quản lý hợp đồng', anchor: '#_11-phap-ly-va-quan-ly-hop-dong' },
  { key: 'travel', name: 'Du lịch và dịch vụ đi lại', anchor: '#_12-du-lich-va-dich-vu-di-lai' },
  { key: 'emotion', name: 'Đồng hành cảm xúc', anchor: '#_13-dong-hanh-cam-xuc' },
  { key: 'entertainment', name: 'Giải trí', anchor: '#_14-giai-tri' },
  { key: 'ecommerce', name: 'Thương mại điện tử', anchor: '#_15-thuong-mai-dien-tu' },
  { key: 'energy', name: 'Năng lượng', anchor: '#_16-nang-luong' },
  { key: 'av-media', name: 'Âm thanh và video', anchor: '#_17-am-thanh-va-video' },
  { key: 'ai-marketing', name: 'Marketing AI', anchor: '#_18-marketing-ai' },
  { key: 'data-intelligence', name: 'Trí tuệ dữ liệu', anchor: '#_19-tri-tue-du-lieu' }
]

// Tính kết quả khuyến nghị - lấy ngẫu nhiên từ pool chủ đề
const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []

  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []

  // Lấy ngẫu nhiên 1-2 chủ đề từ mỗi ngành được khuyến nghị
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []

    if (industry && industryTopics.length > 0) {
      // Lấy ngẫu nhiên 1-2 chủ đề
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...industryTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))

      selected.forEach(topic => {
        topics.push({
          ...topic,
          industryKey: key,
          industryName: industry.name,
          industryAnchor: industry.anchor
        })
      })
    }
  })

  // Sắp xếp ngẫu nhiên và giới hạn tổng số
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Lấy mô tả lựa chọn hiện tại
const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  // Trì hoãn cuộn để đảm bảo DOM đã cập nhật
  setTimeout(() => {
    // Thử tìm theo ID (hỗ trợ nhiều định dạng)
    let element = document.querySelector(anchor)

    // Nếu không tìm thấy, thử các định dạng ID khác
    if (!element) {
      // Thử bỏ tiền tố gạch dưới
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }

    // Nếu vẫn không tìm thấy, tìm theo văn bản tiêu đề
    if (!element) {
      // Trích xuất tên ngành từ anchor
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')

      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Khớp hoàn toàn hoặc khớp chứa
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Highlight đoạn mục tiêu
      element.style.backgroundColor = '#f0f9ff'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const resetSelection = () => {
  interestPoint.value = ''
  purpose.value = ''
}

// ---- C 端场景变量 ----
const cDuration = 'khoảng <strong>4 giờ</strong>'

const vibePoint = ref('')
const feeling = ref('')

// Nhóm chủ đề theo từng kịch bản: nhấn mạnh cảm giác, bầu không khí và gợi ý tâm lý
const cTopicPool = {
  'lifestyle': [
    { title: 'Trợ lý đánh thức bằng nghi thức buổi sáng', desc: 'Tạo nghi thức buổi sáng riêng theo thời tiết, lịch trình và tâm trạng để mỗi ngày bắt đầu thật đẹp' },
    { title: 'Nhà thiết kế bầu không khí cho người sống một mình', desc: 'Thiết kế không gian sống cho người ở một mình với gợi ý phối hợp ánh sáng, âm nhạc và hương thơm' },
    { title: 'Trình tạo kế hoạch chữa lành cuối tuần ở nhà', desc: 'Đề xuất combo ở nhà hoàn hảo theo tâm trạng: phim + đồ ăn vặt + bố trí không gian' },
    { title: 'Đài phát thanh an ủi tâm hồn trước khi ngủ', desc: 'Tạo câu chuyện dịu dàng và hướng dẫn thiền như một đài riêng đồng hành vào giấc ngủ' },
    { title: 'Bộ bắt cảm hứng thẩm mỹ đời sống', desc: 'Tìm cái đẹp trong những việc nhỏ hằng ngày, tạo gợi ý thẩm mỹ và hướng dẫn nghi thức sống' }
  ],
  'emotion': [
    { title: 'Người lắng nghe tâm sự đêm khuya', desc: 'Một nơi tiếp nhận cảm xúc trực tuyến 24 giờ, không phán xét mọi điều trong lòng' },
    { title: 'Người đồng hành chữa lành sau chia tay', desc: 'Cung cấp sự đồng hành dịu dàng, gợi ý hồi phục và lối thoát cảm xúc trong giai đoạn thấp điểm sau chia tay' },
    { title: 'Huấn luyện viên thở giảm lo âu', desc: 'Nhận biết cảm xúc lo âu, hướng dẫn bài tập thở và thiền chánh niệm' },
    { title: 'Cố vấn xây dựng lại tự tin', desc: 'Giúp xây dựng lại nhận thức về bản thân và cảm giác giá trị qua đối thoại tích cực và gợi ý tâm lý' },
    { title: 'Diễn giải thông minh nhật ký cảm xúc', desc: 'Phân tích nhật ký cảm xúc, phát hiện quy luật tâm trạng và đưa ra góc nhìn, lời khuyên ấm áp' }
  ],
  'entertainment': [
    { title: 'DM nhập vai cho trò chơi suy luận', desc: 'Đóng vai người dẫn trò, tạo bầu không khí hồi hộp và thúc đẩy cốt truyện' },
    { title: 'NPC có linh hồn trong game thế giới mở', desc: 'NPC có cá tính, nhớ câu chuyện của người chơi và tạo liên kết cảm xúc thật' },
    { title: 'Tạo nội dung podcast cá nhân hóa', desc: 'Tạo podcast riêng theo sở thích, tự nhiên như trò chuyện với bạn bè' },
    { title: 'Nhóm tạo không khí cho concert ảo', desc: 'Tạo cảm giác hiện trường cho concert online với tương tác, cổ vũ và hiệu ứng không khí thời gian thực' },
    { title: 'Bạn đồng sáng tạo tiểu thuyết tương tác', desc: 'Cùng độc giả sáng tác câu chuyện, mỗi lựa chọn đều ảnh hưởng đến hướng đi của thế giới' }
  ],
  'growth': [
    { title: 'Người chứng kiến phát triển cá nhân', desc: 'Ghi lại hành trình trưởng thành, khích lệ và nhìn lại ở các mốc quan trọng' },
    { title: 'Huấn luyện viên game hóa thói quen', desc: 'Biến quá trình xây dựng thói quen nhàm chán thành một trò phiêu lưu thú vị' },
    { title: 'Ghép đôi bạn học kỹ năng', desc: 'Tìm bạn học cùng chí hướng để cùng giám sát và chia sẻ tiến bộ' },
    { title: 'Người phát hiện niềm vui nhỏ mỗi ngày', desc: 'Giúp nhận ra những điều nhỏ đẹp trong đời sống, nuôi dưỡng lòng biết ơn và thái độ tích cực' },
    { title: 'Trình mô phỏng trải nghiệm cuộc đời', desc: 'Mô phỏng các lựa chọn cuộc đời khác nhau và trải nghiệm khả năng khác trong dòng thời gian song song' }
  ],
  'social': [
    { title: 'Trình tạo chủ đề phá băng', desc: 'Cung cấp chủ đề thú vị trong bối cảnh xã hội để giảm ngượng và kéo gần khoảng cách' },
    { title: 'Người viết caption mạng xã hội có không khí', desc: 'Tạo caption có phong cách theo ảnh và tâm trạng' },
    { title: 'Nhà hoạch định không khí hẹn hò', desc: 'Thiết kế trọn vẹn không khí cho buổi hẹn, từ địa điểm đến chủ đề và bất ngờ' },
    { title: 'Người khuấy động họp mặt từ xa', desc: 'Làm không khí họp mặt online sôi nổi bằng trò chơi và hướng dẫn tương tác' },
    { title: 'Trợ lý quản lý năng lượng xã hội', desc: 'Giúp người hướng nội quản lý năng lượng xã hội và tìm nhịp giao tiếp thoải mái' }
  ],
  'creative': [
    { title: 'Bộ sơ cứu khi cạn cảm hứng', desc: 'Cung cấp tia lửa bất ngờ khi gặp nút thắt sáng tạo' },
    { title: 'Hướng dẫn khám phá phong cách cá nhân', desc: 'Giúp phát hiện phong cách riêng, từ ăn mặc đến biểu đạt' },
    { title: 'Cố vấn thẩm mỹ cho sổ tay và nhật ký', desc: 'Gợi ý bố cục, phối màu và ý tưởng nội dung cho journaling' },
    { title: 'Hướng dẫn bố cục và không khí nhiếp ảnh', desc: 'Đưa ra gợi ý chụp ảnh và chỉnh ảnh theo cảnh và cảm giác mong muốn' },
    { title: 'Người ghép nhạc theo tâm trạng', desc: 'Đề xuất tổ hợp âm nhạc hoàn hảo theo tâm trạng và bối cảnh hiện tại' }
  ],
  'travel': [
    { title: 'Hướng dẫn dạo phố khám phá', desc: 'Khám phá thành phố như người địa phương và tìm những địa điểm ẩn thú vị' },
    { title: 'Tạo nhật ký tâm trạng du lịch', desc: 'Chuyển ảnh và cảm xúc du lịch thành bài ký và ký ức đẹp' },
    { title: 'Trợ lý đồng hành khi du lịch một mình', desc: 'Cung cấp đồng hành, lời khuyên và cảm giác an toàn cho người đi du lịch một mình' },
    { title: 'Xem trước bầu không khí điểm đến', desc: 'Trải nghiệm nhập vai không khí điểm đến trước khi khởi hành' },
    { title: 'Hướng dẫn không khí nhiếp ảnh du lịch', desc: 'Hướng dẫn chụp ảnh du lịch có câu chuyện theo cảnh và ánh sáng' }
  ],
  'health': [
    { title: 'Người đánh thức động lực vận động', desc: 'Đưa ra lời khích lệ và động lực vừa đủ khi không muốn vận động' },
    { title: 'Căn bếp cảm hứng ăn uống lành mạnh', desc: 'Tạo công thức lành mạnh và chữa lành theo tâm trạng và nguyên liệu' },
    { title: 'Nhà tối ưu không khí chất lượng giấc ngủ', desc: 'Tạo bầu không khí ngủ tốt toàn diện từ môi trường đến tâm lý' },
    { title: 'Người hướng dẫn cảm nhận cơ thể', desc: 'Dẫn dắt chú ý tới tín hiệu cơ thể và xây dựng kết nối thân tâm' },
    { title: 'Trợ lý nhắc tự chăm sóc', desc: 'Nhắc bạn dừng lại và chăm sóc bản thân trong lúc bận rộn' }
  ],
  'learning': [
    { title: 'Hướng dẫn khám phá tri thức dạng game', desc: 'Biến việc học kiến thức khô khan thành cuộc phiêu lưu khám phá thú vị' },
    { title: 'Bạn đồng hành học ngôn ngữ theo tình huống', desc: 'Đóng vai nhiều nhân vật để tiếp thu ngôn ngữ tự nhiên qua hội thoại tình huống' },
    { title: 'Trợ lý thỏa mãn tò mò', desc: 'Trả lời những ý nghĩ kỳ lạ và nuôi dưỡng tò mò về thế giới' },
    { title: 'Kích hoạt cảm hứng ghi chú đọc sách', desc: 'Giúp sắp xếp cảm nhận đọc sách và tìm góc suy nghĩ mới' },
    { title: 'Tạo không khí chia sẻ kiến thức', desc: 'Chuyển kiến thức đã học thành nội dung chia sẻ thú vị' }
  ],
  'relationship': [
    { title: 'Huấn luyện viên giao tiếp trong quan hệ thân mật', desc: 'Giúp bày tỏ cảm xúc khó nói và cải thiện quan hệ thân mật' },
    { title: 'Trợ lý nhắc quan tâm gia đình', desc: 'Nhắc bạn quan tâm gia đình và gợi ý tương tác ấm áp' },
    { title: 'Người tạo không khí duy trì tình bạn', desc: 'Giúp duy trì tình bạn xa cách và tạo chủ đề chung' },
    { title: 'Nhà hoạch định tỏ tình và bất ngờ', desc: 'Lên kế hoạch cho bất ngờ và khoảnh khắc lãng mạn khó quên dành cho người quan trọng' },
    { title: 'Hướng dẫn làm dịu xung đột', desc: 'Đưa ra lời khuyên và câu nói làm dịu không khí khi quan hệ căng thẳng' }
  ],
  'pet': [
    { title: 'Nhật ký nhân hóa thú cưng', desc: 'Tạo nhật ký từ góc nhìn thú cưng, ghi lại đời sống ấm áp với chủ' },
    { title: 'Người giải mã hành vi thú cưng', desc: 'Diễn giải ngôn ngữ hành vi của thú cưng, tăng kết nối với thú cưng' },
    { title: 'Nhà hoạch định thời gian bên thú cưng', desc: 'Thiết kế hoạt động sáng tạo tương tác với thú cưng để tăng gắn bó' },
    { title: 'Tạo câu chuyện kỷ niệm thú cưng', desc: 'Chuyển ảnh và ký ức về thú cưng thành câu chuyện ấm áp' },
    { title: 'Hướng dẫn yên tâm cho người mới nuôi thú cưng', desc: 'Cung cấp đồng hành và hướng dẫn ấm áp cho người mới nuôi thú cưng' }
  ],
  'finance': [
    { title: 'Trợ lý nhận biết cảm xúc tiêu dùng', desc: 'Nhận ra cảm xúc phía sau mua sắm bốc đồng và xây dựng quan điểm tiêu dùng lành mạnh' },
    { title: 'Động lực trực quan hóa mục tiêu tiết kiệm', desc: 'Chuyển mục tiêu tiết kiệm thành tiến độ giấc mơ có thể nhìn thấy' },
    { title: 'Học tài chính cá nhân nhẹ nhàng', desc: 'Học kiến thức tài chính bằng cách nhẹ nhàng và thú vị' },
    { title: 'Người làm dịu lo âu tài chính', desc: 'Cung cấp hỗ trợ cảm xúc và lời khuyên thực tế khi đối mặt áp lực tài chính' },
    { title: 'Trò chơi trải nghiệm đầu tư nhỏ', desc: 'Trải nghiệm đầu tư theo cách game hóa, giảm rào cản nhập môn' }
  ],
  'career': [
    { title: 'Người đồng hành khi mơ hồ nghề nghiệp', desc: 'Lắng nghe, cùng khám phá và gợi ý hướng đi trong giai đoạn mơ hồ nghề nghiệp' },
    { title: 'Người đánh thức cảm giác thành tựu trong công việc', desc: 'Giúp phát hiện giá trị và ý nghĩa trong công việc, thắp lại nhiệt huyết' },
    { title: 'Trợ lý không khí xã giao nơi làm việc', desc: 'Cung cấp chủ đề nhẹ nhàng và gợi ý tương tác cho giao tiếp công sở' },
    { title: 'Bộ kích hoạt cảm hứng nghề phụ', desc: 'Kích hoạt ý tưởng nghề phụ theo sở thích và kỹ năng cá nhân' },
    { title: 'Trạm tiếp sức tự tin trước phỏng vấn', desc: 'Cung cấp chuẩn bị tâm lý và khích lệ tự tin trước phỏng vấn' }
  ],
  'home': [
    { title: 'Nhà thiết kế không khí không gian nhà ở', desc: 'Thiết kế bầu không khí nhà ở theo tâm trạng và mùa' },
    { title: 'Hướng dẫn thay đổi nhà cửa bốn mùa', desc: 'Thay đổi bố trí nhà theo mùa để giữ cảm giác mới mẻ' },
    { title: 'Phép màu cho căn hộ nhỏ', desc: 'Làm cho không gian nhỏ cũng có bầu không khí thoải mái và ấm áp' },
    { title: 'Người tạo nghi thức trong nhà', desc: 'Tạo cảm giác nghi thức cho hoạt động hằng ngày tại nhà' },
    { title: 'Đồng hành tâm lý khi declutter', desc: 'Cung cấp hỗ trợ tâm lý và gợi ý quyết định khi sắp xếp đồ đạc' }
  ],
  'food': [
    { title: 'Món ăn chữa lành cho một người', desc: 'Thiết kế món ăn đơn giản và chữa lành cho người sống một mình' },
    { title: 'Thiết kế không khí bàn ăn ngày lễ', desc: 'Thiết kế bố trí bàn ăn có nghi thức cho những ngày đặc biệt' },
    { title: 'Người ghép món ăn theo tâm trạng', desc: 'Đề xuất món ăn và cách nấu phù hợp theo tâm trạng hiện tại' },
    { title: 'Xây dựng tự tin cho người mới vào bếp', desc: 'Cung cấp khích lệ ấm áp và công thức đơn giản cho người bắt đầu từ con số không' },
    { title: 'Hướng dẫn không khí chụp ảnh món ăn', desc: 'Giúp món ăn gia đình cũng có thể được chụp thật hấp dẫn' }
  ],
  'fashion': [
    { title: 'Moodboard trang phục hôm nay', desc: 'Tạo cảm hứng phối đồ theo thời tiết, dịp và tâm trạng' },
    { title: 'Stylist tủ đồ capsule', desc: 'Tạo vô số khả năng phối đồ từ số lượng món đồ hữu hạn' },
    { title: 'Hành trình khám phá phong cách cá nhân', desc: 'Giúp phát hiện và xây dựng phong cách cá nhân độc đáo' },
    { title: 'Nhà sáng tạo phối mới đồ cũ', desc: 'Cung cấp cảm hứng phối đồ mới cho quần áo cũ' },
    { title: 'Cố vấn tạo hình dịp đặc biệt', desc: 'Thiết kế diện mạo giúp tự tin cho dịp quan trọng' }
  ]
}

// Bảng ánh xạ đề xuất định sẵn dựa trên bầu không khí và cảm giác
const cRecommendationMap = {
  // Bầu không khí: chữa lành
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: phát triển
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: xã hội
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // Bầu không khí: khám phá
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // Bầu không khí: đời thường
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: 'Chữa lành', value: 'healing', desc: 'Ấm áp, xoa dịu, hồi phục' },
  { label: 'Phát triển', value: 'growth', desc: 'Tiến bộ, đột phá, chuyển hóa' },
  { label: 'Xã hội', value: 'social', desc: 'Kết nối, chia sẻ, tương tác' },
  { label: 'Khám phá', value: 'explore', desc: 'Tò mò, phiêu lưu, phát hiện' },
  { label: 'Đời thường', value: 'daily', desc: 'Bình dị, chân thật, hiện tại' }
]

const feelingOptions = [
  { label: 'Muốn thư giãn', value: 'relax', desc: 'Giảm áp lực, thả lỏng bản thân' },
  { label: 'Tìm cảm hứng', value: 'inspire', desc: 'Kích hoạt sáng tạo, nhận gợi mở' },
  { label: 'Khao khát kết nối', value: 'connect', desc: 'Kết nối với con người, cộng hưởng cảm xúc' },
  { label: 'Tạm thời thoát ra', value: 'escape', desc: 'Rời thực tại, trải nghiệm nhập vai' }
]

const scenarios = [
  { key: 'lifestyle', name: 'Lối sống', anchor: '#_1-lối-sống' },
  { key: 'emotion', name: 'Đồng hành cảm xúc', anchor: '#_2-đồng-hành-cảm-xúc' },
  { key: 'entertainment', name: 'Giải trí thư giãn', anchor: '#_3-giải-trí-thư-giãn' },
  { key: 'growth', name: 'Phát triển cá nhân', anchor: '#_4-phát-triển-cá-nhân' },
  { key: 'social', name: 'Tương tác xã hội', anchor: '#_5-tương-tác-xã-hội' },
  { key: 'creative', name: 'Biểu đạt sáng tạo', anchor: '#_6-biểu-đạt-sáng-tạo' },
  { key: 'travel', name: 'Khám phá du lịch', anchor: '#_7-khám-phá-du-lịch' },
  { key: 'health', name: 'Sức khỏe thân tâm', anchor: '#_8-sức-khỏe-thân-tâm' },
  { key: 'learning', name: 'Khám phá tri thức', anchor: '#_9-khám-phá-tri-thức' },
  { key: 'relationship', name: 'Nuôi dưỡng quan hệ', anchor: '#_10-nuôi-dưỡng-quan-hệ' },
  { key: 'pet', name: 'Đồng hành thú cưng', anchor: '#_11-đồng-hành-thú-cưng' },
  { key: 'finance', name: 'Sức khỏe tài chính', anchor: '#_12-sức-khỏe-tài-chính' },
  { key: 'career', name: 'Phát triển nghề nghiệp', anchor: '#_13-phát-triển-nghề-nghiệp' },
  { key: 'home', name: 'Không gian nhà ở', anchor: '#_14-không-gian-nhà-ở' },
  { key: 'food', name: 'Ẩm thực nấu nướng', anchor: '#_15-ẩm-thực-nấu-nướng' },
  { key: 'fashion', name: 'Phong cách ăn mặc', anchor: '#_16-phong-cách-ăn-mặc' }
]

// Tính kết quả đề xuất: lấy ngẫu nhiên từ nhóm chủ đề
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // Lấy ngẫu nhiên 1-2 chủ đề từ mỗi kịch bản được đề xuất
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // Lấy ngẫu nhiên 1-2 chủ đề
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...scenarioTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          scenarioKey: key,
          scenarioName: scenario.name,
          scenarioAnchor: scenario.anchor
        })
      })
    }
  })
  
  // Sắp xếp ngẫu nhiên và giới hạn tổng số
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// Lấy mô tả của lựa chọn hiện tại
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // Trì hoãn cuộn để đảm bảo DOM đã cập nhật
  setTimeout(() => {
    // Thử tìm bằng ID (hỗ trợ nhiều định dạng)
    let element = document.querySelector(anchor)
    
    // Nếu không tìm thấy, thử định dạng ID khác
    if (!element) {
      // Thử bỏ tiền tố gạch dưới
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // Nếu vẫn không tìm thấy, tìm theo văn bản tiêu đề
    if (!element) {
      // Trích tên kịch bản từ anchor
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // Khớp chính xác hoặc khớp bao gồm
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Làm nổi bật đoạn mục tiêu
      element.style.backgroundColor = '#fdf2f8'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const cResetSelection = () => {
  vibePoint.value = ''
  feeling.value = ''
}
</script>

# Tham chiếu kịch bản ứng dụng AI (B2B & B2C)

<Tabs>
<TabItem label="B2B Công nghiệp">

## Đọc chương

<ChapterIntroduction :duration="duration" :tags="['Ứng dụng B2B', 'Ứng dụng ngành', 'Kịch bản AI', 'Tham chiếu triển khai', 'Giải pháp ngành']" coreOutput="Hiểu 15+ kịch bản ứng dụng B2B trong các ngành" expectedOutput="Tìm hướng dự án phù hợp với khách hàng doanh nghiệp">

Tài liệu này tổng hợp <strong>các ứng dụng thực tế của mô hình ngôn ngữ lớn (LLM) trong các kịch bản doanh nghiệp B2B</strong>. Khác với B2C tập trung vào trải nghiệm người dùng và cảm xúc, sản phẩm B2B chú trọng hơn vào <strong>giải quyết nhu cầu kinh doanh thực tế, tăng hiệu suất, giảm chi phí</strong>. Mỗi kịch bản đều có <strong>tính khả thi triển khai thực tế</strong>, bao gồm từ <strong>phân tích yêu cầu đến triển khai kỹ thuật</strong>, phù hợp làm tài liệu tham khảo cho nhà phát triển ứng dụng AI hướng tới khách hàng doanh nghiệp.

</ChapterIntroduction>

## Chọn nhanh hướng ngành

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">Tìm kịch bản ứng dụng phù hợp với bạn</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Chọn hướng quan tâm và mục đích bạn muốn đạt được, hệ thống sẽ khuyến nghị các kịch bản ngành liên quan. Nhấp vào thẻ để chuyển đến chương tương ứng.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="Chọn hướng quan tâm" style="width: 100%;">
        <el-option
          v-for="item in interestOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="purpose" placeholder="Chọn mục đích" style="width: 100%;">
        <el-option
          v-for="item in purposeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>

  <!-- Hiển thị kết quả khuyến nghị - dạng bảng -->
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      Khuyến nghị cho bạn {{ recommendationTopics.length }} kịch bản ứng dụng
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table
      :data="recommendationTopics"
      style="width: 100%; cursor: pointer;"
      @row-click="(row) => scrollToAnchor(row.industryAnchor)"
      highlight-current-row>
      <el-table-column prop="title" label="Kịch bản ứng dụng" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="Ngành" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      Nhấp vào bất kỳ dòng nào trong bảng để chuyển đến chương ngành tương ứng
    </div>
  </div>

  <!-- Thông báo khi chưa chọn đủ -->
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">Vui lòng chọn hướng quan tâm và mục đích</span>
    <span v-else-if="!interestPoint">Vui lòng chọn hướng quan tâm</span>
    <span v-else>Vui lòng chọn mục đích</span>
  </div>

  <!-- Nút đặt lại -->
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">Chọn lại</el-button>
  </div>
</el-card>

## Giới thiệu nhanh về các ngành

### Lựa chọn công nghệ chính

Trong phát triển ứng dụng AI, các hướng công nghệ phổ biến bao gồm:

1. **LLM (Mô hình ngôn ngữ lớn)**: Chuyên xử lý các tác vụ ngôn ngữ tự nhiên như hội thoại, tạo văn bản, tóm tắt, dịch thuật, v.v., phù hợp xây dựng ứng dụng chăm sóc khách hàng thông minh, sáng tạo nội dung, hỏi đáp kiến thức.
2. **VLM (Mô hình ngôn ngữ thị giác)**: Kết hợp khả năng hiểu thị giác và ngôn ngữ, có thể thực hiện mô tả hình ảnh, hỏi đáp thị giác, tạo nội dung đa phương thức, phù hợp với phân tích hình ảnh y tế, kiểm tra chất lượng công nghiệp, thiết kế sáng tạo.
3. **GenAI (AI sinh tạo)**: Bao gồm tạo văn bản, tạo hình ảnh (như Stable Diffusion, DALL-E), tạo video, v.v., có thể tạo nội dung sáng tạo nhanh chóng, phù hợp với hỗ trợ thiết kế, sản xuất tài liệu marketing, đào tạo giáo dục.

### Chiến lược lựa chọn

Người học có thể chọn hướng ứng dụng phù hợp theo các tiêu chí sau:

1. **Theo hướng quan tâm**: Ưu tiên chọn ngành hoặc hướng công nghệ mà mình yêu thích để duy trì động lực học tập. Ví dụ:
   - Quan tâm thiết kế sáng tạo: có thể thử ứng dụng sản xuất nội dung, thiết kế công nghiệp
   - Quan tâm thử thách kỹ thuật: có thể thử ứng dụng an ninh mạng, y tế
   - Quan tâm giá trị xã hội: có thể thử ứng dụng quản trị hành chính, giáo dục

2. **Phù hợp ngành nghề**: Kết hợp bối cảnh ngành nghề hoặc lợi thế tài nguyên của mình để chọn kịch bản:
   - Người làm sản xuất: có thể ưu tiên ứng dụng sản xuất công nghiệp, dịch vụ doanh nghiệp
   - Người làm giáo dục: có thể ưu tiên ứng dụng giáo dục, sản xuất nội dung
   - Người làm y tế: có thể khám phá ứng dụng y tế, quản lý sức khỏe

3. **Mức độ kỹ thuật**: Chọn độ phức tạp phù hợp với nền tảng kỹ thuật của mình:
   - Cấp độ nhập môn: Chăm sóc khách hàng thông minh, sáng tạo nội dung, hệ thống hỏi đáp đơn giản
   - Cấp độ nâng cao: Kiểm tra chất lượng công nghiệp, phân tích hình ảnh y tế, trợ lý code thông minh
   - Cấp độ chuyên nghiệp: Kiểm soát rủi ro tài chính, an ninh mạng, ứng dụng đa phương thức phức tạp

## 1. Sản xuất công nghiệp

Kịch bản sản xuất công nghiệp chủ yếu xoay quanh ba hướng: hỗ trợ thiết kế, tối ưu sản xuất, vận hành thông minh. Các ứng dụng phổ biến bao gồm sử dụng AI hỗ trợ thiết kế ngoại hình sản phẩm, kiểm tra bản vẽ tự động, tạo tài liệu kỹ thuật thông minh, chẩn đoán lỗi thiết bị công nghiệp, v.v., có thể nâng cao đáng kể hiệu suất thiết kế và giảm chi phí vận hành.

| STT | Tên kịch bản ứng dụng                              | Tham khảo triển khai                                                                                                     |
| :--: | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  1   | Nền tảng thiết kế hỗ trợ AI ngoại hình xe buýt năng lượng mới | Thiết kế khái niệm ngoại hình dựa trên mô hình tạo ảnh, kết hợp LLM kiểm tra quy tắc thiết kế và lặp sáng tạo; tích hợp Three.js render 3D |
|  2   | Trợ lý thiết kế và kiểm tra bản vẽ thông minh     | Sử dụng RAG xây dựng kho kiến thức quy tắc thiết kế doanh nghiệp, DALL-E tạo ảnh tham khảo hỗ trợ hiểu; tích hợp CAD API phân tích bản vẽ tự động |
|  3   | Tự động tạo và quản lý tài liệu kỹ thuật          | Dựa trên LLM tự động tạo tài liệu quy cách sản phẩm và hướng dẫn sử dụng từ cơ sở dữ liệu sản phẩm, ChromaDB vector lưu trữ tài liệu lịch sử hỗ trợ tìm kiếm thông minh |
|  4   | Trợ lý tự động tạo báo cáo kiểm tra thiết bị sản xuất | Nhân viên kiểm tra mô tả tình trạng thiết bị bằng giọng nói, LLM tạo báo cáo kiểm tra có cấu trúc; tự động liên kết lịch sử lỗi |
|  5   | Hệ thống điều phối và lập đường dẫn xe nâng thông minh | LLM phân tích nhiệm vụ đơn hàng và vị trí kho, kết hợp bản đồ API tạo phương án điều phối tối ưu |
|  6   | Kho dữ liệu truy xuất thông tin dựa trên LLM      | Sử dụng Text-to-SQL chuyển đổi ngôn ngữ tự nhiên thành truy vấn cơ sở dữ liệu, Superset hiển thị trực quan kết quả; Doris hoặc ClickHouse làm OLAP engine |
|  7   | Trợ lý hỏi đáp chẩn đoán lỗi thiết bị công nghiệp | Xây dựng kho kiến thức vector dựa trên lịch sử lỗi thiết bị, LLM cung cấp đề xuất chẩn đoán và giải pháp theo mô tả lỗi |
|  8   | Tự động tạo báo cáo kiểm tra chất lượng và phân loại lỗi sản xuất | OCR nhận diện lỗi trong ảnh kiểm tra chất lượng, LLM tạo báo cáo kiểm tra chất lượng có cấu trúc; tự động phân loại loại và mức độ nghiêm trọng của lỗi |
|  9   | Trợ lý kiểm kê thông minh và tạo báo cáo kiểm kê   | Nhập dữ liệu kiểm kê, LLM tự động so sánh tồn kho hệ thống và tạo báo cáo chênh lệch; cảnh báo tồn kho bất thường |
|  10  | Hệ thống hỏi đáp đề xuất tối ưu quy trình công nghệ | Xây dựng kho kiến thức RAG dựa trên tài liệu quy trình sản xuất, LLM cung cấp đề xuất tối ưu theo vấn đề sản xuất |

## 2. Chăm sóc khách hàng thông minh

Kịch bản chăm sóc khách hàng thông minh tập trung vào nâng cao hiệu suất dịch vụ khách hàng và tối ưu trải nghiệm người dùng. Các ứng dụng điển hình bao gồm tích hợp chăm sóc khách hàng đa kênh, tạo phản hồi thông minh, phân tích cảm xúc khách hàng, xử lý ticket tự động, v.v., giúp doanh nghiệp cung cấp dịch vụ khách hàng 24/7.

| STT | Tên kịch bản ứng dụng                                   | Tham khảo triển khai                                                                                                                       |
| :--: | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
|  1   | Hệ thống phản hồi tự động và tạo ticket chăm sóc khách hàng đa kênh | Kết nối tin nhắn đa kênh (WeChat, APP, website), LLM hiểu ý định và tạo phản hồi tự động tạo ticket; sử dụng LangChain xây dựng luồng hội thoại, MySQL lưu trữ dữ liệu ticket |
|  2   | Trợ lý khai thác và theo dõi khách hàng tiềm năng     | LLM phân tích lịch sử hội thoại chăm sóc khách hàng, nhận diện đặc điểm khách hàng có ý định cao và chấm điểm; hệ thống đề xuất kết hợp thuật toán lọc cộng tác |
|  3   | Trợ lý tìm kiếm và hỏi đáp kiến thức nội bộ doanh nghiệp | Xây dựng kho kiến thức vector dựa trên Confluence và tài liệu nội bộ, LLM kết hợp RAG tạo câu trả lời |
|  4   | Hệ thống khảo sát hài lòng khách hàng và cải tiến dịch vụ | LLM tự động phân tích nội dung hội thoại chăm sóc khách hàng để phân loại cảm xúc và chấm điểm hài lòng; báo cáo BI hiển thị kết quả phân tích |
|  5   | Công cụ tóm tắt hội thoại CSKH và tạo ticket thông minh | Sau khi kết thúc hội thoại, LLM tự động tóm tắt và trích xuất thông tin quan trọng; tự động điền trường ticket |
|  6   | Trợ lý kiểm tra tuân thủ kịch bản CSKH tự động         | Nhân viên CSKH nhập nội dung phản hồi, LLM kiểm tra tuân thủ kịch bản và từ nhạy cảm theo thời gian thực; đưa ra đề xuất sửa đổi |
|  7   | Công cụ tự động tóm tắt và phân loại ticket CSKH       | LLM tóm tắt và tự động phân loại đánh tag cho lịch sử hội thoại dài; Elasticsearch hỗ trợ tìm kiếm toàn văn ticket |
|  8   | Công cụ theo dõi cảm xúc khách hàng và cảnh báo bất thường | Phân tích đặc điểm ngữ điệu giọng nói và cảm xúc văn bản theo thời gian thực, LLM nhận diện cảm xúc bất thường và kích hoạt cảnh báo; WebSocket đẩy tin cảnh báo |
|  9   | Hệ thống kho kiến thức kịch bản CSKH xuất sắc         | LLM phân tích ca hội thoại chăm sóc khách hàng xuất sắc, đúc kết mẫu kịch bản xuất sắc; hệ thống đề xuất kịch bản theo thời gian thực theo ngữ cảnh hội thoại |
|  10  | Trợ lý phân tích nội dung hội thoại gọi ra và kiểm tra chất lượng thông minh | Sau khi chuyển đổi ghi âm gọi ra, LLM phân tích nội dung hội thoại trích xuất thông tin quan trọng; tự động tạo báo cáo kiểm tra chất lượng và đề xuất cải tiến |

## 3. Ngành giáo dục

Kịch bản ngành giáo dục hướng tới thực hiện dạy học cá nhân hóa và quản lý giáo dục thông minh. Các ứng dụng cốt lõi bao gồm lập lộ trình học tập thông minh, chấm bài tự động, tạo giáo án, phân tích tình hình học tập, v.v., thúc đẩy tối ưu phân bổ nguồn lực giáo dục và thực hiện dạy học theo năng lực.

| STT | Tên kịch bản ứng dụng                                | Tham khảo triển khai                                                                                                     |
| :--: | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  1   | Hệ thống lập lộ trình học ngôn ngữ cá nhân hóa và hướng dẫn thông minh | LLM đánh giá trình độ hiện tại của người học, lập kế hoạch học tập hàng ngày theo mục tiêu học tập; thuật toán đề xuất kết hợp biểu đồ kiến thức đề xuất tài liệu học tập |
|  2   | Nền tảng soạn giáo án tự động và đẩy tài liệu giảng dạy | LLM tạo khung giáo án và thiết kế giảng dạy theo chương trình học; kho vector lưu trữ giáo án và bài giảng chất lượng, hỗ trợ tìm kiếm từ khóa và đề xuất tương tự |
|  3   | Hệ thống chấm bài tự động và chẩn đoán tình hình học tập | LLM tự động chấm câu hỏi tự luận và tạo đề xuất chấm, biểu đồ kiến thức xác định điểm yếu của học sinh |
|  4   | Xây dựng mô hình năng lực vị trí và bản đồ học tập   | LLM phân tích JD vị trí trích xuất yêu cầu năng lực, xây dựng hồ sơ năng lực vị trí; tạo bản đồ học tập cá nhân hóa theo khoảng cách |
|  5   | Công cụ xây dựng hệ thống chương trình học theo trường và làm bài giảng | LLM phân tích đặc điểm trường và nhu cầu học sinh, tạo khung chương trình học theo trường; tích hợp giao diện tạo PPT tự động làm bài giảng |
|  6   | Thực hành giao tiếp ngoại ngữ 1-1 theo tình huống     | LLM đóng vai trò khác nhau để hội thoại giao tiếp, ASR nhận diện phát âm và chấm điểm; TTS tạo mẫu phát âm chuẩn |
|  7   | Nền tảng hướng dẫn kế hoạch nghề nghiệp và đề xuất trường đại học dựa trên dữ liệu lớn | LLM phân tích thông tin điểm số, thứ hạng, sở thích của thí sinh, kết hợp dữ liệu tuyển sinh đề xuất trường và chuyên ngành |
|  8   | Trợ lý code lập trình thiếu nhi                      | LLM giải thích logic code và cung cấp hướng dẫn lập trình, hỗ trợ chuyển đổi giữa ngôn ngữ khối và Python |
|  9   | Công cụ tự động tạo sơ đồ tư duy kiến thức và đề xuất lộ trình học tập | Nhập chủ đề khóa học, LLM tự động tạo sơ đồ tư duy kiến thức; đề xuất nội dung học tiếp theo theo tiến độ học |
|  10  | Engine chấm và sửa bài văn Trung-Anh tự động          | LLM chấm điểm nhiều chiều (ý tưởng, cấu trúc, ngôn ngữ, đa dạng) và tạo chú thích; so sánh với bài văn mẫu xuất sắc |

## 4. Lập trình thông minh

Kịch bản lập trình thông minh nhằm nâng cao hiệu suất phát triển và chất lượng code. Các ứng dụng điển hình bao gồm gợi ý code thông minh, sửa Bug tự động, tạo test tự động, chuyển đổi code, v.v., giúp nhà phát triển tập trung vào logic nghiệp vụ thay vì công việc code lặp lại.

| STT | Tên kịch bản ứng dụng                          | Tham khảo triển khai                                                                                                                     |
| :--: | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
|  1   | Trợ lý gợi ý code thông minh và sửa Bug tự động | Fine-tune mô hình code dựa trên CodeLlama, plugin IDE cung cấp gợi ý code theo thời gian thực; LLM phân tích stack lỗi tự động định vị Bug và tạo code sửa |
|  2   | Nền tảng xây dựng ứng dụng low-code và tự động hóa quy trình | Người dùng mô tả yêu cầu bằng ngôn ngữ tự nhiên, LLM chuyển đổi thành cấu hình low-code hoặc framework code |
|  3   | Hệ thống tạo test case đơn vị                  | AST phân tích mã nguồn trích xuất logic hàm, LLM tạo test case cho điều kiện biên và kịch bản bất thường; tích hợp Jest/Pytest chạy test |
|  4   | Công cụ phân tích code thông minh và chuyển đổi ngôn ngữ | Phân tích cấu trúc code dựa trên Tree-sitter, LLM phân tích chất lượng code và đưa ra đề xuất tối ưu; kết hợp engine quy tắc thực hiện chuyển đổi ngôn ngữ |
|  5   | Công cụ tự động chuyển đổi ngôn ngữ tự nhiên thành câu lệnh SQL | LLM chuyển đổi truy vấn ngôn ngữ tự nhiên thành SQL, hỗ trợ join và aggregate truy vấn đa bảng phức tạp |
|  6   | Nền tảng test API tự động và tạo tài liệu      | LLM phân tích chú thích code và định nghĩa interface, tự động tạo test case và tài liệu API; tích hợp Postman chạy test |
|  7   | Công cụ ghi và duy trì script test UI thông minh | Plugin trình duyệt ghi thao tác người dùng, LLM phân tích ý định thao tác tạo script test; AI sửa locator bị lỗi |
|  8   | Phân tích log hệ thống và định vị lỗi           | ELK Stack thu thập dữ liệu log, LLM phân tích log bất thường trích xuất thông tin quan trọng và định vị nguyên nhân gốc; đề xuất phương án sửa |
|  9   | Công cụ tự động tạo code giao diện (UI) frontend | Ảnh thiết kế nhận diện cấu trúc bố cục qua OCR, LLM tạo CSS responsive và code component; tích hợp TailwindCSS hỗ trợ nhiều framework style |
|  10  | Trợ lý thiết kế và xây dựng cấu trúc cơ sở dữ liệu thông minh | Nhập tài liệu yêu cầu nghiệp vụ cho LLM, tự động tạo ER diagram và cấu trúc bảng dữ liệu; hỗ trợ xuất script tạo bảng MySQL/PostgreSQL |

## 5. Y tế

Kịch bản y tế hướng tới nâng cao hiệu suất chẩn đoán điều trị và chất lượng dịch vụ y tế. Các ứng dụng phổ biến bao gồm tạo bệnh án tự động, hỏi đáp kiến thức y khoa, hỗ trợ phân tích hình ảnh, hỗ trợ nghiên cứu thuốc, v.v., thúc đẩy chuyển đổi số ngành y tế.

| STT | Tên kịch bản ứng dụng                           | Tham khảo triển khai                                                                                                           |
| :--: | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
|  1   | Trợ lý giải thích báo cáo xét nghiệm y khoa thông minh | Tải ảnh báo cáo xét nghiệm, OCR nhận diện chỉ số quan trọng, LLM giải thích giá trị bất thường và tạo giải thích dễ hiểu |
|  2   | Chuyên gia tư vấn sức khỏe dựa trên công nghệ truy xuất kiến thức | Xây dựng biểu đồ kiến thức y khoa (ICD-10, hướng dẫn sử dụng thuốc, hướng dẫn chẩn đoán điều trị), RAG truy xuất tạo câu trả lời |
|  3   | Nền tảng phân tích quyết định dữ liệu nghiên cứu lâm sàng | Tích hợp dữ liệu EMR và kết quả xét nghiệm, LLM hỗ trợ tạo code thống kê phân tích và biểu đồ trực quan; hỗ trợ nghiên cứu đoàn hệ và phân tích sống còn |
|  4   | Hệ thống tạo câu hỏi y khoa thông minh và giải thích câu sai | Nhập chương giáo trình và điểm kiến thức, LLM tạo bài tập và giải thích; tự động thu thập câu sai và tạo phân tích điểm yếu |
|  5   | Chuyên gia hỏi đáp biểu đồ kiến thức toàn quy trình nghiên cứu thuốc | Xây dựng biểu đồ kiến thức thuốc-mục tiêu-bệnh, LLM trả lời câu hỏi nghiên cứu liên quan; hỗ trợ tìm kiếm tài liệu và đề xuất phương án thử nghiệm |
|  6   | Trợ lý hỏi đáp thông minh hướng dẫn sử dụng thuốc | Tải ảnh hướng dẫn sử dụng thuốc hoặc nhập tên thuốc, LLM trả lời các câu hỏi về liều dùng, tác dụng phụ, lưu ý |
|  7   | Trợ lý tạo bài viết phổ biến kiến thức bệnh lý  | Nhập tên bệnh và đối tượng, LLM tạo bài viết phổ biến dễ hiểu; hỗ trợ nhiều phiên bản (phiên bản bệnh nhân/phiên bản người nhà) |
|  8   | Công cụ tự động tạo báo cáo hình ảnh y khoa     | Bác sĩ khoa chẩn đoán hình ảnh mô tả đặc điểm hình ảnh, LLM tự động tạo báo cáo có cấu trúc; hỗ trợ mẫu các loại kiểm tra phổ biến |
|  9   | Trợ lý tạo và lưu trữ hồ sơ phẫu thuật thông minh | Nhập giọng nói các bước quan trọng trong quá trình phẫu thuật, LLM tạo hồ sơ phẫu thuật có cấu trúc; tự động liên kết mã phẫu thuật |
|  10  | Trợ lý nhắc thuốc thông minh quản lý bệnh mãn tính | Bệnh nhân nhập danh sách thuốc, LLM tạo nhắc thuốc cá nhân hóa; hỗ trợ kiểm tra tương tác thuốc và hỏi đáp tương tác |

## 6. An ninh mạng

Kịch bản an ninh mạng tập trung vào bảo vệ an toàn và quản lý rủi ro. Các ứng dụng cốt lõi bao gồm phát hiện lỗ hổng, phân tích thông tin đe dọa, nhận diện email phishing, ứng phó sự kiện an ninh, v.v., xây dựng hệ thống bảo vệ an toàn thông minh toàn diện cho doanh nghiệp.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                                  |
| :--: | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
|  1   | Engine phát hiện và sửa lỗi bảo mật code              | Công cụ phân tích code tĩnh (SAST) quét code, LLM phân tích nguyên lý lỗ hổng và tạo đề xuất sửa; tích hợp pipeline CI/CD |
|  2   | Hệ thống nhận diện và chặn email phishing do AI tạo   | LLM phân tích nội dung email, đặc điểm người gửi và tính an toàn liên kết, nhận diện email phishing do AI tạo; kết nối gateway email chặn theo thời gian thực |
|  3   | Trợ lý tự động tạo báo cáo vận hành an ninh hàng ngày | Tổng hợp log thiết bị an ninh, LLM tự động trích xuất sự kiện quan trọng và tạo báo cáo hàng ngày; đánh dấu highlight sự kiện bất thường |
|  4   | Trợ lý hỏi đáp kho kiến thức an ninh thông minh       | Xây dựng kho kiến thức vector dựa trên tài liệu an ninh, cơ sở dữ liệu CVE, LLM trả lời câu hỏi về kỹ thuật an ninh và đề xuất xử lý |
|  5   | Trợ lý tạo báo cáo kiểm thử xâm nhập thông minh      | Sau khi hoàn thành kiểm thử xâm nhập, LLM tự động tạo báo cáo theo mô tả lỗ hổng; tạo đề xuất sửa lỗi hàng loạt |
|  6   | Bảo vệ mã độc và giám sát tuân thủ quyền riêng tư     | Phân tích hành vi tệp đáng ngờ trong sandbox, LLM nhận diện đặc điểm mã độc và tạo chữ ký; quét nhận diện dữ liệu riêng tư |
|  7   | Công cụ tạo danh sách kiểm tra cấu hình an ninh tuân thủ | Nhập loại hệ thống mục tiêu, LLM tạo danh sách kiểm tra cấu hình an ninh; hỗ trợ các tiêu chuẩn như DJCP 2.0, CIS |
|  8   | Trợ lý truy vấn và phân tích thông tin đe dọa thông minh | Kết nối đa nguồn thông tin đe dọa (mã nguồn mở, thương mại), LLM giải thích thông tin và liên kết tài sản doanh nghiệp; đề xuất chiến lược bảo vệ |
|  9   | Trợ lý tạo báo cáo tổng kết sự kiện an ninh           | Sau khi xảy ra sự kiện an ninh, LLM tự động tạo báo cáo tổng kết theo mốc thời gian; phân tích nguyên nhân gốc và đề xuất cải tiến |
|  10  | Trung tâm theo dõi và cảnh báo thông tin đe dọa toàn cầu | Crawler thu thập tin tức an ninh toàn cầu và công bố lỗ hổng, LLM trích xuất thông tin quan trọng và đánh giá tác động; thông báo cảnh báo qua email/SMS |

## 7. Quản lý tài chính, ngân hàng bảo hiểm

Kịch bản tài chính xoay quanh kiểm soát rủi ro và trí tuệ hóa nghiệp vụ. Các ứng dụng điển hình bao gồm đánh giá rủi ro tín dụng, cố vấn quản lý tài sản, tạo báo cáo tài chính, giám sát chống rửa tiền, v.v., nâng cao hiệu suất vận hành và khả năng kiểm soát rủi ro của tổ chức tài chính.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                                     |
| :--: | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  1   | Trợ lý tạo báo cáo thẩm tín tín dụng thông minh       | Nhập thông tin cơ bản doanh nghiệp và dữ liệu tài chính, LLM tự động tạo báo cáo thẩm tín tín dụng; tự động đánh dấu điểm rủi ro |
|  2   | Cố vấn quản lý tài sản ngân hàng tư nhân thông minh   | LLM phân tích sở thích rủi ro và mục tiêu tài chính của khách hàng, tạo đề xuất phân bổ tài sản; kết nối kho sản phẩm tài chính và quỹ |
|  3   | Trợ lý tạo và kiểm tra tuân thủ prospectus IPO thông minh | Template modular prospectus, LLM tự động điền mô tả kinh doanh và yếu tố rủi ro; engine quy tắc kiểm tra tuân thủ tính nhất quán |
|  4   | Hệ thống tự động tạo báo cáo tài chính và cảnh báo bất thường kinh doanh | Thu thập dữ liệu hệ thống tài chính tự động, LLM tạo phân tích tài chính và phần thảo luận ban quản lý; quy tắc cảnh báo chỉ tiêu bất thường |
|  5   | Trợ lý trích xuất thông tin hóa đơn tài chính và hỏi đáp | Tải ảnh hóa đơn, OCR nhận diện thông tin, LLM trả lời câu hỏi liên quan đến hóa đơn; hỗ trợ hóa đơn VAT, vé tàu, v.v. |
|  6   | Trợ lý tìm kiếm và hỏi đáp ca tuân thủ thông minh     | Xây dựng kho kiến thức dựa trên ca xử phạt giám sát, LLM trả lời câu hỏi tuân thủ và cung cấp tham khảo ca |
|  7   | Trợ lý luyện tập kịch bản đại lý bảo hiểm thông minh  | LLM đóng vai các loại khách hàng khác nhau để hội thoại mô phỏng, đánh giá tính tuân thủ và sức thuyết phục kịch bản đại lý; phân tích chuyển đổi ghi âm |
|  8   | Nền tảng phân tích điều khoản sản phẩm bảo hiểm và so sánh đối thủ | Phân tích cấu trúc điều khoản, LLM tạo tóm tắt điểm nổi bật và lưu ý |
|  9   | Dịch vụ nhận diện cảm xúc kịch bản khách hàng         | Nhận diện cảm xúc giọng nói kết hợp kiểm tra tuân thủ kịch bản, phản hồi theo thời gian thực đề xuất cải tiến cho đại lý |
|  10  | Trợ lý hỏi đáp và truy vấn tiến độ bồi thường bảo hiểm thông minh | Người dùng nhập số hợp đồng bảo hiểm hoặc số báo cáo, LLM truy vấn tiến độ bồi thường và trả lời câu hỏi liên quan đến bồi thường |

## 8. Dịch vụ doanh nghiệp

Kịch bản dịch vụ doanh nghiệp hướng tới nâng cao hiệu suất vận hành tổ chức và mức độ quản lý. Các ứng dụng phổ biến bao gồm quản lý quan hệ khách hàng, dự báo bán hàng, theo dõi dư luận, quản lý nhân sự thông minh, v.v., giúp doanh nghiệp thực hiện chuyển đổi số.

| STT | Tên kịch bản ứng dụng                           | Tham khảo triển khai                                                                                         |
| :--: | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
|  1   | Nền tảng phân tích giữ chân khách hàng và cảnh báo rời đi | Thu thập thao tác người dùng qua tracking hành vi, mô hình ML dự đoán xác suất rời đi, LLM tạo đề xuất giữ chân |
|  2   | Nền tảng tiếp cận và email marketing khách hàng tiềm năng B2B | Lọc khách hàng mục tiêu qua dữ liệu đăng ký doanh nghiệp, LLM tạo nội dung marketing cá nhân hóa; kết nối nền tảng gửi email hàng loạt |
|  3   | Nền tảng theo dõi pipeline bán hàng và dự báo doanh thu | Thu thập dữ liệu CRM tự động, LLM phân tích phễu bán hàng và dự báo hoàn thành doanh thu; cảnh báo bất thường đẩy cho quản lý |
|  4   | Radar theo dõi dư luận thương hiệu và cảnh báo khủng hoảng | Thu thập dữ liệu dư luận toàn mạng (mạng xã hội, tin tức, diễn đàn), LLM phân tích cảm xúc và xu hướng lan truyền; đẩy cảnh báo khủng hoảng |
|  5   | Trợ lý viết email công sở thông minh và quản lý cảm xúc giao tiếp | Hiểu ngữ cảnh email, LLM tạo nháp email chuyên nghiệp; phân tích cảm xúc phản hồi đề xuất cải tiến |
|  6   | Hệ thống phân tích CV và khớp vị trí thông minh   | Phân tích CV PDF trích xuất thông tin quan trọng, LLM khớp vị trí phù hợp và tạo đề xuất phỏng vấn; kết nối hệ thống ATS |
|  7   | Trợ lý hướng dẫn và hỏi đáp nhân viên mới           | RAG truy xuất kho kiến thức tài liệu nhập học, LLM trả lời câu hỏi phổ biến của nhân viên mới |
|  8   | Nền tảng phản hồi hiệu suất nhân viên và quản lý mục tiêu OKR | Thu thập dữ liệu hệ thống OKR, LLM phân tích hoàn thành mục tiêu và tạo đề xuất phản hồi; thu thập phản hồi 360 độ |
|  9   | Ghi chép cuộc họp thông minh và quản lý việc cần làm | Chuyển đổi ghi âm cuộc họp, LLM trích xuất điểm thảo luận quan trọng và việc cần làm; hệ thống task tự động tạo việc cần làm |
|  10  | Nhận diện hóa đơn và xử lý hoàn phí tự động         | OCR nhận diện thông tin hóa đơn, tự động kiểm tra tính xác thực và tuân thủ hoàn phí hóa đơn; kết nối hệ thống tài chính |

## 9. Sản xuất và vận hành nội dung

Kịch bản sản xuất và vận hành nội dung tập trung vào sáng tạo và vận hành lưu lượng. Các ứng dụng cốt lõi bao gồm sáng tạo văn bản, sản xuất video ngắn, livestream người ảo, tối ưu SEO, v.v., giúp doanh nghiệp nâng cao hiệu suất sản xuất nội dung và tỷ lệ chuyển đổi marketing.

| STT | Tên kịch bản ứng dụng                              | Tham khảo triển khai                                                                                               |
| :--: | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
|  1   | Nền tảng hỗ trợ sáng tạo nội dung phim ảnh và tiểu thuyết | LLM cung cấp hỗ trợ sáng tạo như tóm tắt cốt truyện, thiết lập nhân vật, tạo thoại; sơ đồ tư duy trực quan hóa cấu trúc cốt truyện |
|  2   | Trợ lý viết câu chuyện thương hiệu và bài PR doanh nghiệp thông minh | Nhập từ khóa thương hiệu và thông tin sản phẩm, LLM tạo phiên bản nội dung đa phong cách; kết hợp giao diện A/B test |
|  3   | Hệ thống tương tác livestream và quản lý đẩy stream người ảo | Xây dựng hình ảnh người ảo + giọng nói TTS + hội thoại LLM, phản hồi bình luận khán giả theo thời gian thực; tích hợp đẩy stream OBS |
|  4   | Tạo kịch bản video ngắn và chỉnh sửa thông minh    | LLM tạo kịch bản video ngắn và phân cảnh, Sora/Runway tạo đoạn video; công cụ chỉnh sửa tự động ghép nối |
|  5   | Chuyển đổi giọng nói hội thoại bán hàng và đề xuất kịch bản | Ghi âm điện thoại chuyển đổi ASR, LLM phân tích hội thoại và đề xuất kịch bản xuất sắc; tích hợp hệ thống CRM |
|  6   | Hệ thống tạo và thiết kế nội dung marketing thông minh | Nhập thông tin sản phẩm, LLM tạo nội dung marketing và trích xuất điểm bán hàng; tích hợp template Canva/Gianding |
|  7   | Hệ thống giám sát ROI quảng cáo đa nền tảng theo thời gian thực và tối ưu chiến lược | Kết nối API nền tảng quảng cáo thu thập dữ liệu, LLM phân tích hiệu quả chạy quảng cáo và tạo đề xuất tối ưu; đẩy cảnh báo bất thường |
|  8   | Phân tích từ khóa công cụ tìm kiếm và lưu lượng     | Thu thập dữ liệu Baidu Index, 5118, LLM phân tích xu hướng từ khóa và mức độ cạnh tranh; đề xuất chủ đề nội dung |
|  9   | Nền tảng phân tích quảng cáo đối thủ               | Thu thập quảng cáo đối thủ qua API nền tảng dữ liệu bên thứ ba, LLM phân tích chiến lược chạy quảng cáo và đặc điểm sáng tạo |
|  10  | Hệ thống phân tích chủ đề nóng toàn mạng và đề xuất nội dung thông minh | Thu thập dữ liệu top trending Weibo, top trending Douyin, LLM phân tích xu hướng chủ đề nóng và đề xuất góc tiếp cận; lịch nội dung theo dạng lịch |

## 10. Quản trị hành chính thông minh

Kịch bản quản trị hành chính thông minh hướng tới nâng cao hiệu năng dịch vụ chính phủ và năng lực quản trị. Các ứng dụng điển hình bao gồm điều hướng thông minh đường dây nóng chính phủ, hỏi đáp chính sách thông minh, tối ưu phê duyệt hành chính, quản lý sự kiện đô thị, v.v., thúc đẩy xây dựng chính phủ số.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                           |
| :--: | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
|  1   | Hệ thống điều hướng giọng nói thông minh và phân công tự động đường dây nóng 12345 | Nhận diện giọng nói cuộc gọi của công dân, LLM hiểu yêu cầu và phân công thông minh đến bộ phận tương ứng; hệ thống ticket tự động luân chuyển |
|  2   | Robot hướng dẫn thông minh và hỏi đáp chính sách tại đại dịch vụ hành chính | RAG truy xuất kho kiến thức hành chính, LLM trả lời câu hỏi về quy trình thủ tục và chính sách; kết nối hệ thống lấy số |
|  3   | Nền tảng đối chiếu và đẩy thông minh chính sách hỗ trợ doanh nghiệp | Phân tích cấu trúc chính sách, hồ sơ doanh nghiệp tự động đối chiếu chính sách phù hợp; đẩy nhắc nhở qua SMS/email |
|  4   | Trợ lý kiểm tra trước và xác nhận tuân thủ tài liệu phê duyệt hành chính thông minh | Nhận diện OCR tài liệu và trích xuất thông tin quan trọng, LLM kiểm tra tính đầy đủ và tuân thủ tài liệu |
|  5   | Hệ thống phát hiện hành vi bất thường trong camera giám sát an toàn công cộng | Phân tích luồng video theo thời gian thực, mô hình CV phát hiện hành vi bất thường (đánh nhau, té ngã, v.v.); đẩy cảnh báo |
|  6   | Nền tảng nhận diện sự kiện lưới đô thị thông minh và điều phối quản lý | Thu thập dữ liệu cảm biến đô thị (IoT, camera), LLM nhận diện loại sự kiện và phân công |
|  7   | Hệ thống phân tích dữ liệu lớn dư luận xã hội và cảnh báo rủi ro | Phân tích tích hợp đa nguồn dữ liệu (đường dây nóng chính phủ, dư luận mạng, khảo sát xã hội); LLM nhận diện điểm nóng rủi ro |
|  8   | Nền tảng số hóa hồ sơ hành chính và quản lý lưu trữ thông minh | Nhận diện văn bản hồ sơ qua OCR, LLM trích xuất thông tin quan trọng và phân loại tự động; hỗ trợ tìm kiếm toàn văn |
|  9   | Nền tảng chỉ huy ứng phó khẩn cấp và điều phối nguồn lực cứu hộ sự kiện công cộng | Thu thập thông tin sự kiện, LLM tạo phương án ứng phó khẩn cấp; thuật toán tối ưu điều phối nguồn lực |
|  10  | Hệ thống giám sát phân mảnh ô nhiễm môi trường không khí và truy nguồn chính xác | Thu thập dữ liệu cảm biến chất lượng không khí, mô hình CV nhận diện nguồn ô nhiễm; LLM phân tích xu hướng ô nhiễm và truy nguồn |

## 11. Pháp lý và quản lý hợp đồng

Kịch bản pháp lý tập trung vào nâng cao hiệu suất dịch vụ pháp lý và quản lý tuân thủ. Các ứng dụng phổ biến bao gồm kiểm tra hợp đồng, phân tích vụ án, theo dõi luật pháp, tạo văn bản pháp lý, v.v., cung cấp hỗ trợ công cụ thông minh cho người hành nghề pháp lý.

| STT | Tên kịch bản ứng dụng                                             | Tham khảo triển khai                                                                                     |
| :--: | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
|  1   | Agent phát hiện rủi ro hợp đồng một chạm                          | Phân tích cấu trúc văn bản hợp đồng, LLM đối chiếu danh mục rủi ro nhận diện vấn đề tiềm ẩn; đánh dấu điều khoản rủi ro cao |
|  2   | Nền tảng kiểm tra tuân thủ và đề xuất sửa đổi hợp đồng doanh nghiệp toàn vòng đời | So sánh điều khoản hợp đồng với cơ sở dữ liệu luật pháp, LLM tạo báo cáo kiểm tra tuân thủ; theo dõi đề xuất sửa đổi |
|  3   | Cố vấn đánh giá tỷ lệ thắng kiện AI cho các vụ án tương tự       | Trích xuất đặc điểm vụ án, tìm kiếm và đối chiếu vụ án tương tự; LLM phân tích yếu tố ảnh hưởng đến thắng kiện |
|  4   | Radar theo dõi thay đổi luật pháp và phân tích tác động kinh doanh | Cơ sở dữ liệu luật pháp cập nhật theo thời gian thực, LLM phân tích nội dung thay đổi và đánh giá tác động kinh doanh; đẩy cảnh báo |
|  5   | Công cụ soạn thư luật sư AIGC tự động                             | Nhập trình bày sự kiện, LLM tạo template thư luật sư chuẩn mực; kiểm tra yếu tố và xác nhận tuân thủ |
|  6   | Máy ghi âm chuyển đổi theo thời gian thực tại tòa và trích xuất tự động trọng điểm tranh chấp | Chuyển đổi ASR ghi âm tòa án, LLM trích xuất trọng điểm tranh chấp và luận điểm quan trọng; đánh dấu timestamp |
|  7   | Hệ thống theo dõi tự động vi phạm sở hữu trí tuệ và thu thập chứng cứ blockchain toàn mạng | Giám sát vi phạm trên nền tảng thương mại điện tử, mạng xã hội; tự động thu thập và lưu chứng cứ vi phạm |
|  8   | Agent kiểm tra nhất quán dữ liệu quan trọng và cảnh báo rủi ro prospectus IPO dựa trên LLM | So sánh dữ liệu nhiều chương prospectus, LLM nhận diện không nhất quán và dữ liệu bất thường; đánh dấu rủi ro |
|  9   | Plugin giải thích điều khoản pháp luật phức tạp sang ngôn ngữ dễ hiểu | Chọn điều khoản luật, LLM tạo giải thích dễ hiểu |
|  10  | Hệ thống sắp xếp chuỗi chứng cứ vụ án thông minh và hiển thị trực quan | Tải tài liệu chứng cứ, LLM phân tích quan hệ chứng cứ và mốc thời gian |

## 12. Du lịch và dịch vụ đi lại

Kịch bản du lịch hướng tới nâng cao trải nghiệm du lịch và sự tiện lợi của dịch vụ. Các ứng dụng cốt lõi bao gồm lập lịch trình thông minh, dự báo giá, tham quan ảo, dịch thuật, v.v., giúp du lịch trở nên dễ dàng và thú vị hơn.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                                       |
| :--: | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|  1   | Trình tạo lịch trình du lịch lười dựa trên AIGC      | Nhập sở thích người dùng (số ngày, ngân sách, sở thích), LLM tạo lịch trình hàng ngày; API điểm tham quan lấy giờ mở cửa và vé |
|  2   | Robot dự đoán xu hướng giá vé máy bay khách sạn toàn mạng và tự động khóa giá rẻ | Thu thập dữ liệu giá OTA, mô hình ML dự đoán xu hướng giá; nhắc nhở giám sát giá |
|  3   | Cố vấn đề xuất phương án khẩn cấp và tái tổ chức lịch trình liên hãng khi hủy chuyến | Giám sát trạng thái chuyến bay, LLM phân tích phương án lịch trình thay thế; so sánh giá đa hãng |
|  4   | Hệ thống hỗ trợ kiểm tra trước tài liệu visa và điền form tự động | Chụp ảnh tải tài liệu, nhận diện OCR kiểm tra tính đầy đủ thông tin; tự động điền form |
|  5   | Trợ lý dịch giọng nói thời gian thực và dịch menu thị giác khi du lịch nước ngoài | Mô hình dịch giọng nói ngoại tuyến, nhận diện OCR ảnh menu và dịch |
|  6   | Máy phân tích hướng dẫn "tránh rủi ro" khách sạn dựa trên đánh giá thực tế dữ liệu lớn | Thu thập dữ liệu đánh giá khách sạn, LLM trích xuất từ khóa đánh giá tích cực/tiêu cực |
|  7   | Nền tảng tương tác chọn phòng ảo và xem trước VR immerrsive tại điểm đến | Thu thập ảnh toàn cảnh 360°, công nghệ VR xem trước immerrsive; tham quan ảo phòng |
|  8   | Trợ lý tự động tạo bài du ký và nội dung mạng xã hội từ dấu chân du lịch | Trích xuất thông tin thời gian địa điểm từ ảnh, LLM tạo nội dung bài du ký; tạo bố cục theo template |
|  9   | Nền tảng quản lý hoàn phí tuân thủ và thu thập hóa đơn công tác tự động doanh nghiệp | Kết nối API nền tảng công tác, thu thập thông tin hóa đơn tự động; kiểm tra tuân thủ |
|  10  | Dự đoán tắc nghẽn khách du lịch theo thời gian thực và điều hướng lộ trình du lịch tránh giờ cao điểm | Thu thập dữ liệu khách du lịch điểm tham quan, mô hình ML dự đoán khung giờ tắc nghẽn; đề xuất tránh giờ cao điểm |

## 13. Đồng hành cảm xúc

Kịch bản đồng hành cảm xúc tập trung vào sức khỏe tâm thần và an ủi cảm xúc. Các ứng dụng điển hình bao gồm người bạn đồng hành ảo, tư vấn cảm xúc, huấn luyện nhận thức, tư vấn tâm lý, v.v., cung cấp đồng hành và hỗ trợ toàn thời gian cho người dùng.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                     |
| :--: | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
|  1   | Người bạn đồng hành ảo 24 giờ dựa trên mô hình LLM   | Hệ thống ghi nhớ lưu trữ lịch sử hội thoại, LLM tạo phản hồi cá nhân hóa; module hỗ trợ cảm xúc |
|  2   | Cố vấn AI nhận diện cảm xúc đa phương thức và tư vấn tâm lý | Phân tích ngữ điệu giọng nói + nhận diện cảm xúc văn bản, LLM tạo đề xuất tư vấn; cảnh báo can thiệp khủng hoảng |
|  3   | Người ảo AI huấn luyện nhận thức và kích thích trí nhớ cho người bệnh Alzheimer | Huấn luyện trò chơi nhận thức (trí nhớ, tính toán, ngôn ngữ); ảnh cũ/bài hát cũ kích thích trí nhớ |
|  4   | Huấn luyện viên mô phỏng giao tiếp xã hội AIGC cho người hướng nội | Mô phỏng tình huống giao tiếp xã hội ảo, LLM đóng vai khác nhau; đề xuất kỹ năng giao tiếp |
|  5   | Máy tạo câu chuyện trước khi ngủ cá nhân hóa GenAI    | Cha mẹ nhập chủ đề và sở thích, LLM tạo câu chuyện cá nhân hóa; tạo nhạc nền |
|  6   | Hệ thống phục hồi cuộc sống số người đã khuất và hội thoại xuyên không gian thời gian LLM | Đào tạo mô hình cá nhân hóa từ tài liệu khi còn sống (giọng nói, văn bản); tạo hội thoại ghi nhớ |
|  7   | Robot chat đồng cảm và phản chiếu tính cách AI dựa trên dữ liệu MBTI | Nhập kết quả test MBTI, LLM tạo phân tích tính cách và phản hồi đồng cảm; đề xuất khớp tính cách |
|  8   | Trợ lý theo dõi tâm trạng toàn thời gian và kích thích cảm xúc tích cực AI | Ghi nhận trạng thái tâm trạng hàng ngày, LLM phân tích xu hướng và tạo nội dung khích lệ; đẩy nhắc nhở tích cực |
|  9   | Hòm thư AI tâm sự ẩn danh bảo vệ quyền riêng tư cho thanh thiếu niên | Lối vào tâm sự ẩn danh, LLM cung cấp lắng nghe và đề xuất; cảnh báo từ nhạy cảm |
|  10  | Hệ thống nuôi thú ảo AI có khả năng tiến hóa tự chủ    | Đào tạo mô hình tính cách thú cưng, tương tác hội thoại lớn lên tiến hóa; hệ thống trang phục ảo |

## 14. Giải trí

Kịch bản giải trí hướng tới cung cấp trải nghiệm giải trí số phong phú. Các ứng dụng phổ biến bao gồm quyết định thông minh NPC game, hỗ trợ kịch bản nhập vai, sáng tạo nội dung, xử lý âm thanh video, v.v., đáp ứng nhu cầu giải trí đa dạng của người dùng.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                     |
| :--: | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
|  1   | Engine quyết định tự chủ NPC game thế giới mở dựa trên LLM | Cây hành vi NPC kết hợp quyết định LLM, hệ thống hội thoại tạo tương tác cá nhân hóa; engine hành vi |
|  2   | Công cụ hỗ trợ DM với diễn biến cốt truyện AIGC cho game kịch bản nhập vai | Lựa chọn người chơi kích hoạt nhánh cốt truyện, LLM tạo logic suy luận; tự động tạo thẻ manh mối |
|  3   | Trình sửa đổi kết thúc truyện tương tác dạng sinh    | Lựa chọn độc giả ảnh hưởng hướng đi cốt truyện, LLM tạo nhiều nhánh kết thúc |
|  4   | Bàn làm việc tạo mô hình 3D nhân vật anime AIGC tự động | Mô tả văn bản tạo phác thảo nhân vật, công cụ mô hình 3D tự động xây dựng; render vật liệu texture |
|  5   | Phân tích thị giác CV và bình luận viên AI thông minh cho trận đấu e-sports | Phân tích thời gian thực màn hình game, nhận diện khoảnh khắc quan trọng; LLM tạo bình luận |
|  6   | Engine thuật toán đề xuất nội dung hài hước cá nhân hóa | Hồ sơ sở thích người dùng, đề xuất khớp nội dung hài hước |
|  7   | Phần mềm chỉnh giọng hát và làm đẹp giọng KTV AI       | Xử lý giảm nhiễu và tăng cường giọng người; thuật toán chỉnh giọng AI |
|  8   | Công cụ trích xuất AI cốt truyện riêng nhân vật phim truyền hình và tự động chỉnh sửa | Phân tích nội dung video, trích xuất đoạn liên quan nhân vật; tự động chỉnh sửa tạo |
|  9   | Hệ thống tự động tạo sách nói TTS đa vai              | Phân vai văn bản, tạo giọng nói cá nhân hóa; thêm nhạc nền và hiệu ứng âm thanh |
|  10  | Huấn luyện viên đối chiến và phân tích ván cờ board game reinforcement learning | Phân tích ván cờ, mô phỏng đối chiến đối thủ AI; tạo đề xuất phân tích ván |

## 15. Thương mại điện tử

Kịch bản thương mại điện tử tập trung vào nâng cao hiệu suất vận hành và tỷ lệ chuyển đổi. Các ứng dụng cốt lõi bao gồm tạo nội dung sản phẩm, livestream bán hàng, dịch vụ khách hàng, phân tích giá, v.v., giúp người bán thực hiện vận hành thông minh.

| STT | Tên kịch bản ứng dụng                                  | Tham khảo triển khai                                                                                              |
| :--: | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
|  1   | Công cụ sản xuất hàng loạt trang chi tiết sản phẩm AIGC tỷ lệ chuyển đổi cao | Nhập thông tin sản phẩm, LLM tạo nội dung điểm bán hàng và mô tả kịch bản; tạo ảnh nền |
|  2   | Nhà máy tạo video người mẫu ảo thử đồ AI cho ngành may mặc | Xử lý ảnh sản phẩm may mặc phẳng, tạo hiệu quả thử đồ người mẫu ảo; video trình diễn đa góc độ |
|  3   | Trợ lý dịch thuật và biên tập bản địa hóa đa ngôn ngữ LLM cho thương mại điện tử xuyên biên giới | Dịch mô tả sản phẩm đa ngôn ngữ, biên tập thích ứng văn hóa; giao diện phát hành đa nền tảng |
|  4   | Robot phân tích cảm xúc khách hàng và phản hồi thông minh dựa trên NLP | Phân tích cảm xúc hội thoại tư vấn, tự động tạo phản hồi xoa dịu; phân loại đánh giá tốt/xấu |
|  5   | Hệ thống livestream bán hàng người ảo AIGC toàn thời gian 24 giờ | Hình ảnh người ảo + tạo kịch bản theo thời gian thực, gọi thông tin sản phẩm theo thời gian thực; phản hồi tương tác bình luận |
|  6   | Plugin so sánh giá AI sản phẩm tương tự toàn mạng và dự đoán xu hướng | Crawl giá nền tảng thương mại điện tử, hiển thị biểu đồ so sánh giá; dự đoán xu hướng giá |
|  7   | Nền tảng lọc thông minh ảnh review khách hàng và tổng hợp video ngắn | Chấm điểm chất lượng ảnh review khách hàng, tự động đề xuất nội dung chất lượng; tổng hợp template video ngắn |
|  8   | Phân tích giọng nói hội thoại bán hàng theo thời gian thực và đề xuất kịch bản xuất sắc dựa trên LLM | Chuyển đổi ASR cuộc gọi, kiểm tra tuân thủ kịch bản theo thời gian thực; đề xuất kịch bản |
|  9   | Engine dự đoán xu hướng thị trường AI và dự đoán sản phẩm hot | Thu thập và phân tích dữ liệu mạng xã hội và thương mại điện tử, LLM phát hiện xu hướng hot; đề xuất lựa chọn sản phẩm |
|  10  | Hệ thống vận hành tinh tế và phân cụm hồ sơ người dùng traffic riêng AI | Phân tích cụm dữ liệu hành vi người dùng, tạo tag hồ sơ; kích hoạt marketing tự động |

## 16. Năng lượng

Kịch bản năng lượng hướng tới thực hiện quản lý thông minh và chuyển đổi xanh trong ngành năng lượng. Các ứng dụng điển hình bao gồm phân tích tiêu điện, phát hiện thiết bị, tính toán phát thải carbon, tối ưu điều phối, v.v., thúc đẩy vận hành hiệu quả hệ thống năng lượng.

| STT | Tên kịch bản ứng dụng                                     | Tham khảo triển khai                                                                                     |
| :--: | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
|  1   | Cố vấn phân tích hành vi tiêu điện gia đình và chiến lược tiết kiệm năng lượng AI | Thu thập dữ liệu đồng hồ điện thông minh, phân tích mô hình tiêu điện; LLM tạo đề xuất tiết kiệm năng lượng |
|  2   | Hệ thống nhận diện thị giác CV drone phát hiện lỗi linh kiện quang điện | Drone kiểm tra chụp ảnh, phân tích ảnh nhiệt hồng ngoại; đánh dấu phát hiện lỗi |
|  3   | Agent dự đoán xu hướng giá giao dịch điện thời gian thực AI và chiến lược sinh lời tự động | Thu thập dữ liệu thị trường điện, mô hình dự đoán giá; tạo chiến lược và thực hiện giao dịch |
|  4   | Hệ thống phát hiện sức khỏe không phá hủy AI và cảnh báo rủi ro mất kiểm soát nhiệt pin lưu trữ | Giám sát dữ liệu vận hành pin, mô hình đánh giá sức khỏe; đẩy cảnh báo rủi ro |
|  5   | Trợ lý tự động tính toán phát thải carbon toàn chuỗi doanh nghiệp và tạo báo cáo ESG AI | Thu thập dữ liệu tiêu thụ năng lượng, tính toán hệ số phát thải carbon; tự động tạo báo cáo ESG |
|  6   | Hệ thống dự đoán phụ tải AI thời tiết cực đoan và chỉ huy điều phối khẩn cấp lưới điện | Kết nối dữ liệu thời tiết, mô hình dự đoán phụ tải; tạo chiến lược điều phối |
|  7   | Bảo vệ video AI phát hiện hành vi vi phạm và cảnh báo tại trạm xăng | Phân tích giám sát video, phát hiện hành vi vi phạm (điện thoại, hút thuốc, v.v.); đẩy cảnh báo |
|  8   | Hệ thống giám sát sóng âm AI phát hiện rò rỉ và định vị chính xác đường ống dẫn dầu khí dài | Thu thập dữ liệu cảm biến sóng âm, mô hình phát hiện rò rỉ; thuật toán tính định vị |
|  9   | Hệ thống quyết định giao dịch điện AI và tập hợp nguồn lực nhà máy ảo | Kết nối nguồn lực phân tán, điều phối tối ưu tập hợp; thực hiện chiến lược giao dịch |
|  10  | Theo dõi vị trí nhân viên AI mỏ và cảnh báo xâm phạm khu vực nguy hiểm | Định vị UWB/Bluetooth, theo dõi quỹ đạo nhân viên; hàng rào điện tử khu vực nguy hiểm |

## 17. Âm thanh và video

Kịch bản âm thanh video tập trung vào sản xuất nội dung và xử lý media. Các ứng dụng phổ biến bao gồm cắt video, tổng hợp giọng nói, tạo phụ đề, phục hồi video, v.v., nâng cao hiệu suất và chất lượng sản xuất nội dung âm thanh video.

| STT | Tên kịch bản ứng dụng                                 | Tham khảo triển khai                                                                                 |
| :--: | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
|  1   | Công cụ nhận diện đoạn hay AI và tự động cắt video ngắn từ video dài | Phân tích nội dung video, nhận diện khung hình quan trọng; tự động cắt đoạn hay |
|  2   | Trợ lý tách tiếng ồn nền AI và tăng cường giọng nói video | Mô hình tách âm thanh, loại bỏ tiếng ồn nền; xử lý tăng cường giọng người |
|  3   | Bàn làm việc phục hồi siêu phân giải 4K và tự động tô màu AI cho video cũ | Mô hình siêu phân giải video, phục hồi chất lượng video cũ; tự động tô màu AI |
|  4   | Hệ thống kiểm soát cảm xúc và lồng tiếng TTS chuyển văn bản thành giọng người thật | Mô hình TTS đa giọng, tạo kiểm soát cảm xúc; xuất âm thanh |
|  5   | Công cụ tự động nhận diện giọng nói video ASR và tạo phụ đề song ngữ | Nhận diện giọng nói tạo phụ đề, dịch đa ngôn ngữ; ghép phụ đề song ngữ |
|  6   | Engine tách đối tượng thừa AI trong khung hình video | Theo dõi đối tượng video, loại bỏ và sửa khung; xử lý tính nhất quán giữa các khung |
|  7   | Máy soạn nhạc tự động AIGC nhạc nền không bản quyền  | Mô hình tạo nhạc, phong cách cảm xúc có thể kiểm soát; kiểm tra bản quyền |
|  8   | Phần mềm nhân bản giọng người cụ thể AI và chuyển đổi giọng nói | Đào tạo mô hình giọng từ ít mẫu giọng nói; xử lý chuyển đổi giọng |
|  9   | Nền tảng chuyển đổi kịch bản sang phân cảnh một chạm và tạo video dự diễn AI | Phân tích kịch bản tạo phân cảnh, AI tạo video dự diễn |
|  10  | Trợ lý chuyển đổi giọng nói thông minh và trích xuất việc cần làm từ ghi âm cuộc họp AI | Tách và chuyển đổi giọng nói cuộc họp nhiều người, LLM trích xuất việc cần làm; đánh dấu timestamp |

## 18. Marketing AI

Kịch bản marketing AI hướng tới nâng cao hiệu suất marketing và sản xuất sáng tạo. Các ứng dụng cốt lõi bao gồm tạo nội dung, thiết kế poster, theo dõi chủ đề nóng, phân tích đối thủ, v.v., giúp doanh nghiệp thực hiện marketing chính xác và truyền thông thương hiệu.

| STT | Tên kịch bản ứng dụng                               | Tham khảo triển khai                                                                                       |
| :--: | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
|  1   | Engine AIGC tự động viết nội dung viral trên Xiaohongshu | Nhập chủ đề, LLM tạo nội dung review sản phẩm; tối ưu emoji và thẻ chủ đề |
|  2   | Công cụ bố trí AI poster marketing và thích ứng đa kích thước | Nhập nội dung, khớp template poster thông minh và xuất đa kích thước |
|  3   | Nền tảng tạo sáng tạo LOGO thương hiệu AIGC và xây dựng hệ thống VI | Nhập từ khóa thương hiệu, tạo sáng tạo LOGO; tạo quy phạm VI |
|  4   | Trợ lý theo dõi chủ đề nóng AI toàn mạng và tạo sáng tạo marketing | Thu thập dữ liệu chủ đề nóng, LLM phân tích góc marketing; tạo đề án sáng tạo |
|  5   | Quản lý đấu giá ngân sách AI và giám sát ROI quảng cáo theo thời gian thực | Kết nối dữ liệu nền tảng quảng cáo, mô hình phân tích hiệu quả; tối ưu chiến lược đấu giá |
|  6   | Máy tạo báo cáo tuần phân tích sâu chiến lược marketing đối thủ AI | Thu thập và phân tích nội dung đối thủ, trích xuất chiến lược; tự động tạo báo cáo tuần |
|  7   | Viết hàng loạt bài thu hút traffic và bố trí từ khóa SEO AI | Phân tích từ khóa, tạo bài hàng loạt; đề xuất tối ưu SEO |
|  8   | Chuyên gia viết email marketing cá nhân hóa AI      | Dữ liệu hồ sơ người dùng, tạo nội dung cá nhân hóa; A/B test |
|  9   | Radar cảnh báo khủng hoảng dư luận và theo dõi danh tiếng thương hiệu AI toàn mạng | Thu thập dữ liệu dư luận toàn mạng, phân tích cảm xúc; đẩy cảnh báo khủng hoảng |
|  10  | Trợ lý tạo sáng tạo kịch bản video ngắn AIGC và hướng dẫn phân cảnh | Nhập chủ đề, tạo kịch bản và phân cảnh; hướng dẫn quay phim |

## 19. Trí tuệ dữ liệu

Kịch bản trí tuệ dữ liệu tập trung vào phân tích dữ liệu và khai thác giá trị. Các ứng dụng điển hình bao gồm truy vấn ngôn ngữ tự nhiên, tạo trực quan, quản trị dữ liệu, xây dựng biểu đồ kiến thức, v.v., giúp doanh nghiệp thực hiện hỗ trợ quyết định dựa trên dữ liệu.

| STT | Tên kịch bản ứng dụng                           | Tham khảo triển khai                                                                                             |
| :--: | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
|  1   | Engine truy vấn dữ liệu ngôn ngữ tự nhiên dựa trên Text-to-SQL | Chuyển đổi ngôn ngữ tự nhiên thành truy vấn SQL, hiển thị trực quan kết quả |
|  2   | BI hội thoại: tạo biểu đồ trực quan bằng một câu | Mô tả nhu cầu dữ liệu, tự động tạo biểu đồ; hỗ trợ chuyển đổi đa loại biểu đồ |
|  3   | Công cụ nhận diện bảng Excel từ ảnh chụp màn hình một chạm | Tải ảnh chụp màn hình, VLM nhận diện cấu trúc bảng và dữ liệu; xuất file Excel |
|  4   | Công cụ nhận diện AI chuyển ảnh và ảnh chụp màn hình thành bảng Excel | Nhận diện cấu trúc bảng qua OCR ảnh, xuất dữ liệu sang Excel |
|  5   | Xây dựng biểu đồ kiến thức dữ liệu đa nguồn dị cấu tự động | Kết nối đa nguồn dữ liệu, trích xuất thực thể và quan hệ; lưu trữ cơ sở dữ liệu đồ thị |
|  6   | Trợ lý giải thích thông minh báo cáo dữ liệu và phân tích xu hướng | Tải ảnh báo cáo dữ liệu hoặc nhập dữ liệu, VLM giải thích nội dung biểu đồ và phân tích xu hướng |
|  7   | Trợ lý giải thích cấu trúc bảng cơ sở dữ liệu và tạo ví dụ truy vấn thông minh | Nhập tên bảng hoặc mô tả trường, LLM tạo giải thích tạo bảng và SQL truy vấn ví dụ |
|  8   | Căn chỉnh master data doanh nghiệp thông minh và quản trị trùng lặp AI | Khớp master data đa nguồn, nhận diện bản ghi trùng; cấu hình quy tắc gộp |
|  9   | Công cụ chuyển đổi tài liệu yêu cầu dữ liệu thành test case thông minh | Nhập mô tả yêu cầu dữ liệu, LLM tạo kịch bản test và test case xác minh |
|  10  | Trợ lý hỏi đáp về chỉ tiêu dữ liệu thông minh   | Xây dựng kho kiến thức dựa trên tài liệu định nghĩa chỉ tiêu, LLM trả lời câu hỏi về định nghĩa chỉ tiêu, logic tính toán, v.v. |

</TabItem>
<TabItem label="B2C Tiêu dùng">

## Dẫn nhập chương

<ChapterIntroduction :duration="cDuration" :tags="['Ứng dụng B2C', 'Lối sống', 'Trải nghiệm cảm xúc', 'Tạo bầu không khí']" coreOutput="Khám phá hơn 15 cảm hứng kịch bản đời sống" expectedOutput="Tìm hướng sản phẩm chạm tới người dùng">

Tài liệu này tổng hợp <strong>các hướng ứng dụng sáng tạo của mô hình LLM trong kịch bản tiêu dùng B2C</strong>. Khác với sản phẩm B2B tập trung vào hiệu suất và điểm đau, sản phẩm B2C chú trọng hơn đến <strong>tạo cảm giác, gợi ý tâm lý và bầu không khí</strong>, để người dùng có cộng hưởng cảm xúc và trải nghiệm tốt đẹp trong quá trình sử dụng.

</ChapterIntroduction>

## Chọn nhanh bầu không khí kịch bản

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">Tìm cảm hứng kịch bản chạm tới bạn</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    Chọn bầu không khí bạn muốn và cảm giác hiện tại. Hệ thống sẽ đề xuất các hướng kịch bản liên quan; bấm vào thẻ để nhảy tới phần tương ứng.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="Chọn loại bầu không khí" style="width: 100%;">
        <el-option
          v-for="item in vibeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="Chọn cảm giác hiện tại" style="width: 100%;">
        <el-option
          v-for="item in feelingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="cRecommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #ec4899;">
      Kịch bản {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }} được đề xuất cho bạn:
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <el-tag
        v-for="topic in cRecommendationTopics"
        :key="topic.title"
        type="danger"
        effect="light"
        style="cursor: pointer; margin-bottom: 4px;"
        @click="cScrollToAnchor(topic.scenarioAnchor)"
      >
        {{ topic.title }}
      </el-tag>
    </div>
    <el-button type="text" size="small" @click="cResetSelection" style="margin-top: 8px;">
      Chọn lại
    </el-button>
  </div>
</el-card>

---

## 1. Lối sống

> 💡 **Ý tưởng cốt lõi**: biến đời thường thành trải nghiệm có nghi thức, tạo cái đẹp trong từng chi tiết

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trợ lý đánh thức bằng nghi thức buổi sáng | Tích hợp API thời tiết và dữ liệu lịch; LLM tạo kế hoạch buổi sáng cá nhân hóa; kết hợp loa thông minh phát nhạc riêng và đèn thông minh sáng dần |
| 2 | Nhà tạo không khí cho người sống một mình | Kết nối thiết bị nhà thông minh (đèn, loa, máy khuếch tán hương); LLM tự điều chỉnh theo thời gian/tâm trạng; học sở thích người dùng để tối ưu liên tục |
| 3 | Trình tạo kế hoạch chữa lành cuối tuần ở nhà | Kết nối API nền tảng streaming để lấy danh sách phim, kết hợp lịch sử sở thích để tạo combo phim + món ăn + bố trí không gian |
| 4 | Đài phát thanh an ủi trước khi ngủ | Tạo câu chuyện dịu dàng bằng TTS, trộn white noise, giảm âm lượng thông minh; điều chỉnh nội dung theo dữ liệu giấc ngủ |
| 5 | Bộ bắt cảm hứng thẩm mỹ đời sống | Dùng nhận diện hình ảnh phân tích ảnh môi trường của người dùng, LLM tạo gợi ý thẩm mỹ; đề xuất nội dung theo phong cách Pinterest/Xiaohongshu |

---

## 2. Đồng hành cảm xúc

> 💡 **Ý tưởng cốt lõi**: tiếp nhận và đồng hành vô điều kiện, trở thành chiếc bình dịu dàng chứa cảm xúc

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người lắng nghe tâm sự đêm khuya | Mã hóa đầu cuối bảo vệ quyền riêng tư; phân tích cảm xúc bằng LLM để hiểu tâm trạng; bộ nhớ dài hạn lưu câu chuyện người dùng và đồng hành qua nhiều lượt đối thoại |
| 2 | Người đồng hành chữa lành sau chia tay | Thuật toán nhận diện giai đoạn cảm xúc, cung cấp hỗ trợ theo từng giai đoạn (tâm sự -> xả cảm xúc -> tái xây dựng); truy xuất RAG từ kho tri thức tâm lý học |
| 3 | Huấn luyện viên thở giảm lo âu | Kết nối dữ liệu cảm biến sinh học (nhịp tim/hơi thở), giám sát mức lo âu theo thời gian thực; giọng nói hướng dẫn nhịp thở và thư giãn cơ tiến triển |
| 4 | Cố vấn xây dựng lại tự tin | Khung đối thoại tâm lý học tích cực, ghi nhận và phản hồi các thành tựu nhỏ; kỹ thuật tái cấu trúc nhận thức giúp thay đổi tự thoại tiêu cực |
| 5 | Diễn giải thông minh nhật ký cảm xúc | Mô hình NLP nhận diện cảm xúc, phân tích chuỗi thời gian để phát hiện quy luật tâm trạng; trực quan hóa bản đồ cảm xúc và cảnh báo dự đoán |

---

## 3. Giải trí thư giãn

> 💡 **Ý tưởng cốt lõi**: tạo trải nghiệm nhập vai, để giải trí trở thành nơi tâm hồn nghỉ chân

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | DM nhập vai cho trò chơi suy luận | LLM tạo nhánh cốt truyện theo thời gian thực, tổng hợp giọng nói để đóng vai NPC, điều chỉnh độ khó và nhịp theo phản ứng người chơi; dựng cảnh AR/VR |
| 2 | NPC có linh hồn trong game thế giới mở | Cơ sở dữ liệu bộ nhớ dài hạn lưu lịch sử tương tác của người chơi, LLM tạo hội thoại cá nhân hóa; tính toán cảm xúc giúp NPC có phản ứng cảm xúc thật |
| 3 | Tạo nội dung podcast cá nhân hóa | Tạo nội dung riêng theo biểu đồ sở thích người dùng, TTS sao chép giọng người dùng thích; tương tác thời gian thực để trả lời câu hỏi người nghe |
| 4 | Nhóm tạo không khí cho concert ảo | Render nhân vật ảo, tương tác bình luận thời gian thực, lightstick/đạo cụ cổ vũ ảo; âm thanh không gian tạo cảm giác hiện trường |
| 5 | Bạn đồng sáng tạo tiểu thuyết tương tác | LLM tạo cốt truyện theo thời gian thực, lựa chọn người dùng ảnh hưởng hướng đi câu chuyện; thiết kế nhiều kết thúc và phát triển quan hệ nhân vật động |

---

## 4. Phát triển cá nhân

> 💡 **Ý tưởng cốt lõi**: trưởng thành không phải khổ hạnh, mà là hành trình tự khám phá thú vị

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người chứng kiến phát triển cá nhân | Trực quan hóa hành trình trưởng thành bằng timeline, tự động đánh dấu cột mốc; ảnh so sánh hiển thị "tôi ngày trước" và "tôi hiện tại" |
| 2 | Huấn luyện viên game hóa thói quen | Cơ chế game hóa (điểm kinh nghiệm, cấp độ, huy hiệu), bảng xếp hạng xã hội, AI coach nhập vai như "cố vấn phiêu lưu" |
| 3 | Ghép đôi bạn học kỹ năng | Thuật toán ghép đôi theo sở thích và mục tiêu học tập, cộng đồng nhóm học, cơ chế check-in giám sát lẫn nhau |
| 4 | Người phát hiện niềm vui nhỏ mỗi ngày | Nhận diện hình ảnh để phát hiện khoảnh khắc đẹp trong đời sống, hướng dẫn gratitude journal, nhìn lại khoảnh khắc đẹp mỗi tuần |
| 5 | Trình trải nghiệm mô phỏng cuộc đời | Cốt truyện nhiều nhánh mô phỏng kết quả của lựa chọn khác nhau, so sánh cuộc đời song song; trực quan hóa hệ quả quyết định |

---

## 5. Tương tác xã hội

> 💡 **Ý tưởng cốt lõi**: làm giao tiếp trở nên nhẹ nhàng tự nhiên, tìm cách kết nối thoải mái

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trình tạo chủ đề phá băng | Đề xuất chủ đề thông minh theo dịp và người tham gia, phân tích hội thoại thời gian thực để gợi ý nối tiếp; nhắc cứu nguy lúc ngượng |
| 2 | Người tạo không khí caption mạng xã hội | Phân tích nội dung ảnh, LLM tạo caption nhiều phong cách (văn nghệ/hài hước/sâu lắng); đề xuất emoji và bố cục thông minh |
| 3 | Nhà hoạch định không khí hẹn hò | Tạo kế hoạch hẹn hò theo sở thích hai bên, đề xuất nhà hàng/hoạt động, gợi ý chủ đề trò chuyện; nhắc thời tiết và giao thông thời gian thực |
| 4 | Người khuấy động họp mặt từ xa | Thư viện game online, trình tạo hoạt động phá băng, vòng quay chủ đề; nền ảo và filter tăng không khí |
| 5 | Trợ lý quản lý năng lượng xã hội | Đánh giá mức tiêu hao năng lượng sau hoạt động xã hội, gợi ý phục hồi (hoạt động một mình); lập kế hoạch lịch xã hội thông minh |

---

## 6. Biểu đạt sáng tạo

> 💡 **Ý tưởng cốt lõi**: ai cũng có năng lực sáng tạo, chỉ cần được đánh thức

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Bộ sơ cứu khi cạn cảm hứng | Thuật toán liên tưởng liên lĩnh vực, tạo từ kích thích ngẫu nhiên, thư viện prompt sáng tạo; công cụ mở rộng ý tưởng dạng mind map |
| 2 | Hướng dẫn khám phá phong cách cá nhân | Phân tích hình ảnh để nhận diện phong cách hiện có, đề xuất xu hướng phong cách, thử đồ/trang điểm ảo; timeline tiến hóa phong cách |
| 3 | Cố vấn thẩm mỹ cho sổ tay và nhật ký | Đề xuất mẫu bố cục, tạo phối màu, gợi ý yếu tố trang trí; nhận dạng chữ viết tay và làm đẹp nội dung |
| 4 | Hướng dẫn bố cục và không khí nhiếp ảnh | Nhận diện cảnh và gợi ý bố cục, đề xuất phong cách filter, tự điều chỉnh tham số chỉnh ảnh; lộ trình học kỹ thuật nhiếp ảnh |
| 5 | Người ghép nhạc theo tâm trạng | Thuật toán phân tích cảm xúc âm nhạc, nhận diện tâm trạng người dùng, tạo playlist cá nhân hóa; giới thiệu câu chuyện và bối cảnh âm nhạc |

---

## 7. Khám phá du lịch

> 💡 **Ý tưởng cốt lõi**: du lịch không chỉ là ngắm cảnh, mà còn là cảm nhận những lối sống khác nhau

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Hướng dẫn dạo phố khám phá | Tổng hợp nội dung từ người địa phương am hiểu, đề xuất địa điểm ít người biết, chỉ dẫn AR; dịch thời gian thực và thuyết minh giọng nói |
| 2 | Tạo nhật ký tâm trạng du lịch | Tự phân loại và chọn ảnh, LLM tạo bài du ký đẹp, timeline gắn vị trí địa lý; tạo video du lịch một chạm |
| 3 | Trợ lý đồng hành du lịch một mình | Chia sẻ vị trí và nhắc an toàn theo thời gian thực, liên hệ khẩn cấp địa phương, AI hướng dẫn viên đồng hành bằng giọng nói; cộng đồng người đi một mình |
| 4 | Xem trước bầu không khí điểm đến | Xem trước VR/360°, mô phỏng âm thanh và mùi địa phương, giới thiệu bối cảnh văn hóa; trải nghiệm "ở thử" ảo |
| 5 | Hướng dẫn không khí nhiếp ảnh du lịch | Nhắc golden hour, đường hỗ trợ bố cục, đề xuất điểm chụp đặc trưng địa phương; gợi ý phong cách chỉnh màu hậu kỳ |

---

## 8. Sức khỏe thân tâm

> 💡 **Ý tưởng cốt lõi**: sức khỏe không phải mục tiêu, mà là một cách tự chăm sóc dịu dàng

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người đánh thức động lực vận động | Đề xuất loại vận động thông minh theo trạng thái người dùng, lựa chọn micro workout 5 phút, thử thách vận động game hóa; check-in vận động xã hội |
| 2 | Căn bếp cảm hứng ăn uống lành mạnh | Nhận diện nguyên liệu trong tủ lạnh, đề xuất công thức cá nhân hóa, phân tích phối hợp dinh dưỡng; hướng dẫn nấu ăn step-by-step |
| 3 | Nhà tối ưu không khí chất lượng giấc ngủ | Phân tích dữ liệu theo dõi giấc ngủ, tạo nghi thức trước khi ngủ, gợi ý tối ưu môi trường (nhiệt độ/độ ẩm/ánh sáng); đánh thức thông minh |
| 4 | Người hướng dẫn cảm nhận cơ thể | Hướng dẫn thiền quét cơ thể, liên kết bộ phận cơ thể với cảm xúc, bài tập kết nối thân tâm; trực quan hóa biofeedback |
| 5 | Trợ lý nhắc tự chăm sóc | Theo dõi cường độ làm việc, nhắc nghỉ ngơi định kỳ, gợi ý hoạt động tự chăm sóc nhỏ (uống nước/giãn cơ/hít thở sâu); ghi chép tự chăm sóc |

---

## 9. Khám phá tri thức

> 💡 **Ý tưởng cốt lõi**: học tập là cuộc phiêu lưu không có điểm dừng, tò mò là người thầy tốt nhất

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Hướng dẫn khám phá tri thức dạng game | Trực quan hóa bản đồ điểm kiến thức, lộ trình học theo màn chơi, hệ thống huy hiệu thành tựu; AI mentor nhập vai |
| 2 | Bạn đồng hành học ngôn ngữ theo tình huống | LLM đóng vai nhiều nhân vật để hội thoại, sửa phát âm, giới thiệu bối cảnh văn hóa; mô phỏng tình huống nhập vai |
| 3 | Trợ lý thỏa mãn tò mò | Kết nối Wikipedia/knowledge graph, giải thích khái niệm phức tạp theo cách dễ hiểu, đề xuất kiến thức liên quan; ghi lại tò mò |
| 4 | Kích hoạt cảm hứng ghi chú đọc sách | Phân tích nội dung sách, trích xuất và liên kết quan điểm, đề xuất góc suy nghĩ; mẫu ghi chú đọc sách và làm đẹp |
| 5 | Tạo không khí chia sẻ kiến thức | Tự tạo thẻ kiến thức, tối ưu copy chia sẻ, làm đẹp thị giác; phản hồi dữ liệu chia sẻ xã hội |

---

## 10. Nuôi dưỡng quan hệ

> 💡 **Ý tưởng cốt lõi**: quan hệ tốt cần được chăm chút, nhưng chăm chút không cần quá phức tạp

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Huấn luyện viên giao tiếp trong quan hệ thân mật | Tạo mẫu biểu đạt cảm xúc, hướng dẫn kỹ năng giao tiếp phi bạo lực, câu nói hóa giải xung đột; đánh giá sức khỏe quan hệ |
| 2 | Trợ lý nhắc quan tâm gia đình | Nhắc ngày quan trọng (sinh nhật/kỷ niệm), gợi ý lời quan tâm, đề xuất hoạt động gia đình; tạo album gia đình |
| 3 | Người tạo không khí duy trì tình bạn | Ghi lại tương tác với bạn bè, đề xuất chủ đề chung, tổ chức họp mặt từ xa; tạo timeline tình bạn và ký ức |
| 4 | Nhà hoạch định tỏ tình và bất ngờ | Tạo phương án bất ngờ cá nhân hóa, đề xuất quà tặng, gợi ý lời nói lãng mạn; lịch thực hiện và nhắc nhở |
| 5 | Hướng dẫn làm dịu xung đột | Câu nói hạ nhiệt cảm xúc, hướng dẫn đổi góc nhìn, gợi ý bước hòa giải; theo dõi quá trình sửa chữa quan hệ |

---

## 11. Đồng hành thú cưng

> 💡 **Ý tưởng cốt lõi**: thú cưng là gia đình, sự đồng hành của chúng đáng được ghi lại và trân trọng

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Nhật ký nhân hóa thú cưng | Phân tích hành vi thú cưng, tạo nhật ký ngôi thứ nhất, tự ghép ảnh; "vòng bạn bè" của thú cưng |
| 2 | Người giải mã hành vi thú cưng | Phân tích video hành vi thú cưng, cảnh báo sức khỏe, gợi ý huấn luyện; kho tri thức đặc tính giống loài |
| 3 | Nhà hoạch định thời gian bên thú cưng | Đề xuất hoạt động cho thú cưng, hướng dẫn DIY đồ chơi, gợi ý địa điểm thân thiện với thú cưng; ghép đôi xã hội cho thú cưng |
| 4 | Tạo câu chuyện kỷ niệm thú cưng | Chọn ảnh và video, tạo câu chuyện theo timeline, phối nhạc; tự tạo album/video kỷ niệm |
| 5 | Hướng dẫn yên tâm cho người mới nuôi thú cưng | Hướng dẫn chăm sóc theo giai đoạn, trả lời câu hỏi thường gặp, xử lý tình huống khẩn cấp; hỗ trợ cộng đồng người mới |

---

## 12. Sức khỏe tài chính

> 💡 **Ý tưởng cốt lõi**: tự do tài chính không phải mục tiêu duy nhất, sức khỏe tài chính mới là điều cần giữ

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Trợ lý nhận biết cảm xúc tiêu dùng | Phân tích ghi chép tiêu dùng, phân tích liên hệ cảm xúc-tiêu dùng, cảnh báo mua sắm bốc đồng; gợi ý thỏa mãn thay thế |
| 2 | Động lực trực quan hóa mục tiêu tiết kiệm | Trực quan hóa tiến độ mục tiêu, render bối cảnh giấc mơ, ăn mừng cột mốc; trò chơi xây dựng thói quen tiết kiệm |
| 3 | Học tài chính cá nhân nhẹ nhàng | Đẩy kiến thức dạng mảnh nhỏ, dạy bằng tình huống và case, hỏi đáp tương tác; kiểm tra kiến thức và chứng nhận |
| 4 | Người làm dịu lo âu tài chính | Đánh giá sức khỏe tình trạng tài chính, kỹ thuật quản lý áp lực, kế hoạch hành động từng bước nhỏ; tư vấn tâm lý tài chính |
| 5 | Trò chơi trải nghiệm đầu tư nhỏ | Mô phỏng đầu tư ảo, giáo dục rủi ro, trò chơi danh mục đầu tư; hướng dẫn đầu tư nhỏ thật |

---

## 13. Phát triển nghề nghiệp

> 💡 **Ý tưởng cốt lõi**: nghề nghiệp không phải đường ray cố định, mà là vùng đất rộng có thể khám phá

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Người đồng hành khi mơ hồ nghề nghiệp | Đánh giá hứng thú nghề nghiệp, kiểm kê năng lực, đề xuất thông tin ngành; đối thoại với cố vấn nghề nghiệp |
| 2 | Người đánh thức cảm giác thành tựu công việc | Ghi lại kết quả công việc, chắt lọc giá trị, trực quan hóa thành tựu; thu thập phản hồi tích cực từ đồng nghiệp/khách hàng |
| 3 | Trợ lý không khí xã giao nơi làm việc | Đề xuất chủ đề công sở, kỹ năng networking, sự kiện ngành; tối ưu nội dung LinkedIn |
| 4 | Bộ kích hoạt cảm hứng nghề phụ | Ghép kỹ năng-sở thích-nhu cầu thị trường, thư viện case nghề phụ, hướng dẫn khởi động; cộng đồng nghề phụ |
| 5 | Trạm tiếp sức tự tin trước phỏng vấn | Phỏng vấn mô phỏng, chuẩn bị câu hỏi thường gặp, kỹ thuật tăng tự tin; gợi ý hình ảnh cá nhân |

---

## 14. Không gian nhà ở

> 💡 **Ý tưởng cốt lõi**: nhà không chỉ là nơi ở, mà còn là nơi tâm hồn nghỉ ngơi

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Nhà thiết kế không khí không gian nhà ở | Phân tích ảnh không gian, đề xuất phong cách, gợi ý nội thất/trang trí; xem trước hiệu quả bằng AR |
| 2 | Hướng dẫn thay đổi nhà cửa bốn mùa | Đề xuất chủ đề theo mùa, gợi ý lưu trữ và trưng bày, phương án trang trí ngày lễ; tạo danh sách mua sắm |
| 3 | Phép màu cho căn hộ nhỏ | Thuật toán tối ưu không gian, đề xuất đồ nội thất đa năng, mẹo lưu trữ; kỹ thuật mở rộng thị giác |
| 4 | Người tạo nghi thức tại nhà | Thiết kế nghi thức hằng ngày (sáng/tối/cuối tuần), nhắc thực hiện nghi thức; phản hồi hiệu quả nghi thức |
| 5 | Đồng hành tâm lý khi declutter | Đánh giá giá trị cảm xúc của đồ vật, hướng dẫn từng bước declutter, hỗ trợ tâm lý; đề xuất kênh quyên góp/tái chế |

---

## 15. Ẩm thực nấu nướng

> 💡 **Ý tưởng cốt lõi**: thức ăn là ngôn ngữ của tình yêu, nấu nướng là cách biểu đạt tình yêu

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Món ăn chữa lành cho một người | Nhận diện nguyên liệu trong tủ lạnh, đề xuất công thức đơn giản, hướng dẫn step-by-step; thẩm mỹ bày món cho một người |
| 2 | Thiết kế không khí bàn ăn ngày lễ | Thực đơn chủ đề ngày lễ, phương án bày bàn, kỹ thuật tạo bầu không khí; tối ưu trải nghiệm khách mời |
| 3 | Người ghép món ăn theo tâm trạng | Thuật toán liên hệ tâm trạng-thức ăn, công thức điều tiết cảm xúc, đề xuất comfort food; hướng dẫn chữa lành bằng nấu ăn |
| 4 | Xây dựng tự tin cho người mới vào bếp | Công thức siêu đơn giản, mẹo cứu lỗi, lời động viên xây dựng tự tin; tăng độ khó dần dần |
| 5 | Hướng dẫn không khí chụp ảnh món ăn | Gợi ý bày món, tận dụng ánh sáng tự nhiên, hướng dẫn góc chụp; gợi ý filter và hậu kỳ |

---

## 16. Phong cách ăn mặc

> 💡 **Ý tưởng cốt lõi**: ăn mặc là tự biểu đạt, phong cách là phần bên trong hiện ra bên ngoài

| STT | Tên kịch bản ứng dụng | Chức năng kịch bản ứng dụng |
| :--: | ------------ | ------------ |
| 1 | Moodboard trang phục hôm nay | Đề xuất tổng hợp theo thời tiết/dịp/tâm trạng, thử đồ ảo, cảm hứng phối đồ; quản lý tủ đồ |
| 2 | Stylist tủ đồ capsule | Kiểm kê tủ đồ, tổ hợp phối từng món, nhiều cách mặc một món; gợi ý mua sắm để lấp khoảng trống |
| 3 | Hành trình khám phá phong cách cá nhân | Trắc nghiệm phong cách, đề xuất icon tham khảo, lộ trình tiến hóa phong cách; xây dựng tự tin |
| 4 | Nhà sáng tạo phối mới đồ cũ | Cảm hứng cải tạo đồ cũ, cách phối mới, kỹ thuật nhấn bằng phụ kiện; triết lý thời trang bền vững |
| 5 | Cố vấn tạo hình dịp đặc biệt | Giải thích dress code theo dịp, tạo phương án tạo hình, gợi ý trang điểm và tóc; phối hợp tổng thể |

---

## Tâm pháp cốt lõi khi thiết kế sản phẩm B2C

### 1. Từ "chức năng" đến "cảm giác"

Sản phẩm B2B quan tâm "chức năng này giải quyết vấn đề gì", còn sản phẩm B2C quan tâm "chức năng này mang lại cảm giác gì".

| Tư duy B2B | Tư duy B2C |
|---------|---------|
| Nâng cao hiệu suất | Tiết kiệm thời gian để làm việc mình thích |
| Giảm chi phí | Khiến từng đồng chi ra đều đáng giá |
| Giải quyết điểm đau | Tạo trải nghiệm tốt đẹp |
| Chức năng đầy đủ | Cảm giác đúng chỗ |

### 2. Ba tầng tạo bầu không khí

**Tầng giác quan**: thiết kế thị giác, thính giác và xúc giác
- Màu sắc ấm áp
- Âm thanh thư giãn
- Hiệu ứng chuyển động mượt mà

**Tầng cảm xúc**: cộng hưởng và dẫn dắt cảm xúc
- Hiểu tâm trạng người dùng
- Cung cấp hỗ trợ cảm xúc
- Tạo cảm xúc tích cực

**Tầng ý nghĩa**: sự công nhận giá trị và cảm giác thuộc về
- Khiến người dùng cảm thấy được thấu hiểu
- Tạo cảm giác thuộc về
- Trao ý nghĩa cho hành động

### 3. Sức mạnh của gợi ý tâm lý

Copy và thiết kế của sản phẩm B2C đều đang truyền tải gợi ý tâm lý:

- **Gợi ý tích cực**: "Bạn đã làm rất tốt rồi", "Cứ từ từ, không sao cả"
- **Gợi ý thuộc về**: "Nhiều người cũng giống bạn", "Bạn không cô đơn"
- **Gợi ý trưởng thành**: "Mỗi lần thử đều là tiến bộ", "Bạn đang trở nên tốt hơn"

### 4. Giúp người dùng trở thành phiên bản tốt hơn của chính họ

Sản phẩm B2C tốt nhất không phải là thay đổi người dùng, mà là giúp họ trở thành con người họ muốn trở thành.

- Không phải "bạn nên...", mà là "bạn có thể..."
- Không phải "bạn phải...", mà là "nếu bạn muốn..."
- Không phải "bạn vẫn chưa đủ...", mà là "bạn đã..."

---

> 🌟 **Hãy nhớ**: người dùng B2C mua không phải chức năng, mà là cảm giác; không phải công cụ, mà là sự đồng hành; không phải dịch vụ, mà là sự thấu hiểu.

</TabItem>
</Tabs>

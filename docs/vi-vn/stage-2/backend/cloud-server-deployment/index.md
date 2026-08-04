<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# Đưa website lên mạng (nâng cao): tự chuẩn bị VPS để triển khai

> 💡 **"Đưa website lên mạng" nghĩa là gì?** Còn được gọi là "going live" hay "triển khai/xuất bản". Một trang web bạn tự xây trên máy tính của mình chỉ có mình bạn mở được. **Đưa lên mạng nghĩa là đặt nó trên một máy chủ chạy 24/7, để bất kỳ ai cũng có thể gõ một URL trong trình duyệt và truy cập** — giống như một tài liệu Word chỉ mình bạn đọc được, sau khi bạn đăng lên blog thì ai cũng xem được; khác biệt là lần này bạn đang xuất bản một trang web hoàn chỉnh.

Ở chương trước chúng ta đã học cách xuất bản dễ nhất — dùng các nền tảng PaaS một cú nhấp chuột như Vercel hoặc Zeabur. Chương này đề cập cách tiếp cận linh hoạt hơn, tự làm mọi thứ: **mua máy chủ đám mây của riêng bạn, tự thiết lập mọi thứ từ đầu và tự xuất bản trang web**. Bạn sẽ học cách chọn máy chủ, kết nối với nó, cài đặt môi trường, cấu hình Nginx, gắn tên miền và bật HTTPS. Khi đã hiểu điều này, không nền tảng nào có thể giới hạn bạn — chạy bất kỳ dịch vụ nào bạn muốn.

---

# 0. Chọn Cho Đúng: Cây Quyết Định Nền Tảng Triển Khai

Trước khi chọn nền tảng, hãy trả lời ba câu hỏi:

1. **Dự án của bạn có cần chạy 24/7 không?**
   - Không (chỉ phản hồi khi được truy cập, ví dụ tài liệu, blog, trang tĩnh) → **Static hosting / PaaS**
   - Có (cron jobs, trình thu thập dữ liệu, bot Telegram/Discord, dịch vụ WebSocket) → **PaaS luôn bật hoặc VPS**

2. **Bạn có cần GPU không?**
   - Không (chỉ gọi API OpenAI/Anthropic) → Các nền tảng thông thường là đủ
   - Có (chạy mô hình mã nguồn mở, tạo ảnh/video) → **Nền tảng đám mây GPU** (Modal, Replicate, Lambda Labs)

3. **Người dùng của bạn chủ yếu ở đâu?**
   - Toàn cầu / Mỹ / EU → Vercel / Railway / Fly.io / AWS
   - Trung Quốc đại lục → Đám mây Trung Quốc (Alibaba Cloud / Tencent Cloud) hoặc Cloudflare (nhanh ở Trung Quốc)
   - Cả hai → Dùng CDN, triển khai nội dung hướng tới Trung Quốc trên đám mây Trung Quốc, phần toàn cầu trên AWS kèm GeoDNS

```
What type of project are you deploying?
│
├─ Pure frontend static site (Vite/React/Vue build output)
│   ├─ Completely free → Cloudflare Pages (unlimited bandwidth) / GitHub Pages
│   ├─ Next.js project → Vercel (official platform, best DX)
│   └─ China users primarily → Cloudflare Pages or domestic OSS+CDN
│
├─ Backend API, doesn't need to be always-on (request-triggered)
│   ├─ Node.js/Python API → Vercel Functions / Cloudflare Workers
│   └─ Full-stack frameworks (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Needs always-on process (Bot, cron, WebSocket)
│   ├─ Don't want to manage servers → Railway / Render / Fly.io
│   ├─ Full control & cost savings → Buy a VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ China-facing projects → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Need to run AI models / GPU
│   ├─ Inference API → Modal / Replicate / Hugging Face Inference
│   ├─ Training/Fine-tuning → Modal / Lambda Labs
│   └─ China GPU → AutoDL / Alibaba Cloud PAI
│
└─ Large production projects
    └─ AWS/GCP + Kubernetes (hire DevOps or let AI write Terraform)
```

---

# 1. Các Nền Tảng Triển Khai Miễn Phí/Giá Rẻ Chi Tiết (Không Cần Máy Chủ)

Với hầu hết dự án cá nhân, demo và hồ sơ năng lực, bạn **hoàn toàn không cần mua máy chủ**. Phần này giới thiệu các nền tảng miễn phí/giá rẻ phổ biến nhất kèm cách đăng ký, cách sử dụng và những lỗi thường gặp.

## 1.1 Vercel — Lựa Chọn Hàng Đầu Cho Next.js / Frontend

**Website:** https://vercel.com

**Phù hợp nhất cho:** Dự án Next.js, frontend React/Vue, ứng dụng full-stack có Serverless Functions, chatbot AI (thời gian phản hồi nhanh)

**Cách sử dụng:**
1. Đăng ký bằng tài khoản GitHub
2. Nhấp "Add New..." → "Project"
3. Chọn repository GitHub của bạn
4. Vercel tự động nhận diện framework của bạn (Next.js/Vite/React v.v.), điền biến môi trường
5. Nhấp "Deploy" — trang web của bạn hoạt động sau 1-2 phút tại `xxx.vercel.app`

**Gói miễn phí (Hobby plan):**
- 100 GB băng thông/tháng
- 100 giờ thời gian build/tháng
- Thời gian thực thi Serverless Function **10 giây** (giới hạn quan trọng nhất!)
- HTTPS tự động, CDN toàn cầu, link preview PR

**Gói trả phí (Pro, $20/tháng):**
- Thời gian chờ của Function kéo dài đến 60-300 giây
- 1 TB băng thông
- Tính năng cộng tác nhóm

**⚠️ Những giới hạn quan trọng người mới hay vấp phải:**
- **Function timeout 10 giây** ở gói miễn phí: lời gọi API AI quá 10 giây sẽ bị ngắt kết nối. Gói Pro $20/tháng kéo dài lên 60 giây, 300 giây phải trả thêm phí
- **Không có tiến trình luôn bật**: không có cron, không có WebSocket long-polling, không có bot chạy vĩnh viễn
- **Cold start**: Function bị bỏ trống một thời gian sẽ phản hồi chậm ở request đầu tiên
- **Chi phí dự án AI**: phản hồi AI dạng streaming tiêu tốn băng thông; lưu lượng lớn có thể đẩy hóa đơn Pro lên $200/tháng

**Kết luận:** Vercel là trải nghiệm mượt mà nhất để triển khai trang frontend, tài liệu và demo nhanh. Nhưng với agent luôn bật hoặc lời gọi AI chạy lâu — đừng dùng Vercel.

## 1.2 Cloudflare Pages — Băng Thông Không Giới Hạn, Nhanh Toàn Cầu

**Website:** https://pages.cloudflare.com

**Phù hợp nhất cho:** Trang tĩnh, dự án tiêu tốn nhiều băng thông, khán giả toàn cầu, Edge Functions

**Gói miễn phí:**
- **Băng thông không giới hạn** (điểm bán hàng lớn nhất!)
- 500 lần build/tháng
- Không giới hạn số request
- Cloudflare Workers: 100.000 request/ngày
- Hơn 300 vị trí edge trên toàn thế giới, tốc độ khá tốt ngay cả ở Trung Quốc

**Cách sử dụng:**
1. Đăng ký tài khoản Cloudflare miễn phí
2. Vào Workers & Pages → Create → Pages → Connect to Git
3. Chọn repo của bạn, đặt lệnh build (Vite: `npm run build`, thư mục đầu ra: `dist`)
4. Nhấp Save and Deploy

**Thêm nữa: Workers AI:** Cloudflare còn hỗ trợ chạy các mô hình AI mã nguồn mở (Llama 3, Mistral, Stable Diffusion) trên các nút edge, miễn phí 10.000 neurons/ngày. Tuyệt vời để chạy mô hình nhỏ mà không cần phụ thuộc API OpenAI.

**Kết luận:** Lựa chọn tốt nhất cho trang tĩnh, đặc biệt là dự án có khán giả toàn cầu. Băng thông không giới hạn là một tính năng cực kỳ mạnh.

## 1.3 Railway — Trải Nghiệm Tốt Nhất Cho Dịch Vụ Backend (Luôn Bật)

**Website:** https://railway.app

**Phù hợp nhất cho:** Dịch vụ backend luôn bật, API Node.js/Python/Go, bot Discord/Telegram, dự án full-stack cần cơ sở dữ liệu

**Cách sử dụng:**
1. Đăng ký bằng GitHub
2. New Project → Deploy from GitHub repo (hoặc chọn template)
3. Railway tự động nhận diện loại dự án, cài dependencies, build và khởi động
4. Thêm cơ sở dữ liệu PostgreSQL/Redis/MySQL/MongoDB chỉ bằng một cú nhấp
5. Tên miền tự động tạo, hoặc gắn tên miền tùy chỉnh của bạn

**Giá cả:**
- Người dùng mới được **$5 credit dùng thử** (không miễn phí vĩnh viễn)
- Sau đó tính phí theo mức sử dụng, bắt đầu khoảng $5/tháng (dịch vụ luôn bật cấu hình tối thiểu + DB)
- Ngủ sau 5 phút không hoạt động (trong thời gian dùng thử miễn phí); không ngủ sau khi trả phí

**Kết luận:** Railway có trải nghiệm tốt nhất để triển khai API backend, bot và ứng dụng full-stack cần cơ sở dữ liệu — auto-deploy từ GitHub, cơ sở dữ liệu tích hợp, log và giám sát đều bao gồm sẵn.

## 1.4 Fly.io — Container Miễn Phí Thật Sự 24/7

**Website:** https://fly.io

**Phù hợp nhất cho:** Dịch vụ phân tán toàn cầu độ trễ thấp, muốn một container **thật sự miễn phí 24/7**, chấp nhận một chút độ dốc học tập

**Gói miễn phí:**
- 3 micro VM dùng chung (micro-1x, 256MB RAM)
- **Không giới hạn thời gian chạy** (không ngủ như Render)
- 160 GB lưu lượng ra/tháng
- 3 GB ổ đĩa bền vững (persistent volumes)
- Hơn 30 khu vực trung tâm dữ liệu toàn cầu
- Hỗ trợ GPU (A100/H100)

**Cách sử dụng:**
1. Đăng ký cần thẻ tín dụng (sẽ không bị trừ tiền, chỉ để xác minh danh tính)
2. Cài CLI flyctl
3. Viết tệp `fly.toml` trong dự án của bạn (AI có thể sinh ra tệp này)
4. `fly launch` → tự động build Docker image, cấp IP, triển khai
5. `fly deploy` để cập nhật, `fly logs` để xem log

**Kết luận:** Nếu bạn cần một **container miễn phí thật sự 24/7** cho bot/API/cron job, Fly.io là lựa chọn miễn phí tốt nhất. Đánh đổi là phải học các lệnh flyctl và kiến thức Docker cơ bản.

## 1.5 Render — 750 Giờ Miễn Phí Nhưng Có Ngủ

**Website:** https://render.com

**Phù hợp nhất cho:** Giai đoạn học tập, dự án cá nhân, dự án không ngại cold start

**Gói miễn phí:**
- Web Service: 750 giờ/tháng (một instance chạy liên tục)
- PostgreSQL: miễn phí 90 ngày (⚠️ sau đó DB bị xóa!)
- Trang tĩnh: hoàn toàn miễn phí, 100 GB băng thông

**⚠️ Vấn đề chính:**
- **Ngủ sau 15 phút không hoạt động**, cold start mất 10-30 giây (trải nghiệm tệ)
- Cơ sở dữ liệu miễn phí bị xóa sau 90 ngày — nhớ sao lưu!

**Kết luận:** Phù hợp cho dự án dev/test/trường học, nhưng đừng đặt dự án production hướng tới người dùng lên gói miễn phí. Gói trả phí bắt đầu từ $7/tháng để tắt tính năng ngủ.

## 1.6 Các Nền Tảng Đáng Chú Ý Khác

| Nền tảng | Loại | Gói miễn phí | Điểm nổi bật |
|----------|------|-----------|------------|
| **GitHub Pages** | Static hosting | Không giới hạn (giới hạn mềm 100GB) | Dễ nhất: push lên GitHub là lên mạng |
| **Hugging Face Spaces** | Ứng dụng AI | Instance CPU nhỏ miễn phí | Chuyên cho demo AI (Gradio/Streamlit) |
| **Modal** | AI/Serverless GPU | $30 credit/tháng | Python functions-as-a-service, GPU cold start <4s |
| **Replicate** | Hosting mô hình AI | Trả phí theo lần gọi | Biến mô hình thành API mà không cần quản lý hạ tầng |
| **Denoland Deploy** | Deno/Edge | Miễn phí 100k request/ngày | Nền tảng chính thức của Deno, TypeScript thuần |
| **Netlify** | Static hosting | 100GB băng thông/tháng | Hệ sinh thái plugin phong phú |
| **Supabase** | BaaS | Miễn phí DB 500MB | Bản thay thế mã nguồn mở cho Firebase, Postgres+Auth+Storage |
| **Neon** | Serverless Postgres | Miễn phí 500MB | Cơ sở dữ liệu nhánh (branchable) cho Serverless |
| **Upstash** | Serverless Redis | Miễn phí 10k lệnh/ngày | Redis dựa trên request cho Serverless |

---

# 2. Mua VPS Đám Mây: Hướng Dẫn AWS

Nếu bạn cần kiểm soát hoàn toàn môi trường máy chủ, chạy dịch vụ tùy chỉnh, hoặc PaaS không đáp ứng nhu cầu của bạn, đã đến lúc mua máy chủ đám mây của riêng mình. Phần này hướng dẫn qua AWS (nền tảng đám mây toàn cầu được dùng rộng rãi nhất), đồng thời đề cập các lựa chọn thay thế như DigitalOcean, Vultr và Hetzner.

## 2.1 AWS Free Tier — Miễn Phí 12 Tháng

AWS dành cho người dùng mới 12 tháng Free Tier, hoàn hảo để học tập và làm dự án cá nhân. Đây là những gì được bao gồm:

| Dịch vụ | Hạn mức Free Tier |
|---------|---------------------|
| **EC2** | 750 giờ/tháng t2.micro hoặc t3.micro (một instance chạy 24/7) |
| **S3** | 5GB lưu trữ tiêu chuẩn |
| **RDS** | 750 giờ/tháng db.t2.micro/db.t3.micro + 20GB lưu trữ |
| **Lambda** | 1 triệu request/tháng + 3,2 triệu giây tính toán |
| **CloudFront** | 50GB lưu lượng ra + 2 triệu request/tháng |
| **CloudWatch** | 10 metric tùy chỉnh + 1GB thu nhận log |
| **DynamoDB** | 25GB lưu trữ + 2,5 triệu đơn vị công suất đọc/ghi |

**⚠️ Quan trọng:** Free Tier hết hạn sau 12 tháng kể từ khi đăng ký, sau đó bạn sẽ bị tính phí theo giá tiêu chuẩn. Luôn thiết lập cảnh báo hóa đơn (Billing Dashboard → Budgets) để tránh khoản phí bất ngờ. Hãy xóa các tài nguyên không dùng!

### Cách tạo một EC2 instance (VPS của AWS):

1. **Đăng ký** tại https://aws.amazon.com/ bằng email và thẻ tín dụng
2. Vào **EC2 Dashboard** → **Launch Instances**
3. **Bước 1: Chọn Amazon Machine Image (AMI)**
   - Chọn **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-bit x86) — đây là lựa chọn thân thiện nhất với người mới
4. **Bước 2: Chọn Instance Type**
   - Chọn **t2.micro** (đủ điều kiện free tier, 1 vCPU, 1GB RAM)
5. **Bước 3: Cấu hình Instance Details**
   - Giữ nguyên mặc định (1 instance, VPC mặc định)
6. **Bước 4: Thêm Storage**
   - Ổ root gp2 8GB mặc định là đủ cho người mới bắt đầu
7. **Bước 5: Thêm Tags** (tùy chọn, để tổ chức)
8. **Bước 6: Cấu hình Security Group** (⚠️ RẤT QUAN TRỌNG — đây là tường lửa của bạn)
   - Tạo một security group mới
   - Thêm các rule:
     - Type: **SSH**, Port: 22, Source: **My IP** (chỉ IP của bạn được SSH)
     - Type: **HTTP**, Port: 80, Source: **Anywhere (0.0.0.0/0)**
     - Type: **HTTPS**, Port: 443, Source: **Anywhere**
9. **Bước 7: Review and Launch**
10. **Key Pair**: Khi được nhắc, tạo một key pair mới (ví dụ `my-aws-key.pem`), tải về và cất giữ an toàn. **Bạn không thể tải lại lần nữa!**
11. Nhấp **Launch Instances** → đợi 2-5 phút để nó khởi động

### Kết nối với EC2 instance của bạn:

```bash
# Trên terminal Mac/Linux cục bộ của bạn
chmod 400 my-aws-key.pem  # Đặt quyền truy cập chính xác (bắt buộc!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# ví dụ ssh -i my-aws-key.pem ubuntu@54.123.45.67

# Trên Windows dùng PuTTY (chuyển .pem sang .ppk) hoặc Windows Terminal với OpenSSH
```

**Lấy IP công khai của bạn:** Vào EC2 Dashboard → Instances → Chọn instance của bạn → Tìm "Public IPv4 address" trong phần chi tiết.

## 2.2 DigitalOcean — Tài Liệu Tuyệt Vời Cho Người Mới

**Website:** https://www.digitalocean.com

**Giá cả:** Droplet bắt đầu từ $4/tháng (512MB RAM, 10GB SSD, 500GB băng thông)

**Vì sao chọn DO:** Tài liệu của họ (gọi là "community tutorials") nổi tiếng — hầu như câu hỏi Linux/máy chủ nào cũng có một bài hướng dẫn DO được viết tốt. Giao diện của họ sạch sẽ và thân thiện với người mới.

**Cách sử dụng:**
1. Đăng ký (thẻ tín dụng hoặc PayPal, nạp tối thiểu $2 qua PayPal)
2. Nhấp "Create" → "Droplets"
3. Chọn Ubuntu 22.04, gói cơ bản $4/tháng, chọn trung tâm dữ liệu gần người dùng của bạn (NYC, SFO, London, Singapore, v.v.)
4. Thêm SSH public key của bạn (khuyến nghị) hoặc đặt mật khẩu root
5. Nhấp "Create Droplet" — sẵn sàng trong ~1 phút
6. Kết nối qua: `ssh root@YOUR_DROPLET_IP`

## 2.3 Vultr — Thanh Toán Theo Giờ, Nhiều Vị Trí

**Website:** https://www.vultr.com

**Giá cả:** Cloud Compute thường bắt đầu từ $5/tháng (1 vCPU, 1GB RAM, 25GB SSD, 1TB băng thông)

**Vì sao chọn Vultr:** Trả phí theo giờ (bạn có thể bật một máy chủ 10 phút để thử gì đó, rồi xóa nó và chỉ trả vài xu), hơn 30 vị trí toàn cầu, và họ có instance GPU giá phải chăng nếu sau này bạn cần.

## 2.4 Hetzner — Giá Trị Tốt Nhất Cho Dự Án Dài Hạn

**Website:** https://www.hetzner.com/cloud

**Giá cả:** CX11 bắt đầu từ €3.49/tháng (1 vCPU, 2GB RAM, 20GB SSD, 20TB lưu lượng!)

**Vì sao chọn Hetzner:** Tỷ lệ giá/hiệu năng tốt nhất ở châu Âu, mạng cực kỳ ổn định. Tuyệt vời cho dự án production chạy lâu dài. Điểm trừ là trung tâm dữ liệu nằm ở Đức/Phần Lan/Mỹ (không có vị trí châu Á).

## 2.5 So Sánh Nhanh Các Nhà Cung Cấp VPS

| Nhà cung cấp | Giá khởi điểm | Phù hợp nhất cho | Dùng thử miễn phí |
|----------|---------------|----------|-----------|
| **AWS EC2** | Free tier 12 tháng, sau đó ~$10/tháng | Học AWS, tích hợp doanh nghiệp | 12 tháng Free Tier |
| **DigitalOcean** | $4/tháng | Người mới, tài liệu tốt | $200 credit trong 60 ngày (người dùng mới) |
| **Vultr** | $5/tháng ($2.50 cho IPv6-only) | Thử nghiệm theo giờ, nhiều khu vực | $100 credit trong 30 ngày |
| **Hetzner** | €3.49/tháng | Dự án dài hạn giá trị tốt nhất | €20 credit |
| **Linode (Akamai)** | $5/tháng | Lâu đời, đáng tin cậy | $100 credit trong 60 ngày |

---

# 3. Thiết Lập Ban Đầu Cho Máy Chủ (Ubuntu 22.04)

Sau khi đã SSH vào máy chủ, việc đầu tiên là cập nhật hệ thống và cài đặt các công cụ cơ bản. Bạn có thể **copy prompt bên dưới vào trợ lý AI của mình** và để nó sinh ra các lệnh chính xác bạn cần:

> "Tôi vừa thiết lập một máy chủ Ubuntu 22.04 mới và muốn triển khai một dự án [Node.js/Python/...]. Hãy đưa cho tôi toàn bộ lệnh khởi tạo bao gồm: cập nhật hệ thống, tạo user sudo không phải root, cấu hình xác thực SSH key, cài Node.js 20, cài Nginx, cài Docker, cấu hình tường lửa ufw cơ bản."

Một quy trình thiết lập ban đầu điển hình:

```bash
# 1. Cập nhật hệ thống và cài các công cụ cơ bản
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. Tạo user thường (đừng luôn dùng root!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Cài Node.js (dùng nvm, KHÔNG dùng apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # kiểm tra

# 4. Cài Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# Truy cập http://YOUR-IP trong trình duyệt, sẽ thấy trang chào mừng của Nginx

# 5. Cài Docker (nếu dùng container)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # chạy Docker không cần sudo
# Đăng xuất và đăng nhập lại để hiệu lực
docker --version

# 6. Cấu hình tường lửa
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 Cấu Hình Security Group / Tường Lửa (RẤT QUAN TRỌNG!)

Trên AWS việc này được làm qua **Security Groups** (trong EC2 console). Trên DigitalOcean/Vultr thì nằm trong phần tường lửa của dashboard. Trên Ubuntu bạn cũng cần `ufw`.

**Ít nhất hãy mở các cổng sau:**

| Cổng | Mục đích | Khuyến nghị |
|------|---------|---------------|
| **22** | SSH | Bắt buộc; giới hạn về IP của bạn nếu có thể |
| **80** | HTTP | Bắt buộc cho web |
| **443** | HTTPS | Bắt buộc cho web an toàn |
| **3000-3999** | Cổng dev Node.js | Mở tạm để gỡ lỗi, đóng lại sau khi triển khai |

> ⚠️ **Sai lầm số 1 của người mới:** Ứng dụng đang chạy nhưng bạn không truy cập được. 90% là do security group/tường lửa không cho phép cổng đó.

---

# 4. Ba Kịch Bản Triển Khai Điển Hình

## 4.1 Kịch Bản 1: Triển Khai Frontend Tĩnh (Vite/React/Vue)

Sau khi `npm run build`, bạn có thư mục `dist/` chứa các tệp HTML/CSS/JS thuần.

**Đưa code lên máy chủ:**

```bash
# Phương án A: rsync từ máy cục bộ
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# Phương án B: git clone trên máy chủ (khuyến nghị, cập nhật dễ hơn)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Cấu hình Nginx:**

```bash
sudo vim /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name YOUR-IP-OR-DOMAIN;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # fallback định tuyến SPA
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Kích hoạt trang:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 Kịch Bản 2: Triển Khai Backend Node.js (Express/Fastify/NestJS)

Dùng **PM2** để giữ ứng dụng chạy nền:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # nếu dùng TypeScript
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # tự khởi động khi bật máy
pm2 logs myapp  # xem log
```

**Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 Kịch Bản 3: Triển Khai Full-Stack Bằng Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/myapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

Chạy với: `docker compose up -d`

---

# 5. Tên Miền & HTTPS

## 5.1 Mua Tên Miền & Cấu Hình DNS

Đăng ký tên miền qua Namecheap, Cloudflare Registrar, GoDaddy hoặc AWS Route 53. Trong cài đặt DNS của tên miền, thêm các **bản ghi A**:

| Loại | Host | Giá trị |
|------|------|-------|
| A | @ | IP máy chủ của bạn |
| A | www | IP máy chủ của bạn |
| A | api | IP máy chủ của bạn (cho backend) |

## 5.2 HTTPS Một Cú Nhấp Chuột Với Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# Chọn tùy chọn 2 (Redirect) để tự động chuyển HTTP sang HTTPS
sudo certbot renew --dry-run  # kiểm tra tự gia hạn
```

---

# 6. Tìm Hiểu Sâu Dịch Vụ Đám Mây (Ngoài VPS)

Khi bạn đăng nhập vào AWS Console (hoặc bất kỳ dashboard đám mây nào), bạn sẽ thấy hàng chục dịch vụ với cái tên khó hiểu (EC2, S3, RDS, ELB, VPC…). Phần này giải thích những dịch vụ phổ biến nhất và khi nào nên dùng chúng, **lấy AWS làm ví dụ chính** (các khái niệm ánh xạ trực tiếp sang đám mây khác).

## 6.1 Tổng Quan Kiến Trúc Đám Mây

Một ứng dụng web điển hình chạy trên đám mây trông như thế này:

```
User → CloudFront (CDN) → ALB (Load Balancer) → EC2 (Your App Server)
                              │                     │
                              │                     ├── S3 (images/files)
                              │                     ├── RDS (database)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (containers, advanced)
                              
         └── Route 53 (DNS) → maps your domain to CloudFront/ALB
             + ACM (SSL certs) → HTTPS encryption
```

Hãy đi qua từng dịch vụ.

## 6.2 Tính Toán (Compute): Nơi Code Của Bạn Chạy

### EC2 (Elastic Compute Cloud) — VPS

Đây chính là "máy chủ đám mây" chúng ta đang dùng. Nó là một máy ảo bạn có thể SSH vào, cài bất cứ thứ gì và cấu hình tùy ý.

- **Alibaba Cloud:** ECS
- **Tencent Cloud:** CVM / Lighthouse
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**Khi nào dùng:** Khi bạn cần kiểm soát hoàn toàn, phần mềm tùy chỉnh, tiến trình luôn bật.

### Lambda — Serverless Functions

Tải lên các đoạn code mà không cần quản lý máy chủ. Trả phí theo lần gọi và thời gian thực thi. Chỉ chạy khi được kích hoạt.

- **Alibaba Cloud:** Function Compute
- **Tencent Cloud:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**Khi nào dùng:** Các tác vụ không thường xuyên (webhook handler, xử lý ảnh, công việc theo lịch), API có lưu lượng nhấp nhô. **Không dùng cho** tiến trình luôn bật như bot WebSocket.

### ECS/EKS — Điều Phối Container

Nếu dự án của bạn dùng Docker và phát triển lên nhiều container/dịch vụ, hãy dùng Kubernetes để điều phối.

- **AWS ECS:** Dịch vụ container đơn giản hơn của Amazon
- **AWS EKS:** Kubernetes được quản lý
- **Alibaba Cloud:** ACK
- **Tencent Cloud:** TKE
- **Google Cloud:** GKE

**Khi nào dùng:** Kiến trúc microservice nhiều dịch vụ, tự mở rộng quy mô, dự án nhóm. Hầu hết dự án cá nhân không cần thứ này — một VPS + Docker Compose là đủ.

## 6.3 Lưu Trữ: Nơi Tệp Và Dữ Liệu Sống

### S3 (Simple Storage Service) ⭐ Được Dùng Nhiều Nhất

**Đây là dịch vụ phổ biến nhất ngoài máy chủ**, dùng để lưu ảnh, video, PDF, tài sản trang tĩnh, bản sao lưu, v.v. **Không bao giờ lưu tệp người dùng tải lên trên ổ đĩa cục bộ của máy chủ!** Chúng sẽ bị mất nếu bạn build lại/di chuyển/thay đổi kích thước máy chủ.

- **Alibaba Cloud:** OSS (Object Storage Service)
- **Tencent Cloud:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **Lựa chọn thay thế:** Cloudflare R2 (không tính phí egress — ưu đãi tuyệt vời!)

**Gói miễn phí:** AWS S3 cho 5GB lưu trữ tiêu chuẩn trong 12 tháng theo Free Tier. Alibaba Cloud OSS cho người dùng mới 5GB trong 6 tháng. Cloudflare R2 có gói miễn phí vĩnh viễn với 10GB lưu trữ.

**Bạn có thể làm gì với S3:**
- Lưu tệp người dùng tải lên (ảnh đại diện, hình ảnh, tệp đính kèm, ảnh sản phẩm)
- Host trang web tĩnh (tải thư mục `dist/` lên, bật "Static website hosting")
- Sao lưu bản xuất dữ liệu từ cơ sở dữ liệu
- Kết hợp CDN CloudFront để tải xuống nhanh toàn cầu
- Tạo pre-signed URL để chia sẻ tệp riêng tư

**Cách sử dụng S3 (hướng dẫn trong AWS Console):**

1. Vào **S3 Dashboard** → **Create bucket**
2. Nhập tên bucket **duy nhất toàn cầu** (ví dụ `myapp-images`)
3. Chọn AWS Region (ví dụ us-east-1 cho miền Đông Mỹ)
4. **Object Ownership:** Chọn "ACLs enabled" → "Bucket owner preferred" (đơn giản hơn cho truy cập công khai)
5. **Bỏ chọn** "Block all public access" nếu bạn muốn ảnh công khai (đọc cảnh báo, chỉ bỏ chọn cho nội dung công khai)
6. Giữ nguyên các cài đặt khác → Nhấp **Create bucket**
7. Nhấp vào bucket của bạn → **Upload** → Chọn tệp
8. Sau khi tải lên, mỗi tệp có một URL như `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. Dùng URL đó trực tiếp trong `<img src="...">` của frontend

**Dùng S3 với code (ví dụ Node.js, hãy nhờ AI viết logic đầy đủ):**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "myapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // make file publicly accessible
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **Lưu ý bảo mật quan trọng:** AWS Access Keys giống như mật khẩu S3 của bạn. **Không bao giờ hardcode chúng trong code frontend hoặc commit lên Git!** Hãy lưu chúng trong biến môi trường hoặc dùng IAM roles. Nếu key bị rò rỉ, hãy vô hiệu hóa ngay trong IAM console.

### EBS (Elastic Block Store) — Ổ Cứng Ảo

Khối lưu trữ gắn vào EC2 instance (giống ổ cứng của máy tính bạn). EC2 instance đi kèm một ổ root (thường 8-60GB); mua thêm EBS volume khi bạn cần thêm dung lượng.

- **Alibaba Cloud:** Cloud Disk (ESSD/SSD)
- **Tencent Cloud:** CBS (Cloud Block Storage)

**Khi nào dùng:** Thêm dung lượng đĩa cho máy chủ, dữ liệu cần tồn tại độc lập với vòng đời của EC2 instance.

### EFS (Elastic File System) — Lưu Trữ Tệp Dùng Chung

Một hệ thống tệp mạng mà nhiều EC2 instance có thể mount đồng thời. Phù hợp để chia sẻ tệp tải lên giữa nhiều máy chủ web.

- **Alibaba Cloud:** NAS
- **Tencent Cloud:** CFS

Hầu hết dự án nhỏ không cần thứ này — một máy chủ + S3 là đủ.

## 6.4 Cơ Sở Dữ Liệu: Lưu Trữ Dữ Liệu Có Cấu Trúc

### RDS (Relational Database Service) ⭐ Phổ biến

**Đừng chạy cơ sở dữ liệu production trên cùng VPS của bạn!** Về mặt kỹ thuật thì có thể làm được (chúng ta đã làm ở ví dụ Docker Compose phía trước), nhưng với production hãy dùng cơ sở dữ liệu được quản lý: sao lưu tự động, tính sẵn sàng cao, giám sát và mở rộng chỉ bằng một cú nhấp.

- **Alibaba Cloud:** RDS
- **Tencent Cloud:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**Các engine được hỗ trợ:** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle và Amazon Aurora (tương thích MySQL/PostgreSQL, tối ưu cho đám mây).

**Gói miễn phí:** AWS RDS tặng 750 giờ/tháng db.t2.micro hoặc db.t3.micro + 20GB lưu trữ trong 12 tháng.

**Cách thiết lập RDS (AWS):**

1. Vào **RDS** → **Create database**
2. Chọn **Standard create** → Engine: **MySQL 8.0** hoặc PostgreSQL
3. Templates: **Free tier** (để nằm trong hạn mức miễn phí)
4. Đặt DB instance identifier, master username, master password
5. Cấu hình instance: **db.t3.micro** (thuộc free tier)
6. Lưu trữ: 20GB gp2 (đủ điều kiện free tier)
7. Kết nối: Chọn **cùng VPC** với EC2 instance của bạn
8. **Public access:** No (chỉ cho phép truy cập từ bên trong VPC)
9. VPC Security Group: Tạo mới, hoặc chọn nhóm hiện có cho phép port 5432/3306 từ security group của EC2
10. Nhấp **Create database** → đợi ~5-10 phút
11. Khi sẵn sàng, lấy **Endpoint** (trông giống `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. Cập nhật `DATABASE_URL` trong ứng dụng của bạn trỏ tới endpoint này, và thêm security group của EC2 vào inbound rules của security group RDS

> 💡 **Mẹo vibecoding:** Hãy nói với AI "Tôi có một instance AWS RDS PostgreSQL tại [endpoint], user [username], hãy giúp tôi viết code kết nối và script migration cho [dự án của tôi]."

### ElastiCache — Redis/Memcached Được Quản Lý

Bộ nhớ đệm trong RAM cho dữ liệu nóng (giảm số truy vấn DB), lưu trữ session/token, hàng đợi tin nhắn, bảng xếp hạng, v.v.

- **Alibaba Cloud:** ApsaraDB for Redis
- **Tencent Cloud:** TencentDB for Redis
- **Thay thế:** Upstash (Serverless Redis, có gói miễn phí)

Với dự án nhỏ bạn có thể chạy `sudo apt install redis-server` ngay trên VPS; hãy dùng Redis được quản lý cho production/độ sẵn sàng cao.

## 6.5 Mạng: Truy Cập Nhanh Hơn, An Toàn Hơn

### CloudFront — CDN (Content Delivery Network) ⭐ Phổ biến

Lưu cache các tài nguyên tĩnh (ảnh, CSS, JS, video) của bạn tại các vị trí edge trên toàn thế giới để người dùng nhận nội dung từ nút gần nhất.

- **Alibaba Cloud:** CDN / DCDN
- **Tencent Cloud:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **Thay thế miễn phí:** Cloudflare CDN (gói miễn phí bao gồm băng thông không giới hạn)

**Khi nào dùng:**
- Trang web có ảnh/video/tệp lớn
- Người dùng trải rộng ở nhiều khu vực
- Giảm chi phí băng thông trên máy chủ gốc
- Cloudflare Pages về cơ bản = CDN + static hosting

**Cách cấu hình CloudFront:**
1. CloudFront console → **Create distribution**
2. Origin domain: chọn S3 bucket hoặc ALB của EC2 của bạn
3. Default cache behavior: Redirect HTTP to HTTPS
4. Create distribution → đợi ~5-15 phút để triển khai
5. Trỏ DNS của tên miền tới tên miền của distribution CloudFront (ví dụ `dxxx.cloudfront.net`) qua bản ghi CNAME

### ELB (Elastic Load Balancing) — Bộ Cân Bằng Tải

Phân phối lưu lượng truy cập đến nhiều EC2 instance, tự động loại bỏ các instance không khỏe mạnh.

- **ALB (Application Load Balancer):** Tầng 7 (HTTP/HTTPS), định tuyến theo đường dẫn, phổ biến nhất cho ứng dụng web
- **NLB (Network Load Balancer):** Tầng 4 (TCP/UDP), độ trễ cực thấp
- **GLB (Gateway Load Balancer):** Dành cho thiết bị ảo mạng
- **Alibaba Cloud:** SLB / ALB
- **Tencent Cloud:** CLB

Dự án một máy chủ không cần thứ này. Hãy dùng khi bạn mở rộng ra nhiều máy chủ backend.

### Route 53 — Dịch Vụ DNS

Chuyển tên miền thành địa chỉ IP. Hầu hết các nhà đăng ký tên miền đều bao gồm DNS miễn phí, nhưng Route 53 được tích hợp sâu với AWS.

- **Alibaba Cloud:** Alibaba Cloud DNS
- **Tencent Cloud:** DNSPod
- **Thay thế miễn phí:** Cloudflare DNS (một trong những DNS nhanh nhất toàn cầu, hoàn toàn miễn phí)

**Các loại bản ghi DNS phổ biến:**

| Loại | Mục đích | Ví dụ |
|------|---------|---------|
| **A** | Tên miền → địa chỉ IPv4 | `@ → 54.123.45.67` |
| **AAAA** | Tên miền → địa chỉ IPv6 | `@ → 2600:xxxx::` |
| **CNAME** | Tên miền → tên miền khác (dùng cho CDN) | `static → dxxx.cloudfront.net` |
| **MX** | Máy chủ thư (cần cho email doanh nghiệp) | - |
| **TXT** | Văn bản tùy ý (xác minh tên miền, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — Chứng Chỉ SSL Miễn Phí

AWS cung cấp chứng chỉ SSL/TLS miễn phí tự gia hạn khi dùng cùng CloudFront hoặc ALB. Chỉ cần yêu cầu chứng chỉ, xác minh qua DNS hoặc email, rồi gắn nó vào distribution/load balancer của bạn.

- **Alibaba Cloud:** Free SSL Certificates
- **Tencent Cloud:** Free SSL Certificates
- **Tùy chọn miễn phí phổ biến:** Certbot + Let's Encrypt (phương pháp chúng ta đã trình bày ở Phần 5, tự gia hạn 90 ngày)

### VPC (Virtual Private Cloud)

Một mạng ảo cô lập trên AWS nơi EC2, RDS và các tài nguyên khác của bạn hoạt động. Tài khoản mới nhận được một VPC mặc định. Cách dùng nâng cao (tách subnet công khai/riêng tư, NAT gateway) cần nghiên cứu sâu hơn.

## 6.6 Các Dịch Vụ Phổ Biến Khác

### Đăng Ký Tên Miền

- **Toàn cầu:** Namecheap, Cloudflare Registrar (bảo mật WHOIS miễn phí), GoDaddy
- **AWS:** Route 53 (cũng làm đăng ký)
- **Trung Quốc:** Alibaba Cloud Wanwang, Tencent Cloud DNSPod (bắt buộc để xin ICP filing)

### SES (Simple Email Service) — Gửi Email

Đừng tự chạy máy chủ mail (email của bạn rất dễ rơi vào spam). Hãy dùng dịch vụ email chuyên nghiệp.

- **AWS SES**, SendGrid, Mailgun, Resend
- **Trung Quốc:** Alibaba Cloud Direct Mail, Tencent SES
- Công dụng: email xác minh, thông báo, email marketing

### SNS (Simple Notification Service) — Thông Báo SMS/Push

Dành cho SMS, thông báo push trên di động. Twilio là lựa chọn phổ biến toàn cầu cho SMS.

### CloudWatch — Giám Sát & Log

Giám sát CPU/bộ nhớ/đĩa của EC2, xem log ứng dụng, thiết lập cảnh báo (CPU cao, dịch vụ chết).

- **Alibaba Cloud:** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud:** Cloud Monitor + CLS
- **Thay thế cho người mới:** giám sát tích hợp của PM2 + Uptime Kuma (mã nguồn mở, chỉ cần chạy một Docker container)

### S3 Nâng Cao: Xử Lý Ảnh / Lambda Triggers

S3 có thể tự động kích hoạt hàm Lambda khi có tệp được tải lên. Ví dụ, khi người dùng tải lên một bức ảnh lớn, một hàm Lambda có thể tự động thu nhỏ nó thành ảnh thumbnail. Ở Trung Quốc, Alibaba OSS có xử lý ảnh tích hợp (thêm `?x-oss-process=image/resize,w_300` vào URL) và Tencent COS có Cloud Infinite (CI) cho các tính năng tương tự.

## 6.7 Bản Đồ Dịch Vụ Đám Mây: AWS ↔ Đám Mây Trung Quốc ↔ Các Lựa Chọn Thay Thế

Tham khảo nhanh để tìm dịch vụ tương đương:

| Danh mục | AWS | Alibaba Cloud | Tencent Cloud | Thay thế Miễn Phí/Giá Rẻ |
|----------|-----|--------------|---------------|------------------------|
| Máy chủ đám mây | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| Lưu trữ đối tượng | S3 | OSS | COS | Cloudflare R2 (zero egress) |
| Cơ sở dữ liệu quan hệ | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Cache Redis | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (miễn phí) |
| Bộ cân bằng tải | ALB/NLB | SLB/ALB | CLB | Nginx tự host / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| Containers/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (miễn phí) |
| Chứng chỉ SSL | ACM (miễn phí) | Chứng chỉ miễn phí | Chứng chỉ miễn phí | Let's Encrypt (miễn phí) |
| Email | SES | Direct Mail | SES | Resend / SendGrid free tier |
| SMS | SNS | SMS | SMS | Twilio |
| Giám sát | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (tự host) |
| API AI/ML | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | OpenAI / Anthropic API |
| Đăng ký tên miền | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 Các Câu Hỏi Thường Gặp Cho Người Mới

**Hỏi: Tôi nên dùng dịch vụ đám mây được quản lý hay tự host mọi thứ trên VPS?**

- **Dự án cá nhân / học tập:** Tự host trên VPS (Docker Compose tất cả) — rẻ hơn và bạn học được nhiều hơn.
- **Production có người dùng thật:** Dùng dịch vụ được quản lý cho cơ sở dữ liệu và lưu trữ đối tượng (tự sao lưu, ổn định), ứng dụng có thể ở lại trên VPS.
- **Dự án có ngân sách/nhóm:** Dùng dịch vụ đám mây được quản lý càng nhiều càng tốt — dành thời gian cho logic nghiệp vụ, không phải vận hành.

**Hỏi: Làm sao dùng AWS Free Tier mà không bị tính phí?**

1. Luôn launch các instance **t2.micro/t3.micro** (có nhãn "Free tier eligible")
2. Thiết lập **Billing Alarm** ở mức $0 hoặc $1 (Billing Dashboard → Budgets → Create budget)
3. **Terminate/xóa** tài nguyên khi xong: EC2 instances, RDS databases, S3 buckets, EBS volumes, Elastic IPs
4. Lưu ý EBS volumes và Elastic IPs **vẫn bị tính phí ngay cả khi instance đã dừng** nếu không xóa
5. Kiểm tra Billing Dashboard hàng tháng

**Hỏi: AWS so với các nhà cung cấp VPS khác?**

- Học hệ sinh thái AWS / chuẩn bị cho công việc đám mây → Dùng AWS Free Tier
- Triển khai nhanh, dự án đơn giản, chi phí thấp nhất → DigitalOcean ($4/tháng) hoặc Hetzner (€3.49/tháng)
- Thử nghiệm theo giờ → Vultr (tính phí theo giờ, hủy bất cứ lúc nào)
- Khối lượng công việc AI/GPU → Modal hoặc Lambda Labs
- Container miễn phí hoàn toàn, chạy 24/7 → Fly.io free tier

---

# 7. Các Nền Tảng Triển Khai Chuyên Cho AI Agent

Nếu bạn đang triển khai AI Agent (không chỉ ứng dụng web thông thường), có những nền tảng được thiết kế riêng cho khối lượng công việc AI:

## 7.1 Modal — GPU Serverless Cho Python AI/ML

**Website:** https://modal.com

**Phù hợp nhất cho:** Dự án Python AI cần suy luận GPU, công việc theo lịch trình, xử lý dữ liệu hàng loạt

**Tính năng:**
- Định nghĩa hàm bằng Python decorators, `modal deploy` để triển khai chỉ với một lệnh
- GPU container cold start ~1 giây, tính phí theo mili giây
- Lập lịch tích hợp, quản lý secrets, lưu trữ dùng chung
- Gói miễn phí bao gồm $30 credit/tháng (đủ cho hầu hết dự án cá nhân)
- Chỉ hỗ trợ Python

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # Run your AI model/agent here
    return result
```

## 7.2 Hugging Face Spaces — Lựa Chọn Hàng Đầu Cho Demo AI

**Website:** https://huggingface.co/spaces

**Phù hợp nhất cho:** Giới thiệu nhanh demo AI (UI Gradio/Streamlit), trưng bày mô hình mã nguồn mở

**Tính năng:**
- Instance CPU nhỏ miễn phí; GPU trả phí
- Hỗ trợ Gradio, Streamlit, Docker
- Cộng đồng sôi động; mọi Space đều có code công khai và phần thảo luận
- Fork Space của người khác chỉ bằng một cú nhấp để chỉnh sửa

## 7.3 Replicate — Biến Mô Hình Thành API

**Website:** https://replicate.com

**Phù hợp nhất cho:** Biến mô hình AI thành HTTP API có thể gọi được mà không cần quản lý máy chủ

Đẩy mô hình của bạn lên, Replicate đóng gói nó thành HTTP API, tính phí theo từng lần gọi. Tuyệt vời để xuất bản các mô hình đã fine-tune.

## 7.4 Lambda Labs — Instance GPU Theo Yêu Cầu

**Website:** https://lambdalabs.com

**Phù hợp nhất cho:** Huấn luyện và suy luận tốn GPU với chi phí thấp hơn instance GPU của AWS/GCP. A100, H100, A10 có sẵn theo yêu cầu.

---

# 8. 🎯 Quy Trình Triển Khai Vibecoding: Để AI Làm DevOps Của Bạn

Đây là tư duy quan trọng nhất trong kỷ nguyên vibecoding khi nói về triển khai: **Bạn không cần nhớ từng lệnh — AI chính là trợ lý DevOps của bạn.**

## 8.1 Hai Chế Độ Cộng Tác Với AI

**Chế độ 1: Sinh script tại chỗ, tự thực thi**

Nói với trợ lý lập trình AI của bạn (Claude Code, Trae Solo, Cursor):

> "Tôi muốn triển khai [mô tả dự án] lên [nền tảng/máy chủ]. Hãy sinh:
> 1. Danh sách kiểm tra triển khai từng bước đầy đủ
> 2. Tất cả tệp cấu hình cần thiết (Nginx, PM2, Dockerfile, docker-compose)
> 3. Một script triển khai deploy.sh
> 4. Danh sách kiểm tra biến môi trường"

Sau đó chỉ cần thực thi những gì AI sinh ra.

**Chế độ 2: AI SSH trực tiếp vào máy chủ của bạn (thậm chí dễ hơn)**

Claude Code hỗ trợ thao tác SSH từ xa:

```bash
claude
# Hãy nói với nó:
# "SSH vào root@MY-IP và triển khai /root/myapp, cấu hình Nginx + HTTPS + PM2"
```

AI sẽ tự động kiểm tra môi trường, cài các dependency còn thiếu, kéo code, build, cấu hình và xác minh — tất cả mà bạn không cần gõ lệnh thủ công.

> ⚠️ **Lời nhắc an toàn:**
> - Hãy thực hành trên máy chủ thử nghiệm trước để chắc chắn AI không thực hiện các thay đổi phá hủy
> - Sao lưu dữ liệu quan trọng thường xuyên
> - Cấp cho AI một user có quyền tối thiểu (đừng cấp root; user sudo là được, nhưng phải theo dõi các lệnh)
> - Trước khi AI chạy các lệnh nguy hiểm, hãy xem xét điều nó sắp làm

## 8.2 Mẫu Prompt Triển Khai Phổ Quát

Dù bạn chọn nền tảng/máy chủ nào, hãy điền mẫu này và gửi cho AI để nhận một kế hoạch hành động hoàn chỉnh:

```
Help me deploy a project with the following info:

[DEPLOYMENT TARGET]
- Platform/Server: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- Server IP (if VPS): xxx.xxx.xxx.xxx
- Already configured: [SSH key login / Docker installed / Nginx installed / ...]

[PROJECT INFO]
- Project type: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Code location: GitHub repo https://github.com/xxx/xxx
- Tech stack: Node.js 20 + PostgreSQL 16 + Redis 7
- Start command: npm run start
- Listens on port: 3000
- Environment variables: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAIN]
- Domain: mydomain.com
- DNS already pointing to server: Yes/No
- Need HTTPS: Yes/No

[REQUIREMENTS]
1. Complete steps (list local vs server operations separately)
2. Provide all config files
3. Tell me how to verify successful deployment
4. List common gotchas and troubleshooting steps
```

## 8.3 Quy Trình Gỡ Lỗi Có Hỗ Trợ Của AI

Khi có sự cố:

1. **Kiểm tra log trước:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **Dán toàn bộ lỗi cho AI** kèm bối cảnh:
   > "Đang triển khai Node.js lên Ubuntu, gặp lỗi 502 Bad Gateway. Nginx error log: [dán vào]. Cấu hình: [dán vào]. PM2 status: [dán vào]. Giúp tôi gỡ lỗi."

3. **Tham khảo nhanh các sự cố thường gặp:**
   - **502 Bad Gateway:** Backend không chạy, sai port, proxy_pass không đúng
   - **Không truy cập được IP:** Security group không mở port, ufw chặn, Nginx chưa khởi động
   - **Refresh bị 404:** Nginx thiếu `try_files` cho định tuyến SPA
   - **Tài nguyên tĩnh 404:** Sai đường dẫn root, sai quyền tệp
   - **Chứng chỉ HTTPS lỗi:** Tên miền chưa trỏ về máy chủ, port 80 bị chặn
   - **PM2 khởi động lại liên tục:** Bug code gây crash, kiểm tra `pm2 logs`
   - **Vercel Function timeout:** Vượt giới hạn 10s — chuyển sang Fly.io/Railway/VPS cho các tác vụ chạy lâu
   - **Railway/Render 503:** Dịch vụ đang ngủ hoặc hết credit
   - **AWS EC2 connection refused:** Security group thiếu rule SSH hoặc sai port

---

# 9. Mẹo Sau Khi Triển Khai

## 9.1 Chuyển Tệp

```bash
# Local → Server
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# Server → Local
scp yourname@IP:/home/yourname/file.zip ./

# rsync (đồng bộ gia tăng, khuyến nghị cho triển khai)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 Script Cập Nhật Một Lệnh

Tạo `deploy.sh` trên máy chủ của bạn:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ Deployment complete!"
```

Cập nhật chỉ cần chạy `bash deploy.sh`. Để tự động hóa hoàn toàn, hãy thiết lập GitHub Actions (nhờ AI viết cấu hình CI/CD) để mỗi lần push lên main là tự động triển khai.

## 9.3 Danh Sách Kiểm Tra Tăng Cường Bảo Mật

Nhờ AI sinh một script tăng cường bảo mật hoàn chỉnh, thường bao gồm:
- Tắt đăng nhập bằng mật khẩu, chỉ dùng SSH key
- Đổi port SSH mặc định (22 → số khác)
- Cài fail2ban (tự động chặn các IP brute-force)
- Bật cập nhật bảo mật tự động: `sudo apt install unattended-upgrades`
- Không bao giờ commit secrets/.env lên Git
- Lên lịch sao lưu cơ sở dữ liệu định kỳ lên S3

---

# 10. Tổng Kết Chương

**Tóm tắt các lựa chọn triển khai:**

| Kịch bản | Khuyến nghị | Chi phí | Độ khó |
|----------|------------|------|-----------|
| Frontend/tài liệu thuần | Cloudflare Pages / Vercel / GitHub Pages | Miễn phí | ⭐ |
| Next.js full-stack (phản hồi nhanh) | Vercel | Miễn phí / $20/tháng | ⭐ |
| Backend API / Bot (luôn bật) | Railway / Fly.io (miễn phí) / VPS | $0-10/tháng | ⭐⭐ |
| Full-stack (kiểm soát hoàn toàn) | DigitalOcean / Vultr / AWS EC2 + Docker | $4-10/tháng | ⭐⭐⭐ |
| Demo AI Agent | Hugging Face Spaces | Miễn phí | ⭐ |
| Suy luận GPU AI | Modal (toàn cầu) | $0-30/tháng credit | ⭐⭐ |
| Production có người dùng | Dịch vụ được quản lý AWS/Azure/GCP | Tùy | ⭐⭐⭐ |

**Nhớ 5 bước cốt lõi:**
1. **Chọn nền tảng** → Dựa vào loại dự án của bạn (dùng bảng trên)
2. **Đưa code lên đó** → git push / rsync / GitHub auto-deploy
3. **Thiết lập môi trường** → Cài Node.js/Nginx/Docker (hoặc nền tảng tự lo)
4. **Giữ nó chạy** → PM2 / Docker / systemd
5. **Tên miền + HTTPS** → Bản ghi DNS + Certbot / ACM

**Tư duy vibecoding:**
1. Hiểu *cần làm gì*, không phải nhớ từng lệnh
2. Mô tả yêu cầu rõ ràng cho AI — nó sẽ đưa ra giải pháp hoàn chỉnh
3. Hiểu AI đang làm gì, xác nhận các bước quan trọng
4. Khi gặp lỗi, dán log cho AI — nó chẩn đoán được 90% sự cố
5. Sao lưu dữ liệu quan trọng, dùng quyền tối thiểu

Triển khai một lần rồi bạn sẽ nhận ra — đưa website lên mạng không khó lắm đâu. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['en/stage-2/backend/cloud-server-deployment']"
  title="Related Articles"
  description="Continue learning the engineering skills around deployment."
/>

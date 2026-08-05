# Fundamentals of Cloud Platforms in Practice
> **Learning Guide**: Cloud service providers are not "websites for buying servers" — they are "infrastructure that provides computing power like utility companies." This chapter revolves around one core question: **Starting from scratch, how do you understand and use cloud services?** We'll use real-world scenarios, vivid analogies, and hands-on steps to help you build a complete cognitive map of cloud services.

Before you begin, we recommend you first understand:

- **Basic Networking Concepts**: If you're not familiar with IP addresses, ports, and domain names, we recommend reading [Computer Network Basics](/en/appendix/1-computer-fundamentals/computer-networks)
- **What is an API**: If you're not familiar with APIs, you can start with [API Introduction](/en/appendix/4-server-and-backend/api-intro)

---

## 0. Introduction: Motivation for Fewering Companies Buying Servers

Imagine this scenario:

Xiao Ming started a business in 2010 and wanted to build a website. What did he go through?

He first spent 20,000 yuan on a Dell server, then contacted an IDC data center and paid 3,000 yuan per month for colocation. Then he installed Linux himself, configured the environment, and worried about hardware issues — when a hard drive failed, he had to replace it himself; when the machine overheated, he had to fix it himself. The most painful part was that when users suddenly surged and the system couldn't handle it, he had to buy yet another server. After a year, Xiao Ming had spent 50,000 yuan, yet the server utilization was only 10%.

Now consider Xiao Hong's company, which started in 2024. What did she do?

She opened a cloud provider's website, registered an account, and with a few clicks created a cloud server — done in 2 minutes. Pay for what you use; don't pay when you don't use it. When traffic spikes, upgrade the configuration with one click. Want to open a US branch? Just switch to a different region. After one month, Xiao Hong had spent 500 yuan, with server utilization at 80%.

**Intuitively, we might think: "Cloud services are just renting servers."**

But the essence of cloud services goes far beyond that — it is a **revolution in computing power**.

In the past, companies had to go through a lengthy process of buying servers, finding data centers, installing operating systems, worrying about hardware, and being helpless when traffic surged. Now, you just need to register an account, click a few times, pay on demand, auto-scale, and deploy globally. This transformation is like going from digging your own well to turning on a faucet for running water.

---

## 1. Overview of Cloud Service Providers

### 1.1 Computing Services Like Utility Companies

The essence of cloud service providers is to **package computing power, storage capacity, and network capabilities into standardized services**, delivered to users over the internet — just like water companies provide water and power companies provide electricity.

The brilliance of this model lies in **on-demand usage**. You don't need to purchase large amounts of hardware in advance; you only pay for what you actually use. Need more resources? One click. Some services even bill by the second, offering incredible flexibility. Moreover, cloud providers have data centers in dozens of countries, allowing you to deploy applications globally. All operations are self-service and available 24/7 without manual approval.

### 1.2 Cloud Services vs. Traditional Hosting

Traditional IDC colocation is like buying your own generator to produce electricity. You need to buy hardware (servers) first, then find a place to put them (data center colocation), and maintain them yourself (install OS, fix hardware). If you need more power, you have to buy another generator. This process can take days to weeks, with fixed costs regardless of whether you use it or not.

Cloud services are like connecting to the power grid. You don't need to buy a generator — just pull a wire (register an account) and pay for the electricity you use. Need more power? Switch to a higher-capacity plan in minutes. In this model, costs are variable — you pay for what you use — and the cloud provider handles all hardware maintenance, so you only need to focus on your business.

### 1.3 Public Cloud, Private Cloud, and Hybrid Cloud

Just as restaurants have different business models, cloud services come in three types.

**Public Cloud** is like a public restaurant — anyone can use it, with shared resources. AWS, Alibaba Cloud, and Azure are all public clouds, suitable for the vast majority of businesses and individuals. This is the focus of this book because it's the most commonly used and best suited for learning.

**Private Cloud** is like a private kitchen — self-built with dedicated resources. OpenStack and VMware are typical representatives, suitable for large enterprises, government agencies, and banks with extremely high data security requirements.

**Hybrid Cloud** combines the two — some workloads on public cloud, some on private cloud. All major providers have solutions, suitable for scenarios that require both compliance and elasticity.

Below, **click to explore**:
Click the service cards below to learn about the six core categories of cloud services.

<CloudServicesOverview />

---

## 2. Overview of the Major Cloud Service Providers

### 2.1 The Global Big Three: AWS, Azure, Google Cloud

In the global cloud services market, three providers dominate.

**AWS (Amazon Web Services)** is Amazon's cloud service launched in 2006, holding the #1 global market share at approximately 32%. It's like the "department store" of cloud services — the most comprehensive service offerings with over 200 services, the most mature and stable features, and the richest documentation and community resources. Pricing is on the higher side, but the value is excellent, especially suited for companies expanding overseas, startups, and large internet companies.

**Microsoft Azure** is Microsoft's cloud service launched in 2010, with approximately 23% global market share at #2. Its biggest advantage is deep integration with the Windows and Office ecosystem, rich enterprise customer resources, strong hybrid cloud capabilities, and being particularly friendly to .NET developers. If your company already uses the Microsoft technology stack, Azure is the natural choice.

**Google Cloud Platform (GCP)** is Google's cloud service launched in 2011, with approximately 10% global market share at #3. It leads in Kubernetes, data analytics, and AI, with strong technical innovation and relatively lower pricing. However, its market share is smaller and its ecosystem is less mature than the top two, making it suitable for technology-driven companies, containerized applications, and AI projects.

### 2.2 China's Big Three: Alibaba Cloud, Tencent Cloud, Huawei Cloud

In the Chinese cloud services market, there are also three major providers.

**Alibaba Cloud** was established in 2009 as Alibaba's cloud computing division, holding approximately 40% market share in China at #1. As the earliest and most mature domestic cloud provider, Alibaba Cloud offers comprehensive service types and deep technical expertise from e-commerce and Double 11. While pricing is relatively high, stability and feature completeness are top-notch, especially suited for domestic enterprises and e-commerce-related projects.

**Tencent Cloud** was established in 2013 as Tencent's cloud services division, holding approximately 15% market share in China at #2. It excels in gaming, audio/video capabilities, integrates well with the WeChat and QQ ecosystem, has relatively lower pricing, and has developed rapidly in recent years. If you're building gaming, social, or live-streaming projects, Tencent Cloud is a solid choice.

**Huawei Cloud** was established in 2015 as Huawei's cloud services division, holding approximately 10% market share in China at #3. It has strong hardware technology expertise, rich government and enterprise customer resources, strong security and compliance capabilities, and distinctive AI chips (Ascend). Suitable for government projects, large state-owned enterprises, and manufacturing.

### 2.3 Approach to choosing a Cloud Provider

Choosing a cloud provider is like choosing an apartment — you need to consider location, price, amenities, and more.

**First, look at your target market.** Where are your users primarily located? If users are in China, choose Alibaba Cloud or Tencent Cloud; if users are overseas, choose AWS or Azure; for global business, choose a provider with multi-region coverage.

**Next, look at your tech stack.** What technology are you using? If Microsoft technology, choose Azure; if Kubernetes and big data, choose Google Cloud; for general scenarios, AWS is a safe choice.

**Then consider cost.** For small projects testing the waters, cheaper options like Tencent Cloud or UCloud work; for large-scale production, look at total cost — AWS may be more cost-effective in the long run.

**Finally, consider the ecosystem.** If you're already using other services like GitHub or Office 365, choosing a provider in the same ecosystem will be more convenient.

Practical advice: Beginners or small projects should choose Alibaba Cloud or Tencent Cloud because the documentation is in Chinese and customer support is domestic; overseas expansion projects should choose AWS because it's the most mature with the best global coverage; large enterprises may need a multi-cloud strategy, using different clouds for different workloads.

---

## 3. Method for Typicallying Use Cloud Services

### 3.1 The Complete Process from Registration to Going Live

The first step in using cloud services is registering an account. This process is like opening a bank account — you need to verify your identity. Open the cloud provider's website, click "Free Registration," fill in your email and password, verify your phone number, then upload your ID or business credentials for real-name authentication, and finally bind a payment method. The entire process takes about 10 to 20 minutes.

After registration, you need to understand a few core concepts. **Region** is the geographic area where the cloud service's data center is located, such as East China (Hangzhou), US East (Virginia), or Asia Pacific (Singapore). The principle is to choose the one closest to your users for lower latency. **Availability Zone (AZ)** is one of multiple data centers within a region, isolated from each other to improve availability. If one AZ goes down, another can still serve. An **Instance** is a virtual server, such as a 2-core 4GB cloud server, billed by duration or usage.

### 3.2 Creating Your First Cloud Server

Creating a cloud server is like assembling a computer, but by selecting configurations on a web page. First, choose the billing model — pay-as-you-go for testing, or subscription for long-term operation. Then select the region closest to you, such as East China - Hangzhou. For instance specifications, 2-core 4GB is sufficient for a testing environment. For the image, choose an operating system like CentOS 7.9 or Ubuntu 20.04. Use 40GB for the system disk, the default VPC network, and pay-by-traffic bandwidth to save costs. Finally, set the root user password and make sure to save it. The entire process takes about 5 minutes, and after the instance is created, wait 1 to 2 minutes before using it.

Below, **click to explore**:
Select configurations to learn about pricing and applicable scenarios for different specifications.

<ComputeInstanceDemo />

### 3.3 Connecting to Your Cloud Server and Deploying an Application

Connecting to a Linux server is recommended via SSH. To log in with a password: `ssh root@your-server-public-ip`, then enter the password. Key-based login is more secure: `ssh -i your-private-key.pem root@your-server-public-ip`.

Once connected to the server, you can deploy your application. First, update the system — CentOS uses `sudo yum update -y`, Ubuntu uses `sudo apt update && sudo apt upgrade -y`. Then install necessary software like Node.js. Next, upload your code using git or scp. Finally, install dependencies and start the application.

### 3.4 Common Use Cases

**Hosting a personal website or blog** requires a cloud server and domain name. 1-core 2GB is sufficient, costing approximately 50 to 100 yuan per month. The tech stack can be Nginx with static files or WordPress.

**Deploying an API backend** requires a cloud server and database. Start with 2-core 4GB, costing approximately 200 to 500 yuan per month. The tech stack can be Node.js or Python with MySQL or PostgreSQL.

**Storing images or videos** is recommended with object storage, billed by storage volume and traffic, costing a few yuan to several hundred yuan per month. The advantage is not having to manage disks, automatic backups, and you can pair it with CDN for acceleration.

Below, **click to explore**:
Learn about different types of cloud storage services and their applicable scenarios.

<StorageTypeDemo />

---

## 4. Approach to Purchasing and Call APIs

### 4.1 Cloud Service Billing Models

Cloud services have various billing methods. Understanding them can save you a lot of money.

**Pay-as-you-go** is like buying individual movie tickets — pay for what you use, don't pay when you don't. Suitable for testing environments and projects with unstable traffic. Cloud servers are billed by the hour, object storage by GB plus request count, and AI APIs by call count.

**Subscription or Reserved Instances** is like buying a monthly or annual pass — commit to a certain duration for a discount, typically saving 30% to 60%. Suitable for long-running production environments. For example, a 2-core 4GB server that costs 200 yuan per month pay-as-you-go might only cost 140 yuan per month with a 1-year subscription.

**Spot Instances or Preemptible Instances** are like standby tickets — prices are very low, potentially saving up to 90%, but instances may be forcibly reclaimed. Suitable for batch processing tasks and fault-tolerant workloads like data processing and rendering. The risk is that the cloud provider may forcibly reclaim instances when resources are tight.

**Serverless pay-per-invocation** is like taking a taxi — you don't care about servers, only the number of invocations. Billing is based on invocation count plus compute time plus traffic, suitable for API endpoints and event-driven tasks. For example, Alibaba Cloud Function Compute offers the first 1 million invocations free, then 1.33 yuan per million invocations.

Below, **click to explore**:
Use the pricing calculator to compare cost differences between billing models.

<PricingCalculator />

### 4.2 The Complete Process of Purchasing API Calls

Using the Tongyi Qianwen API as an example, the entire process has four steps.

**Step 1: Activate the service.** Open the cloud provider's AI platform or Machine Learning Platform for AI (PAI), find Tongyi Qianwen or DashScope, click "Activate Now" or "Free Trial." It takes about 2 minutes.

**Step 2: Get the API Key.** Go to the console's API-KEY management, click "Create My API-KEY," copy and save this key. Important: The API Key is only displayed once — save it immediately.

**Step 3: Configure permissions.** Go to Access Control (RAM) or Identity and Access Management (IAM), create a user or role, and grant only the necessary permissions — for example, only allow calling Tongyi Qianwen, not deleting servers. This is the principle of least privilege.

**Step 4: Test the call.** Make your first call using Python or JavaScript to verify the API works correctly.

---

## 5. Hands-on: Deploying a Website from Scratch

### 5.1 Scenario and Solution Selection

Suppose you're a frontend developer who wants to deploy a personal blog website. The requirements are: static website (HTML/CSS/JS), custom domain name, fast global access, and minimal cost.

There are three options. The cloud server option has medium cost and medium difficulty, suitable for scenarios requiring backend services. The object storage plus CDN option has low cost and low difficulty, suitable for purely static websites — this is our recommended approach. The Serverless option has extremely low cost and medium difficulty, suitable for dynamic content.

We recommend the object storage plus CDN approach because: lowest cost (potentially free), simplest configuration, and fastest speed (CDN acceleration).

Below, **click to explore**:
Follow the step-by-step guide to learn the complete website deployment process.

<DeployWorkflowDemo />

### 5.2 Implementation Steps

**Step 1: Prepare website files.** Create a simple index.html:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Blog</title>
</head>
<body>
  <h1>Welcome to My Blog</h1>
  <p>This is my first post.</p>
</body>
</html>
```

**Step 2: Create an Object Storage Bucket.** Log into the cloud console, find Object Storage (OSS/S3), and click "Create Bucket." Configure the name (e.g., my-blog-2024, globally unique), select the region (closest to you), and set permissions to public read (the website needs to be accessible).

**Step 3: Upload files.** Enter the Bucket, click "Upload Files," select index.html, and wait for the upload to complete.

**Step 4: Configure static website hosting.** Go to Bucket settings, find "Static Pages" or "Website Hosting," enable the feature, set the default homepage to index.html, and save the configuration.

**Step 5: Bind a custom domain (optional).** Purchase a domain name (e.g., through Alibaba Cloud), add a CNAME record pointing to the Bucket domain, bind the custom domain in the Bucket, and configure HTTPS.

**Step 6: Configure CDN (recommended).** Activate CDN service, add the acceleration domain, select the origin (your Bucket), and wait for CDN to take effect (a few minutes to a few hours).

### 5.3 Cost Estimate

Monthly cost estimate: Object Storage 0 to 5 yuan (billed by storage volume), CDN traffic 0 to 10 yuan (billed by traffic, with free tiers), Domain name 5 to 10 yuan (annual cost amortized). Total: 5 to 25 yuan per month. Small websites may be completely free.

---

## 6. Summary and Next Steps

### 6.1 Key Takeaways

The essence of cloud services can be summarized as: Cloud providers are utility companies for computing power, offering on-demand usage, global deployment, and self-service capabilities. The workflow is: choose a provider, register an account, create resources, configure permissions, and monitor costs.

Key decision points include: choosing a provider based on market, tech stack, and cost; choosing a billing model by weighing pay-as-you-go, subscription, and Serverless; configuring permissions following the principle of least privilege, enabling MFA, and conducting regular audits; controlling costs by monitoring usage, using discounts, and promptly releasing unneeded resources.

### 6.2 Learning Path Recommendations

Week 1: Learn the fundamentals — understand basic cloud service concepts, register a cloud account, and create your first cloud server. Week 2: Hands-on practice — deploy a static website, configure a domain name and CDN, and learn basic Linux commands. Week 3: Advanced skills — including permission management (IAM), monitoring and alerting, and cost optimization. Week 4: Project practice — deploy a complete application, configure a database and storage, and implement auto-scaling.

### 6.3 Recommended Resources

Official documentation includes: Alibaba Cloud Documentation Center, AWS Documentation, and Tencent Cloud Documentation. Learning platforms include Alibaba Cloud University, AWS Free Tier, and Tencent Cloud Labs. Community resources include Cloud Native Community, Serverless China, and InfoQ Cloud Computing Column.

---

## 7. Glossary

| English Term | Chinese Translation | Description |
| :--- | :--- | :--- |
| **Cloud Provider** | 云服务厂商 | Companies that provide cloud computing services, such as AWS, Alibaba Cloud |
| **Region** | 地域 | The geographic area where a data center is located |
| **Availability Zone** | 可用区 | An independent data center within a region |
| **Instance** | 实例 | A virtual server |
| **Image/AMI** | 镜像 | A pre-configured operating system template |
| **VPC** | 虚拟私有云 | An isolated virtual network environment |
| **IAM/RAM** | 身份与访问管理 | Permission management system |
| **User** | 用户 | A specific identity |
| **Group** | 用户组 | A collection of users |
| **Role** | 角色 | A temporary identity |
| **Policy** | 策略 | A JSON document defining permissions |
| **API Key** | API 密钥 | Credentials for calling APIs |
| **AccessKey** | 访问密钥 | Credentials for programmatic access (ID + Secret) |
| **MFA** | 多因素认证 | Login method requiring password plus verification code |
| **CDN** | 内容分发网络 | Global acceleration service that caches static resources |
| **OSS/S3** | 对象存储 | Service for storing files |
| **ECS/EC2** | 云服务器 | Virtual hosting service |
| **RDS** | 关系型数据库服务 | Managed database |
| **Serverless** | 无服务器 | Computing model that doesn't require managing servers |
| **Pay-as-you-go** | 按需付费 | Billing model where you pay for what you use |
| **Reserved Instance** | 预留实例 | Subscription billing model |
| **Spot Instance** | 抢占式实例 | Low-price instances that may be reclaimed |

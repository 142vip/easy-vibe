# 应用应该做成什么平台

很多人一有想法，就先问：“该用 Flutter、Electron，还是微信小程序？”

这个顺序反了。平台不是一道技术偏好题，它取决于用户在哪里打开软件、任务发生在什么设备上，以及软件需要多深的系统权限。

比如，同样是“售后服务”：消费者入口适合放在微信小程序，客服和运营人员需要网页管理后台，维修工程师可能还要一个能拍照、扫码、离线填写的移动端。业务只有一个，入口却可以不止一个。

::: tip 先记住这句话
能用链接解决的，先做 Web；用户就在微信里，先做小程序；需要后台运行、硬件或系统权限，再考虑原生；同一业务有多种角色，就让多个客户端共用一个后端。
:::

## 1. 先问三个问题

### 用户会从哪里打开它？

- 从搜索、链接或企业门户进入：优先考虑网站或 PWA。
- 从微信群、公众号或线下二维码进入：优先考虑微信小程序。
- 每天长时间使用，窗口需要一直开着：优先考虑桌面端。
- 工作本来就在浏览器或编辑器里完成：优先考虑浏览器插件或 IDE 插件。

### 它需要哪些设备能力？

相机、扫码和定位不一定非要原生 App；真正拉开差距的是长时间后台运行、蓝牙和串口通信、本地大文件处理、系统级快捷键、设备驱动与严格的性能要求。

需要的权限越深，越应该靠近操作系统；只是填表、查数据、看报表，就没必要一开始承担原生开发的成本。

### 谁来长期维护？

“一套代码发布多个平台”可以减少重复工作，但不会消除平台差异。应用商店审核、登录、支付、通知、权限、文件系统和窗口行为，最后仍然要分别测试。

先做最重要的一个入口，确认业务有人用，再扩展第二个平台，通常比第一天就同时做五端更稳。

## 2. 十条常见架构路线

### 2.1 网站 / PWA：先让用户点开就能用

![网站与 PWA 架构：浏览器通过 Web 前端访问 API，Service Worker 负责缓存和离线能力](images/web-pwa-architecture.svg)

如果用户只是想打开链接完成一件事，Web 往往是第一版最省力的选择。PWA 仍然是网站，只是增加了安装到桌面、离线缓存等能力。

企业通常用它做 SaaS 后台、CRM、数据看板、知识库、在线教育、预约系统和内容网站。它最擅长公开访问、快速更新和多设备覆盖。

如果产品必须长期在后台运行，或者要深度访问蓝牙、系统文件与设备驱动，就不要硬把网页包装成原生软件。

相关教程：[开发 PWA 本地应用](../pwa-local-app/)

### 2.2 微信小程序：用户本来就在微信里

![微信小程序架构：微信客户端加载小程序，小程序调用云函数或企业 API，再访问数据库与文件存储](images/wechat-mini-program-architecture.svg)

小程序的优势不是“比 App 高级”，而是用户不用安装。扫码、群分享、公众号和门店入口都能把用户直接带进业务流程。

企业通常用它做会员中心、门店点单、活动报名、预约、售后工单、物流查询和轻量商城。用户侧流程很短、使用频率不高时，小程序尤其合适。

它受微信运行环境和审核规则约束。需要长时间后台任务、复杂本地计算或离开微信独立运营时，应当考虑 App 或 Web。

相关教程：[开发微信小程序](../wechat-miniprogram/) · [开发带后端的微信小程序](../wechat-miniprogram-backend/)

### 2.3 iOS / Android 原生：直接使用系统能力

![原生移动端架构：iOS 与 Android 分别使用平台 UI 和系统 API，共同连接业务 API](images/native-mobile-architecture.svg)

原生开发离操作系统最近。后台定位、蓝牙、健康数据、音视频、复杂动画和系统级安全能力，原生通常拥有最完整的支持。

企业通常用它做运动健康、导航、金融客户端、相机与剪辑工具、车机配套应用、蓝牙设备控制和高频消费类 App。

代价也很直接：iOS 和 Android 有各自的工程、发布流程和测试成本。只有一个人做第一版，而且核心功能只是表单与列表时，原生往往太重。

相关教程：[开发 iOS 应用](../ios-app/) · [开发 Android 应用](../android-app/)

### 2.4 Flutter / React Native：共享业务，分别落到两端

![跨端移动架构：共享代码生成 iOS 与 Android 应用，平台差异通过插件或原生模块补齐](images/cross-platform-mobile-architecture.svg)

团队明确需要 iOS 和 Android，又不想维护两套完整业务代码时，可以选择 Flutter 或 React Native。大部分界面和业务逻辑共享，平台能力再通过插件或原生模块接入。

企业通常用它做电商、会员、销售拜访、现场服务、内部办公和内容社区。它适合“两个移动平台的业务大体相同”这种情况。

跨端不是按一下按钮就自动适配。通知、支付、地图、权限和商店发布仍然要在两端分别验证；重度 3D、复杂音视频或大量平台专属能力，也可能需要回到原生。

相关教程：[开发 React Native + Expo 跨平台应用](../react-native-expo/) · [开发 Flutter 跨平台应用](../flutter-app/)

### 2.5 Electron / Tauri：用 Web 技术做桌面软件

![Web 技术桌面端架构：Web 界面通过安全桥接调用桌面进程，再访问文件、通知与系统能力](images/web-desktop-architecture.svg)

如果团队熟悉 Vue、React 或普通前端，又需要独立窗口、托盘、文件读写和桌面通知，Electron 或 Tauri 会比从头学习原生桌面开发更快。

企业通常用它做协作客户端、AI 桌面助手、知识库、数据导入工具、客服工作台和内部运营工具。Electron 自带 Chromium 与 Node.js，生态成熟；Tauri 使用系统 WebView，并通过 Rust 等能力连接系统，安装包通常更轻。

如果软件需要极低内存、复杂图形、设备驱动或严格实时响应，仅靠 Web 桌面方案可能不合适。

相关教程：[开发 Electron 桌面程序](../electron-voice-to-text/)

### 2.6 Qt / 原生桌面端：业务软件直接连接设备与系统

![Qt 与原生桌面架构：桌面界面连接 C++ 业务层，再访问设备协议、本地数据和企业服务](images/qt-native-desktop-architecture.svg)

Qt 不只是“工厂大屏”。在工业界和企业软件中，它常被用于设备控制台、医疗影像、汽车诊断、实验室软件、交易终端、工程设计工具和长期运行的桌面客户端。

这类软件通常需要连接串口、Modbus、CAN、仪器或本地数据库，还要在 Windows、Linux 与嵌入式设备上稳定运行。Qt 的价值在这里，不在于页面看起来像不像网页。

如果产品只是一个普通信息管理后台，Web 会更容易部署和维护；只有真的需要本地设备、离线运行或长期桌面交互时，才值得选择更重的桌面架构。

相关教程：[开发 Qt 企业设备与运营客户端](../qt-industrial-hmi/)

### 2.7 浏览器插件：功能就发生在网页旁边

![浏览器插件架构：内容脚本读取当前网页，后台服务协调任务，侧边栏展示结果并调用企业 API](images/browser-extension-architecture.svg)

如果用户的工作本来就在网页里，就别再让他复制内容、打开另一个系统、粘贴并提交。浏览器插件可以直接读取当前页面，在侧边栏或右键菜单里完成下一步。

企业通常用它做网页翻译、密码填充、销售线索补全、客服知识助手、合规检查、网页数据采集和内部流程快捷入口。

插件权限很敏感。只申请真正需要的站点和能力，并把共享密钥放在企业后端；需要脱离浏览器独立运行时，插件也不是合适的容器。

相关教程：[开发浏览器 AI 插件](../browser-ai-extension/)

### 2.8 VS Code 插件 / CLI：把工具放进开发流程

![开发者工具架构：编辑器或终端触发插件与命令行工具，再连接代码仓库、构建系统和服务 API](images/developer-tool-architecture.svg)

面向开发者的工具，最好出现在他们已经工作的地方。需要读取当前文件、展示诊断和提供编辑器交互时做 VS Code 插件；需要进入脚本、CI 和批处理流程时做 CLI。

企业通常用它做代码规范、依赖升级、项目脚手架、发布检查、数据库迁移、内部平台接入和 AI 编程助手。很多工具最后会同时提供插件和 CLI：一个负责交互，一个负责自动化。

相关教程：[开发 VS Code 插件](../vscode-extension/)

### 2.9 多端企业系统：不同角色使用不同入口

![多端企业系统架构：用户小程序、员工移动端、运营后台和桌面客户端共享统一身份、API 与数据](images/multi-client-enterprise-architecture.svg)

企业业务很少永远停在单个平台。消费者、现场员工、运营人员和管理者的工作环境不同，强迫所有人使用同一种客户端，体验通常会很差。

常见组合是：小程序服务消费者，移动端服务现场人员，Web 后台服务运营，桌面端连接本地文件或设备；下面共用统一身份、业务 API、数据库、文件存储和审计日志。

这里真正需要共享的是业务规则和数据，不是强求每个端的界面代码完全相同。第一版仍然应该只做最关键的入口，后端边界稳定后再扩展其他客户端。

### 2.10 Godot 等游戏引擎：场景、角色和交互围绕实时画面组织

![游戏引擎架构：场景与节点组织玩法，脚本和物理系统驱动实时画面，再导出到桌面、移动端或 Web](images/game-engine-architecture.svg)

横版动作、像素游戏和 3D 游戏都需要持续更新画面、处理输入、碰撞、动画、声音和关卡。Godot 这类游戏引擎已经把这些常用能力放进同一个编辑器，比从普通网页或原生 UI 框架里重新搭一套游戏循环更合适。

独立游戏、教学游戏、互动展览、产品演示和轻量 3D 体验都可以使用这条路线。真正准备发布时，桌面、Android、iOS 和 Web 仍然要分别导出并在目标设备上测试；选择游戏引擎也不代表像素美术、关卡设计和性能优化会自动完成。

相关教程：[用 Godot 开发横版、像素与 3D 游戏](../godot-game-development/)

## 3. 一张表先选出第一版

| 你的第一版要解决什么 | 优先选择 | 企业里常见的软件 | 最大代价 |
| --- | --- | --- | --- |
| 打开链接就能办事、需要搜索流量 | 网站 / PWA | SaaS、后台、知识库、门户 | 系统权限有限 |
| 用户主要从微信进入 | 微信小程序 | 会员、预约、工单、零售服务 | 受微信环境与审核约束 |
| 深度使用手机硬件或后台任务 | iOS / Android 原生 | 健康、导航、金融、设备控制 | 两端开发与发布成本高 |
| 同时覆盖 iOS 和 Android | Flutter / React Native | 电商、销售、现场服务 | 平台差异仍要单独处理 |
| 长时间在电脑上使用，团队熟悉 Web | Electron / Tauri | 协作、AI 客户端、内部工具 | 资源占用或系统适配成本 |
| 连接设备、协议或复杂本地数据 | Qt / 原生桌面 | 医疗、汽车、实验室、工程软件 | 技术和交付门槛较高 |
| 功能需要读取或改变当前网页 | 浏览器插件 | 翻译、客服、销售、合规工具 | 权限与浏览器兼容性 |
| 用户是开发者，需要进入编辑器或 CI | VS Code 插件 / CLI | 代码检查、脚手架、发布工具 | 用户范围集中在开发团队 |
| 需要实时画面、角色、碰撞和关卡 | Godot 等游戏引擎 | 横版游戏、像素游戏、3D 互动体验 | 美术、玩法与各平台性能仍要实测 |
| 多种角色、多个工作现场 | 多端组合 | CRM、售后、零售、运营平台 | 后端治理和产品协调更复杂 |

## 4. 企业里通常怎么组合

### 零售与会员服务

消费者用微信小程序查积分、领券和申请售后；店员用移动端核销；总部在 Web 后台配置活动和看数据。三个入口共用会员、订单和权限系统。

### 现场服务与售后

客户从小程序报修，工程师在移动端接单、拍照和离线记录，调度人员在 Web 后台安排任务。如果还要连接检测仪器，再给工程师增加 Qt 或原生桌面工具。

### 企业知识与 AI 助手

知识库和权限放在企业后端。员工在浏览器里工作，就提供侧边栏插件；在 VS Code 中工作，就提供 IDE 插件；需要批量处理时，再提供 CLI。

### 设备、医疗与工程软件

本地 Qt 或原生客户端负责设备通信、实时数据和安全操作，Web 平台负责远程配置、报表与管理。这里是工业界常见的软件组合，但它只是企业软件的一部分，不代表所有企业系统都需要 Qt。

## 5. 决策时按这个顺序走

![平台选型流程：先判断入口，再判断系统权限、工作时长与是否需要多个角色](images/platform-decision-map.svg)

如果几个答案同时成立，不必硬选唯一平台。先确定最重要的用户和最频繁的任务，把第一条完整链路做通，再决定第二个入口。

## 6. 几个常见误区

### “一套代码”不等于“一次测试”

跨端框架能共享代码，但不能替你完成权限、支付、通知、窗口、应用商店和真机兼容测试。选跨端是为了减少重复，不是消灭平台差异。

### 企业软件不等于工控软件

CRM、审批、排班、售后、知识库和零售会员都属于企业使用场景。只有真的连接设备、协议、实时数据或本地大文件时，Qt 与原生桌面端才会自然地成为优先选项。

### 不要第一天就做全平台

同时做 Web、小程序、iOS、Android 和桌面端，很容易得到五个都不完整的版本。先选一个最短入口验证业务，再扩展其他端。

### 客户端不同，后端仍应当统一

多端产品最怕每个客户端各写一套会员、订单和权限规则。界面可以不同，核心身份、业务规则、数据与审计应该从同一套后端提供。

## 7. 选好第一站，就开始做

平台选型不需要一次决定产品未来五年的样子。先选一个最容易接触到用户、也最能验证核心流程的入口，把第一版做出来。真实反馈出现以后，再决定要不要增加第二个平台。

<NavGrid>
  <NavCard
    href="/zh-cn/stage-3/cross-platform/wechat-miniprogram/"
    title="微信小程序"
    description="适合会员、预约、活动和轻量服务入口"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/wechat-miniprogram-backend/"
    title="带后端的微信小程序"
    description="把身份、工单、数据库和权限真正接起来"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/android-app/"
    title="Android 应用"
    description="需要移动端硬件与系统能力时从这里开始"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/ios-app/"
    title="iOS 应用"
    description="学习 Apple 平台的开发与发布流程"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/react-native-expo/"
    title="React Native + Expo"
    description="用 TypeScript 同时开发 Android、iOS 和 Web"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/flutter-app/"
    title="Flutter"
    description="用 Dart 让 Android 和 iOS 共用界面与业务代码"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/pwa-local-app/"
    title="PWA"
    description="让网站支持安装和离线使用"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/electron-voice-to-text/"
    title="Electron 桌面端"
    description="用 Web 技术构建跨平台桌面软件"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/browser-ai-extension/"
    title="浏览器插件"
    description="让工具直接出现在用户正在看的网页旁边"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/vscode-extension/"
    title="VS Code 插件"
    description="把开发者工具放进编辑器工作流"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/qt-industrial-hmi/"
    title="Qt 桌面与设备软件"
    description="连接设备、协议、本地数据和长期运行的业务"
  />
  <NavCard
    href="/zh-cn/stage-3/cross-platform/godot-game-development/"
    title="Godot 游戏开发"
    description="实际运行横版、像素和 3D 三种游戏场景"
  />
</NavGrid>

如果还是拿不准，就回到开头那三个问题：用户现在在哪里、任务需要什么系统能力、谁来维护。答案指向哪一端，就先从对应的教程开始。做完一条完整链路，比停在架构图里反复比较更有用。

## 参考资料

- [Apple SwiftUI 官方文档](https://developer.apple.com/swiftui/)
- [Android 应用架构指南](https://developer.android.com/topic/architecture)
- [PWA 官方学习指南](https://web.dev/learn/pwa/welcome)
- [Flutter 官方介绍](https://flutter.dev/)
- [React Native 官方入门](https://reactnative.dev/docs/environment-setup)
- [Godot 官方文档](https://docs.godotengine.org/)
- [Electron 进程模型](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Tauri 架构](https://v2.tauri.app/concept/architecture/)
- [Qt 官方介绍](https://doc.qt.io/qt-6/qt-intro.html)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/develop)
- [VS Code Extension Host](https://code.visualstudio.com/api/advanced-topics/extension-host)

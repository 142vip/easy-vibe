# 用 React Native + Expo 做一个同时运行在 Android、iOS 和 Web 的应用

你好，这一篇换一种做手机应用的办法：不用先写一套 Android，再写一套 iOS，而是用 TypeScript 做一个项目，让主要页面和业务逻辑同时跑在 Android、iPhone 和浏览器里。

这里有两个名字容易混在一起。**React Native** 负责把 React 组件变成 Android 和 iOS 真正的原生界面；**Expo** 把创建项目、导航、相机、通知、开发构建和发布工具接在一起。它们不是把网页塞进 WebView，也不是让 Android Studio 和 Xcode 从此消失。

如果团队已经会 React 或 TypeScript，要做会员、预约、电商、内容、巡检、工单或企业内部应用，这条路线很值得先试。两端需要完全不同的交互，或者产品长期依赖大量系统扩展、音视频底层和专用硬件时，先做一个关键功能原型，再和 Compose、SwiftUI 或 Flutter 比较，不要只看“一套代码”四个字。

React Native 官方的[新项目建议](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)是从框架开始，Expo 是其中明确推荐的方案。Expo 官方教程也把它称为一套可以同时运行在 [Android、iOS 和 Web](https://docs.expo.dev/tutorial/introduction/) 的项目。

## 先看三个已经上线的产品

选这三个案例，不是为了凑一份“谁在用 React Native”的名单。Shopify POS 适合看门店设备和原生硬件，Discord 适合看两端体验怎么统一，MTA 则把构建、更新和事故恢复讲得很具体。后面做原型时，我们也会分别借这三点。

### Shopify POS：共用代码，但要在低配设备上真测

Shopify POS 是门店收银和库存工具。店员会用它结账、查库存、处理订单和管理顾客，出错不是少一个动画，而是门店真的无法继续工作。

![Shopify POS 官方产品页展示的库存和门店界面](images/shopify-pos-product.jpg)

图片来自 [Shopify POS 官方产品页](https://apps.shopify.com/shopify-pos)。

Shopify 在[移动端技术选型说明](https://shopify.engineering/react-native-future-mobile-shopify)里记录过一次六周的 POS 实验：团队专门在低性能 Android 硬件上验证，才重新确定设备下限。到 2025 年，Shopify 又完成了 Shopify Mobile 和 POS 的 React Native 新架构迁移，两个大型应用仍保持每周发布，服务数百万商家。[迁移记录](https://shopify.engineering/react-native-new-architecture)

这篇的巡检首页先借了它的信息顺序：门店和班次放在最前面，紧接着就是完成进度、待办项目和现场问题。打开页面的人不用先找菜单，就能知道这次巡检做到哪里了。这一版先把这段交互跑通，本机保存和弱网恢复到第 7 节再接。

需要扫码枪、支付终端或特殊打印机时，也不必放弃 React Native。Shopify 的做法是让大部分产品界面继续共用，真正需要系统能力的部分再写原生模块。[Shopify 的原生代码管理说明](https://shopify.engineering/managing-native-code-react-native)讲了他们怎样划这条边界；React Native 官方也有[性能排查入口](https://reactnative.dev/docs/performance)，准备把原型放到门店旧设备前可以从这里继续。

### Discord：两端一致，不等于两端一模一样

Discord 早期就在 iOS 使用 React Native，后来重写 Android 客户端，让功能不再总是一端先上、另一端等待。下面是 Discord 官方发布 Android 新版本时展示的角色管理页面。

![Discord 官方展示的 Android 角色页面改版前后](images/discord-react-native-roles.png)

图片来源：[Discord 官方博客：Android 切换到 React Native](https://discord.com/blog/android-react-native-framework-update)。

右边的新界面不只是换颜色。角色数量、成员数量、排序和新增入口都变得更容易看懂。Discord 同时强调，Android 和 iOS 仍然保留各自熟悉的交互习惯。

本页原型没有为三端复制三套页面：巡检列表、进度和记录表单都在同一个 `App.tsx` 中；只有顶部间距和“当前运行平台”会根据 `Platform.OS` 变化。等到加入返回手势、权限弹窗、键盘和安全区时，再分别处理平台差异。React Native 官方的[平台专属代码说明](https://reactnative.dev/docs/platform-specific-code)给出了从小条件到独立文件的两种写法。

Discord 的工程团队还公开写过大型频道列表、动画和旧设备性能问题。他们没有用“跨平台”掩盖卡顿，而是在真实设备上测启动、滚动、CPU 和电量，需要时继续使用原生实现。[Discord 的 React Native 性能复盘](https://discord.com/blog/how-discord-achieves-native-ios-performance-with-react-native)

### MTA：生产应用必须准备好恢复办法

纽约大都会运输署 MTA 用 Expo 开发 TrainTime 等出行应用。路线、车次和购票都属于出错后必须尽快恢复的核心流程。

![Expo 官方案例展示的 MTA TrainTime 应用](images/expo-mta-case.png)

图片来源：[Expo 官方 MTA 案例](https://expo.dev/customers/mta)。

这份案例给出的数据很具体：移动团队服务约 35 万日活用户，TrainTime 在大量评价中保持 4.9 分；团队用 EAS Build 管理构建，用 EAS Update 处理适合在线更新的紧急修复。案例中提到，严重问题从收到报告到发布修复可以压到 90 秒以内。

值得学的不是“更新越快越好”，而是发布要可控：开发版、预览版和生产版分开，修复先验证，再逐步送到用户手里。Expo 自己的 [OTA 更新建议](https://expo.dev/blog/5-ota-update-best-practices-every-mobile-team-should-know)也给出了预览渠道、灰度发布和回滚的具体命令。涉及原生模块、权限或 SDK 的变化仍然要重新构建，不能靠热更新绕过应用商店。

这一版巡检原型还没有接 EAS Update，所以不会把 MTA 的能力写成我们的实测结果。本文实际采用的是同一套发布顺序：先用 Development Build 给开发者测试，再发内部版本，最后才进入生产渠道。到了第 10、11 节会把每一步需要的账号、签名和验证说清楚。

把三个案例放在一起，我们这次要做的产品就清楚了：一个不花哨的 **门店巡检应用**。它先告诉店员还有什么没做，允许记录现场问题；以后接后端时，再补照片上传、离线队列、账号隔离和失败重试。

## 1. 先看懂项目是怎么跑到三端的

![React Native 与 Expo 的项目结构](images/react-native-expo-architecture.svg)

TypeScript 项目里保存页面、表单和大部分业务规则。React Native 把这些组件交给各个平台渲染；Expo 提供常用设备能力和开发、构建工具。Web 端由 React Native for Web 处理。

共用的是主要代码，不是安装包。Android 最后仍要生成 APK 或 AAB，iOS 仍要签名并提交 App Store，Web 则生成网站资源。三个目标都要单独打开和测试。

## 2. 准备环境

先安装当前 LTS 版本的 Node.js，再准备一个代码编辑器。想在电脑上运行 Android，需要 Android Studio 和 Emulator；想在 Mac 上运行 iOS，需要 Xcode 和已经安装的 Simulator Runtime。也可以先在手机安装 Expo Go，用它体验第一版页面。

Expo Go 很适合刚开始看效果，但它只带固定的一组原生模块。准备做真实产品、接入自定义原生库或提交商店时，要换成 **Development Build**。Expo 官方也明确把 Expo Go 定位为学习沙盒，把 Development Build 作为真实项目的开发环境。[两种开发方式的区别](https://docs.expo.dev/workflow/overview/)

这一页在 2026 年 8 月实际使用了 Node.js 22.14、npm 10.9、`create-expo-app` 4.0 和 Expo SDK 57。版本会继续变化，以脚手架生成的项目和 [Expo SDK 文档](https://docs.expo.dev/versions/latest/)为准，不要手动把教程里的版本号抄进旧项目。

## 3. 创建第一个项目

新建一个空目录，用 AI 编程工具打开，然后说：

> 请创建一个 React Native + Expo + TypeScript 项目，名称是 store-inspection。先保留空白首页，告诉我怎样启动。

也可以直接执行 Expo 官方脚手架：

```bash
npx create-expo-app@latest store-inspection --template blank-typescript
cd store-inspection
npx expo start
```

终端出现开发服务器后：

- 按 `W` 打开 Web；
- 配好 Android Emulator 后按 `A`；
- Mac 安装好 iOS Simulator Runtime 后按 `I`；
- 使用 Expo Go 时，Android 在 Expo Go 里扫码，iPhone 可以用系统相机扫码。

Expo 官方的[创建项目教程](https://docs.expo.dev/tutorial/create-your-first-app/)也使用 `npx expo start`，并逐项解释了三种运行入口。

如果只看到空白页，先不要做业务功能：

> Expo 没有启动，错误是【粘贴错误】。请只修复启动问题。

## 4. 做出门店巡检首页

第一轮只做页面，不接数据库，也不要一次生成十个功能。

> 请把首页做成“门店巡检”。显示门店、班次、四项巡检、完成进度和现场问题。先用演示数据，不接后端。

下面是本页实际创建的 Expo 项目在 Web 端运行后的画面。它不是设计稿，也不是从别的产品截来的图。

![门店巡检应用真实运行在 Expo Web](images/expo-web-running.png)

浏览器窗口变窄后，内容应该变成手机宽度，按钮和文字不能挤在一起。

![同一个 Expo Web 应用的窄屏布局](images/expo-web-mobile-layout.png)

这张窄屏图用来检查响应式布局，不冒充 iPhone 模拟器截图。真正的 Android 和 iOS 还要在对应设备上重新验证。

界面不满意时，不要让 AI 全部重写：

> 首页信息太多。保留门店、进度、巡检项目和现场问题，其他先删掉。

## 5. 让巡检状态真的可以操作

静态页面顺眼以后，再让每一项可以勾选：

> 请让巡检项可以勾选和取消。进度要跟着变化，已经完成的项目要容易看出来。

逐项点击，确认进度只加一次；取消后要正确减一。按钮还要带有可访问性名称，屏幕阅读器不能只读出“方块”。React Native 官方的 [Accessibility API](https://reactnative.dev/docs/accessibility)列出了 `accessibilityRole`、状态和标签的写法。

如果数字变化不对：

> 我勾选一项后进度错误。请只修复进度计算，不改页面样式。

## 6. 记录现场问题

先做文字记录：

> 请增加现场问题输入框和保存按钮。空内容不能保存，成功后清空输入框并显示刚保存的记录。

本页实测时，勾选“检查安全出口”以后，进度从 `1/4` 变成 `2/4`；输入“消防通道有纸箱，已通知值班员移走”并保存，记录出现在页面，输入框也恢复为空。

![真实点击和保存后的巡检记录](images/expo-web-record-saved.png)

现场巡检经常还要带照片。文字链路稳定后再增加：

> 请给现场问题增加拍照和相册选择。选择后先预览，用户确认保存时才加入记录。

Expo 的 [ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)可以调用系统相机和相册。权限被拒绝时，要告诉用户去哪里开启；上传失败时要保留本地记录，不能把整张页面卡在“加载中”。

Web、Android 和 iOS 的选择器界面不会一样，这正是必须分别测试的地方。

## 7. 先保存本机，再考虑同步

门店网络不稳定时，点击保存不能完全依赖服务器。先把巡检结果、现场说明和照片路径保存在本机，再把需要上传的内容放进待同步队列。

> 请把巡检进度和现场记录保存在本机。关闭应用再打开时可以恢复，先不要接服务器。

简单键值可以使用 AsyncStorage；数据开始出现巡检单、明细和同步任务之间的关系时，更适合用 SQLite。Expo 提供了可持久化的 [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)，也整理了[本地优先应用指南](https://docs.expo.dev/guides/local-first/)。

本机恢复正常以后，再加联网状态：

> 请给记录增加“待同步、同步中、已同步、失败”四种状态。断网时留在待同步，联网后可以手动重试。

测试不要只看一个绿色图标。保存两条记录，关闭应用再打开，然后断网、重连、重复点击重试。服务端要为每次提交准备唯一编号，重复请求不能生成两条相同巡检单。

## 8. 接企业后端时，先把边界说清楚

巡检原型可以只用本机数据，企业版本通常还要登录、门店权限、图片存储和管理后台。开始写接口前，先让 AI 把数据边界讲明白：

> 请先设计巡检后端。说明用户、门店、巡检单、问题记录和照片怎样关联，不要写代码。

确认以后再接登录：

> 请接入现有登录接口。用户只能看到自己有权限的门店，客户端不能自己修改角色。

登录 Token 可以使用 [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)保存在移动端安全存储中；Web 端要使用适合网站的会话方案。企业后端密钥不能写进 App、`EXPO_PUBLIC_` 环境变量或打包文件，因为客户端内容最终都能被用户读取。

图片也不要未经检查就直接公开：

> 请通过后端上传现场照片。限制类型和大小，显示上传进度；失败时保留本地记录并允许重试。

再用两个测试账号验证：A 账号不能读取 B 账号的门店、巡检单、照片地址和离线队列。前端隐藏按钮不是权限控制，真正的限制必须在服务端。

## 9. 分别打开 Android、iOS 和 Web

页面能在浏览器打开，只能证明 Web 目标通过。接下来保持开发服务器运行，分别进入三端。

### Android

Android Studio 安装好 SDK 和 Emulator 后，先启动一个虚拟设备，再按 `A`。也可以用 Android 真机的 Expo Go 扫码。

至少检查系统返回键、相机权限、键盘遮挡、断网恢复和低性能设备滚动。Shopify POS 的经验已经说明，开发者电脑上的流畅不能代替门店设备测试。

### iOS

Mac 安装 Xcode 以后，还要在 Xcode 设置中下载一个 iOS Simulator Runtime；只有 Simulator SDK、没有 Runtime 时，`I` 仍然无法启动设备。真机首次运行还会涉及本地网络、相机和照片权限。

检查安全区、向右返回手势、键盘、深色模式和权限拒绝后的提示。不要拿 Web 窄屏图写成“iOS 已通过”。

### Web

按 `W` 后检查鼠标与键盘操作、浏览器刷新、窄屏布局和控制台错误。准备部署时再生成生产资源：

```bash
npx expo export --platform web
```

本页临时项目已经实际通过 TypeScript 检查和这条 Web 导出命令；Metro 成功生成 374 KB 的 JavaScript bundle 和 `dist` 目录。实际页面的勾选、进度变化与记录保存也在浏览器中操作过。

这台测试机虽然安装了 Xcode 和 iOS Simulator SDK，但没有任何 Simulator Runtime 或可启动设备；Android 端也没有配置 SDK 平台、Emulator 和可启动 AVD。因此这里没有把 Android、iOS 写成“已验证”，更没有用别人的手机截图代替。

## 10. 从 Expo Go 换到 Development Build

页面和基本交互跑通后，真实项目应尽早做自己的开发构建。它可以包含项目需要的原生库，团队成员拿到的也是同一套调试环境。

> 请把当前 Expo 项目改成 Development Build。先列出会修改的配置和本机需要的工具。

通常会安装 `expo-dev-client`，再选择本地构建或 EAS Build。Expo 的 [Development Build 教程](https://docs.expo.dev/develop/development-builds/introduction/)解释了它与 Expo Go 的差别；[EAS 教程](https://docs.expo.dev/tutorial/eas/introduction/)则完整覆盖构建、内部分享、更新和商店提交。

做云端构建需要 Expo 账号；提交 App Store 和 Google Play 还需要各自的开发者账号、包名、签名和商店资料。这些都是外部状态，AI 不能替你编造已经通过的账号验证。

开发版安装到真机以后，再测试相机、照片、通知、离线恢复和后台切换。模拟器能打开，不代表这些设备能力已经完成。

## 11. 把测试放在发布前面

巡检应用最容易出问题的不是标题颜色，而是记录重复、切账号串数据和断网丢内容。先让 AI 为这些规则补测试：

> 请为进度计算、空记录、重复提交和账号隔离增加测试。不要测试具体颜色和间距。

Expo 官方的[单元测试指南](https://docs.expo.dev/develop/unit-testing/)使用 Jest 和 React Native Testing Library。自动测试负责稳定的业务规则，真机负责权限、相机、性能和系统交互，两者不能互相代替。

准备给同事试用时，先做内部版本，不要直接推到所有用户：

> 请配置 Android 和 iOS 的内部测试构建。先告诉我需要哪些账号、包名和签名资料。

Expo 的[内部发布说明](https://docs.expo.dev/review/overview/)列出了应用商店测试轨道、内部分享和 Development Build。上线以后如果使用 EAS Update，也要把预览与生产渠道分开，确认哪些修改必须重新发安装包。

## 12. 把它交给真正巡店的人试一次

做到这里，先别急着把功能继续堆满。让一位没有参与开发的同事拿着手机走完整个流程：打开当天任务，勾完几项，断网记一条问题，拍照，退出应用，再回来继续。恢复网络以后，他应该看得懂哪些已经同步、哪些失败，也应该知道怎样重试。

如果同事总要问“我刚才到底保存了吗”，问题通常不在 React Native，而在产品状态没有说清楚。Shopify POS、Discord 和 MTA 值得参考的地方也正在这里：跨平台只是底座，成熟产品真正花时间的是设备差异、弱网、性能、发布和出错后的恢复。

这次实跑的 Web 原型已经把最小链路接起来了：任务能勾选、进度会变化、现场文字能保存。下一步不是宣称三端完成，而是把同一个项目装到 Android 和 iPhone，再补本机持久化、照片、后端权限和内部发布。每完成一层，就留下对应设备和对应版本的证据。

## 继续参考

- [React Native：使用框架创建新项目](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)
- [React Native 官方产品 Showcase](https://reactnative.dev/showcase.html)
- [Expo：Android、iOS 和 Web 通用应用教程](https://docs.expo.dev/tutorial/introduction/)
- [Expo：开发流程与 Development Build](https://docs.expo.dev/workflow/overview/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo：本地优先应用](https://docs.expo.dev/guides/local-first/)
- [Expo：应用测试](https://docs.expo.dev/develop/unit-testing/)
- [Expo：构建、更新与提交](https://docs.expo.dev/tutorial/eas/introduction/)
- [Shopify Engineering：React Native 移动端实践](https://shopify.engineering/react-native-future-mobile-shopify)
- [Discord：Android 客户端切换到 React Native](https://discord.com/blog/android-react-native-framework-update)
- [Expo：MTA 生产案例](https://expo.dev/customers/mta)

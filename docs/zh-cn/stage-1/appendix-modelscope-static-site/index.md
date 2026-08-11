---
title: 在魔搭社区发布你的网页
description: 从纯 HTML 到 Vue、React、Vite 构建产物，结合魔搭官方 Skill 与创空间发布静态网页的完整教程
---

# 在魔搭社区发布你的网页

网页终于做出来了，接下来当然要找个地方展示，让朋友、同学或者真正的用户可以直接打开它。

我们可以租一台服务器，自己配置域名、HTTPS 和部署流程；也可以把作品托管到成熟的开源社区，少处理一些运维工作，把精力留给页面本身。这一节我们选择第二种方式：把网页发布到 **魔搭社区（ModelScope）**。

魔搭社区由达摩院联合 CCF 开源发展委员会发起，除了开源模型和数据集，也提供用于展示应用的 **创空间（Studio）**。说到杭州，魔搭和这里的开发者社区也很有缘：社区曾在杭州举办[“搭友来碰头”核心开发者共创会](https://community.modelscope.cn/683562c6870cef7360622f7f.html)，来自杭州、上海、南京、北京等地的开发者一起交流开源项目。对我们来说，创空间最实用的一点是：不用先成为运维专家，也能给自己的作品准备一个可以分享的展示地址。

> 本文依据魔搭社区当前的创空间页面、官方 Skill 和命令行资料整理，最后核验于 **2026 年 8 月 11 日**。魔搭仍在快速更新，按钮位置可能变化，但“创建 Static 创空间 → 上传构建产物 → 部署 → 通过创空间链接访问”的主流程不变。

魔搭社区的 **创空间（Studio）** 不只可以运行 Gradio、Streamlit 和 Docker 应用，也支持 `static` 类型，即**已经构建好的纯静态网站**。如果你的网页最终能变成 `index.html`、CSS、JavaScript、图片等文件，就可以用这种方式发布。

发布完成后，你会得到一个类似下面的公开页面：

```text
https://modelscope.cn/studios/你的用户名/你的空间名
```

## 先选对发布方式

| 你的项目 | 选择的创空间类型 | 发布前要做什么 |
| --- | --- | --- |
| 纯 HTML / CSS / JavaScript | **Static / 静态网页** | 不需要构建，直接准备网页文件 |
| Vue、React、Vite、Svelte 等前端项目 | **Static / 静态网页** | 先执行构建，只上传 `dist` 或 `build` 里的内容 |
| Gradio 应用 | Gradio | 准备 `app.py` 和 `requirements.txt` |
| Streamlit 应用 | Streamlit | 准备 Streamlit 入口文件和依赖 |
| 有自定义后端、系统依赖或特殊启动方式 | Docker | 编写 Dockerfile，服务监听平台要求的端口 |

本文重点讲前两种。**不要把 Vue、React 的源代码直接当成 Static 网站上传**：浏览器不能替你执行 `npm install` 和 `npm run build`。

## 推荐：用官方 Skill 和 AI 协作发布

魔搭官方维护了 [ModelScope Skills](https://github.com/modelscope/modelscope-skills)，其中与发布网页最相关的是下面两个 Skill：

| Skill | 作用 | 什么时候使用 |
| --- | --- | --- |
| `ms-hub` | 魔搭平台的统一入口，覆盖仓库、模型、数据集、创空间、MCP 和 Skills Center | 第一次接入魔搭，或只需执行创空间快捷操作 |
| `ms-studio-deploy` | 专门把本地项目部署到创空间，覆盖项目识别、创建空间、Git 同步、部署、日志检查和故障诊断 | **发布或更新本地网页时优先使用** |

`ms-studio-deploy` 会根据项目文件判断运行类型：根目录已有 `index.html` 的构建产物会识别为 `static`。Static 创空间不负责运行 `npm run build`，因此 Vue、React、Vite 项目仍要先在本地构建。

### 安装 Skill

先安装魔搭 SDK，再安装统一入口和创空间部署 Skill：

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

如果当前安装的 `modelscope` 命令没有 `skills` 子命令，可以使用官方安装脚本：

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Skill 默认安装到 `~/.agents/skills/`，Codex、Cursor、Claude Code 等支持 Agent Skills 的工具可以从这里发现它们。安装后重新开始一次智能体会话，让工具刷新可用 Skill 列表。

### 怎样用 Skill 发布

按照魔搭官方 [`ms-studio-deploy` 教程](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)，你不需要自己照着文档逐条执行创建、推送、部署和查日志命令。准备好下面三样东西，就可以把完整流程交给 AI：

1. 已经安装 `ms-studio-deploy` Skill，并重新打开了一次智能体会话；
2. 当前目录是准备发布的目录，而且根目录直接包含 `index.html`；
3. 本机已经配置魔搭 Access Token。

第一次使用时，前往 [Access Token 页面](https://modelscope.cn/my/myaccesstoken) 获取令牌，并在终端设置：

```bash
export MODELSCOPE_API_KEY="你的令牌"
```

纯 HTML 项目直接进入网页目录。Vue、React、Vite 等项目先构建，再进入产物目录：

```bash
npm run build
cd dist
```

上面以 Vite 的 `dist` 为例；如果项目生成的是 `build` 目录，就进入 `build`。

然后在 Codex、Cursor、Claude Code 等支持 Agent Skills 的工具中打开这个目录。

#### 最简单的提示词

只需要说这一句：

```text
请使用 ms-studio-deploy Skill，把当前网页发布到魔搭社区的 Static 创空间，完成后把访问链接发给我。
```

Skill 会先检查 `index.html` 和登录信息。如果需要创建新空间，它还会确认空间名称以及公开或私有；没有特别说明时，建议先使用私有空间。

如果想一次把要求说清楚，可以使用下面这个版本：

```text
请使用 ms-studio-deploy Skill，把当前目录发布到魔搭国内站的 Static 创空间。
空间名使用 my-portfolio，先设为私有；部署后检查运行状态和日志，
如果失败就根据日志修复并重新部署，成功后把访问链接发给我。
```

#### AI 接下来会做什么

官方 Skill 把发布过程整理成了一套协作流程：

```text
识别项目类型 → 确认国内站或国际站 → 获取账号信息
→ 创建或复用创空间 → 检查敏感信息 → 同步到 master
→ 触发部署 → 检查状态与日志 → 诊断并修复 → 返回访问链接
```

过程中如果 AI 询问“公开还是私有”，第一次发布建议选择私有，确认页面正常后再改为公开。Static 网站不需要付费硬件；如果其他类型的空间涉及付费资源，Skill 必须先得到你的明确同意。

令牌同时用于 API 认证和 Git 推送。不要把令牌直接写入网页源码、README、提示词或可分享截图。

## 手动：第 0 步，准备可以发布的网站

前面的 Skill 方式更省事。下面保留一套不使用 Skill 的手动流程，方便你理解创空间页面，或者在智能体暂时不可用时完成发布。

### 情况 A：纯 HTML 网页

最小目录如下，`index.html` 必须位于准备发布内容的根目录：

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

发布前可以在终端里做一次本地检查：

```bash
cd my-site
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000`。不要只双击 `index.html` 检查，因为 `file://` 和真正的 HTTP 访问在模块、跨域和路径处理上并不相同。

### 情况 B：Vue、React、Vite 等项目

先安装依赖并构建：

```bash
npm install
npm run build
```

常见输出目录：

| 工具或框架 | 常见输出目录 |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

你要发布的是输出目录里的**内容**，并确保最终仓库根目录直接出现 `index.html`：

```text
正确：index.html
错误：dist/index.html
```

如果部署后 CSS、JavaScript 或图片 404，Vite 项目可以先尝试把资源基路径改为相对路径：

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

修改后重新执行 `npm run build`。单页应用还建议使用 Hash 路由（例如 `/#/about`），因为纯静态托管不一定会把所有路径都回退到 `index.html`。

## 手动：第 1 步，进入创空间并登录

打开 [魔搭社区创空间](https://modelscope.cn/studios)。页面顶部会显示“创建空间 → 搭建应用 → 发布空间 → 分享创意”的流程。

![魔搭社区创空间首页，页面顶部展示创建、搭建、发布和分享流程](./images/modelscope-static-site/01-studios-home.jpg)

点击页面中的创建按钮，或直接访问 [创建创空间](https://modelscope.cn/studios/create)。未登录时，平台会先要求登录或注册。国内站 `modelscope.cn` 和国际站 `modelscope.ai` 的账号、令牌与内容并不互通；面向国内用户时通常选择国内站。

## 手动：第 2 步，创建 Static 创空间

在“创建创空间”页面填写基础信息：

![魔搭社区“创建创空间”页面，包含名称、所有者、许可证、可见性和描述等基础信息](./images/modelscope-static-site/02-create-studio.jpg)

1. **所属账号或组织**：决定链接中的拥有者名称。
2. **空间名称**：建议使用小写英文字母、数字和连字符，例如 `my-portfolio`。
3. **显示名称与简介**：填写访客能够看懂的标题和说明。
4. **可见性**：第一次部署建议先选择私有，验收后再公开。
5. **许可证**：根据项目实际情况选择。

其中最关键的是 SDK 类型必须为 **Static**。当前网页表单会提示 Static 适合展示已有 HTML 页面，并提供 Gradio、Streamlit、Static 和 Docker 等选项。

![魔搭社区创建创空间页面，在“接入 SDK”区域选择 Static](./images/modelscope-static-site/03-select-static.jpg)

> 如果网页需要数据库、私密 API Key 或服务端计算，它就不是纯静态网页。此时应选择 Gradio、Streamlit、Docker，或把后端部署到其他服务。把密钥写进前端 JavaScript 无法保密。

确认信息后，点击页面底部的创建按钮，等待进入创空间详情页。

## 手动：第 3 步，上传网页文件

下面是一个已经运行的 Static 创空间文件页。可以看到网页入口 `index.html` 直接位于仓库根目录，同时还有平台生成或项目自带的 `README.md`。

![魔搭社区 Static 创空间文件页，根目录包含 index.html 和 README.md](./images/modelscope-static-site/04-studio-files.jpg)

进入新空间的 **文件** 页，点击新增或上传文件，把 `index.html`、CSS、JavaScript 和图片等发布文件传上去。上传完成后，文件列表的根目录必须直接出现 `index.html`，不能多包一层 `dist/`、`build/` 或项目目录。

手动上传适合纯 HTML 页面或文件很少的项目。文件较多、需要频繁更新时，返回前面的推荐方式，让 `ms-studio-deploy` 自动完成 Git 同步更稳妥。

## 手动：第 4 步，部署并验收

保存文件后，平台通常会自动开始部署。如果没有自动触发，就在创空间页面点击部署、重启或重新运行。等待状态变为“运行中”，然后打开类似下面的地址：

```text
https://modelscope.cn/studios/你的用户名/你的空间名
```

打开最终链接，重点确认：

- 首页能否打开；
- CSS、JavaScript 和图片是否正常；
- 浏览器控制台是否有 404、CORS 或 JavaScript 错误；
- 手机宽度下是否能正常使用；
- 复制公开链接后，在未登录窗口中是否仍能访问。

如果空间目前是私有的，确认页面正常后，再到空间设置中把可见性改为公开，并使用未登录窗口检查公开链接。

## 手动：第 5 步，更新已经发布的网页

修改源代码后，先在本地测试并重新构建。回到创空间的 **文件** 页，用新的 `dist` 或 `build` 目录内容替换旧文件，然后重新部署。

```text
修改源代码 → 本地测试 → 重新构建 → 手动替换创空间文件
→ 重新部署 → 打开最终链接验收
```

对于 Vite、React、Vue 项目，仍然只上传构建产物，不要上传 `node_modules`、开发配置和完整源代码。更新次数变多以后，建议改用前面的 Skill 方式。

## 排障仍然推荐使用 Skill

<ModelScopeTroubleshooter />

## 资料来源

- [魔搭社区创空间](https://modelscope.cn/studios)（页面与截图核验于 2026-08-11）
- [“搭友来碰头”魔搭核心开发者共创会回顾](https://community.modelscope.cn/683562c6870cef7360622f7f.html)（杭州开发者社区活动）
- [ModelScope 官方统一操作说明](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)（其中列出 `gradio`、`streamlit`、`docker`、`static` 四种 Studio SDK 类型，并说明默认分支、部署、停止、日志和 Git 同步方式）
- [ModelScope 官方创空间部署 Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)（本地项目识别、创空间创建、代码同步、部署、日志监控和自动诊断的完整协作流程）
- [ModelScope Hub 官方客户端](https://github.com/modelscope/modelscope_hub)（当前 CLI、认证和 Studio 生命周期命令）
- [公开创空间示例](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)（用于核对当前详情页的“内容 / 文件”布局）

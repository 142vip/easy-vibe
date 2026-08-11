---
title: Publish Your Website on ModelScope
description: Publish a static HTML, Vue, React, or Vite site with ModelScope Studio and its official deployment Skill.
---

# Publish Your Website on ModelScope

Once your webpage works locally, you need a link that classmates, colleagues, or users can open. In this appendix, we will publish the site with **ModelScope Studio** instead of configuring a server from scratch.

ModelScope supports a **Static** Studio for HTML, CSS, JavaScript, images, and the built output of frontend frameworks. The page layout may change over time, but the workflow remains: create a Static Studio, upload the built files, deploy, and test the public link.

## 1. Decide what you are publishing

| Your project | Studio type | What to prepare |
| --- | --- | --- |
| Plain HTML, CSS, and JavaScript | Static | The website files, with `index.html` at the root |
| Vue, React, Vite, or Svelte | Static | Run the build first, then publish the contents of `dist` or `build` |
| Gradio or Streamlit application | Gradio or Streamlit | The Python entry file and dependencies |
| A service with a backend or custom system packages | Docker | A Dockerfile and a service listening on the required port |

A browser cannot run `npm install` for visitors. For a framework project, publish the **build output**, not the source directory.

## 2. The easiest route: use the official deployment Skill

ModelScope maintains [official Agent Skills](https://github.com/modelscope/modelscope-skills). Two are useful here:

- `ms-hub` connects an AI coding tool to ModelScope resources;
- `ms-studio-deploy` identifies the local project, creates or reuses a Studio, uploads files, deploys, and checks logs.

Install the SDK and Skills in a terminal:

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

If your `modelscope` command has no `skills` subcommand, use the installation commands on the [official Skills repository](https://github.com/modelscope/modelscope-skills).

Get an access token from [ModelScope Access Tokens](https://modelscope.cn/my/myaccesstoken) and configure it locally. Do not put the token in website code, a README, or a screenshot.

For a Vite project, build it first and open the output directory in your AI coding tool:

```bash
npm run build
cd dist
```

Then use one short request:

```text
Use the ms-studio-deploy Skill to publish this folder to a Static Studio on ModelScope. Send me the link when it works.
```

The Skill will ask for details such as the Studio name and visibility when needed. Start with a private Studio, verify it, and make it public afterward.

## 3. Publish manually from the website

The manual route is useful when your site has only a few files or when you want to understand the ModelScope interface.

### Step 1: open Studio

Visit [ModelScope Studio](https://modelscope.cn/studios) and sign in. The current homepage presents the route from creating a Studio to sharing it.

![ModelScope Studio homepage](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

### Step 2: create a Studio

Open [Create Studio](https://modelscope.cn/studios/create). Enter an owner, a short name, a display name, a description, and the initial visibility.

![Create Studio form](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

In the SDK section, choose **Static**. Gradio, Streamlit, and Docker are different runtime types and are not needed for a site that has already been built.

![Selecting Static as the Studio SDK](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

### Step 3: upload the built files

Open the new Studio's **Files** page. Upload `index.html`, CSS, JavaScript, and image assets. `index.html` must appear at the repository root; do not leave it inside another `dist` folder.

![Static Studio file page with index.html at the root](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

### Step 4: deploy and test

Save the files and wait for the Studio to deploy. If deployment does not start, use the deploy or restart control on the Studio page.

Open the final link and check:

- the homepage loads;
- styles, scripts, and images are present;
- the browser console has no 404 errors;
- the page still works at mobile width;
- a public Studio can be opened in a signed-out window.

## 4. Update the site later

After changing the source project, test locally and build it again. Replace the old published files with the new build output, redeploy, and reopen the final link.

For frequent updates, return to `ms-studio-deploy`; it is safer than repeatedly selecting many files by hand.

## Common problems

- **The page opens without styles:** asset paths are probably wrong. For Vite, check the `base` setting and build again.
- **A route returns 404 after refresh:** a static host may not rewrite every route to `index.html`; a hash router is often simpler.
- **The Studio shows the file list instead of the site:** confirm that `index.html` is at the repository root.
- **The site needs a secret API key:** do not place it in frontend JavaScript. Use a backend service instead of a purely Static Studio.

## Official references

- [ModelScope Studio](https://modelscope.cn/studios)
- [ModelScope Skills](https://github.com/modelscope/modelscope-skills)
- [`ms-studio-deploy` Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [ModelScope Hub client](https://github.com/modelscope/modelscope_hub)

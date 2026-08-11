---
title: 'How to Publish the Application You Built'
description: 'From a release build and signing to store review, staged rollout, monitoring, and updates on mobile, desktop, and the web.'
---

# How to Publish the Application You Built

An application that runs on your computer is not yet a product that users can safely install.

Whether it was built with Flutter, React Native, Electron, Qt, or native tools, a public release follows the same broad path:

> Choose a channel → fix the application identity → create a release build → sign it → test it → prepare store materials → submit for review → roll out gradually → monitor and update

Store requirements change. Check the current console and official documentation again immediately before submitting.

## 1. Separate packaging, signing, distribution, and review

**Packaging** turns the project into an installable artifact. **Signing** proves who produced it and protects the update chain. **Distribution** makes it available through a store, website, or company system. **Review** is the platform's policy and quality check.

A build can be packaged but unsigned, signed but not distributed, or distributed privately without a public store review. Knowing which step failed makes release problems much easier to solve.

## 2. Prepare ownership before the first release

Use organization-controlled accounts, email, domains, cloud services, and payment records for a real product. Do not permanently tie the app to a contractor's or employee's private account.

Record an owner and enable two-factor authentication for:

- developer and store accounts;
- domains, DNS, and the support website;
- signing certificates, keystores, and recovery material;
- cloud services, databases, storage, and monitoring;
- payment, tax, and contract records.

## 3. Fix the application identity and versions

Android package names, Apple Bundle IDs, and store product records are the application's identity. Changing them after release usually creates a different application rather than an update.

Use a reverse-domain name such as:

```text
com.example.fridgechef
```

Do not publish a tutorial value such as `com.example.myapplication`.

Keep the user-facing version and the upload build number separate:

```text
Version: 1.0.0
Build: 1
Git tag: v1.0.0
Planned release date: 2026-09-01
```

Every new upload needs a higher build number, even when the version name remains the same.

## 4. Build a real release environment

The release build must not use localhost, a test database, or sandbox payment by accident. Confirm that:

- APIs use production HTTPS domains;
- server, administrator, and model secrets are not inside the client;
- demo accounts and debug menus are not exposed to normal users;
- unnecessary detailed logging is disabled;
- crash reporting, service alerts, and customer support are ready;
- database upgrades preserve existing user data.

## 5. Prepare store materials from the real build

Keep icons, screenshots, descriptions, privacy documents, review notes, and license records together. Screenshots must show the version being submitted, not a design mock-up.

Remove phone numbers, private conversations, access tokens, customer data, and local file paths from every image.

The privacy policy and store questionnaire must match what the app and its SDKs actually collect. Check permissions for location, photos, camera, contacts, and microphone, plus analytics, advertising, crash reporting, login, account deletion, and data retention.

If review requires login, provide a dedicated account and a path that does not depend on SMS or an expired invitation. Ask someone outside the development team to follow the review notes exactly.

## 6. Publish Android applications

In Android Studio, use **Build → Generate Signed Bundle / APK**. New Google Play applications normally upload an Android App Bundle (`.aab`); an APK is mainly for direct installation and testing.

Protect the keystore and recovery instructions, never commit them to Git, and install the release build on a real device.

In Google Play Console:

1. verify the developer account and create the application;
2. complete the listing, content rating, target audience, ads, and Data safety forms;
3. upload the `.aab` and resolve target API and permission checks;
4. release to an internal or closed testing track;
5. install the store-delivered build and retest login, payment, notifications, and upgrades;
6. begin production with a staged rollout.

Official guide: [Upload an app to Play Console](https://developer.android.com/studio/publish/upload-bundle).

Mainland China has several Android stores rather than one universal store. Teams often publish separately to Huawei, Xiaomi, OPPO, vivo, Honor, and Tencent MyApp, depending on their users. Keep the package name, compatible signing identity, increasing version codes, privacy declarations, and source/build records consistent across channels. Check current APP filing and business-license requirements before submission.

## 7. Publish iOS applications

The standard public channel for iPhone users is the App Store.

1. join the appropriate Apple Developer Program with an organization-controlled Apple Account;
2. create the App ID and capabilities;
3. create the app record in App Store Connect;
4. keep its Bundle ID identical to Xcode;
5. archive from Xcode with a real-device destination;
6. validate and upload the archive;
7. test the processed build through TestFlight;
8. complete screenshots, privacy, age rating, export compliance, and review information;
9. add the version for review and then submit it.

Test first installation, upgrades, login, subscription restoration, notifications, and background recovery using the exact build you submit.

Official guides: [App Store Connect workflow](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow) and [Submit an app](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app).

## 8. Publish Windows and macOS applications

For Windows, the Microsoft Store provides a consistent installation and update path. Reserve the name in Partner Center, build and test an MSIX package, complete the listing, run the required certification checks, and install the published store version again.

Direct website distribution means you own code signing, HTTPS hosting, checksums, SmartScreen reputation, installation, uninstall, updates, rollback, and supported Windows versions.

Official guide: [Publish your first Windows app](https://learn.microsoft.com/windows/apps/package-and-deploy/publish-first-app).

For macOS, a Mac App Store build follows App Store Connect, signing, sandbox, archive, and review rules. A website-delivered DMG or PKG still needs Developer ID signing, hardened runtime checks, Apple notarization, stapling, a clean-Mac Gatekeeper test, and a safe update path.

Official guide: [Distribute apps for testing and release](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases/).

## 9. Publish Linux and Web applications

Linux has no single store for every distribution. Common choices are Flathub, Snap Store, AppImage, `.deb`, and `.rpm`. Whichever you choose, publish checksums, architectures, dependency notes, update instructions, and a trusted download source.

References: [Flathub submission](https://docs.flathub.org/docs/for-app-authors/submission) and [Publish a snap](https://documentation.ubuntu.com/snapcraft/latest/how-to/publishing/publish-a-snap/).

For Web and PWA products, deployment to a stable HTTPS domain is the main release. Check DNS and certificate renewal, production environment variables, 404 and offline behavior, Manifest values, Service Worker updates, accessibility, monitoring, backup, and rollback.

Continue with [How to Build a Local PWA](../pwa-local-app/).

## 10. Publish mini programs and browser extensions

A WeChat Mini Program is normally uploaded from WeChat DevTools, selected in the management console, completed with category and privacy information, submitted for review, and published after approval. Recheck API domains, cloud environments, payments, and privacy prompts in the review build.

Chrome Web Store, Microsoft Edge Add-ons, and Firefox AMO each have their own console. Upload the extension package, explain every requested permission, provide screenshots and privacy information, and use the least permission required.

References: [Chrome Web Store](https://developer.chrome.com/docs/webstore/) and [Publish a Microsoft Edge extension](https://learn.microsoft.com/microsoft-edge/extensions/publish/publish-extension).

## 11. Respond to review failures

Frequent causes include a release-only crash, an unusable review account, privacy declarations that disagree with SDK behavior, unfinished buttons, prohibited payment flows, excessive permissions, unlicensed assets, and screenshots from an older version.

Give AI the exact review message and current behavior, not a vague summary:

> This is the store review message: 【paste it】. Identify the rule and the product behavior that must change. Do not guess.

After the fix:

> List the actions to retest and the store materials that must be updated before resubmission.

The platform's own response remains the authority.

## 12. Roll out gradually and preserve updates

A dependable release order is: developer testing, internal testing, a small closed beta, store review, staged production, and then wider availability after crash, API, login, payment, and support signals remain healthy.

Write down who presses Release, who watches monitoring, which signal pauses the rollout, how rollback works, and how users will be informed.

Every update must preserve the application identity and compatible signing chain, increase the build number, migrate local data safely, keep backend APIs compatible with older clients, and update privacy declarations when SDKs or features change.

## 13. A first-release checklist

- [ ] Choose one first platform and one distribution channel.
- [ ] Register the developer account with the organization identity.
- [ ] Fix the application name and package or Bundle ID.
- [ ] Create and securely back up signing material.
- [ ] Build Release and install it on a clean device.
- [ ] Prepare real screenshots, descriptions, support, and privacy pages.
- [ ] Provide a long-lived review account.
- [ ] Install from the testing channel and complete the core workflow.
- [ ] Save every review message and the corresponding change.
- [ ] Begin with a small rollout and expand only when monitoring is healthy.

Publishing is not administrative work after development. Identity, signing, privacy, testing, monitoring, and rollback are part of the product. Treat them that way in version one and every later release becomes safer and faster.

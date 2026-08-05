# SSH 與金鑰認證原理

> 💡 **學習指南**：每次 `git push` 輸密碼？連伺服器總被提示「Permission denied」？本章用 5 分鐘帶你搞懂 SSH 金鑰認證的原理，以及如何一鍵免密登入 GitHub 和伺服器。

---

## 0. 你一定遇到過這些場景

- `git push` 時反覆彈出密碼輸入框，煩不勝煩
- SSH 連線伺服器失敗，不知道 `id_rsa` 和 `id_ed25519` 是什麼
- 聽過「公鑰」和「私鑰」，但搞不清哪個給別人、哪個自己留

**核心矛盾**：密碼不安全、又麻煩。SSH 金鑰就是用來同時解決安全性和便利性的方案。

---

## 1. 密碼 vs 金鑰：金鑰更好的動機

👇 動手試試看：對比密碼登入和金鑰登入的區別

<SSHAuthDemo />

::: tip 💡 一句話總結
密碼登入 = 每次把密碼發過去讓對方核對（密碼可能被截獲）；
金鑰登入 = 證明「我有鑰匙」但不用把鑰匙給你看（私鑰永不傳輸）。
:::

---

## 2. 非對稱加密：公鑰和私鑰

SSH 金鑰基於**非對稱加密**，一次生成兩把鑰匙：

| | 私鑰 (Private Key) | 公鑰 (Public Key) |
|---|---|---|
| **儲存位置** | 你的電腦 `~/.ssh/id_ed25519` | 伺服器/GitHub |
| **可以給別人嗎** | ❌ 絕不 | ✅ 隨便給 |
| **功能** | 簽名（證明身分） | 驗簽（驗證身分） |
| **類比** | 鑰匙 | 鎖 |

### 常見金鑰類型

| 類型 | 指令 | 推薦度 | 說明 |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | 最新最快最安全 |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | 相容性好，但較慢 |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | 一般不推薦 |

---

## 3. 實戰：生成並設定 SSH 金鑰

### 3.1 生成金鑰對

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

執行後會提示：
- **檔案路徑**：直接按 Enter 使用預設路徑 `~/.ssh/id_ed25519`
- **密碼短語**：可以設定額外保護（也可留空）

### 3.2 把公鑰新增到 GitHub

```bash
# 1. 複製公鑰內容
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. 開啟 GitHub → Settings → SSH and GPG keys → New SSH key
# 3. 貼上公鑰，儲存

# 4. 測試連線
ssh -T git@github.com
# 成功會看到: Hi username! You've been authenticated...
```

### 3.3 把公鑰新增到伺服器

```bash
# 方式一：ssh-copy-id（推薦）
ssh-copy-id user@your-server

# 方式二：手動複製
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config：告別冗長指令

在 `~/.ssh/config` 中設定別名，一次設定終身受益：

```
Host dev
  HostName 192.168.1.100
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

設定後的效果：

| 之前 | 之後 |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| 每次都要記 IP 和使用者名稱 | 記一個別名就夠 |

---

## 5. 常見問題排查

| 問題 | 原因 | 解決方案 |
|---|---|---|
| `Permission denied (publickey)` | 公鑰沒新增到伺服器 | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | 私鑰檔案權限太寬 | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | SSH Config 設定有誤 | 檢查 `~/.ssh/config` 格式 |
| GitHub 還是要密碼 | 用的 HTTPS 而非 SSH | 改用 `git@github.com:user/repo.git` |

---

## 6. 總結

::: tip 📚 核心要點
1. **金鑰 > 密碼**：私鑰永不傳輸，比密碼安全得多
2. **推薦 Ed25519**：最現代的金鑰演算法，速度快、安全性高
3. **公鑰隨便給，私鑰絕不洩露**：記住這條鐵律
4. **SSH Config**：設定一次別名，之後 `ssh 別名` 一鍵連線
5. **GitHub/GitLab**：新增公鑰後，`git push/pull` 再也不需要輸密碼
:::

**下一步學習**：
- [連接埠與 localhost 原理](./ports-localhost) - 理解網路連線的基礎
- [環境變數與 PATH 導論](./environment-path) - 理解系統設定

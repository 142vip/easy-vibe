# SSH認証：鍵ペアとリモートログイン


> 💡 **学習ガイド**：`git push` のたびにパスワードを入力していませんか？サーバーに接続すると毎回「Permission denied」と表示される？この章では 5 分で SSH 鍵認証の仕組みを理解し、GitHub とサーバーへのパスワードなしログインをワンコマンドで設定する方法を説明します。

---

## 0. これらの状況に遭遇したことがあるでしょう

- `git push` のたびにパスワード入力ダイアログが表示される——非常に煩わしい
- SSH でサーバーに接続できず、`id_rsa` や `id_ed25519` が何なのか分からない
- 「公開鍵」と「秘密鍵」という言葉を聞いたことがあるが、どちらを共有し、どちらを保管するのかが不明

**核心的な問題**：パスワードは安全ではない上に不便。SSH 鍵はセキュリティと利便性を同時に解決するソリューションです。

---

## 1. パスワード vs 鍵：なぜ鍵の方が優れているのか

👇 試してみよう：パスワードログインと鍵ログインの違いを比較

<SSHAuthDemo />

::: tip 💡 一言でまとめると
パスワードログイン = 毎回パスワードを送信して相手に検証させる（パスワードが傍受される可能性あり）；
鍵ログイン = 「鍵を持っていること」を証明するが、鍵自体は見せない（秘密鍵は一切転送されない）。
:::

---

## 2. 非対称暗号：公開鍵と秘密鍵

SSH 鍵は**非対称暗号**に基づいており、一度に 2 つの鍵が生成されます：

| | 秘密鍵 (Private Key) | 公開鍵 (Public Key) |
|---|---|---|
| **保存場所** | あなたのコンピュータ `~/.ssh/id_ed25519` | サーバー / GitHub |
| **共有できるか** | ❌ 絶対にしない | ✅ 自由に共有 |
| **機能** | 署名（身元を証明） | 署名検証（身元を確認） |
| **例え** | 鍵 | 錠前 |

### 一般的な鍵の種類

| 種類 | コマンド | 推奨度 | 備考 |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | 最新、最速、最も安全 |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | 互換性は良いが、やや遅い |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | 通常は非推奨 |

---

## 3. 実践：SSH 鍵の生成と設定

### 3.1 鍵ペアの生成

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

実行後にプロンプトが表示されます：
- **ファイルパス**：Enter を押してデフォルトパス `~/.ssh/id_ed25519` を使用
- **パスフレーズ**：追加の保護を設定可能（空欄でも可）

### 3.2 公開鍵を GitHub に追加

```bash
# 1. 公開鍵の内容をコピー
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. GitHub → Settings → SSH and GPG keys → New SSH key を開く
# 3. 公開鍵を貼り付けて保存

# 4. 接続テスト
ssh -T git@github.com
# 成功メッセージ：Hi username! You've been authenticated...
```

### 3.3 公開鍵をサーバーに追加

```bash
# 方法 1：ssh-copy-id（推奨）
ssh-copy-id user@your-server

# 方法 2：手動コピー
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config：長いコマンドに別れを告げる

`~/.ssh/config` でエイリアスを設定——一度設定すればずっと使えます：

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

設定後の効果：

| 設定前 | 設定後 |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| 毎回 IP とユーザー名を覚える必要がある | エイリアスを 1 つ覚えるだけで OK |

---

## 5. よくある問題のトラブルシューティング

| 問題 | 原因 | 解決策 |
|---|---|---|
| `Permission denied (publickey)` | 公開鍵がサーバーに追加されていない | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | 秘密鍵ファイルの権限が広すぎる | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | SSH Config の設定ミス | `~/.ssh/config` の形式を確認 |
| GitHub がまだパスワードを要求する | SSH ではなく HTTPS を使用している | `git@github.com:user/repo.git` に変更 |

---

## 6. まとめ

::: tip 📚 重要ポイント
1. **鍵 > パスワード**：秘密鍵は一切転送されないため、パスワードよりはるかに安全
2. **Ed25519 を推奨**：最もモダンな鍵アルゴリズム、高速で高いセキュリティ
3. **公開鍵は自由に共有、秘密鍵は絶対に漏洩させない**：この黄金ルールを覚えておく
4. **SSH Config**：エイリアスを一度設定すれば、以降は `ssh エイリアス` で即座に接続
5. **GitHub/GitLab**：公開鍵を追加すれば、`git push/pull` でパスワード入力が不要に
:::

**次のステップ**：
- [ポートとlocalhost：ネットワーク接続の基礎概念](./ports-localhost) - ネットワーク接続の基礎を理解する
- [環境変数とPATH：実行可能ファイルの探索機構](./environment-path) - システム設定を理解する

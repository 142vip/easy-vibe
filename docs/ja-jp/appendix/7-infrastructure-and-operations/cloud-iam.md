# クラウドIAM：認可・権限・監査

> **学習ガイド**：プロンプトエンジニアリングは「どうやって明確に伝えるか」を解決し、クラウドアカウント権限管理は「誰が何をできるか」を解決します。本章では一つの問題を中心に展開します：**クラウドの世界で、どうすれば便利に権限を付与しつつ、鍵を渡してはいけない人に渡さないようにできるのか？**

始める前に、以下の「基礎知識」を補っておくことをお勧めします：

- **Token とは**：まず [大規模言語モデル入門](../8-artificial-intelligence/llm-principles.md) の「分詞 & Token」の部分を読んでください。
- **Prompt とは**：System / User / Assistant の基本構造にまだ慣れていない場合は、まず [プロンプトエンジニアリング](../8-artificial-intelligence/prompt-engineering/) を参照してください。

---

## 0. はじめに：なぜクラウドを使い始めた途端に「地雷を踏んだ」のか

<IamRamComparisonDemo />

多くの人がクラウドサービスを使い始めると、次のような状況に遭遇します：

- 手間を省くために、AccessKey を直接コードに書いて GitHub にコミットしてしまう；
- すべての従業員に「管理者権限」を付与した結果、誰かが誤って本番データベースを削除してしまう；
- プロジェクト引き継ぎ後、誰がまだ元従業員のアカウントパスワードを持っているか分からない；
- MFA を有効にするように言われたが、「面倒だ」と思ってずっと後回しにしている。

直感的には、**「従業員のセキュリティ意識が足りない」** と思いがちです。

しかし多くの場合、問題は人ではなく、**正しい権限管理体系が構築されていない**ことにあります。

<IntroProblemReasonSolution />

これらの課題に直面すると、単に「慎重に操作する」だけでは通用しません。体系的な権限管理手法が必要であり、それがまさに **IAM（Identity and Access Management、ID とアクセス管理）** が解決しようとしている問題です。

---

## 1. IAM/RAM とは：「入退室管理システム」から考える

### 1.1 類推：会社のスマート入退室管理

あなたの会社が新しいオフィスビルに引っ越したと想像してください：

| シナリオ       | IAM がない場合のやり方                | IAM がある場合のやり方                                |
| :--------- | :----------------------------- | :------------------------------------------- |
| 新入社員の入社 | すべてのドアを開けられる万能鍵を渡す   | 自分のオフィスエリアのドアだけ開けられる入退室カードを渡す |
| 従業員の退職   | 鍵をなくしたらそれまで、誰が持っているかも分からない | すぐにシステムで入退室カードを無効化し、すべてのドアが開けられなくなる |
| 外部委託者   | 鍵を数日間貸す               | 一時入退室カードを発行し、3日後に自動失効するよう設定              |
| 来訪者       | 受付で鍵を渡す             | 一度だけ使える来訪者コードを発行し、会議室にしか入れない                 |

**IAM（Identity and Access Management、ID とアクセス管理）** は、この「スマート入退室管理システム」のようなものです：

- **ID（Identity）**：誰か？従業員、外部委託者、来訪者、アプリケーション
- **アクセス（Access）**：どのドアに入れるか？どの操作ができるか？
- **管理（Management）**：どうやって鍵を発行し、どうやって回収し、どうやって記録を確認するか

### 1.2 AWS IAM vs Alibaba Cloud RAM

<IamRamComparisonDemo />

各クラウドベンダーは独自の IAM 実装を持っています：

| クラウドベンダー     | サービス名                             | コアコンセプト                  |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS**    | IAM (Identity and Access Management) | User、Group、Role、Policy |
| **Alibaba Cloud** | RAM (Resource Access Management)     | ユーザー、ユーザーグループ、ロール、ポリシー  |
| **Tencent Cloud** | CAM (Cloud Access Management)        | ユーザー、ユーザーグループ、ロール、ポリシー  |
| **Huawei Cloud** | IAM                                  | ユーザー、ユーザーグループ、委託、ポリシー  |
| **Azure**  | Azure AD + RBAC                      | User、Group、Role、RBAC   |

名前は異なりますが、**コアコンセプトは共通**しています：

- **ユーザー（User）**：特定の人またはアプリケーションを表す
- **ユーザーグループ（Group）**：複数ユーザーの権限を一括管理する
- **ロール（Role）**：一連の権限を定義し、「引き受け」ることができる
- **ポリシー（Policy）**：具体的な権限ルール（許可/拒否する操作）

---

## 2. ユーザー、グループ、ロール：どれをの判断基準

### 2.1 3種類の「ID」の違い

<IdentityProviderDemo />

オフィスのシナリオで類推すると：

| 概念                | 類推                           | 適用シナリオ             | 特徴                               |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **ユーザー（User）**    | 正社員、自分のデスクと入退室カードを持つ | 長期、安定的なチームメンバー | 永続的な認証情報（パスワード、AK/SK）を持つ          |
| **ユーザーグループ（Group）** | 部署、「技術部」「営業部」など     | 権限の一括管理         | ログイン不可、権限のコンテナに過ぎない             |
| **ロール（Role）**    | 一時来訪者証、外部委託者一時カード         | 一時的な権限付与、クロスアカウントアクセス | 永続的な認証情報なし、「引き受け」によって一時認証情報を取得 |

### 2.2 実例：スタートアップの権限の進化

**段階1：創業チーム（2〜3人）**

```
問題：ルートアカウント（Root Account）で直接コンソールにログイン、「手間が省ける」から
リスク：ルートアカウントはすべての権限を持ち、一度漏洩するとアカウント全体が台無しになる
```

**段階2：チーム拡大（5〜10人）**

```
改善：全員に IAM User を作成し、異なる権限を割り当て
問題：
- 運用担当の王さんが退職したが、彼の AK/SK はどのサーバーに散らばっているのか？
- 新しく入ったフロントエンド担当は S3 読み取り専用権限が必要、バックエンド担当は RDS 権限が必要、手動で一つずつ設定するのは面倒
```

**段階3：標準化（10〜30人）**

```
改善：
1. ロールごとに IAM Group を作成：
   - Developers（開発）：S3、EC2、RDS 読み書き
   - DevOps（運用）：全権限、ただし MFA 必須
   - ReadOnly（読み取り専用）：すべてのリソースを閲覧可能、変更不可
   - QAs（テスト）：テスト環境リソースへのアクセス

2. IAM Role を使用：
   - EC2 インスタンスは Instance Profile を使用し、サーバー上に AK/SK を置かない
   - クロスアカウントアクセスは Role Assume を使用し、AK/SK を共有しない
   - CI/CD は OIDC Federation を使用し、長期認証情報を保存しない
```

**段階4：マルチアカウント/エンタープライズ（30人以上）**

```
アーキテクチャ：
- Master Account（メインアカウント）：請求と組織構造の管理のみに使用し、リソースは一切置かない
- Audit Account（監査アカウント）：全アカウントのログを収集
- Dev Account（開発アカウント）：開発環境
- Staging Account（ステージングアカウント）：テスト環境
- Prod Account（本番アカウント）：本番環境、最も厳格な権限

権限の流れ：
- 開発者はデフォルトで Dev アカウントの読み取り専用権限のみを持つ
- 本番環境の変更が必要な場合、チケットを申請して Prod の一時 Role への Assume を依頼
- すべての Assume 操作は CloudTrail に記録され、定期的に監査される
```

---

## 3. ロールとポリシー：権限管理の「魂」

### 3.1 ロールの本質：信頼 + 権限

<RolePolicyDemo />

IAM Role には2つの核となる構成要素があります：

1. **信頼ポリシー（Trust Policy）**：誰がこのロールを引き受けられるか？
2. **権限ポリシー（Permission Policy）**：引き受け成功後に何ができるか？

演劇の類推で説明すると：

| 概念                  | 類推                   | 説明                                                                                       |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role（ロール）**      | 脚本の「ハムレット」     | 何を演じるかを定義（権限）                                                                   |
| **Trust Policy**      | 演出家が「誰がハムレットを演じられるか」を決める | 「この劇団の俳優」（自アカウントのユーザー）、「隣の劇団から借りた俳優」（クロスアカウント）、「特別ゲスト」（外部 IdP） |
| **Permission Policy** | 脚本の内容               | ハムレットができること：台詞を言う、決闘する、狂う（具体的な権限）                                           |
| **Assume Role**       | 俳優が舞台に上がって演じる | 李さんが演出家にハムレット役に選ばれ、舞台に上がると脚本に定義されたすべての権限を持つ                             |
| **一時認証情報**          | 出演証                 | 李さんは「一時出演証」を受け取り、公演終了後に失効する                                               |

### 3.2 ポリシー（Policy）：権限の「文法」

<PermissionHierarchyDemo />

IAM Policy は JSON ドキュメントであり、「誰がどのリソースに対してどの操作をできるか」を定義します。

**完全な Policy の例**：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**主要フィールドの説明**：

| フィールド          | 意味                               | 例                     |
| :------------ | :--------------------------------- | :----------------------- |
| **Version**   | Policy 構文バージョン                    | "2012-10-17"             |
| **Statement** | 権限宣言の配列、複数ルールを含むことが可能       | [...]                    |
| **Sid**       | 宣言 ID、オプション、このルールを識別するために使用    | "AllowS3ReadWrite"       |
| **Effect**    | 効果：Allow（許可）または Deny（拒否） | "Allow"                  |
| **Action**    | 許可/拒否する操作、ワイルドカード対応        | "s3:GetObject", "s3:\*"  |
| **Resource**  | 対象リソース、ARN で識別            | "arn:aws:s3:::bucket/\*" |
| **Condition** | オプション、特定の条件を満たした場合のみ有効         | リージョン制限、MFA 要求など     |

### 3.3 権限の優先順位：Deny > Allow > デフォルト拒否

IAM の権限評価ロジックは一言でまとめられます：**明示的な Deny が常に勝ち、Allow がなければ拒否**。

評価フローは以下の通りです：

```
1. まず Deny ポリシーがあるか確認
   ├─ Deny あり → 拒否（Allow の有無に関わらず）
   └─ Deny なし → 続けて確認

2. 次に Allow ポリシーがあるか確認
   ├─ Allow あり → 許可
   └─ Allow なし → 拒否（デフォルト拒否の原則）
```

**実践例：機密データの保護**

```json
// ポリシー1：開発者向けの通常権限
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// ポリシー2：機密ディレクトリの保護（開発者が s3:* を持っていてもアクセス不可）
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**ポイント**：

- 開発者は `s3:*` の Allow 権限を持っているが
- 機密ディレクトリには明示的な Deny ルールがある
- Deny の優先順位が高いため、開発者は機密データにアクセスできない
- 開発者が管理者であっても、この Deny は有効（ルートアカウントを除く）

---

## 4. アクセスキー（AK/SK）：慎重に保管すべき「鍵」

### 4.1 AK/SKの概要

<AccessKeyManagementDemo />

Access Key（アクセスキー）は、クラウドサービスが提供する長期認証情報で、プログラムによる API 呼び出しに使用されます。2つの部分で構成されています：

| 構成要素              | 名称         | 役割                       | 類推       |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID**     | アクセスキー ID  | あなたが誰かを識別（ユーザー名に類似） | 銀行カード番号   |
| **Secret Access Key** | シークレットアクセスキー | あなたがあなたであることを証明（パスワードに類似）   | 銀行カードの暗証番号 |

### 4.2 AK/SK は危険物の動機

**実例：あるスタートアップの教訓**

李さんはスタートアップの新人バックエンドエンジニアです。入社1週間目、ファイルアップロード機能のデバッグを任されました。

```python
# 李さんが書いたコード（重大なセキュリティ問題あり！）
import boto3

# デバッグの便宜上、AK/SK を直接コードに記述
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"ファイルをアップロードしました s3://{bucket_name}/{object_name}")

# アップロードテスト
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**1週間後に起きたこと**：

1. 李さんがコードを GitHub にコミット（AK/SK を含む）
2. GitHub 上のコードがクローラーにスキャンされ、AK/SK が抽出される
3. 攻撃者がこれらの認証情報を使って、会社のアカウントで大量の EC2 インスタンスを作成し暗号通貨のマイニングを実行
4. 月末に請求書が届く：追加費用 12,000 ドル
5. 監査で AK/SK の漏洩が発覚、李さんは呼び出しを受ける…

**この事例から学べること**

| 誤ったやり方                    | 正しいやり方                                         |
| :-------------------------- | :----------------------------------------------- |
| AK/SK をコードにハードコードする     | IAM Role を使用し、プログラムに一時認証情報を自動取得させる            |
| AK/SK を Git リポジトリにコミットする    | `.gitignore` で設定ファイルを除外、キー管理サービスを使用 |
| 同じ AK/SK をローテーションせず長期間使用 | 定期的に AK/SK をローテーション、一時認証情報で長期認証情報を代替         |
| AK/SK に過大な権限を付与する       | 最小権限の原則に従い、必要な権限のみを付与               |

### 4.3 AK/SK の安全な使用ガイド

**シナリオ1：ローカル開発**

```bash
# 正しいやり方：AWS CLI で認証情報を設定し、コードに書かない
aws configure
# プロンプトに従って Access Key ID と Secret Access Key を入力
# これらの情報は ~/.aws/credentials に保存され、パーミッションは 600 に設定

# コード内では認証情報の設定は不要
import boto3
s3 = boto3.client('s3')  # ~/.aws/credentials から自動的に読み取り
```

**シナリオ2：サーバー/EC2**

```python
# 正しいやり方：IAM Instance Profile を使用
# 1. IAM Role を作成し、必要な権限（S3ReadOnly など）をアタッチ
# 2. Instance Profile を作成し、この Role を関連付け
# 3. EC2 起動時にこの Instance Profile を選択

# コード内では認証情報が完全に不要
import boto3
s3 = boto3.client('s3')  # EC2 メタデータサービスから一時認証情報を自動取得

# 一時認証情報は自動的にローテーションされるため、期限切れの心配なし
```

**シナリオ3：CI/CD パイプライン**

```yaml
# 正しいやり方：OIDC Federation（OpenID Connect）を使用
# GitHub Actions を例に：

# 1. AWS で OIDC Identity Provider を作成し、GitHub を信頼
# 2. IAM Role を作成し、信頼ポリシーで GitHub の特定リポジトリの引き受けを許可
# 3. GitHub Actions で設定

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # 重要：OIDC token のリクエストを許可
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # 注意：ここには Access Key がない！完全に一時認証情報を使用

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**まとめ：AK/SK 使用のセキュリティレベル**

| セキュリティレベル | やり方                        | 適用シナリオ                  | リスクレベル |
| :------- | :-------------------------- | :------------------------ | :------- |
| 最高     | IAM Role を使用（長期認証情報なし） | EC2、Lambda、ECS、CI/CD   | 極めて低い     |
| 高       | OIDC Federation を使用        | GitHub Actions、GitLab CI | 低い       |
| 中       | キー管理サービスを使用            | ローカル開発、小規模チーム          | 中       |
| 低       | 環境変数を使用                | 迅速なプロトタイプ、個人プロジェクト        | 高い       |
| 極めて低い     | コードにハードコード              | いかなるシナリオでも非推奨          | 極めて高い     |

---

## 5. 多要素認証（MFA）：アカウントに「鍵」をかける

### 5.1 MFAの概要

<MfaSecurityDemo />

MFA（Multi-Factor Authentication、多要素認証）は、2FA（Two-Factor Authentication、二要素認証）とも呼ばれ、ログイン時に**2種類以上**の異なる認証要素の提供を要求するセキュリティメカニズムです：

| 要素タイプ                   | 何か             | 例           |
| :------------------------- | :----------------- | :------------- |
| **知識要素**（あなたが知っていること） | ユーザーだけが知っている情報 | パスワード、PIN コード   |
| **所持要素**（あなたが持っているもの）   | ユーザーが所有する物理デバイス | 携帯電話、ハードウェアキー |
| **生体要素**（あなた自身）   | ユーザーの生体的特徴 | 指紋、顔認証 |

### 5.2 MFAの動機

**実際のデータが答えを示しています**：

| 攻撃方法                 | MFA なしの場合の成功率 | MFA ありの場合の成功率               |
| :----------------------- | :------------------ | :------------------------------ |
| パスワード推測/ブルートフォース        | 非常に高い                | 極めて低い（第二要素も必要）          |
| フィッシング攻撃によるパスワード取得         | 非常に高い                | 極めて低い（フィッシングページでは MFA コードを取得できない） |
| パスワード漏洩（他サイトでの漏洩） | 非常に高い                | 極めて低い（第二要素が分からない）          |

**Microsoft セキュリティレポート（2020）**：MFA を有効にすると、**99.9%** の自動化攻撃を阻止できます。

### 5.3 MFA 実践：AWS ルートアカウントの MFA を有効にする

**ステップ1：AWS コンソールにログイン**

1. ルートアカウントのメールアドレスとパスワードでログイン
2. 右上のアカウント名をクリックし、「Security Credentials」を選択

**ステップ2：MFA を有効にする**

1. 「Multi-factor authentication (MFA)」エリアを見つける
2. 「Assign MFA device」をクリック
3. MFA デバイスタイプを選択（「Authenticator app」を推奨）

**ステップ3：仮想 MFA を設定**

1. スマートフォンに Google Authenticator または Microsoft Authenticator をインストール
2. QR コードをスキャンするか、手動でキーを入力
3. アプリに表示される6桁の認証コードを入力（認証コードは30秒ごとに更新されるため、連続して2つ入力）

**完了！** ルートアカウントが MFA で保護されました。

---

## 6. クロスアカウントアクセス：安全に「訪問」するには

### 6.1 クロスアカウントアクセスの動機

<CrossAccountAccessDemo />

ビジネスの成長に伴い、多くの企業は異なる環境を分離するために**マルチアカウントアーキテクチャ**を採用します：

| アカウントタイプ            | 用途                   | 権限要件           |
| :------------------ | :--------------------- | :----------------- |
| **Master Account**  | 組織管理、請求決済     | ほとんど使用しない         |
| **Security Audit**  | 全アカウントのログを集中収集 | 他アカウントへの読み取り専用アクセス   |
| **Shared Services** | 共有リソース（イメージリポジトリなど） | 他アカウントからの読み取り専用アクセス   |
| **Development**     | 開発環境               | 開発者のフル権限     |
| **Staging**         | テスト/ステージング環境        | テスター権限       |
| **Production**      | 本番環境               | 厳格に制限、承認が必要 |

**問題：Shared Services アカウントのイメージを、Production アカウントの EC2 にプルさせるには？**

- 案 A：AK/SK を Production のユーザーデータに記述する （危険！AK/SK 漏洩リスク）
- 案 B：クロスアカウント Role Assume を使用する （推奨！一時認証情報、自動ローテーション）

### 6.2 クロスアカウント Role Assume の仕組み

```
アカウント A（Production）                    アカウント B（Shared Services）
    |                                           |
    |  1. Assume Role をリクエスト                      |
    |  "アカウント B の ECRReadRole を引き受けたい"          |
    |------------------------------------------>|
    |                                           |
    |                    2. 信頼ポリシーを確認         |
    |                    "アカウント A は私を引き受けられるか？" |
    |                                           |
    |  3. 一時認証情報を返却                          |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. 一時認証情報で ECR にアクセス                  |
    |  docker pull アカウントB.dkr.ecr...            |
```

**ポイント**：

- 一時認証情報の有効期限はデフォルト1時間、最長12時間まで設定可能
- コード内に長期認証情報を保存する必要がない
- 信頼ポリシーで誰がこのロールを引き受けられるか制限可能（特定アカウント、特定外部 ID の指定など）

### 6.3 実践：クロスアカウント ECR アクセスの設定

**シナリオ**：Production アカウントの EC2 が Shared Services アカウントの Docker イメージをプルする必要がある。

**ステップ1：Shared Services アカウントで IAM Role を作成**

1. Shared Services アカウントの AWS コンソールにログイン
2. IAM -> Roles -> Create role に移動
3. 「Another AWS account」を選択
4. Production アカウントの Account ID を入力
5. オプション：「Require external ID」にチェックを入れ、ランダムな文字列を入力（セキュリティ向上）
6. 権限をアタッチ：AmazonEC2ContainerRegistryReadOnly
7. Role に名前を付ける：CrossAccountECRReadRole

**ステップ2：Role ARN を取得**

作成完了後、Role の ARN をコピー：

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**ステップ3：Production アカウントで EC2 インスタンスを設定**

方法 A：Instance Profile を使用（推奨）

1. Production アカウントで IAM Role を作成（EC2 用）
2. 信頼ポリシー：EC2 サービスを信頼
3. 権限ポリシー：クロスアカウント Role の Assume を許可

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Instance Profile を作成し、この Role を関連付け
5. EC2 起動時にこの Instance Profile を選択

方法 B：EC2 ユーザーデータで動的に Assume Role

```bash
#!/bin/bash
# AWS CLI をインストール
yum install -y aws-cli

# クロスアカウント Role を Assume
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# 一時認証情報を抽出
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# ECR にログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージをプル
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**ステップ4：クロスアカウントアクセスをテスト**

Production の EC2 で実行：

```bash
# Assume Role できるかテスト
aws sts get-caller-identity
# 表示されるべき：arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Shared Services の ECR リポジトリを一覧表示できるかテスト
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**完了！** これで Production の EC2 は、長期認証情報を一切共有することなく、安全に Shared Services のイメージをプルできます。

---

## 7. 実践：安全な権限体系の構築

### 7.1 ゼロから権限アーキテクチャを構築する

<BestPracticesDemo />

あなたが10人のスタートアップの技術責任者で、AWS 権限アーキテクチャをゼロから設計する必要があると仮定します。以下は推奨される実施手順です：

**段階1：ルートアカウントの保護（1日目）**

```
目標：ルートアカウントを保護する、これが最も重要なアカウント

1. ルートアカウントの MFA を有効にする（必須）
   - ハードウェア MFA（YubiKey）または Google Authenticator を推奨

2. IAM 管理者アカウントを作成
   - ユーザー名：admin（または自分の名前）
   - 権限：AdministratorAccess（ただし後で絞り込む）
   - MFA を有効にする

3. ルートアカウントの Access Key を削除（作成されている場合）
   - ルートアカウントに AK/SK があってはならない

4. ルートアカウント使用アラートを設定
   - CloudWatch + SNS を使用し、ルートアカウントがログインしたらメール/SMS を送信
```

**段階2：チーム権限グループ分け（1週目）**

```
目標：チームメンバーをグループ化し、権限を一括管理

1. チームロールを分析：
   - バックエンド開発（2人）
   - フロントエンド開発（1人）
   - モバイル開発（1人）
   - プロダクトマネージャー（1人）
   - デザイナー（1人）
   - 創業者/管理者（3人）

2. IAM Groups を作成：

   Group: Developers
   ├── メンバー：全開発者（バックエンド、フロントエンド、モバイル）
   ├── 権限：
   │   ├── EC2: 起動、停止、閲覧（ただし他人のインスタンスは削除不可）
   │   ├── S3: 開発環境のバケットの読み書き
   │   ├── RDS: 読み取り専用権限（本番データベースの変更不可）
   │   └── CloudWatch: ログの閲覧
   └── 制限：ap-northeast-1 リージョンのみ操作可能

   Group: ProductTeam
   ├── メンバー：プロダクトマネージャー、デザイナー
   ├── 権限：
   │   ├── S3: 読み取り専用（データファイルの閲覧）
   │   ├── CloudWatch Dashboard: 監視グラフの閲覧
   │   └── Cost Explorer: 請求の閲覧（変更不可）
   └── 制限：読み取り専用権限、リソースの変更不可

   Group: Administrators
   ├── メンバー：創業者、技術責任者
   ├── 権限：AdministratorAccess
   └── 要件：MFA を使用しないと操作不可

3. 各人に IAM User を作成し、対応する Group に追加
   - 個人に直接権限をアタッチせず、一律 Group で管理
   - MFA を有効にする（強制要件）
```

**段階3：アプリケーション層の権限最適化（2〜4週目）**

```
目標：アプリケーションが安全に AWS リソースにアクセスできるようにする

1. EC2 インスタンスで Instance Profile を使用
   - サーバー上に AK/SK を設定しない
   - IAM Role を作成し、必要な権限（S3 読み書きなど）をアタッチ
   - Instance Profile を作成し、この Role を関連付け
   - EC2 起動時にこの Instance Profile を選択
   - アプリケーションコードで boto3 を直接使用、認証情報の設定不要

2. AK/SK をどうしても使用する必要がある場合（サードパーティ統合）
   - AWS Secrets Manager で AK/SK を保存
   - アプリケーション起動時に Secrets Manager から読み取り
   - 定期的なローテーションを設定（90日）
   - AK/SK の使用状況を監視

3. CloudTrail を設定してすべての API 呼び出しを記録
   - 専用の S3 バケットを作成してログを保存
   - ログファイルの整合性検証を設定（改ざん防止）
   - SNS 通知を設定（ルートアカウント使用、ポリシー変更などの重要イベント）
```

**段階4：セキュリティ強化（継続的）**

```
目標：継続的なセキュリティ監視と改善の仕組みを確立

1. AWS Config を有効化
   - リソース設定変更の監視
   - コンプライアンスチェック（セキュリティグループが 0.0.0.0/0 を開放していないかなど）

2. IAM Access Analyzer を有効化
   - リソースポリシーの継続的分析
   - 外部アクセスの特定（S3 バケットが公開されていないかなど）

3. IAM 設定の定期的なレビュー
   - 毎月、未使用の IAM User、Role をチェック
   - Access Key の使用状況をチェック
   - Group メンバーが適切か検証

4. セキュリティインシデント対応フローを確立
   - AK/SK 漏洩を発見した場合：即座に削除、ローテーション、影響範囲の監査
   - 異常な API 呼び出しを発見した場合：即座に調査、権限制限
```

---

## 8. よくある誤解とケース回避ガイド

### 8.1 IAM の10大アンチパターン

| #   | アンチパターン                       | なぜ悪いのか                                     | 正しいやり方                                         |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1   | ルートアカウントで日常業務を行う       | ルートアカウントは全権限を持ち、漏洩時に被害を制限できない       | IAM 管理者アカウントを作成し、ルートアカウントは必要な時のみ使用        |
| 2   | 全員に AdministratorAccess を付与 | 最小権限の原則に違反、誤操作や内部脅威のリスクを増大     | ロールごとにグループ化し、必要な権限のみを付与                     |
| 3   | コード内に AK/SK をハードコード         | AK/SK が GitHub 経由で漏洩しやすく、ローテーションも困難         | IAM Role、環境変数、キー管理サービスを使用            |
| 4   | AK/SK を長期間ローテーションしない             | 認証情報漏洩後のリスク露出時間を増大                   | 90日ローテーションポリシーを設定、またはより良い方法として一時認証情報を使用       |
| 5   | MFA を無視                     | パスワード漏洩後アカウントが直接乗っ取られる                         | すべての IAM ユーザーに MFA を有効化、特に高権限ユーザー        |
| 6   | CloudTrail を使用しない            | 誰が何をしたか監査できず、事故後の原因追跡が不可能         | CloudTrail を有効化し、ログを独立した監査アカウントに保存    |
| 7   | IAM Policy が緩すぎる          | `Resource: "*"`、`Action: "*"` など、攻撃対象領域を増大  | リソース ARN と具体的な Action を明示的に指定                   |
| 8   | 退職者の IAM User をクリーンアップしない    | ゾンビアカウントがバックドアになる可能性           | 退職フローを確立し、即座に IAM User を無効化・削除            |
| 9   | IAM Access Analyzer を使用しない   | 過度に緩いリソースポリシー（公開 S3 バケットなど）を発見できない | IAM Access Analyzer を有効化し、定期的に外部アクセスをチェック       |
| 10  | テスト環境で Policy を検証しない      | 本番環境に直接 Policy を適用すると、サービス停止を引き起こす可能性    | IAM Policy Simulator でテストし、まずテスト環境で検証 |

---

## 9. 用語対照表

| 英語用語                                 | 日本語対照        | 説明                                       |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | ID とアクセス管理  | クラウドサービスでユーザー ID とアクセス権限を管理するサービス       |
| **RAM (Resource Access Management)**     | リソースアクセス管理    | Alibaba Cloud の IAM サービス名                      |
| **Root Account**                         | ルートアカウント          | クラウドアカウント登録時に作成される所有者アカウント、最高権限を持つ |
| **IAM User**                             | IAM ユーザー/サブアカウント | ルートアカウントによって作成されたサブ ID、日常業務に使用         |
| **IAM Role**                             | IAM ロール        | 一時的な権限の担い手、長期認証情報なし、「引き受け」が必要   |
| **IAM Policy**                           | IAM ポリシー        | JSON 形式の権限ルール定義                    |
| **ARN**                                  | Amazon リソースネーム  | グローバルに一意なリソース識別子                       |
| **AK/SK**                                | アクセスキー/シークレットキー   | プログラムによるクラウド API アクセスの認証情報                      |
| **STS**                                  | セキュリティトークンサービス    | 一時セキュリティ認証情報を提供するサービス                     |
| **MFA**                                  | 多要素認証      | 2つ以上の要素を必要とする認証方式               |
| **SSO**                                  | シングルサインオン        | 1回のログインで複数システムにアクセスできる認証方式     |
| **ExternalId**                           | 外部 ID         | 混乱した代理攻撃を防止するためのセキュリティ識別子           |
| **CloudTrail**                           | クラウド監査サービス      | クラウドアカウント内のすべての API 呼び出しと操作を記録するログサービス  |

---

## まとめ：クラウドアカウント権限管理の核心原則

クラウドアカウント権限管理は一朝一夕にできるものではなく、チーム規模とビジネス要件に応じて継続的に進化させる必要があります：

1. **スタートアップ段階**（1〜10人）：
   - ルートアカウントの保護（MFA + ルートアカウントを日常業務に使わない）
   - IAM 管理者アカウントの作成
   - 基本的なグループ分け（Developers、Admins）

2. **成長段階**（10〜50人）：
   - 詳細な権限グループ分け（フロントエンド・バックエンド、運用、プロダクトなど）
   - IAM Role で AK/SK を代替
   - CloudTrail 監査の有効化
   - 定期的な権限レビュー

3. **成熟段階**（50人以上 / マルチアカウント）：
   - マルチアカウントアーキテクチャ（Dev、Staging、Prod の分離）
   - 集中ログ監査アカウント
   - 権限レビューとアラートの自動化
   - 整備された権限申請・承認フロー

**核心原則として3つの言葉を覚えてください**：

1. **最小権限の原則**：必要な権限だけを与え、AdministratorAccess を付与しない
2. **長期認証情報を使わない**：IAM Role と一時認証情報を優先し、AK/SK 漏洩を回避
3. **MFA を有効にする**：特にルートアカウントと高権限アカウント、これが最も効果的なセキュリティ対策

---

> **参考文献**：
>
> - [AWS IAM 公式ドキュメント](https://docs.aws.amazon.com/iam/)
> - [Alibaba Cloud RAM 公式ドキュメント](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
# Principles of Cloud Identity and Access Management
> **Learning Guide**: Prompt engineering solves "how to say things clearly," while cloud account permission management solves "who can do what." This chapter revolves around one question: **In the cloud world, how do you grant access conveniently without handing the keys to the wrong people?**

Before you begin, it's recommended to brush up on two fundamentals:

- **What is a Token**: You can read the "Tokenization & Tokens" section in [Introduction to Large Language Models](../8-artificial-intelligence/llm-principles.md).
- **What is a Prompt**: If you're not yet familiar with the basic System / User / Assistant structure, check out [Prompt Engineering](../8-artificial-intelligence/prompt-engineering/).

---

## 0. Introduction: Motivation for Peopling "Step on Landmines" as Soon as They Get on the Cloud

<IamRamComparisonDemo />

Many people encounter similar situations when they first start using cloud services:

- Hard-coding AccessKeys directly in code and committing them to GitHub for convenience;
- Giving all employees "admin permissions," only to have someone accidentally delete the production database;
- After a project handover, having no idea who still has former employees' account credentials;
- Hearing about enabling MFA but putting it off because it seems "too much trouble."

Intuitively, we might think: **"These employees lack security awareness."**

But most of the time, the problem isn't the people — it's the **failure to establish a proper permission management system.**

<IntroProblemReasonSolution />

Faced with these challenges, relying on "being more careful" is no longer enough. We need a systematic approach to permission management — and that's exactly what **IAM (Identity and Access Management)** sets out to solve.

---

## 1. Overview of IAM/RAM Starting with the "Access Control System"

### 1.1 Analogy: A Company's Smart Access Control

Imagine your company moves into a new office building:

| Scenario            | Without IAM                                                   | With IAM                                                              |
| :------------------ | :------------------------------------------------------------ | :-------------------------------------------------------------------- |
| New employee onboarding | Give them a master key that opens every door              | Give them an access card that only opens doors in their work area    |
| Employee departure  | The key is just lost, and no one knows who has it              | Immediately revoke their access card in the system — all doors are locked |
| Contractors         | Lend them the key for a few days                              | Issue a temporary access card, set to expire automatically in 3 days |
| Visitors            | The front desk hands them a key                               | Issue a one-time visitor code that only accesses the meeting room    |

**IAM (Identity and Access Management)** is like this "smart access control system":

- **Identity**: Who? Employee, contractor, visitor, application
- **Access**: Which doors can they enter? What operations can they perform?
- **Management**: How to issue keys, how to revoke them, how to check records

### 1.2 AWS IAM vs Alibaba Cloud RAM

<IamRamComparisonDemo />

Different cloud providers have their own IAM implementations:

| Cloud Provider       | Service Name                         | Core Concepts                       |
| :------------------- | :----------------------------------- | :---------------------------------- |
| **AWS**              | IAM (Identity and Access Management) | User, Group, Role, Policy           |
| **Alibaba Cloud**    | RAM (Resource Access Management)     | User, User Group, Role, Policy      |
| **Tencent Cloud**    | CAM (Cloud Access Management)        | User, User Group, Role, Policy      |
| **Huawei Cloud**     | IAM                                  | User, User Group, Agency, Policy    |
| **Azure**            | Azure AD + RBAC                      | User, Group, Role, RBAC             |

Although the names differ, **the core concepts are the same**:

- **User**: Represents a specific person or application
- **Group**: Manages permissions for a batch of users
- **Role**: Defines a set of permissions that can be "assumed"
- **Policy**: Specific permission rules (what is allowed/denied)

---

## 2. Users, Groups, Roles: Selection of One Should You Use

### 2.1 Differences Between the Three "Identities"

<IdentityProviderDemo />

Let's use an office scenario as an analogy:

| Concept           | Analogy                                            | Use Case                       | Characteristics                                  |
| :---------------- | :------------------------------------------------- | :----------------------------- | :----------------------------------------------- |
| **User**          | Full-time employee with their own desk and access card | Long-term, stable team members | Has permanent credentials (password, AK/SK)      |
| **Group**         | Department, like "Engineering" or "Sales"          | Batch permission management    | Cannot log in; just a permission container       |
| **Role**          | Temporary visitor pass, contractor temporary card  | Temporary authorization, cross-account access | No permanent credentials; obtains temporary credentials by "assuming" |

### 2.2 Real Case: Permission Evolution at a Startup

**Phase 1: Founding Team (2-3 people)**

```
Problem: Using the root account directly to log into the console because it's "easier"
Risk: The root account has all permissions; if compromised, the entire account is ruined
```

**Phase 2: Team Expansion (5-10 people)**

```
Improvement: Create IAM Users for everyone, assign different permissions
Problems:
- Ops engineer Xiao Wang left — where are his AK/SK scattered across servers?
- The new frontend dev needs S3 read-only access, the backend dev needs RDS access — configuring each one manually is too tedious
```

**Phase 3: Standardization (10-30 people)**

```
Improvements:
1. Create IAM Groups by role:
   - Developers: S3, EC2, RDS read/write
   - DevOps: Full permissions, but MFA required
   - ReadOnly: View all resources, cannot modify
   - QAs: Test environment resource access

2. Use IAM Roles:
   - EC2 instances use Instance Profiles — no more storing AK/SK on servers
   - Cross-account access via Role Assume — no shared AK/SK
   - CI/CD uses OIDC Federation — no long-term credential storage
```

**Phase 4: Multi-Account / Enterprise (30+ people)**

```
Architecture:
- Master Account: Only used for billing and organizational management; no resources placed here
- Audit Account: Collects logs from all accounts
- Dev Account: Development environment
- Staging Account: Pre-release/testing environment
- Prod Account: Production environment, strictest permissions

Permission Flow:
- Developers have read-only access to the Dev account by default
- To modify production, submit a ticket to request Assume into a temporary Prod Role
- All Assume operations are logged by CloudTrail for periodic auditing
```

---

## 3. Roles and Policies: The "Soul" of Permission Management

### 3.1 The Essence of a Role: Trust + Permissions

<RolePolicyDemo />

An IAM Role has two core components:

1. **Trust Policy**: Who can assume this role?
2. **Permission Policy**: What can they do after successfully assuming it?

Using a theater performance analogy:

| Concept                 | Analogy                                  | Explanation                                                                                                     |
| :---------------------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Role**                | "Hamlet" in the script                   | Defines what play to perform (permissions)                                                                      |
| **Trust Policy**        | The director saying "who can play Hamlet"| Could be "actors from this troupe" (same-account users), "actors borrowed from a neighboring troupe" (cross-account), "guest stars" (external IdP) |
| **Permission Policy**   | The script content                       | What Hamlet can do: deliver lines, duel, go mad (specific permissions)                                         |
| **Assume Role**         | An actor going on stage                  | Xiao Li is chosen to play Hamlet; once on stage, he has all the permissions defined in the script               |
| **Temporary Credentials**| Performance pass                         | Xiao Li gets a "temporary performance pass" that expires after the show                                        |

### 3.2 Policy: The "Grammar" of Permissions

<PermissionHierarchyDemo />

An IAM Policy is a JSON document that defines "who can do what to which resources."

**A Complete Policy Example**:

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

**Key Field Explanations**:

| Field          | Meaning                                                    | Example                  |
| :------------- | :--------------------------------------------------------- | :----------------------- |
| **Version**    | Policy syntax version                                      | "2012-10-17"             |
| **Statement**  | Array of permission statements; can contain multiple rules | [...]                    |
| **Sid**        | Statement ID, optional, used to identify this rule         | "AllowS3ReadWrite"       |
| **Effect**     | Effect: Allow or Deny                                      | "Allow"                  |
| **Action**     | Allowed/denied operations; supports wildcards              | "s3:GetObject", "s3:\*"  |
| **Resource**   | Target resource, identified by ARN                         | "arn:aws:s3:::bucket/\*" |
| **Condition**  | Optional; only takes effect when specific conditions are met | Region restriction, MFA requirement, etc. |

### 3.3 Permission Priority: Deny > Allow > Default Deny

IAM's permission evaluation logic can be summed up in one sentence: **Explicit Deny always wins; no Allow means Deny.**

The evaluation flow is as follows:

```
1. First check if there is a Deny policy
   ├─ Has Deny → Denied (regardless of any Allow)
   └─ No Deny → Continue checking

2. Then check if there is an Allow policy
   ├─ Has Allow → Allowed
   └─ No Allow → Denied (default deny principle)
```

**Practical Example: Protecting Sensitive Data**

```json
// Policy 1: Normal permissions for developers
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// Policy 2: Protect sensitive directories (even developers with s3:* cannot access)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**Key Points**:

- Although developers have `s3:*` Allow permissions
- The sensitive directory has an explicit Deny rule
- Deny takes higher priority, so developers cannot access sensitive data
- Even if the developer is an admin, this Deny still applies (unless it's the root account)

---

## 4. Access Keys (AK/SK): A "Key" That Needs Careful Handling

### 4.1 Overview of AK/SK

<AccessKeyManagementDemo />

Access Keys are long-term credentials provided by cloud services for programmatic API calls. They consist of two parts:

| Component              | Name            | Purpose                               | Analogy            |
| :--------------------- | :-------------- | :------------------------------------ | :----------------- |
| **Access Key ID**      | Access Key ID   | Identifies who you are (like a username) | Bank card number   |
| **Secret Access Key**  | Secret Access Key | Proves you are who you say you are (like a password) | Bank card PIN      |

### 4.2 Motivation for AKing /SK "High-Risk Items"

**Real Case: A Startup's Lesson**

Xiao Li is a new backend engineer at a startup. In his first week, his task is to debug a file upload feature.

```python
# Xiao Li's code (serious security issue!)
import boto3

# Hard-coded AK/SK directly in the code for convenience
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"File uploaded to s3://{bucket_name}/{object_name}")

# Test upload
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**What Happened a Week Later**:

1. Xiao Li committed the code to GitHub (including AK/SK)
2. The code on GitHub was scanned by crawlers, and the AK/SK were extracted
3. Attackers used these credentials to create a large number of EC2 instances in the company account for crypto mining
4. At the end of the month, the bill arrived: an extra $12,000 in charges
5. An audit revealed the AK/SK leak, and Xiao Li was called in for a talk...

**What Does This Case Teach Us?**

| Wrong Practice                                    | Correct Practice                                                  |
| :------------------------------------------------ | :---------------------------------------------------------------- |
| Hard-coding AK/SK in code                         | Use IAM Roles so the program automatically obtains temporary credentials |
| Committing AK/SK to a Git repository              | Use `.gitignore` to exclude config files; use a secrets management service |
| Using the same AK/SK long-term without rotation   | Rotate AK/SK regularly; use temporary credentials instead of long-term ones |
| Assigning excessive permissions to AK/SK          | Follow the principle of least privilege; grant only necessary permissions |

### 4.3 AK/SK Security Best Practices

**Scenario 1: Local Development**

```bash
# Correct approach: Use AWS CLI to configure credentials — don't write them in code
aws configure
# Then enter Access Key ID and Secret Access Key as prompted
# This info is saved in ~/.aws/credentials with permissions set to 600

# No credential configuration needed in code
import boto3
s3 = boto3.client('s3')  # Automatically reads from ~/.aws/credentials
```

**Scenario 2: Servers / EC2**

```python
# Correct approach: Use IAM Instance Profile
# 1. Create an IAM Role and attach the needed permissions (e.g., S3ReadOnly)
# 2. Create an Instance Profile and associate it with this Role
# 3. When launching EC2, select this Instance Profile

# No credentials needed in code at all
import boto3
s3 = boto3.client('s3')  # Automatically obtains temporary credentials from EC2 metadata service

# Temporary credentials auto-rotate — no need to worry about expiration
```

**Scenario 3: CI/CD Pipelines**

```yaml
# Correct approach: Use OIDC Federation (OpenID Connect)
# Example with GitHub Actions:

# 1. Create an OIDC Identity Provider in AWS, trusting GitHub
# 2. Create an IAM Role with a trust policy allowing specific GitHub repos to assume it
# 3. Configure in GitHub Actions

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Critical: allows requesting an OIDC token
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # Note: No Access Key here! Entirely using temporary credentials

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**Summary: AK/SK Usage Security Levels**

| Security Level | Practice                          | Suitable For                     | Risk Level    |
| :------------- | :-------------------------------- | :------------------------------- | :------------ |
| Highest        | Use IAM Role (no long-term creds) | EC2, Lambda, ECS, CI/CD          | Very Low      |
| High           | Use OIDC Federation               | GitHub Actions, GitLab CI        | Low           |
| Medium         | Use secrets management service    | Local development, small teams   | Medium        |
| Low            | Use environment variables         | Rapid prototyping, personal projects | High          |
| Very Low       | Hard-code in source code          | Not recommended for any scenario | Very High     |

---

## 5. Multi-Factor Authentication (MFA): Adding a "Lock" to Your Account

### 5.1 Overview of MFA

<MfaSecurityDemo />

MFA (Multi-Factor Authentication), also called 2FA (Two-Factor Authentication), is a security mechanism that requires users to provide **two or more** different types of authentication factors when logging in:

| Factor Type                          | What It Is                             | Examples              |
| :----------------------------------- | :------------------------------------- | :-------------------- |
| **Knowledge Factor** (something you know) | Information only the user knows    | Password, PIN code    |
| **Possession Factor** (something you have) | A physical device the user possesses | Phone, hardware key   |
| **Inherence Factor** (something you are)  | The user's biological characteristics | Fingerprint, facial recognition |

### 5.2 Motivation for MFAing So Important

**Real Data Tells the Answer**:

| Attack Method                          | Success Rate Without MFA | Success Rate With MFA                        |
| :------------------------------------- | :----------------------- | :------------------------------------------- |
| Password guessing / brute force        | Very High                | Extremely Low (second factor still required) |
| Phishing attacks to obtain passwords   | Very High                | Extremely Low (phishing page cannot obtain MFA code) |
| Password leaks (from other website breaches) | Very High           | Extremely Low (second factor unknown)        |

**Microsoft Security Report (2020)**: Enabling MFA can block **99.9%** of automated attacks.

### 5.3 MFA in Practice: Enabling MFA for the AWS Root Account

**Step 1: Log into the AWS Console**

1. Log in with your root account email and password
2. Click your account name in the top-right corner and select "Security Credentials"

**Step 2: Enable MFA**

1. Find the "Multi-factor authentication (MFA)" section
2. Click "Assign MFA device"
3. Choose the MFA device type ("Authenticator app" recommended)

**Step 3: Configure Virtual MFA**

1. Install Google Authenticator or Microsoft Authenticator on your phone
2. Scan the QR code or manually enter the secret key
3. Enter the 6-digit code shown in the app (enter two consecutive codes, since the code refreshes every 30 seconds)

**Done!** Your root account now has MFA protection.

---

## 6. Cross-Account Access: Approach to "Visit" Safely

### 6.1 Motivation for needing Cross-Account Access

<CrossAccountAccessDemo />

As businesses grow, many companies adopt a **multi-account architecture** to isolate different environments:

| Account Type         | Purpose                                  | Permission Requirements         |
| :------------------- | :--------------------------------------- | :------------------------------ |
| **Master Account**   | Organization management, billing         | Rarely used                     |
| **Security Audit**   | Centralized log collection from all accounts | Read-only access to other accounts |
| **Shared Services**  | Shared resources (image registries, etc.)| Read-only access from other accounts |
| **Development**      | Development environment                  | Full access for developers      |
| **Staging**          | Testing / pre-release environment        | Tester permissions              |
| **Production**       | Production environment                   | Strictly limited, requires approval |

**The Problem: How does the Production account's EC2 pull images from the Shared Services account's registry?**

- Option A: Write AK/SK in Production's user data (Dangerous! AK/SK leakage risk)
- Option B: Use cross-account Role Assume (Recommended! Temporary credentials, auto-rotation)

### 6.2 How Cross-Account Role Assume Works

```
Account A (Production)                    Account B (Shared Services)
    |                                           |
    |  1. Request Assume Role                  |
    |  "I want to assume Account B's          |
    |   ECRReadRole"                            |
    |------------------------------------------>|
    |                                           |
    |                    2. Check Trust Policy  |
    |                    "Can Account A         |
    |                     assume me?"           |
    |                                           |
    |  3. Return temporary credentials         |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. Use temporary credentials            |
    |     to access ECR                         |
    |  docker pull accountB.dkr.ecr...         |
```

**Key Points**:

- Temporary credentials are valid for 1 hour by default, configurable up to 12 hours
- No need to store any long-term credentials in code
- Trust policies can restrict who can assume the role (e.g., specific accounts, specific external IDs)

### 6.3 Hands-On: Configuring Cross-Account ECR Access

**Scenario**: The Production account's EC2 needs to pull Docker images from the Shared Services account.

**Step 1: Create an IAM Role in the Shared Services Account**

1. Log into the Shared Services account's AWS Console
2. Go to IAM → Roles → Create role
3. Select "Another AWS account"
4. Enter the Production account's Account ID
5. Optional: Check "Require external ID" and enter a random string (adds security)
6. Attach permission: AmazonEC2ContainerRegistryReadOnly
7. Name the Role: CrossAccountECRReadRole

**Step 2: Get the Role ARN**

After creation, copy the Role's ARN:

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**Step 3: Configure EC2 Instances in the Production Account**

Method A: Use Instance Profile (Recommended)

1. Create an IAM Role in the Production account (for EC2 use)
2. Trust policy: Trust the EC2 service
3. Permission policy: Allow assuming the cross-account Role

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

4. Create an Instance Profile and associate it with this Role
5. When launching EC2, select this Instance Profile

Method B: Dynamically Assume Role in EC2 User Data

```bash
#!/bin/bash
# Install AWS CLI
yum install -y aws-cli

# Assume cross-account Role
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# Extract temporary credentials
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# Log in to ECR
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# Pull the image
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**Step 4: Test Cross-Account Access**

Run on the Production EC2 instance:

```bash
# Test if Assume Role works
aws sts get-caller-identity
# Should show: arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Test if we can list Shared Services ECR repositories
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**Done!** Now the Production EC2 can safely pull images from Shared Services without sharing any long-term credentials.

---

## 7. Hands-On: Building a Secure Permission System

### 7.1 Building a Permission Architecture from Scratch

<BestPracticesDemo />

Suppose you're the tech lead at a 10-person startup and need to design an AWS permission architecture from scratch. Here are the recommended implementation steps:

**Phase 1: Root Account Protection (Day 1)**

```
Goal: Protect the root account — this is the most important account

1. Enable root account MFA (mandatory)
   - Hardware MFA recommended (YubiKey), or Google Authenticator

2. Create an IAM admin user
   - Username: admin (or your name)
   - Permissions: AdministratorAccess (but will be tightened later)
   - Enable MFA

3. Delete the root account's Access Keys (if any were created)
   - The root account should never have AK/SK

4. Configure root account usage alerts
   - Use CloudWatch + SNS to send email/SMS whenever the root account logs in
```

**Phase 2: Team Permission Grouping (Week 1)**

```
Goal: Group team members and manage permissions in batches

1. Analyze team roles:
   - Backend developers (2)
   - Frontend developer (1)
   - Mobile developer (1)
   - Product manager (1)
   - Designer (1)
   - Founders / admins (3)

2. Create IAM Groups:

   Group: Developers
   ├── Members: All developers (backend, frontend, mobile)
   ├── Permissions:
   │   ├── EC2: Start, stop, view (but cannot delete others' instances)
   │   ├── S3: Read/write development environment buckets
   │   ├── RDS: Read-only (cannot modify production database)
   │   └── CloudWatch: View logs
   └── Restriction: Can only operate in the ap-northeast-1 region

   Group: ProductTeam
   ├── Members: Product manager, designer
   ├── Permissions:
   │   ├── S3: Read-only (view data files)
   │   ├── CloudWatch Dashboard: View monitoring charts
   │   └── Cost Explorer: View billing (but cannot modify)
   └── Restriction: Read-only; cannot modify any resources

   Group: Administrators
   ├── Members: Founders, tech lead
   ├── Permissions: AdministratorAccess
   └── Requirement: Must use MFA to perform operations

3. Create an IAM User for each person and add them to the corresponding Group
   - Never attach permissions directly to individuals — always manage via Groups
   - Enable MFA (mandatory)
```

**Phase 3: Application-Layer Permission Optimization (Weeks 2-4)**

```
Goal: Let applications access AWS resources securely

1. EC2 instances use Instance Profiles
   - No more configuring AK/SK on servers
   - Create an IAM Role and attach needed permissions (e.g., S3 read/write)
   - Create an Instance Profile and associate it with this Role
   - Select this Instance Profile when launching EC2
   - Application code uses boto3 directly without credential configuration

2. If AK/SK must be used (third-party integrations)
   - Use AWS Secrets Manager to store AK/SK
   - Application reads from Secrets Manager at startup
   - Set up regular rotation (90 days)
   - Monitor AK/SK usage

3. Configure CloudTrail to record all API calls
   - Create a dedicated S3 bucket for log storage
   - Enable log file validation (to prevent tampering)
   - Configure SNS notifications for critical events (e.g., root account usage, policy changes)
```

**Phase 4: Security Hardening (Ongoing)**

```
Goal: Establish continuous security monitoring and improvement mechanisms

1. Enable AWS Config
   - Monitor resource configuration changes
   - Check compliance (e.g., whether security groups have 0.0.0.0/0 open)

2. Enable IAM Access Analyzer
   - Continuously analyze resource policies
   - Identify external access (e.g., whether S3 buckets are public)

3. Regularly review IAM configuration
   - Monthly check for unused IAM Users and Roles
   - Check Access Key usage
   - Verify Group membership is reasonable

4. Establish a security incident response process
   - If AK/SK leak is discovered: Immediately delete, rotate, audit the impact scope
   - If abnormal API calls are detected: Immediately investigate and restrict permissions
```

---

## 8. Common Misconceptions and Pitfall Avoidance Guide

### 8.1 Top 10 IAM Anti-Patterns

| #   | Anti-Pattern                              | Why It's Bad                                                | Correct Practice                                              |
| :-- | :---------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------ |
| 1   | Using the root account for daily operations | Root account has all permissions; damage cannot be limited if compromised | Create an IAM admin user; use root account only when necessary |
| 2   | Giving everyone AdministratorAccess       | Violates least privilege; increases risk of mistakes and insider threats | Group by role; grant only necessary permissions                |
| 3   | Hard-coding AK/SK in source code          | AK/SK easily leaked via GitHub and hard to rotate           | Use IAM Roles, environment variables, or secrets management services |
| 4   | Not rotating AK/SK for long periods       | Increases exposure window after credential leaks            | Set a 90-day rotation policy, or better — use temporary credentials |
| 5   | Ignoring MFA                              | Account is immediately compromised if password is leaked    | Enable MFA for all IAM users, especially high-privilege users |
| 6   | Not using CloudTrail                      | Cannot audit who did what; impossible to trace incidents    | Enable CloudTrail and store logs in a separate audit account  |
| 7   | IAM Policies that are too permissive      | e.g., `Resource: "*"`, `Action: "*"` — increases attack surface | Explicitly specify resource ARNs and specific Actions         |
| 8   | Not cleaning up departed employees' IAM Users | Zombie accounts can become backdoors                     | Establish an offboarding process; immediately disable and delete IAM Users |
| 9   | Not using IAM Access Analyzer             | Cannot discover overly permissive resource policies (e.g., public S3 buckets) | Enable IAM Access Analyzer; regularly check for external access |
| 10  | Not validating Policies in a test environment | Applying Policies directly in production may cause service outages | Use IAM Policy Simulator to test; validate in a test environment first |

---

## 9. Glossary

| English Term                             | Chinese Translation            | Explanation                                                          |
| :--------------------------------------- | :----------------------------- | :------------------------------------------------------------------- |
| **IAM (Identity and Access Management)** | 身份与访问管理                 | Cloud service for managing user identities and access permissions    |
| **RAM (Resource Access Management)**     | 资源访问管理                   | Alibaba Cloud's IAM service name                                     |
| **Root Account**                         | 根账号                         | The owner account created when registering a cloud account; has the highest privileges |
| **IAM User**                             | IAM 用户/子账号                | A sub-identity created by the root account for daily operations      |
| **IAM Role**                             | IAM 角色                       | A temporary permission carrier with no long-term credentials; needs to be "assumed" |
| **IAM Policy**                           | IAM 策略                       | JSON-formatted permission rule definition                            |
| **ARN**                                  | 亚马逊资源名称                 | Globally unique resource identifier                                  |
| **AK/SK**                                | 访问密钥/密钥                  | Credentials for programmatic cloud API access                        |
| **STS**                                  | 安全令牌服务                   | Service that provides temporary security credentials                 |
| **MFA**                                  | 多因素认证                     | Authentication method requiring two or more factors                  |
| **SSO**                                  | 单点登录                       | Authentication method allowing users to access multiple systems with a single login |
| **ExternalId**                           | 外部 ID                        | Security identifier used to prevent confused deputy attacks          |
| **CloudTrail**                           | 云审计服务                     | Logging service that records all API calls and operations in a cloud account |

---

## Summary: Core Principles of Cloud Account Permission Management

Cloud account permission management is not a one-time effort — it needs to evolve continuously based on team size and business needs:

1. **Starting Phase** (1-10 people):
   - Protect the root account (MFA + don't use the root account for daily operations)
   - Create an IAM admin user
   - Basic grouping (Developers, Admins)

2. **Growth Phase** (10-50 people):
   - Refined permission grouping (frontend/backend, ops, product, etc.)
   - Use IAM Roles instead of AK/SK
   - Enable CloudTrail auditing
   - Regular permission reviews

3. **Maturity Phase** (50+ people / multi-account):
   - Multi-account architecture (Dev, Staging, Prod separation)
   - Centralized log audit account
   - Automated permission reviews and alerts
   - Well-established permission request and approval workflows

**Remember Three Core Principles**:

1. **Principle of Least Privilege**: Grant only necessary permissions; don't give AdministratorAccess
2. **No Long-Term Credentials**: Prefer IAM Roles and temporary credentials to avoid AK/SK leaks
3. **Enable MFA**: Especially for root accounts and high-privilege accounts — this is the most effective security measure

---

> **Further Reading**:
>
> - [AWS IAM Official Documentation](https://docs.aws.amazon.com/iam/)
> - [Alibaba Cloud RAM Official Documentation](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
# Principles of Infrastructure as Code

::: tip Foreword
**Have you ever experienced this nightmare: a production server goes down, but nobody remembers how it was originally configured?** Manually logging into servers, running commands from memory, praying you don't make a typo — this is the daily reality of traditional operations. Infrastructure as Code (IaC) has completely changed all of this: using code to define and manage infrastructure, making server configuration as version-controllable, reproducible, and auditable as software.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Core concepts**: Understand what IaC is and why it's the cornerstone of modern operations
- **Workflow understanding**: Master Terraform's Write → Plan → Apply → Destroy four-stage workflow
- **Tool selection**: Understand the pros and cons of mainstream tools like Terraform, Pulumi, and CloudFormation
- **Risk awareness**: Understand the dangers of configuration drift and detection methods
- **Best practices**: Master engineering management methods for IaC projects

| Chapter | Content | Core Concepts |
|---------|---------|---------------|
| **Chapter 1** | IaC Concepts | Manual operations vs. code management |
| **Chapter 2** | Terraform Workflow | Write → Plan → Apply |
| **Chapter 3** | Tool Comparison | Terraform, Pulumi, CDK |
| **Chapter 4** | Configuration Drift | Detection, prevention, remediation |
| **Chapter 5** | Best Practices | Modularization, state management, CI/CD |

---

## 0. Big Picture: Motivation for Infrastructuring Need "Source Code" Too

Imagine you're a chef. If you cook every dish by feel — a spoonful of salt today, two spoonfuls tomorrow — the taste will never be consistent. But if you write down the recipe — specifying the exact grams of each seasoning — anyone can reproduce the same taste.

Infrastructure management faces the same problem. A single server's configuration might involve dozens of parameters: operating system, network rules, security groups, storage volumes, environment variables, and more. Manual configuration is not only error-prone, but also **irreproducible, unauditable, and irreversible**.

::: tip Core Values of IaC
- **Reproducible**: The same code produces the same result no matter how many times it's executed (idempotency)
- **Version controllable**: Infrastructure changes are managed through Git — who changed what and why is clear at a glance
- **Auditable**: All changes are recorded, meeting compliance requirements
- **Automatable**: Automatic deployment through CI/CD pipelines eliminates human error
- **Collaborative**: Team members review infrastructure changes through Pull Requests, just like code reviews
:::

---

## 1. IaC Concepts: From "Manual Clicking" to "Code Declarations"

Traditional operations works like this: log into the cloud platform console, manually click to create servers, configure networks, and set up security groups. This approach works when managing a few servers, but becomes a nightmare when scaling to dozens or hundreds.

The core idea of IaC is: **use declarative code to describe your desired infrastructure state, and let tools automatically implement it**. You don't need to tell the tool "first create a VPC, then create a subnet, then create a security group" (imperative). Instead, you simply say "I want this kind of network environment" (declarative), and the tool automatically calculates the steps needed.

<IaCConceptDemo />

| Dimension | Manual Operations | Infrastructure as Code |
|-----------|------------------|----------------------|
| Operation method | Log into console and click | Write code files |
| Reproducibility | Relies on documentation and memory | Code is documentation, 100% reproducible |
| Change tracking | No records or incomplete records | Git version control, complete history |
| Collaboration method | Verbal communication, document passing | Pull Request reviews |
| Rollback capability | Manual reverse operations | git revert + re-apply |
| Consistency | Large differences between environments | Dev/test/production are completely identical |

::: tip Declarative vs Imperative
- **Declarative**: Describe "what I want," and the tool automatically figures out "how to do it." Terraform and CloudFormation use this approach. The advantage is good idempotency; the disadvantage is limited flexibility.
- **Imperative**: Describe "how to do it," executing step by step. Ansible and Shell scripts use this approach. The advantage is flexibility; the disadvantage is difficulty ensuring idempotency.
- **Hybrid**: Pulumi and AWS CDK are written in general-purpose programming languages, combining declarative state management with imperative flexibility.
:::

---

## 2. Terraform Workflow: Write → Plan → Apply

Terraform is currently the most popular IaC tool, developed by HashiCorp. Its workflow is clear and intuitive, divided into four stages, much like software development's "code → review → deploy → cleanup."

<TerraformWorkflowDemo />

::: tip Four-Stage Workflow
1. **Write**: Write infrastructure definition files (.tf) using HCL (HashiCorp Configuration Language). Declare the resources you need: servers, databases, networks, etc.
2. **Plan**: Run `terraform plan`. Terraform compares the current state with the desired state and generates an "execution plan" — telling you what resources it intends to create, modify, or delete. This is a safety net that lets you confirm changes before actually executing.
3. **Apply**: After confirming the plan is correct, run `terraform apply`. Terraform creates or modifies resources according to the plan. After execution, the current state is saved to the state file (terraform.tfstate).
4. **Destroy**: When no longer needed, run `terraform destroy` to clean up all resources and avoid unnecessary costs.
:::

| Command | Purpose | Modifies Infrastructure | Use Case |
|---------|---------|----------------------|----------|
| `terraform init` | Initialize project, download providers | No | First use or adding new providers |
| `terraform plan` | Preview changes, generate execution plan | No | Must run before every change |
| `terraform apply` | Execute changes, create/modify resources | Yes | Execute after confirming plan |
| `terraform destroy` | Destroy all resources | Yes | Clean up test environments, decommission services |
| `terraform state` | View/manage state file | Depends on operation | State migration, resource import |

---

## 3. Tool Comparison: Choosing the Right IaC Tool for You

There are multiple tools in the IaC space, each with different focuses. When choosing a tool, consider the team's tech stack, cloud platform, and project scale. There's no "best" tool — only the one most suitable for your scenario.

<IaCToolComparisonDemo />

| Tool | Language | Cloud Support | Learning Curve | Use Case |
|------|----------|--------------|---------------|----------|
| Terraform | HCL | Multi-cloud (AWS/Azure/GCP) | Medium | Multi-cloud environments, team collaboration |
| Pulumi | Python/TS/Go | Multi-cloud | Low (familiar programming language) | Developer-friendly, complex logic |
| AWS CloudFormation | JSON/YAML | AWS only | Medium | Pure AWS environments |
| AWS CDK | Python/TS/Java | AWS only | Low | AWS + programming language preference |
| Ansible | YAML | Multi-cloud + bare metal | Low | Configuration management, hybrid environments |

::: tip How to Choose?
- **Startups / Single cloud**: CloudFormation (AWS) or the cloud platform's native tool for best ecosystem integration
- **Multi-cloud / Mid-to-large teams**: Terraform — largest community, most providers, easiest hiring
- **Developer-led teams**: Pulumi or CDK — write infrastructure in familiar programming languages with good IDE support
- **Need configuration management**: Ansible — excels at server-internal configuration (installing software, modifying config files)
:::

---

## 4. Configuration Drift: The Silent Time Bomb

Configuration drift is the most insidious enemy in IaC practice. It refers to the **gradual divergence between the actual infrastructure state and the code-defined state**.

How does this drift typically occur? Someone makes a "quick fix" for a production issue by directly logging into the console and manually changing a security group rule. Someone temporarily increases a server's configuration for debugging but forgets to change it back. These "small changes" accumulate over time, eventually causing serious misalignment between the code and the actual environment.

<ConfigDriftDemo />

::: tip Dangers of Configuration Drift
1. **Irreproducible**: The environment described by the code is inconsistent with the actual environment, causing problems when creating new environments
2. **Failed rollbacks**: You think rolling back to the previous version will restore everything, but the actual environment has been manually modified
3. **Security risks**: Manually opened ports and relaxed permissions may be forgotten, becoming attack vectors
4. **Audit failure**: Compliance audits are based on code, but the code doesn't reflect the real state
:::

| Prevention Measure | Description |
|-------------------|-------------|
| Prohibit manual changes | Restrict console operation permissions through IAM policies |
| Regular drift detection | Periodically run `terraform plan` to check for differences |
| Auto-remediation | Automatically execute apply to restore consistency when drift is detected |
| Change audit | Enable CloudTrail and other audit logs to track all change sources |

---

## 5. Best Practices: Making IaC Projects Sustainable

IaC code, just like application code, needs good engineering practices to ensure maintainability. As infrastructure scales up, unstructured IaC code becomes another form of "technical debt."

<IaCBestPracticeDemo />

::: tip Six Core Best Practices
1. **Modularization**: Abstract reusable infrastructure into modules (like VPC modules, database modules) to avoid copy-pasting. Like writing functions — define once, call everywhere.
2. **Environment isolation**: Development, testing, and production use independent state files and variable files, isolated through workspaces or directory structures.
3. **Remote state management**: State files (tfstate) are stored in remote backends (S3 + DynamoDB), supporting team collaboration and state locking to prevent concurrent conflicts.
4. **Sensitive information management**: Passwords, keys, and other sensitive data should not be written in code. Use tools like Vault or AWS Secrets Manager for management.
5. **CI/CD integration**: Integrate terraform plan into the PR process; apply is automatically executed through pipelines, eliminating local manual operations.
6. **Code review**: Infrastructure changes need Code Review just like application code, especially changes involving security groups and IAM policies.
:::

---

## Summary

Infrastructure as Code is the cornerstone of modern cloud-native operations. It transforms "indescribable manual operations" into "version-controllable code," turning infrastructure management from "art" into "engineering."

Key takeaways from this chapter:

1. **The essence of IaC**: Use code to declare the desired state of infrastructure, and let tools automatically implement it
2. **Terraform workflow**: Write → Plan → Apply in three steps, with Plan as the safety net
3. **Tool selection**: Multi-cloud → Terraform, single cloud → native tools, developer teams → Pulumi
4. **Configuration drift**: The most insidious risk, requiring dual protection through processes and tools
5. **Engineering management**: Modularization, environment isolation, remote state, and CI/CD integration are all essential

## Further Reading

- [Terraform Official Tutorials](https://developer.hashicorp.com/terraform/tutorials) - Learn Terraform from scratch
- [Pulumi Documentation](https://www.pulumi.com/docs/) - Write infrastructure in programming languages
- [AWS CDK Workshop](https://cdkworkshop.com/) - AWS CDK hands-on tutorial
- [Infrastructure as Code (O'Reilly)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098114664/) - Classic book on IaC
- [Spacelift Blog](https://spacelift.io/blog) - IaC best practices and industry trends

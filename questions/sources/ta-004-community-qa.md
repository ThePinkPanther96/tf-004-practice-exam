# Terraform Associate 004 — community Q&As and passing-candidate reports

Initially collected on **9 October 2026**; expanded and reviewed on **21 October 2026**. **139 collected questions with options, corrected answers and source links**, plus the concrete question example and topic recollections below.

The question collection comes from **Suu10 / susu10-10**, who explicitly [reports passing TA-004](https://www.reddit.com/r/Terraform/comments/1todk9x/free_terraform_associate_004_pocket_guide_i/) and publishes quizzes in the [TF004 Pocket Guide](https://github.com/susu10-10/TF004-PocketGuide). The repository declares an MIT license. These are that community author's published study questions. The author does **not** identify them as questions copied from their exam.

The direct exam-experience evidence is recorded separately below. I did not find a reliable public set containing original exam stems, complete original options and independently established correct answers from verified passers. Passing claims in these Reddit posts are self-reported. No question stems or distractors in the numbered collection were invented for this document. Formatting and option letters were standardized; true/false options are explicit even where the source only states the question type. Answer explanations and corrections are my technical audit.

## What passers actually reported

### A concrete question example from a passer, with a verified answer

**Reporter:** Impressive_Basket434, 24 January 2026; explicitly reports passing 004. [R1](https://www.reddit.com/r/Terraform/comments/1qlhaqt/i_passed_the_newly_released_terraform_004/)

> what is a major difference between a variable block and an output block

**Reported follow-up structure:** identify how the blocks are written and recognize their appearance in configuration. **Original answer options: not supplied.** The passer describes this as an example concept, without saying it is a verbatim exam question.

**Correct answer:** An input variable declares an argument accepted by a module; an output exposes a value computed by the module. A parent supplies child inputs through its module block and reads child outputs through `module.NAME.OUTPUT`. [Input variables](https://developer.hashicorp.com/terraform/language/v1.12.x/values/variables), [output values](https://developer.hashicorp.com/terraform/language/v1.12.x/values/outputs).

**Reliability note:** Another commenter in the same thread also reports passing and disputes how representative this simple example is, saying some options looked nearly identical. This is evidence for practicing the distinction, not evidence that all questions are this simple. [R1](https://www.reddit.com/r/Terraform/comments/1qlhaqt/i_passed_the_newly_released_terraform_004/)

### A claimed recalled question from a commercial discussion page

**Reporter:** Gearldine, displayed as five months ago when retrieved; explicitly claims passing 004 and labels the question a recollection. [Community comment](https://www.pass4success.com/hashicorp/exam/terraform-associate-004).

**Reported question, paraphrased:** If references already establish resource ordering, must you also explicitly declare `depends_on`? **Original answer options: not supplied.**

**Correct answer:** No. References normally establish the necessary implicit dependency. Explicit `depends_on` is for a hidden dependency that Terraform cannot infer from references. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/depends_on).

**Provenance confidence: low.** This comment is hosted by an exam vendor. I could not authenticate the commenter or passing claim. It is included as a claimed recollection, with a technically verified answer, rather than as established real-exam content.

### Specific topics a passer recalls appearing on the test

**Reporter:** Existing-Strength-21, June 2026; says they passed the previous day. [R2](https://www.reddit.com/r/Terraform/comments/1udt01o/hashicorp_certified_terraform_associate_004/)

> there were questions on the test that were not on any of his knowlwdge checks or the practice exam.

The commenter explicitly identifies **`terraform console`** and **when to force a state unlock**. They do not supply the original question stems or options.

**Verified answer facts:** `terraform console` evaluates expressions and functions interactively, using configuration and state. For a stale lock left by your failed operation, first establish that no legitimate operation is still using it, then use `terraform force-unlock LOCK_ID` if normal unlocking failed. It removes a state lock, not infrastructure. [Console](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/console), [state locking](https://developer.hashicorp.com/terraform/language/v1.12.x/state/locking), [force-unlock](https://developer.hashicorp.com/terraform/cli/commands/force-unlock).

### Broader structures and distinctions reported by passers

| Report | What the passing candidate actually says | What to practice in the collected Q&As |
|---|---|---|
| [R3](https://www.reddit.com/r/Terraform/comments/1r579o8/passed_terraform_associate_004_some_honest/) — 15 February 2026 | Workflows, state/backends and module behavior were prominent; CLI behavior mattered; Terraform Cloud features appeared. | Select the correct command for an operational scenario; distinguish previewing changes, applying changes and refreshing state; read module wiring. |
| [R4](https://www.reddit.com/r/Terraform/comments/1uz9shk/passed_the_hashicorp_terraform_associate_004_exam/) — 17 July 2026 | Calls out providers versus backends, variables versus outputs, module inputs/outputs, state commands, sensitive values and the lock file as important or tricky areas. | Choose between closely related concepts; recognize references and file purposes; follow values between modules. |
| [R1](https://www.reddit.com/r/Terraform/comments/1qlhaqt/i_passed_the_newly_released_terraform_004/) — January 2026 comments | One passer reports similar-looking options and unfamiliar features; another gives the variable/output example. | Check the precise behavior of each option rather than relying on a keyword alone. |
| [R5](https://www.reddit.com/r/Terraform/comments/1todk9x/free_terraform_associate_004_pocket_guide_i/) — 26 May 2026 | Explicitly reports passing and shares their own quizzes. | The complete stems and options below are extracted from those published quizzes. Their presence in the repository does not establish that they appeared on the exam. |

## Question collection

Every numbered item is a **community-published practice question by a self-reported TA-004 passer**. Each includes the original source question number and an official technical reference. “Source correction” identifies a source key that needed repair. “Source clarification” identifies an explanation that needed qualification without changing its correct option.

## IaC and the provider workflow

### Q001 · True/False

Terraform's configuration language is procedural, requiring you to define the specific steps and order of operations to reach the desired end state.

- **A.** True
- **B.** False

**Correct answer: False.**

Terraform configurations describe desired infrastructure rather than an ordered procedure. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L274).

### Q002 · True/False

One advantage of Infrastructure as Code is that it enables the use of version control systems (VCS) to track changes to infrastructure definitions over time.

- **A.** True
- **B.** False

**Correct answer: True.**

Infrastructure definitions can be reviewed and versioned in Git. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L281).

### Q003 · True/False

When using Terraform, you must use a different command syntax (e.g., `terraform aws-plan` vs `terraform azure-plan`) depending on which cloud provider you are targeting.

- **A.** True
- **B.** False

**Correct answer: False.**

The CLI workflow stays the same across providers. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L288).

### Q004 · True/False

The "Idempotency" provided by Terraform means that running `terraform apply` 10 times in a row will result in the creation of 10 identical sets of resources.

- **A.** True
- **B.** False

**Correct answer: False.**

Repeated applies converge on the same desired state; they do not inherently duplicate resources. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L295).

### Q005 · Multiple Choice

Which of the following best describes the role of the execution plan in the `terraform plan` command?

- **A.** It executes the necessary API calls to provision the infrastructure.
- **B.** It provides a cost estimate for the infrastructure to be deployed.
- **C.** It displays a preview of the changes Terraform will make to the infrastructure based on the current configuration and state.
- **D.** It validates the syntax of the configuration files.

**Correct answer: C — It displays a preview of the changes Terraform will make to the infrastructure based on the current configuration and state..**

A plan previews proposed changes before they are applied. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L312).

### Q006 · Multiple Choice

Terraform manages resources across multiple cloud providers (e.g., AWS and Azure) primarily through the use of:

- **A.** A single, universal cloud API standard.
- **B.** Cloud-specific environment variables.
- **C.** Executable plugins called "Providers."
- **D.** A central management console at console.terraform.io.

**Correct answer: C — Executable plugins called "Providers.".**

Provider plugins implement interactions with individual services. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L322).

### Q007 · Multiple Choice

An organization is using Terraform to manage their AWS EC2 instances and also their Datadog monitoring dashboards. What term describes Terraform's ability to manage these two distinct types of services with the same workflow?

- **A.** Multi-cloud provisioning
- **B.** Hybrid cloud deployment
- **C.** Service-agnostic workflow
- **D.** Policy as Code

**Correct answer: C — Service-agnostic workflow.**

The same workflow can manage compute and monitoring services. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L332).

### Q008 · Multiple Answer

Which of the following are recognized benefits of adopting Infrastructure as Code (IaC)? (Select **THREE**)

- **A.** Reduced risk of human error through automation.
- **B.** Guaranteed zero downtime for all application deployments.
- **C.** Increased speed and efficiency when provisioning environments.
- **D.** Automatic generation of application source code.
- **E.** Improved consistency and repeatability of infrastructure deployments.
- **F.** Elimination of all network latency.

**Correct answer: A — Reduced risk of human error through automation.; C — Increased speed and efficiency when provisioning environments.; E — Improved consistency and repeatability of infrastructure deployments..**

Automation improves repeatability and provisioning efficiency; zero downtime is not guaranteed. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/01-Infrastructure-as-Code-with-Terraform.md#L365).

## Providers, state and generated files

### Q009 · True/False

If a module does not define a `required_providers` block, Terraform will assume that all required providers are available globally and will not attempt to download them.

- **A.** True
- **B.** False

**Correct answer: False.**

Provider configurations and provider requirements are distinct. Terraform still resolves and installs required plugins. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1111).

### Q010 · Multiple Choice

You need to manage resources in two different AWS accounts from the same Terraform configuration. What is the correct approach?

- **A.** Define two separate `terraform` blocks, each with its own `required_providers`.
- **B.** Define one provider "aws" block and use the account_id argument in each resource.
- **C.** Define two provider "aws" blocks with different alias values, and use the provider meta-argument in resources to select the appropriate one.
- **D.** Use the terraform workspace command to switch between accounts.

**Correct answer: C — Define two provider "aws" blocks with different alias values, and use the provider meta-argument in resources to select the appropriate one..**

Aliased provider configurations let resources use different accounts or regions. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1129).

### Q011 · Multiple Choice

What is the primary reason that Terraform state files should not be manually edited?

- **A.** The JSON format is encrypted and cannot be read by humans.
- **B.** Manual edits can break the one-to-one mapping between resources and real-world objects, leading to orphaned resources or incorrect planning.
- **C.** Editing the state file requires a paid license.
- **D.** The state file is automatically regenerated on every terraform plan, so edits are lost.

**Correct answer: B — Manual edits can break the one-to-one mapping between resources and real-world objects, leading to orphaned resources or incorrect planning..**

State maintains bindings between Terraform addresses and remote objects. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/state/purpose).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1139).

### Q012 · True/False

When using a remote backend (e.g., S3), the `terraform state pull` command retrieves the state directly from the local `.terraform/terraform.tfstate` cache file, not from the remote location.

- **A.** True
- **B.** False

**Correct answer: False.**

State is read from the configured backend; the local backend metadata file is not a remote state cache. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1159).

### Q013 · Multiple Choice

Consider the following configuration snippet:

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
}
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
}
```
How does Terraform ensure that the `aws_instance.web` resource is created after the `aws_ami` data source has been queried?

- **A.** The user must explicitly add depends_on = [data.aws_ami.ubuntu].
- **B.** The AWS provider internally serializes all API calls.
- **C.** Terraform's dependency graph detects the reference `data.aws_ami.ubuntu.id` and establishes an implicit dependency.
- **D.** Data sources are always evaluated during `terraform apply`, never during `terraform plan`.

**Correct answer: C — Terraform's dependency graph detects the reference `data.aws_ami.ubuntu.id` and establishes an implicit dependency..**

The resource expression creates an implicit dependency on the data source. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/depends_on).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1167).

### Q014 · Multiple Choice

A junior engineer accidentally commits the `terraform.tfstate` file to a public GitHub repository. What is the most immediate and critical security action required?

- **A.** Delete the commit history using git filter-branch.
- **B.** Immediately run `terraform destroy` to tear down all infrastructure.
- **C.** Rotate all secrets and credentials that were stored in the state file, as they are now exposed.
- **D.** Add *.tfstate to .gitignore for future commits.

**Correct answer: C — Rotate all secrets and credentials that were stored in the state file, as they are now exposed..**

Treat credentials exposed through state as compromised; removing the file does not revoke them. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1206).

### Q015 · Multiple Choice

What is the purpose of the `lineage` field in a Terraform state file?

- **A.** It tracks the user who last applied the configuration.
- **B.** It is a unique identifier assigned when the state is created, used to prevent accidentally applying a state from a different configuration.
- **C.** It indicates the Terraform version that generated the state.
- **D.** It stores the checksum of the configuration files.

**Correct answer: B — It is a unique identifier assigned when the state is created, used to prevent accidentally applying a state from a different configuration..**

Lineage distinguishes state histories; state push checks it to prevent mixing unrelated state. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/push).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1226).

### Q016 · Multiple Choice

A Terraform configuration declares a `cloud` block. What happens if you also attempt to define a `backend` block in the same configuration?

- **A.** The backend block takes precedence for state storage, and the cloud block is ignored.
- **B.** The cloud block takes precedence, and the backend block is ignored.
- **C.** Terraform will raise an error during `terraform init` because they are mutually exclusive.
- **D.** Both are allowed; the cloud block handles remote operations, and the backend block handles state storage.

**Correct answer: C — Terraform will raise an error during `terraform init` because they are mutually exclusive..**

A configuration cannot declare both cloud and backend blocks. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/terraform).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L1242).

## Command selection and operational scenarios

### Q017 · True/False

Running `terraform plan` will automatically run `terraform init` if the working directory has not been initialized yet.

- **A.** True
- **B.** False

**Correct answer: False.**

Initialize the working directory explicitly before planning. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L872).

### Q018 · True/False

The `terraform apply` command, when used without a saved plan file, will generate a new execution plan and immediately apply it without any user interaction.

- **A.** True
- **B.** False

**Correct answer: False.**

An interactive apply normally asks for approval unless auto-approval is requested. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/apply).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L880).

### Q019 · Multiple Choice

Which command would you use to check whether your Terraform configuration files follow the canonical style conventions without actually modifying them?

- **A.** terraform fmt
- **B.** terraform fmt -check
- **C.** terraform validate -style
- **D.** terraform plan -style-check

**Correct answer: B — terraform fmt -check.**

The check option reports formatting problems without rewriting files. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/fmt).

[Community source — question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L888).

### Q020 · Multiple Answer

Which of the following actions does `terraform init` perform? **(Select THREE)**

- **A.** Downloads and installs provider plugins.
- **B.** Generates an execution plan for the current configuration.
- **C.** Initializes the configured backend for state storage.
- **D.** Validates the syntax of all .tf files.
- **E.** Downloads child modules referenced in module blocks.
- **F.** Creates the resources defined in the configuration.

**Correct answer: A — Downloads and installs provider plugins.; C — Initializes the configured backend for state storage.; E — Downloads child modules referenced in module blocks..**

Initialization prepares the backend, provider plugins and child modules; it is not full configuration validation. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L905).

### Q021 · Multiple Choice

What happens if you run `terraform apply` and the apply process encounters an error after successfully creating two of the three resources defined in the configuration?

- **A.** Terraform automatically rolls back the two created resources and exits.
- **B.** Terraform halts execution, records the two created resources in the state file, and exits with an error.
- **C.** Terraform continues attempting to create the third resource indefinitely.
- **D.** Terraform deletes the two created resources and then exits with an error.

**Correct answer: B — Terraform halts execution, records the two created resources in the state file, and exits with an error..**

Successfully completed changes remain; Terraform does not provide automatic transactional rollback. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/apply).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L924).

### Q022 · Multiple Choice

You have made manual changes to a resource outside of Terraform. You want to update the Terraform state file to match the current real-world state without modifying your configuration. Which command sequence is the recommended approach?

- **A.** terraform refresh
- **B.** terraform plan -refresh-only then terraform apply -refresh-only
- **C.** terraform state pull then manually edit the JSON and terraform state push
- **D.** terraform apply -target=resource_address

**Correct answer: B — terraform plan -refresh-only then terraform apply -refresh-only.**

Review refresh-only changes before committing them to state. Applying a saved refresh-only plan preserves the reviewed plan. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L934).

### Q023 · Multiple Choice

In a team environment using HCP Terraform, what is the primary purpose of a speculative plan?

- **A.** To apply changes to production infrastructure after hours.
- **B.** To preview the potential effects of a configuration change in a pull request before merging.
- **C.** To estimate the monthly cost of the infrastructure.
- **D.** To lock the workspace to prevent other users from making changes.

**Correct answer: B — To preview the potential effects of a configuration change in a pull request before merging..**

Speculative plans preview changes without an associated apply. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/cli).

[Community source — question 10](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L950).

### Q024 · True/False

A saved Terraform plan file (created with `-out`) contains the full configuration, variable values, and planned changes in an encrypted format to protect sensitive data.

- **A.** True
- **B.** False

**Correct answer: False.**

Saved plan files are sensitive artifacts, not encrypted containers. Ephemeral values are omitted. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 12](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L971).

### Q025 · Multiple Choice

What does the `terraform fmt -recursive` command do?

- **A.** Formats only the files in the current directory.
- **B.** Formats files in the current directory and all subdirectories.
- **C.** Formats files and also validates their syntax.
- **D.** Formats files and automatically commits them to Git.

**Correct answer: B — Formats files in the current directory and all subdirectories..**

Recursive formatting includes nested directories. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/fmt).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L979).

### Q026 · Multiple Answer

Which statements accurately describe the `terraform destroy` command? **(Select TWO)**

- **A.** It is an alias for terraform apply -destroy.
- **B.** It requires a saved plan file to execute.
- **C.** It prompts for confirmation before deleting resources.
- **D.** It only deletes resources that have been commented out in the configuration.
- **E.** It deletes the state file along with the infrastructure.

**Correct answer: A — It is an alias for terraform apply -destroy.; C — It prompts for confirmation before deleting resources..**

Destroy mode prompts for approval by default, like a normal interactive apply. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/apply).

[Community source — question 14](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L988).

### Q027 · Multiple Choice

During `terraform apply`, Terraform creates resources in parallel when possible. What is the default maximum number of concurrent resource operations?

- **A.** 1 (sequential)
- **B.** 5
- **C.** 10
- **D.** 20

**Correct answer: C — 10.**

The default parallelism limit is ten graph operations. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/apply).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L998).

### Q028 · Multiple Answer

Which of the following are true about the `-target` option? **(Select TWO)**

- **A.** It is recommended for routine use to speed up operations on large configurations.
- **B.** It limits the plan/apply to the specified resource and its dependencies.
- **C.** It can cause configuration drift if used regularly.
- **D.** It works with both plan and apply but not destroy.

**Correct answer: B — It limits the plan/apply to the specified resource and its dependencies.; C — It can cause configuration drift if used regularly..**

Targeting includes dependencies and is intended for exceptional recovery situations. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 18](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L1029).

### Q029 · Multiple Choice

A team member runs `terraform apply` but forgets to pull the latest changes from Git. Their local state file is older than the remote state. What happens if they are using a remote backend with state locking (e.g., S3 with DynamoDB)?

- **A.** Terraform will overwrite the remote state with the local state.
- **B.** Terraform will merge the local state with the remote state.
- **C.** Terraform will fail to acquire the state lock because the serial number in the remote state is higher.
- **D.** Terraform will automatically pull the latest state before applying.

**Correct answer: D — Terraform will automatically pull the latest state before applying..**

The configured remote backend supplies current state. This does not fix stale Git configuration. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend).

**Source correction:** The source key says C. A newer state serial does not itself prevent acquiring a state lock.

[Community source — question 19](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L1039).

### Q030 · Multiple Choice

What is the exit code of `terraform plan -detailed-exitcode` if there are no changes to be made?

- **A.** 0
- **B.** 1
- **C.** 2
- **D.** 3

**Correct answer: A — 0.**

Detailed exit codes are 0 for no changes, 1 for errors and 2 for changes. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 21](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L1056).

### Q031 · Multiple Answer

Which of the following files or directories should not be committed to version control? **(Select THREE)**

- **A.** .terraform/
- **B.** terraform.tfstate
- **C.** .terraform.lock.hcl
- **D.** terraform.tfvars (if it contains sensitive data)
- **E.** main.tf

**Correct answer: A — .terraform/; B — terraform.tfstate; D — terraform.tfvars (if it contains sensitive data).**

Keep state and secrets out of version control. Commit configuration and the provider lock file. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — question 22](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L1066).

## Read HCL, variable precedence and data sources

### Q032 · True/False

A data block can be configured with count to fetch multiple instances of a data source.

- **A.** True
- **B.** False

**Correct answer: True.**

Data sources support multiple instances through count or for_each. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/data-sources).

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L819).

### Q033 · Multiple Choice

You need to reference the private IP address of an AWS instance defined as `resource "aws_instance" "app"`. Which expression is correct?

- **A.** aws_instance.app.private_ip
- **B.** resource.aws_instance.app.private_ip
- **C.** data.aws_instance.app.private_ip
- **D.** var.aws_instance.app.private_ip

**Correct answer: A — aws_instance.app.private_ip.**

Managed resource attributes use resource_type.local_name.attribute. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/outputs).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L823).

### Q034 · Multiple Answer

Which of the following are valid meta-arguments for a resource block? **(Select THREE)**

- **A.** depends_on
- **B.** sensitive
- **C.** lifecycle
- **D.** provider
- **E.** validation

**Correct answer: A — depends_on; C — lifecycle; D — provider.**

These are resource meta-arguments; sensitive and validation belong in other contexts. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

[Community source — question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L833).

### Q035 · True/False

A local value `(locals block)` can reference other local values defined later in the same block, as long as there is no circular dependency.

- **A.** True
- **B.** False

**Correct answer: True.**

References determine evaluation order; circular dependencies are invalid. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/locals).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L844).

### Q036 · Multiple Choice

You have a variable defined as:

```hcl
variable "instance_count" {
  type    = number
  default = 1
}
```

You set an environment variable `TF_VAR_instance_count=3` and also pass `-var="instance_count=5"` on the command line. What value will Terraform use?

- **A.** 1
- **B.** 3
- **C.** 5
- **D.** Terraform will error due to conflicting values.

**Correct answer: C — 5.**

For the local CLI sources listed, the command-line value overrides the environment value and default. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/variables).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L848).

### Q037 · Multiple Choice

Which type constraint would correctly validate the value `{ id = "i-123", tags = { Name = "web" } }`?

- **A.** map(string)
- **B.** object({ id = string, tags = map(string) })
- **C.** list(string)
- **D.** tuple([string, map(string)])

**Correct answer: B — object({ id = string, tags = map(string) }).**

The object constraint describes the nested map and identifier. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/expressions/types).

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L866).

### Q038 · Multiple Answer

Which of the following statements about data sources are true? (Select THREE)

- **A.** Data sources can be used to read existing infrastructure without managing it.
- **B.** Data sources are read during terraform plan if all arguments are known.
- **C.** Data sources can be modified by terraform apply.
- **D.** Data sources support the depends_on meta-argument.

**Correct answer: A — Data sources can be used to read existing infrastructure without managing it.; B — Data sources are read during terraform plan if all arguments are known.; D — Data sources support the depends_on meta-argument..**

Data sources query information; depends_on can defer their reads. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/data-sources).

[Community source — question 9](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L888).

### Q039 · Multiple Choice

You want to ensure that a `variable` environment only accepts the values `"dev"`, `"staging"`, or `"prod"`. What is the best way to enforce this?

- **A.** Set type = string and rely on the provider to fail if invalid.
- **B.** Add a validation block with a contains check.
- **C.** Set sensitive = true to hide the value.
- **D.** Use a locals block to map the value.

**Correct answer: B — Add a validation block with a contains check..**

A variable validation condition can reject unsupported environment names. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/validate).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L901).

### Q040 · Multiple Choice

What is the correct way to reference a data source of type `aws_ami` with local name `ubuntu`?

- **A.** resource.aws_ami.ubuntu.id
- **B.** data.aws_ami.ubuntu.id
- **C.** aws_ami.ubuntu.data.id
- **D.** var.aws_ami.ubuntu.id

**Correct answer: B — data.aws_ami.ubuntu.id.**

Data source references begin with data, followed by type, local name and attribute. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/data-sources).

[Community source — question 12](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L910).

### Q041 · True/False

A set(string) variable type ensures that elements are unique and order is preserved.

- **A.** True
- **B.** False

**Correct answer: False.**

Sets provide uniqueness, without preserving insertion order. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/expressions/types).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L919).

### Q042 · Multiple Answer

Which of the following are valid ways to assign a value to an input variable? **(Select FOUR)**

- **A.** Defining a default in the variable block.
- **B.** Creating a terraform.tfvars file.
- **C.** Hardcoding the value in the resource block.
- **D.** Using the -var command-line flag.
- **E.** Setting an environment variable named TF_VAR_name

**Correct answer: A — Defining a default in the variable block.; B — Creating a terraform.tfvars file.; D — Using the -var command-line flag.; E — Setting an environment variable named TF_VAR_name.**

Defaults, tfvars, CLI flags and TF_VAR environment variables can supply root input values. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/variables).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L932).

## Expressions, lifecycle, conditions and sensitive values

### Q043 · True/False

The expression `[for s in ["a", "b"] : upper(s)]` returns `["A", "B"]`.

- **A.** True
- **B.** False

**Correct answer: True.**

The for expression applies upper to each element. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/expressions/for).

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L890).

### Q044 · Multiple Choice

Which function would you use to render a template file with variable substitution?

- **A.** `file()`
- **B.** `templatefile()`
- **C.** `jsonencode()`
- **D.** `format()`

**Correct answer: B — `templatefile()`.**

Templatefile renders an existing file with named substitutions. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/templatefile).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L894).

### Q045 · Multiple Answer

Which of the following are valid lifecycle rules? (Select THREE)

- **A.** `create_before_destroy`
- **B.** `prevent_apply`
- **C.** `ignore_changes`
- **D.** `replace_triggered_by`
- **E.** `timeout`

**Correct answer: A — `create_before_destroy`; C — `ignore_changes`; D — `replace_triggered_by`.**

These are supported lifecycle rules. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

[Community source — question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L902).

### Q046 · True/False

The `depends_on` meta-argument can be used inside a `module` block to ensure the module's resources are created after another module's resources.

- **A.** True
- **B.** False

**Correct answer: True.**

Module-level depends_on orders operations relative to another module. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/depends_on).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L913).

### Q047 · Multiple Choice

A precondition defined in a `resource` lifecycle block is evaluated:

- **A.** After the resource is created.
- **B.** Before the resource is created.
- **C.** Only during `terraform validate`.
- **D.** Only when using HCP Terraform.

**Correct answer: B — Before the resource is created..**

A precondition is checked before the associated resource operation, when its inputs become known. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L926).

### Q048 · True/False

A failed `check` block assertion will prevent `terraform apply` from proceeding.

- **A.** True
- **B.** False

**Correct answer: False.**

A failed check assertion reports a warning; it does not block the operation. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/validate).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L935).

### Q049 · Multiple Choice

Which function converts a Terraform map into a JSON string?

- **A.** `jsondecode()`
- **B.** `jsonencode()`
- **C.** `yamldecode()`
- **D.** `tostring()`

**Correct answer: B — `jsonencode()`.**

Jsonencode serializes Terraform values to JSON. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/jsonencode).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L939).

### Q050 · Multiple Answer

Which statements about the `sensitive = true` flag are correct? (Select TWO)

- **A.** It encrypts the value in the state file.
- **B.** It redacts the value from CLI output.
- **C.** It prevents the value from being used in resource arguments.
- **D.** It propagates to any expressions that reference the sensitive variable.

**Correct answer: B — It redacts the value from CLI output.; D — It propagates to any expressions that reference the sensitive variable..**

Sensitivity redacts ordinary output and normally propagates; it does not encrypt state. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — question 9](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L947).

### Q051 · True/False

The `replace_triggered_by` lifecycle rule can reference resources, data sources, or specific resource attributes.

- **A.** True
- **B.** False

**Correct answer: False.**

Replace_triggered_by accepts managed resource references, not data sources. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

**Source correction:** The source key says True, but HashiCorp explicitly limits these references to managed resources.

[Community source — question 10](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L956).

### Q052 · Multiple Choice

What is the result of the expression `merge({a=1}, {b=2})`?

- **A.** `{a=1, b=2}`
- **B.** `[{a=1}, {b=2}]`
- **C.** `["a", "b"]`
- **D.** `[1, 2]`

**Correct answer: A — `{a=1, b=2}`.**

Merge combines the two maps. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/merge).

[Community source — question 12](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L969).

### Q053 · True/False

Postconditions are evaluated after a resource is created or updated, and a failed postcondition will roll back the resource creation.

- **A.** True
- **B.** False

**Correct answer: False.**

A failed postcondition stops dependent processing; it does not undo changes already made. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/validate).

**Source correction:** The source key says True and incorrectly promises rollback.

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L978).

### Q054 · Multiple Choice

Which function would you use to find all elements in a list that match a condition?

- **A.** `contains()`
- **B.** A `for` expression with an `if` clause
- **C.** `filter()`
- **D.** `lookup()`

**Correct answer: B — A `for` expression with an `if` clause.**

A for expression can filter elements using an if condition. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/expressions/for).

[Community source — question 14](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L982).

### Q055 · Multiple Answer

Which of the following are valid arguments to the `templatefile()` function? (Select TWO)

- **A.** The path to the template file.
- **B.** A list of variables to interpolate.
- **C.** A map of variable assignments.
- **D.** A boolean flag for escaping.

**Correct answer: A — The path to the template file.; C — A map of variable assignments..**

The parameters are a file path and an object of named substitution values. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/templatefile).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L991).

### Q056 · True/False

The `terraform console` command allows you to test expressions and functions interactively against the current state.

- **A.** True
- **B.** False

**Correct answer: True.**

The console evaluates expressions interactively, including values from current state. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/console).

[Community source — question 16](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L1000).

### Q057 · Multiple Choice

You want to ignore manual changes to the `tags` attribute of an AWS instance so Terraform doesn't revert them. Which lifecycle rule should you use?

- **A.** `prevent_destroy`
- **B.** `create_before_destroy`
- **C.** `ignore_changes`
- **D.** `replace_triggered_by`

**Correct answer: C — `ignore_changes`.**

Ignore_changes permits external management of selected attributes after creation. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

[Community source — question 17](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L1004).

### Q058 · Multiple Answer

Which of the following are valid ways to validate input variables? (Select TWO)

- **A.** `validation` block within the `variable` block.
- **B.** `precondition` block within the `variable` block.
- **C.** Using the `sensitive = true` flag.
- **D.** Setting a restrictive `type` constraint.

**Correct answer: A — `validation` block within the `variable` block.; D — Setting a restrictive `type` constraint..**

Type constraints and variable validation restrict accepted inputs. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/validate).

[Community source — question 18](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L1013).

### Q059 · Multiple Choice

What does the `cidrsubnet("10.0.0.0/16", 8, 2)` function return?

- **A.** `10.0.0.2/24`
- **B.** `10.0.2.0/24`
- **C.** `10.2.0.0/16`
- **D.** `10.0.0.2/32`

**Correct answer: B — `10.0.2.0/24`.**

Adding eight prefix bits creates /24 subnets; subnet number two is 10.0.2.0/24. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/cidrsubnet).

[Community source — question 20](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L1026).

## Module sources, scope and value wiring

### Q060 · True/False

A module's `output` block can directly reference a variable from a sibling module.

- **A.** True
- **B.** False

**Correct answer: False.**

Sibling module values are wired through their parent. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/configuration).

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1102).

### Q061 · Multiple Choice

Which `source` value correctly points to a local module in the directory `./modules/network`?

- **A.** "./network"
- **B.** "./modules/network"
- **C.** "local/network"
- **D.** "file://./modules/network"

**Correct answer: B — "./modules/network".**

A relative local source starts with ./ or ../. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/module).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1106).

### Q062 · True/False

The `providers` argument in a `module` block allows a child module to define its own provider configurations that the parent cannot override.

- **A.** True
- **B.** False

**Correct answer: False.**

The providers map selects parent configurations to supply to the child. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1126).

### Q063 · Multiple Choice

How do you reference an output named `vpc_id` from a child module named `network`?

- **A.** data.module.network.vpc_id
- **B.** module.network.output.vpc_id
- **C.** module.network.vpc_id
- **D.** network.vpc_id

**Correct answer: C — module.network.vpc_id.**

Read a child output with module.NAME.OUTPUT_NAME. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/outputs).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1130).

### Q064 · Multiple Choice

What is the default behavior for provider configurations in child modules?

- **A.** Child modules must always define their own provider blocks.
- **B.** Child modules inherit only aliased providers from the parent.
- **C.** Child modules inherit the default (non-aliased) provider configurations from the parent.
- **D.** Child modules cannot use providers.

**Correct answer: C — Child modules inherit the default (non-aliased) provider configurations from the parent..**

Default provider configurations are inherited; aliased configurations require explicit mapping. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1140).

### Q065 · Multiple Answer

Which of the following are valid arguments in a `module` block? (Select THREE)

- **A.** source
- **B.** version
- **C.** backend
- **D.** depends_on
- **E.** lifecycle

**Correct answer: A — source; B — version; D — depends_on.**

Source and depends_on are supported; version applies to registry module sources. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/module).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1154).

### Q066 · Multiple Choice

What happens if you omit the `version` argument in a module block that references a module from the public Terraform Registry?

- **A.** Terraform will error, as version is required.
- **B.** Terraform will use the latest version when the module is first downloaded.
- **C.** Terraform will use the version pinned in .terraform.lock.hcl.
- **D.** Terraform will prompt you to choose a version.

**Correct answer: B — Terraform will use the latest version when the module is first downloaded..**

Initial installation selects the latest available registry module if no constraint restricts it. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/module).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1179).

### Q067 · Multiple Answer

Which of the following statements about variable scope in modules are true? (Select TWO)

- **A.** Variables defined in a child module can be directly accessed by the root module.
- **B.** A child module's outputs can be accessed by the root module using `module.NAME.OUTPUT_NAME`.
- **C.** Two sibling modules can communicate directly without routing through the root module.
- **D.** A root module passes values to a child module via the module block's arguments.

**Correct answer: B — A child module's outputs can be accessed by the root module using `module.NAME.OUTPUT_NAME`.; D — A root module passes values to a child module via the module block's arguments..**

Inputs go through module arguments; outputs are read through module references. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/configuration).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1192).

### Q068 · True/False

When using `for_each` on a module block, the module's resources are all created in parallel, ignoring any intra-module dependencies.

- **A.** True
- **B.** False

**Correct answer: False.**

Multiple module instances still respect dependencies. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/depends_on).

[Community source — question 14](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1201).

### Q069 · Multiple Choice

Which file in the standard module structure contains the declarations for the module's input variables?

- **A.** main.tf
- **B.** outputs.tf
- **C.** variables.tf
- **D.** README.md

**Correct answer: C — variables.tf.**

Variables.tf is the conventional filename; Terraform permits declarations in other .tf files. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/configuration).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1205).

### Q070 · True/False

A child module can contain its own `terraform` block with `required_providers` to specify which providers and versions it needs.

- **A.** True
- **B.** False

**Correct answer: True.**

Each module can declare its provider requirements independently of provider configuration. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — question 17](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1225).

### Q071 · Multiple Choice

What is the purpose of the `//` in a module source like `"hashicorp/consul/aws//modules/consul-cluster"`?

- **A.** It is a comment delimiter.
- **B.** It separates the registry address from a subdirectory path within the module repository.
- **C.** It indicates that the module uses multiple providers.
- **D.** It is part of the version constraint syntax.

**Correct answer: B — It separates the registry address from a subdirectory path within the module repository..**

The double slash separates a package source from its module subdirectory. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/module).

[Community source — question 18](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1229).

### Q072 · True/False

The `depends_on` argument in a `module` block can reference individual resources inside that module.

- **A.** True
- **B.** False

**Correct answer: False.**

A parent cannot refer directly to a child module's internal resource addresses. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/depends_on).

[Community source — question 19](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1240).

### Q073 · Multiple Choice

You want to share data from Module A to Module B. Module A outputs a value `subnet_ids`. How do you pass this to Module B?

- **A.** In Module B's main.tf, reference module.A.subnet_ids directly.
- **B.** In the root module, set an argument in Module B like subnet_ids = module.A.subnet_ids.
- **C.** Use the terraform_remote_state data source in Module B pointing to Module A.
- **D.** Define a global variable accessible by both modules.

**Correct answer: B — In the root module, set an argument in Module B like subnet_ids = module.A.subnet_ids..**

The parent passes an exported value from the producing module into the consuming module. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/configuration).

[Community source — question 20](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L1244).

## Backends, drift and state operations

### Q074 · True/False

The `backend` block inside `terraform {}` can reference `var.bucket_name` to dynamically set the S3 bucket for state storage.

- **A.** True
- **B.** False

**Correct answer: False.**

Backend settings cannot reference input variables, locals or resource attributes. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L868).

### Q075 · Multiple Choice

What is the primary reason state locking is essential for team workflows?

- **A.** It encrypts the state file at rest.
- **B.** It prevents two users from running `terraform plan` simultaneously.
- **C.** It prevents concurrent `apply` operations from corrupting the state file.
- **D.** It enables remote execution of Terraform commands.

**Correct answer: C — It prevents concurrent `apply` operations from corrupting the state file..**

Locking prevents concurrent state writers from causing conflicts. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/state/locking).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L872).

### Q076 · True/False

`terraform apply -refresh-only` will update your infrastructure to match the configuration if drift is detected.

- **A.** True
- **B.** False

**Correct answer: False.**

Refresh-only apply accepts observed changes into state; it does not reconcile infrastructure to configuration. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L892).

### Q077 · Multiple Choice

Which CLI command is the **safest** way to inspect what changes would occur to the state file due to external resource modifications?

- **A.** `terraform refresh`
- **B.** `terraform plan -refresh-only`
- **C.** `terraform apply -auto-approve`
- **D.** `terraform state pull`

**Correct answer: B — `terraform plan -refresh-only`.**

A refresh-only plan previews proposed state changes. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L896).

### Q078 · Multiple Choice

What does the `moved` block in Terraform configuration do?

- **A.** It physically moves cloud resources to a different region.
- **B.** It tells Terraform to rename a resource in the state file without destroying the actual resource.
- **C.** It backs up the state file to a remote location.
- **D.** It locks the state file during long-running operations.

**Correct answer: B — It tells Terraform to rename a resource in the state file without destroying the actual resource..**

A moved block records a change of Terraform address; it does not physically relocate infrastructure. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/configuration).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L920).

### Q079 · Multiple Choice

You accidentally delete an EC2 instance manually via the AWS Console. This instance was managed by Terraform. What will `terraform plan` show the next time you run it?

- **A.** No changes; Terraform will update the state automatically.
- **B.** Terraform will propose to recreate the instance.
- **C.** Terraform will error because the state is corrupted.
- **D.** Terraform will ask you to import the instance.

**Correct answer: B — Terraform will propose to recreate the instance..**

With the resource still configured and normal refresh enabled, planning proposes recreation. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — question 12](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L929).

### Q080 · Multiple Answer

Which of the following are valid methods for providing backend configuration values when they cannot be hardcoded? (Select **TWO**)

- **A.** Using `-backend-config=KEY=VALUE` at `init` time.
- **B.** Using `-backend-config=PATH` to point to a configuration file.
- **C.** Setting environment variables like `TF_BACKEND_BUCKET`.
- **D.** Using `locals` in the `backend` block.

**Correct answer: A — Using `-backend-config=KEY=VALUE` at `init` time.; B — Using `-backend-config=PATH` to point to a configuration file..**

Partial backend configuration can be supplied by an init flag or a separate file. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend).

[Community source — question 14](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L942).

### Q081 · Multiple Choice

What is the effect of running `terraform state rm aws_instance.web`?

- **A.** Terraform destroys the EC2 instance and removes it from state.
- **B.** Terraform removes the EC2 instance from state but does NOT destroy it.
- **C.** Terraform locks the state to prevent further changes.
- **D.** Terraform renames the resource in state.

**Correct answer: B — Terraform removes the EC2 instance from state but does NOT destroy it..**

The object survives removal of its state binding. Remaining configuration can propose a new object later. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/rm).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L952).

### Q082 · True/False

State locking guarantees that only one `terraform apply` can modify state at a time, but multiple `terraform plan` operations can run concurrently without any issue.

- **A.** True
- **B.** False

**Correct answer: False.**

Plan normally acquires a state lock too; parallel plans can contend for it. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

**Source correction:** The source key says True and incorrectly treats all plans as free of locking conflicts.

[Community source — question 18](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L974).

### Q083 · Multiple Answer

Which of the following statements about the state file are true? (Select **TWO**)

- **A.** It should be committed to version control to enable collaboration.
- **B.** It can contain sensitive data in plaintext.
- **C.** It maps configuration resource addresses to real-world resource IDs.
- **D.** It is automatically encrypted by Terraform when using the `local` backend.

**Correct answer: B — It can contain sensitive data in plaintext.; C — It maps configuration resource addresses to real-world resource IDs..**

State binds Terraform addresses to real objects and can contain plaintext secrets. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/state/purpose).

[Community source — question 20](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L987).

## Import, inspection and logging

### Q084 · Multiple Choice

You have an existing EC2 instance `i-abc123` that you want to bring under Terraform management. You write a `resource "aws_instance" "managed"` block and an `import` block with `id = "i-abc123"` and `to = aws_instance.managed`. What command do you run to complete the import?

- **A.** `terraform import`
- **B.** `terraform apply`
- **C.** `terraform plan -import`
- **D.** `terraform state push`

**Correct answer: B — `terraform apply`.**

Declarative import is completed through the plan/apply workflow. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/import).

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L758).

### Q085 · True/False

After a successful import, you can remove the `import` block from your configuration, and Terraform will continue to manage the resource normally.

- **A.** True
- **B.** False

**Correct answer: True.**

The imported resource remains managed by its resource block and state binding. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/import).

[Community source — question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L769).

### Q086 · Multiple Choice

Which CLI command lists all resources currently tracked in the Terraform state file?

- **A.** `terraform state show`
- **B.** `terraform show`
- **C.** `terraform state list`
- **D.** `terraform state pull`

**Correct answer: C — `terraform state list`.**

State list prints tracked resource addresses. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/list).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L773).

### Q087 · Multiple Answer

Which of the following are valid `terraform state` subcommands? (Select **THREE**)

- **A.** `terraform state list`
- **B.** `terraform state read`
- **C.** `terraform state mv`
- **D.** `terraform state rm`
- **E.** `terraform state refresh`

**Correct answer: A — `terraform state list`; C — `terraform state mv`; D — `terraform state rm`.**

List, mv and rm are state subcommands; read and refresh are not. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/list).

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L782).

### Q088 · True/False

`terraform state push` can overwrite the remote state file unconditionally, without any safety checks.

- **A.** True
- **B.** False

**Correct answer: False.**

State push checks lineage and serial unless those protections are explicitly overridden. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/push).

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L792).

### Q089 · Multiple Choice

What is the recommended `TF_LOG` level for capturing detailed information needed for a bug report?

- **A.** `INFO`
- **B.** `DEBUG`
- **C.** `TRACE`
- **D.** `WARN`

**Correct answer: C — `TRACE`.**

Trace provides the most detailed diagnostic logs. [HashiCorp reference](https://developer.hashicorp.com/terraform/internals/debugging).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L796).

### Q090 · Multiple Answer

Which of the following environment variables affect Terraform's logging behavior? (Select **TWO**)

- **A.** `TF_LOG`
- **B.** `TF_VAR_log_level`
- **C.** `TF_LOG_PATH`
- **D.** `TF_LOG_CONSOLE`

**Correct answer: A — `TF_LOG`; C — `TF_LOG_PATH`.**

TF_LOG selects verbosity; TF_LOG_PATH selects a log file. [HashiCorp reference](https://developer.hashicorp.com/terraform/internals/debugging).

[Community source — question 8](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L805).

### Q091 · True/False

Setting `TF_LOG_PROVIDER=DEBUG` enables debug logging for Terraform Core but not for any providers.

- **A.** True
- **B.** False

**Correct answer: False.**

TF_LOG_PROVIDER controls provider logs, rather than Terraform Core logs. [HashiCorp reference](https://developer.hashicorp.com/terraform/internals/debugging).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L827).

### Q092 · True/False

The `import` block supports importing resources into child modules using the `to = module.MODULE_NAME.RESOURCE_TYPE.NAME` address format.

- **A.** True
- **B.** False

**Correct answer: True.**

The destination can address a managed resource inside a child module. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/import).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L840).

### Q093 · Multiple Answer

Which of the following are limitations of the `import` block? (Select **TWO**)

- **A.** It cannot import resources that were created by Terraform.
- **B.** It does not automatically detect and add resource dependencies.
- **C.** Not all provider resource types support import.
- **D.** It requires the resource to be destroyed before import.

**Correct answer: B — It does not automatically detect and add resource dependencies.; C — Not all provider resource types support import..**

Import support is resource-specific; generated configuration still requires review and appropriate references. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/import).

[Community source — question 14](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L844).

## HCP Terraform operations, governance and organization

### Q094 · True/False

When you run `terraform apply` with a `cloud` block configured, the Terraform CLI executes the plan locally and only uploads the state to HCP Terraform.

- **A.** True
- **B.** False

**Correct answer: False.**

Remote execution is the default. Local execution is possible only when the workspace uses that mode. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings).

**Source correction:** The source labels the answer True although its own explanation describes remote execution.

[Community source — question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L627).

### Q095 · Multiple Choice

Which HCP Terraform feature allows you to define reusable collections of variables and apply them across multiple workspaces?

- **A.** Variable sets
- **B.** Projects
- **C.** Policy sets
- **D.** Run triggers

**Correct answer: A — Variable sets.**

Variable sets share reusable values across workspaces. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/variables).

**Source correction:** The source labels this multiple-choice answer False. Its explanation correctly names Variable sets.

[Community source — question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L630).

### Q096 · True/False

HCP Terraform workspaces are identical to Terraform CLI workspaces and serve the same purpose of managing multiple state files for a single configuration.

- **A.** True
- **B.** False

**Correct answer: False.**

HCP workspaces include their own configuration and settings; CLI workspaces select separate state for a directory. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces).

[Community source — question 4](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L649).

### Q097 · Multiple Choice

You want a policy that blocks any Terraform run from creating an S3 bucket with public read access. The policy should prevent the apply unless a security admin explicitly overrides it. What policy enforcement level should you use?

- **A.** `advisory`
- **B.** `hard-mandatory`
- **C.** `soft-mandatory`
- **D.** `warning`

**Correct answer: C — `soft-mandatory`.**

Soft-mandatory Sentinel policies allow an authorized override. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/policy-enforcement/view-results).

**Source correction:** The source labels this answer True; the option answer is C. The advisory/soft/hard terminology here is Sentinel-specific.

[Community source — question 5](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L653).

### Q098 · Multiple Choice

Which block is used to exclude certain files from being uploaded to HCP Terraform during remote execution?

- **A.** `.gitignore`
- **B.** `.terraformignore`
- **C.** `terraform.ignore`
- **D.** `exclude` block in `terraform {}`

**Correct answer: B — `.terraformignore`.**

The filename is .terraformignore; it is not a Terraform configuration block. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/cli).

**Source correction:** The source labels this multiple-choice answer False. The correct option is B.

[Community source — question 6](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L662).

### Q099 · True/False

A project in HCP Terraform can contain multiple workspaces, and a user's permissions on a project automatically apply to all workspaces within it.

- **A.** True
- **B.** False

**Correct answer: True.**

Project permissions extend to the project's workspaces, subject to the assigned role and available features. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/projects).

[Community source — question 7](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L671).

### Q100 · Multiple Choice

What is the primary advantage of using dynamic provider credentials over static credentials stored as workspace variables?

- **A.** They are easier to manually rotate.
- **B.** They eliminate the need to store long-lived secrets in HCP Terraform.
- **C.** They work with all Terraform providers without additional configuration.
- **D.** They are automatically encrypted in state files.

**Correct answer: B — They eliminate the need to store long-lived secrets in HCP Terraform..**

Dynamic credentials avoid storing long-lived provider credentials. They do not automatically encrypt arbitrary state values. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials).

[Community source — question 9](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L684).

### Q101 · True/False

When migrating an existing local state file to HCP Terraform, you must first manually upload the state file via the HCP Terraform UI before running `terraform init`.

- **A.** True
- **B.** False

**Correct answer: False.**

The CLI integration can migrate existing state during initialization; a manual UI upload is not required. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

[Community source — question 10](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L693).

### Q102 · Multiple Choice

A workspace `app-prod` has a run trigger configured to trigger from `networking-prod`. What causes a run to be queued in `app-prod`?

- **A.** A successful `terraform plan` in `networking-prod`.
- **B.** A successful `terraform apply` in `networking-prod`.
- **C.** Any run in `networking-prod`, regardless of outcome.
- **D.** A manual trigger from the `networking-prod` workspace UI.

**Correct answer: B — A successful `terraform apply` in `networking-prod`..**

Run triggers queue downstream runs after a successful upstream apply. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/run-triggers).

[Community source — question 11](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L697).

### Q103 · Multiple Answer

Which of the following are features of HCP Terraform's health assessments? (Select **TWO**)

- **A.** Drift detection
- **B.** Automatic resource rollback
- **C.** Continuous validation
- **D.** Cost estimation

**Correct answer: A — Drift detection; C — Continuous validation.**

Health assessments include drift detection and continuous validation. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/health).

[Community source — question 12](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L706).

### Q104 · True/False

The `cloud` block supports using `tags` to associate a configuration with multiple workspaces instead of a single workspace name.

- **A.** True
- **B.** False

**Correct answer: True.**

Workspace tags can associate the configuration with a set of workspaces. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/terraform).

[Community source — question 13](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L715).

### Q105 · True/False

A workspace configured for "Local" execution mode still uses HCP Terraform for remote state storage and locking.

- **A.** True
- **B.** False

**Correct answer: True.**

Local mode keeps state in HCP while plan and apply execute locally. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings).

[Community source — question 15](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L728).

### Q106 · Multiple Choice

You have a team of 5 developers who should be able to view workspace data but not modify it. You also have a team of 2 admins who need full control. How should you configure permissions?

- **A.** Grant both teams "Admin" on each workspace.
- **B.** Grant the developer team "Read" and the admin team "Admin" on each workspace.
- **C.** Grant both teams "Write" on each workspace.
- **D.** Only grant permissions at the organization level; workspace-level permissions are not supported.

**Correct answer: B — Grant the developer team "Read" and the admin team "Admin" on each workspace..**

Read gives developers visibility; Admin gives administrators control. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/access).

[Community source — question 16](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L732).

### Q107 · Multiple Answer

Which of the following can be configured in a `.terraformignore` file? (Select **TWO**)

- **A.** Patterns for files to exclude from upload.
- **B.** Backend configuration.
- **C.** Rules based on `.gitignore` syntax.
- **D.** Variable definitions.

**Correct answer: A — Patterns for files to exclude from upload.; C — Rules based on `.gitignore` syntax..**

Terraformignore uses patterns based on gitignore syntax. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/cli).

[Community source — question 17](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L741).

### Q108 · Multiple Choice

What is the function of the `TF_WORKSPACE` environment variable when using the `cloud` block with tags?

- **A.** It overrides the `hostname` setting.
- **B.** It selects which tagged workspace to use for the current operation.
- **C.** It defines a new tag to apply to the workspace.
- **D.** It sets the execution mode of the workspace.

**Correct answer: B — It selects which tagged workspace to use for the current operation..**

TF_WORKSPACE selects the workspace within the tag-filtered set. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/terraform).

[Community source — question 19](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L754).

### Q109 · True/False

A priority variable set in HCP Terraform takes precedence over a workspace-specific variable of the same name.

- **A.** True
- **B.** False

**Correct answer: True.**

Priority variable sets override values at more specific scopes. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/variables).

[Community source — question 20](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L763).

## Additional questions from the same passer: lock files and ephemeral values

### Q110 · Multiple Choice

Which file stores the pinned provider versions and checksums?

- **A.** terraform.tfstate
- **B.** .terraform.lock.hcl
- **C.** backend.hcl

**Correct answer: B — .terraform.lock.hcl.**

The dependency lock file records provider selections and checksums; it does not lock module versions. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

[Community source — question 3b.6 mini-quiz, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L289).

### Q111 · True/False

Marking a variable as `sensitive` prevents its value from being written to the state file.

- **A.** True
- **B.** False

**Correct answer: False.**

Sensitivity controls disclosure in normal output. It does not omit the value from state. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — question 4h.8 mini-quiz, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L853).

### Q112 · Multiple Choice

Which Terraform feature ensures a value is never stored in state?

- **A.** sensitive = true
- **B.** ephemeral = true
- **C.** sensitive on outputs
- **D.** .gitignore

**Correct answer: B — ephemeral = true.**

Ephemeral values are omitted from state and plans and can only be used in supported ephemeral contexts. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — question 4h.8 mini-quiz, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L855).

## Additional community questions reviewed 21 October 2026

The following 27 published mini-quiz questions were added after the second scan. Original stems and option order are retained; answers, corrections and clarifications were checked against official documentation.

### Q113 · Multiple Choice

What does `terraform init -upgrade` do?

- **A.** Recreates all infrastructure from scratch
- **B.** Checks for newer acceptable provider/module versions and updates the lock file when needed
- **C.** Validates configuration without downloading anything

**Correct answer: B — Checks for newer acceptable provider/module versions and updates the lock file when needed**

Upgrade selects newer provider and module versions permitted by the constraints. The dependency lock file records provider selections, not module versions. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

[Community source — 3b.6: Mini-Quiz: `terraform init`, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L295).

### Q114 · Multiple Choice

If a child module requires a different provider region than the root module, the recommended approach is:

- **A.** Define a provider block inside the child module with region set.
- **B.** Pass an aliased provider from the root module to the child using the `providers` map in the module block.
- **C.** Edit the state file to change the provider region for the child resources.

**Correct answer: B — Pass an aliased provider from the root module to the child using the `providers` map in the module block.**

Configure the alias in the parent and map it to the child provider name. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/providers).

[Community source — 2b.6: Mini-Quiz - Terraform Providers, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L435).

### Q115 · Multiple Choice

Which is the best practice for provider credentials?

- **A.** Hardcode `access_key` and `secret_key` in the provider block.
- **B.** Use environment variables or shared credentials files (e.g., `~/.aws/credentials`).
- **C.** Commit credentials to the repo and reference them with locals.

**Correct answer: B — Use environment variables or shared credentials files (e.g., `~/.aws/credentials`).**

Of these options, environment variables or shared credentials files avoid embedding credentials in versioned configuration. Protect credential files; prefer short-lived credentials where supported. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend/s3).

[Community source — 2b.6: Mini-Quiz - Terraform Providers, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L442).

### Q116 · Multiple Choice

To avoid name collisions when two providers expose the same resource types, you should:

- **A.** Use unique local names in `required_providers` (e.g., `hashicorp-aws`).
- **B.** Rename resources to avoid collisions.
- **C.** Only use one provider per configuration.

**Correct answer: A — Use unique local names in `required_providers` (e.g., `hashicorp-aws`).**

Provider local names must be unique in a module. When names differ from resource type prefixes, explicitly select the provider configuration in affected resources. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/providers/requirements).

[Community source — 2d.5: Mini-Quiz - Multi-Provider Behavior and Cross-Provider References, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L753).

### Q117 · Multiple Choice

To change a configuration from a local backend to an S3 backend and migrate the state, which command is appropriate?

- **A.** terraform apply
- **B.** terraform init -reconfigure
- **C.** terraform init -migrate-state

**Correct answer: C — terraform init -migrate-state**

Init with -migrate-state copies existing state to the new backend after any necessary confirmation. Reconfigure alone does not migrate it. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/init).

**Source clarification:** The source explanation suggests reconfigure followed by unspecified migration steps. The concrete correct option here is init -migrate-state; distinguish migration from reconfiguration.

[Community source — 2d.5: Mini-Quiz - State Locking and Backend Migration, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/02-Terraform-fundamentals.md#L874).

### Q118 · Multiple Choice

Which order best describes the core Terraform workflow?

- **A.** Plan → Write → Apply
- **B.** Write → Plan → Apply
- **C.** Write → Apply → Plan

**Correct answer: B — Write → Plan → Apply**

The core loop is write, plan and apply. Initialize a new working directory before planning. [HashiCorp reference](https://developer.hashicorp.com/terraform/intro/core-workflow).

[Community source — 3a.5: Mini-Quiz for 3a, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L151).

### Q119 · True/False

`terraform validate` checks provider APIs to confirm that an AMI ID or resource name actually exists.

- **A.** True
- **B.** False

**Correct answer: False**

Validate checks configuration syntax and internal consistency; it does not validate remote services or provider APIs. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/validate).

[Community source — 3c.6: Mini-Quiz: `terraform validate`, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L396).

### Q120 · Multiple Answer

Which issues can `terraform validate` catch? (Select TWO)

- **A.** HCL syntax errors
- **B.** Missing required arguments
- **C.** Real-world API permission problems
- **D.** Global uniqueness of resource names

**Correct answer: A — HCL syntax errors; B — Missing required arguments**

Syntax and required-argument errors can be caught without testing real API permissions or global name uniqueness. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/validate).

[Community source — 3c.6: Mini-Quiz: `terraform validate`, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L410).

### Q121 · Multiple Answer

Which symbols can appear in a plan output? (Select TWO)

- **A.** `+` create
- **B.** `~` update in-place
- **C.** `!` force update
- **D.** `?` refresh only

**Correct answer: A — `+` create; B — `~` update in-place**

These symbols represent creation and in-place modification in human-readable plan output. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/plan).

[Community source — Mini-Quiz: `terraform plan`, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L567).

### Q122 · True/False

When you apply a saved plan file, Terraform asks for confirmation again.

- **A.** True
- **B.** False

**Correct answer: False**

Passing a saved plan file is treated as approval. Terraform does not ask for the normal plan confirmation again. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/apply).

[Community source — 3e.6: Mini-Quiz: `terraform apply`, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L674).

### Q123 · Multiple Choice

In which order does Terraform destroy resources?

- **A.** Random order
- **B.** Reverse dependency order
- **C.** Alphabetical order by resource type

**Correct answer: B — Reverse dependency order**

Terraform uses dependency information to order deletions so dependent objects are removed before the objects they require. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/state/purpose).

[Community source — 3f.5: Mini-Quiz: `terraform destroy`, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/03-Core-Terraform-workflow.md#L754).

### Q124 · True/False

The local name of a resource (`resource "aws_instance" "web"`) determines the Name tag of the EC2 instance in AWS.

- **A.** True
- **B.** False

**Correct answer: False**

The resource label is an identifier in the module. It does not automatically set the remote object's Name tag. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/resources/syntax).

[Community source — 4a.5: Mini-Quiz for 4a, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L207).

### Q125 · True/False

If a variable has no default and no value is provided, Terraform will use null and proceed with the plan.

- **A.** True
- **B.** False

**Correct answer: False**

A variable without a default is required: the root CLI prompts or errors if no value is supplied. Allowing null does not itself supply a missing value. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/values/variables).

**Source clarification:** The source explanation implies nullable input can make omission acceptable. Null must be supplied explicitly or provided by a default; nullable alone does not satisfy a required variable.

[Community source — 4c.6: Mini-Quiz - Variables and Outputs, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L623).

### Q126 · True/False

A tuple type requires all elements to be of the same type.

- **A.** True
- **B.** False

**Correct answer: False**

A tuple specifies a type per position, so its elements can have different types. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/expressions/type-constraints).

[Community source — 4d.7: Mini-Quiz - Complex Types, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-1.md#L786).

### Q127 · True/False

The `templatefile` function can only be used with files ending in `.tpl`.

- **A.** True
- **B.** False

**Correct answer: False**

There is no required extension. The template must exist at the beginning of the run and contain valid UTF-8 text. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/functions/templatefile).

**Source clarification:** The source says templatefile can read any file. The answer False is correct, but arbitrary binary files are not valid templates.

[Community source — 4e.10: Mini-Quiz - Functions, Expressions, and Validation, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L316).

### Q128 · Multiple Choice

Which lifecycle rule prevents accidental deletion of a resource?

- **A.** `create_before_destroy`
- **B.** `prevent_destroy`
- **C.** `ignore_changes`
- **D.** `replace_triggered_by`

**Correct answer: B — `prevent_destroy`**

Prevent_destroy rejects planned destruction while that lifecycle setting remains in the resource configuration. Removing the entire resource block also removes this protection. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/meta-arguments/lifecycle).

[Community source — 4f.5: Mini-Quiz - Resource Dependencies and Lifecycle, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L488).

### Q129 · Multiple Answer

Where can you define a precondition? (Select TWO)

- **A.** In a `variable` block
- **B.** In a `resource` lifecycle block
- **C.** In a `data` lifecycle block
- **D.** In a `provider` block

**Correct answer: B — In a `resource` lifecycle block; C — In a `data` lifecycle block**

Resource and data lifecycle blocks support preconditions. Output blocks can also contain preconditions, but output is not an offered option. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/validate).

[Community source — 4g.7: Mini-Quiz - Custom Conditions, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L683).

### Q130 · Multiple Answer

What are best practices for managing sensitive data in Terraform? **(Select TWO)**

- **A.** Store state files in encrypted remote backends.
- **B.** Commit .tfvars files to version control.
- **C.** Use dynamic credentials from Vault instead of static keys.
- **D.** Hardcode secrets in locals blocks.

**Correct answer: A — Store state files in encrypted remote backends.; C — Use dynamic credentials from Vault instead of static keys.**

Protect state and prefer short-lived credentials. Fetching secrets from Vault alone does not prevent their storage in state. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/manage-sensitive-data).

[Community source — 4h.8: Mini-Quiz - Managing Sensitive Data, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/04-Terraform-configuration-part-2.md#L863).

### Q131 · Multiple Answer

Which files are part of the standard module structure? **(Select FOUR)**

- **A.** main.tf
- **B.** variables.tf
- **C.** terraform.tfstate
- **D.** outputs.tf
- **E.** README.md

**Correct answer: A — main.tf; B — variables.tf; D — outputs.tf; E — README.md**

These are recommended files in a reusable module layout. The naming convention is not a requirement for executing a module. State does not belong in a reusable module package. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/modules/develop/structure).

[Community source — 5a.8: Mini-Quiz - Module Sources, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L336).

### Q132 · Multiple Answer

Which meta-arguments are available on a module block? (Select THREE)

- **A.** depends_on
- **B.** lifecycle
- **C.** count
- **D.** for_each
- **E.** provider

**Correct answer: A — depends_on; C — count; D — for_each**

Module blocks support depends_on, count and for_each. Use the plural providers argument for provider mappings. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/block/module).

[Community source — 5c.7: Mini-Quiz - Using Modules in Configuration, question 3](https://github.com/susu10-10/TF004-PocketGuide/blob/main/05-Terraform-modules.md#L932).

### Q133 · True/False

The local backend supports automatic state locking to prevent concurrent modifications.

- **A.** True
- **B.** False

**Correct answer: True**

The local backend locks its state using operating-system APIs. Separate local state copies do not coordinate team activity. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/backend/local).

**Source correction:** Answer-key correction: the source says False. HashiCorp explicitly documents local-backend state locking; the correct answer is True.

[Community source — 6a.6: Mini-Quiz for 6a, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/06-Terraform-state-management.md#L200).

### Q134 · True/False

After running `terraform import aws_instance.web i-12345`, the matching `resource` block is automatically generated in your configuration.

- **A.** True
- **B.** False

**Correct answer: False**

The CLI import command creates a state binding; it does not generate configuration. Import blocks plus plan -generate-config-out support a separate configuration-generation workflow. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/import).

**Source clarification:** The source explanation tells users to write the resource block after CLI import. The matching resource configuration is required for the CLI import workflow; generated configuration is a separate import-block workflow.

[Community source — 7a.7: Mini-Quiz for 7a, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L249).

### Q135 · Multiple Choice

In an `import` block, what does the `id` argument represent?

- **A.** The Terraform resource address.
- **B.** The local name of the resource in the configuration.
- **C.** The cloud provider's unique identifier for the existing resource.
- **D.** The state file serial number.

**Correct answer: C — The cloud provider's unique identifier for the existing resource.**

ID identifies the existing provider object, while the to address identifies its Terraform destination. The precise ID format is resource-specific. [HashiCorp reference](https://developer.hashicorp.com/terraform/language/v1.12.x/import).

[Community source — 7a.7: Mini-Quiz for 7a, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L252).

### Q136 · True/False

`terraform state list` shows only managed resources; data sources are excluded.

- **A.** True
- **B.** False

**Correct answer: False**

Cached data sources present in state can be listed too. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/list).

[Community source — 7b.8: Mini-Quiz for 7b, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L497).

### Q137 · Multiple Choice

Which command would you use to see the detailed attributes of a specific resource from the state file?

- **A.** `terraform plan`
- **B.** `terraform state list`
- **C.** `terraform state show`
- **D.** `terraform output`

**Correct answer: C — `terraform state show`**

State show displays attributes for one addressed instance. State list displays addresses. [HashiCorp reference](https://developer.hashicorp.com/terraform/cli/v1.12.x/commands/state/show).

[Community source — 7b.8: Mini-Quiz for 7b, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/07-Maintain-infrastructure-with-terraform.md#L500).

### Q138 · True/False

In HCP Terraform, a user can be a member of multiple teams, and their effective permissions are the union of all team permissions.

- **A.** True
- **B.** False

**Correct answer: True**

Permissions are additive. Membership in a less privileged team does not remove access granted by a more privileged one. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/permissions).

[Community source — 8b.7: Mini-Quiz - HCP Terraform Collaboration and Governance, question 1](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L300).

### Q139 · Multiple Choice

What is the maximum scope of a variable set?

- **A.** A single workspace.
- **B.** A single project.
- **C.** The entire organization (global).
- **D.** A single Terraform run.

**Correct answer: C — The entire organization (global).**

An organization-owned global variable set can apply across the organization. Local execution mode does not evaluate HCP workspace variables or variable sets. [HashiCorp reference](https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables).

[Community source — 8c.7: Mini-Quiz for 8c, question 2](https://github.com/susu10-10/TF004-PocketGuide/blob/main/08-Hcp-Terraform-1.md#L413).

## How closely this reflects TA-004

The collection contains true/false, single-answer and multiple-answer items, including command scenarios, HCL snippets, expression results and distinctions between similar concepts. Those question types match [HashiCorp's published 004 examples](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004). The repeated subject areas also match the passing-candidate reports above.

Technical answers were checked against official Terraform documentation, using the **1.12 documentation for CLI and language behavior** where available. HashiCorp lists Terraform 1.12, a one-hour exam and eight objective groups for [TA-004](https://developer.hashicorp.com/certifications/terraform-associate). Technical correctness and topic overlap do not establish identical real-exam wording, frequency or difficulty. I cannot assign a defensible percentage of “real exam accuracy” to a community collection.

This is not complete evidence for every 004 topic. In particular, the selected source questions provide less coverage of write-only arguments, Vault integration, version-constraint calculations and count/for_each instance addressing than the official objectives warrant. No additional questions were generated to fill those gaps.

## Source questions excluded from the collection

These were excluded because their original options or wording prevent a clean answer without rewriting the source question:

| Source file / question | Issue |
|---|---|
| IaC Q12 | Creating before destroying is useful, but not a defining requirement of immutable infrastructure. |
| IaC Q14 | Requests three answers, but compute, repositories, monitoring and DNS are all valid examples. |
| IaC Q15 | Requests three actions, but creation, deletion, update and replacement are all possible. |
| Fundamentals Q3 | The stem says a version is installed, while the explanation assumes that version is locked. Those conditions differ. |
| Fundamentals Q6; State Q9 | Too many valid locking backends for “Select THREE”; local supports locking and HTTP supports configured lock endpoints. |
| Fundamentals Q12 | Confuses methods that are technically valid with methods recommended for credential security. |
| Workflow Q4 | Both applying the saved plan normally and applying it with auto-approve are valid; the flag is ignored for a saved plan. |
| Workflow Q11 | Four listed plan flags are valid, but the prompt asks for three. |
| Workflow Q17 | The modern replace option is preferred, while deprecated taint can also schedule replacement. |
| Configuration part 1 Q8 | Both modern and legacy splat expressions can return the IDs; the resource declaration is also malformed. |
| Configuration part 1 Q14 | All listed values can satisfy list(number), including the numeric string through type conversion. |
| Modules Q3 | Requests two answers, but only ref is correct; ref can select a branch, tag or commit. |
| Modules Q7 | Conflates reading changed local files with upgrading downloaded modules. |
| Modules Q10 | Several options can create three VPCs; one is a useful recommendation, not the only feasible approach. |
| State Q3 | Ambiguous distinction between stored dependency metadata and the complete computed graph. |
| State Q6 | The offered migration behavior incorrectly asserts deletion of the original state. |
| State Q19 | The intended moved-block answer is written with invalid semicolon-separated HCL. |
| Maintenance Q10 | Import-block for_each requires 1.7+, while the question says 1.5+. |
| Maintenance Q15 | Conflates the versioned, public show-JSON interface with internal state representation and makes an absolute tooling-safety claim. |
| HCP Q3 | Requests three run initiation methods, but more listed methods initiate runs. |
| HCP Q14 | Both authentication enablement and a role ARN are required; the question does not isolate either. |
| HCP Q18 | Combines a true lack of normal workspace apply-locking with an incorrect claim that no run is queued. |

Other omitted items repeat covered concepts or introduce provider-specific or peripheral details. These exclusions are not a measured error rate for the full repository.

## Attribution and reuse

Question stems and answer options are attributed to **susu10-10 / Suu10, TF004-PocketGuide**. The repository's [README license statement](https://github.com/susu10-10/TF004-PocketGuide#-license) declares “MIT License free to use, share, and modify.” Source wording and option order were retained apart from formatting; technical explanations and marked corrections were added for this document. Reddit quotations are attributed and linked beside the quotation. Sources retrieved 9 and 21 October 2026; the source links point to a live branch and may later change.

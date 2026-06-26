# PIPES Web

Technology stack:

- node
- npm
- react

## 1. Local Development

Clone this repository and enter into `pipes-web` directory.

Install node modules

```bash
$ npm install
```

Start development server

```bash
$ npm run start
```

Then visit [http://localhost:3000/](http://localhost:3000/)

Builds the app for production to the `build` folder.

```bash
$ npm run build
```


## 2. AI Coding Setup

This section provides guidance to setup AI coding agent and framework to assist the development of PIPES project.

### 2.1 Coding Assitant

There are many popular AI coding assistants, such as `Claude Code`, `GitHub Copilot`, `OpenAI Codex`,
`Gemini Coding Assistant` and so on. At NLR, we use Claude Code as coding assistant through Amazon Bedrock, please follow the steps below to setup.

**Install Claude Code**

https://code.claude.com/docs/en/quickstart

**Config the Models**
The initial models we setup are ANTHROPIC_MODEL=Sonnet4.6, ANTHROPIC_SMALL_FAST_MODEL=Haiku4.5.

Export the env variables below in your terminal session:


```text
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION='<aws-region>'
export ANTHROPIC_MODEL='<the-main-sonnet-model>'
export ANTHROPIC_SMALL_FAST_MODEL='<the-fast-haiku-model>'
```

These exports could be put into .bash_profile/.bashrc or .zshrc in user home dir, depending on the shell used on your machine.

**Set SSO credentials (Need to do everyday)**

Use NLR SSO login and find `pipes-llm-developer`under AWS account.

Click Access Keys and get SSO credentials, then paste into terminal session as well for exporting the AWS credentials.

Note: The SSO session would last for 8 hours, after that need to copy and paste new Access keys as credentials.

**Test Claude Code**

Start claude code by running claude command,

```bash
$ claude
```

### 2.2 Agentic Skills/Frameworks

Install agentic skills and frameworks to enhance Claude Code coding capability.

Enter claude code, and install plugins

```bash
/plugin
```

The following skills and frameworks are recommended:

* `superpowers`
* `frontend-design`
* `context7`

## 3. Coding Workflow

PIPES adopts a test-driven development workflow using [Superpowers](https://github.com/obra/superpowers) — a composable skill library for Claude Code that enforces TDD (RED-GREEN-REFACTOR), systematic debugging, and structured code review.

### Workflow Overview

```
Feature Request
      │
      ▼
 0. /grill-me               ← Superpowers: interview LLM to clarify requirements and write ADR
      │
      ▼
 1. /brainstorming          ← Superpowers: explore design options before committing to an approach
      │
      ▼
 2. /writing-plans          ← Superpowers: break tasks into TDD-ready steps
      │
      ▼
 3. /test-driven-development  ← Superpowers: implement each task RED→GREEN→REFACTOR
      │
      ▼
 4. /verification-before-completion  ← Superpowers: evidence-based sign-off
```

### Step-by-Step Guide

**Step 0 — Clarify requirements and write ADR (Superpowers)**

For any non-trivial feature, start by interviewing the LLM to surface unknowns and document decisions:

This runs a relentless Q&A session, resolving each branch of the decision tree one question at
a time. The output is used to write an ADR in `docs/ADRs/` before any code is written.

**Step 1 — Brainstorm the approach (Superpowers)**

Before writing a plan, explore the design space:

```
/brainstorming
```

This explores user intent, requirements, and constraints — helping you consider alternatives
and trade-offs before committing to a direction. Use the output to inform the plan in Step 2.

**Step 2 — Plan tasks (Superpowers)**

Activate TDD-style planning:

```
/writing-plans
```

This breaks each task into bite-sized steps following the pattern: write failing test → verify failure → implement minimally → verify passing → commit.

**Step 3 — Implement with TDD (Superpowers)**

For each task, enforce RED-GREEN-REFACTOR:

```
/test-driven-development
```

Key rules the skill enforces:
- **RED**: Write one failing test first. Run it. Confirm it fails for the right reason.
- **GREEN**: Write the minimum code to make it pass. No extras.
- **REFACTOR**: Improve clarity while keeping all tests green.
- Any production code written before a failing test exists must be deleted entirely.

Run `python manage.py test` after each task to confirm nothing is broken.

**Step 4 — Verify (Superpowers)**

Before marking work done, run:

```
/verification-before-completion
```

This blocks "I think it works" claims and requires evidence (test output, manual checks) before closing a task.

### Quick Reference

| Situation | Tool | Command |
|---|---|---|
| Clarify requirements and write ADR | Superpowers | `/grill-me` |
| Explore design options | Superpowers | `/brainstorming` |
| Break proposal into TDD steps | Superpowers | `/writing-plans` |
| Implement a task with TDD | Superpowers | `/test-driven-development` |
| Debug a failing test systematically | Superpowers | `/systematic-debugging` |
| Sign off on a completed task | Superpowers | `/verification-before-completion` |

---

## 4. Release

The release workflow is this:

- Release via `release` branch.
- Merge `release` into `develop` and `master` branches.
- Create semantic tags for release
- Generate release logs on Github.


## 4. Deployment

### 4.1 Build docker image

AWS Codebuild and webhook has been setup on this repo, triggering by

- pull request create
- pull request update
- pull request reopen

on base branch `develop`, `stage` and `master`.

### 4.2 Deploy the site

Deploy via Jenkins job named `pipes-web` at NLR.

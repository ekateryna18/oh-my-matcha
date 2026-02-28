# 🤖 Oh My Matcha — AI Agents

This folder contains a **Project Orchestrator** (your AI project manager) and 5 specialized AI agents designed to assist with the Oh My Matcha project development.

---

## 🎯 The Orchestrator (Start Here!)

### **Project Orchestrator** (`AGENT_ORCHESTRATOR.md`)
**Your AI Project Manager** — Coordinates all agents, manages SPECS.md, and ensures project consistency

**Use when**:
- You want to just describe what you need (not which agent to use)
- Making specification changes that affect multiple files
- Need impact analysis before implementing changes
- Want automatic propagation of updates across the codebase
- Doing complex multi-step tasks

**Example**: *"Add a product review system"* → Orchestrator handles backend, frontend, SPECS updates, testing, and GDPR checks automatically

📚 **Read**: `USE_ORCHESTRATOR.md` for complete usage guide

---

## 📋 Specialized Agents

The Orchestrator coordinates these 5 specialized agents:

### 1. **NestJS Resource Generator** (`AGENT_NESTJS_GENERATOR.md`)
**Purpose**: Generates complete NestJS modules (schema, DTOs, service, controller, module)

**Use when**:
- Creating new backend resources (Users, Products, Orders, etc.)
- Need a complete CRUD setup with TypeScript + Mongoose
- Want to follow project conventions automatically

**Example**: *"Generate the Product resource with fields: name, category, price, options, allergens"*

---

### 2. **API Tester** (`AGENT_API_TESTER.md`)
**Purpose**: Generates ready-to-use HTTP requests for testing the NestJS API

**Use when**:
- Need to test API endpoints with Postman/Insomnia
- Want example requests with correct headers and auth
- Testing complex flows (login → add to cart → checkout)

**Example**: *"Test the loyalty points flow: user orders 17.50€ and should receive 17 points"*

---

### 3. **GDPR Cookie Checker** (`AGENT_GDPR_CHECKER.md`)
**Purpose**: Reviews code for GDPR/CNIL compliance violations

**Use when**:
- Checking if cookie logic is compliant
- Verifying consent management implementation
- Before final project delivery

**Example**: *"Check if the CookieBanner.tsx component is CNIL compliant"*

---

### 4. **React Component Builder** (`AGENT_COMPONENT_BUILDER.md`)
**Purpose**: Generates complete React components with TypeScript

**Use when**:
- Building new UI components
- Converting Figma designs to code
- Need mobile-first, typed components

**Example**: *"Build a ProductCard component showing image, name, price, and add-to-cart button"*

---

### 5. **Code Reviewer** (`AGENT_CODE_REVIEWER.md`)
**Purpose**: Final quality check before project delivery

**Use when**:
- Ready to submit the project
- Want to catch issues before teacher review
- Need a comprehensive quality audit

**Example**: *"Review the entire project for delivery readiness"*

---

## 🎯 How to Use These Agents

### Option 1: Copy-paste the agent prompt
1. Open the agent's `.md` file
2. Copy the entire content
3. Paste it as a system prompt in your AI tool
4. Give it your specific task

### Option 2: Reference in conversation
Simply tell your AI assistant:
```
Use the AGENT_NESTJS_GENERATOR.md instructions to generate a User resource.
```

### Option 3: Use with Claude Code
These agents are optimized for use with Claude Code CLI and can be invoked directly in your development workflow.

---

## 📚 Project Context Files

All agents reference these core documentation files:
- **`/info/SPECS.md`** — Complete technical specifications
- **`/info/PLANNING.md`** — 5-weekend development timeline
- **`/info/FONCTIONALITES_PROJECT.MD`** — Feature descriptions

**Important**: Always include "Refer to SPECS.md for full project context" when using these agents.

---

## 🔄 Typical Development Workflow

1. **Week 1-2**: Use **NestJS Generator** + **API Tester** for backend
2. **Week 3**: Use **GDPR Checker** for cookie consent system
3. **Week 4**: Use **Component Builder** for React frontend
4. **Week 5**: Use **API Tester** for order flow + **Code Reviewer** before delivery

---

## 📌 Quick Reference

| Agent | Primary Tool | Output |
|-------|-------------|---------|
| NestJS Generator | Backend scaffolding | 5 TypeScript files (schema, DTOs, service, controller, module) |
| API Tester | API testing | HTTP requests with headers, bodies, expected responses |
| GDPR Checker | Compliance review | List of violations with fixes |
| Component Builder | Frontend development | Complete `.tsx` components with types and styles |
| Code Reviewer | Quality assurance | Comprehensive checklist with pass/fail report |

---

## ⚡ Pro Tips

- **Always read SPECS.md first** before using any agent
- **Use multiple agents in sequence** (e.g., Generator → API Tester → Code Reviewer)
- **Keep agents updated** if project requirements change
- **Reference specific sections** when asking agents for help (e.g., "Using the Product schema from SPECS.md...")

---

> Last updated: February 2026
> Project: Oh My Matcha — Tea shop with click & collect ordering
> Stack: React 19 · NestJS 11 · MongoDB · Docker

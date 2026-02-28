# 🚀 Quick Start Guide — Using the 5 AI Agents

> Fast reference for developers working on Oh My Matcha

---

## ⚡ Quick Commands

### 1. Generate a new NestJS resource
```
Agent: AGENT_NESTJS_GENERATOR
Task: Generate the [ResourceName] resource.
Fields: [list fields with types]
Auth: [specify which routes need JWT/CSRF]
```

**Example**:
```
Generate the Loyalty resource.
Fields: userId (ObjectId, ref User), points (number), history (array of transactions)
Auth: All routes require JWT authentication.
```

---

### 2. Test an API endpoint
```
Agent: AGENT_API_TESTER
Task: Test [feature description]
```

**Example**:
```
Test user registration, login, and fetching profile in sequence.
```

---

### 3. Check GDPR compliance
```
Agent: AGENT_GDPR_CHECKER
Task: Review [file or feature] for GDPR/CNIL compliance
```

**Example**:
```
Review the ConsentManager.ts file for CNIL compliance.
```

---

### 4. Build a React component
```
Agent: AGENT_COMPONENT_BUILDER
Task: Build [component name] that [description]
```

**Example**:
```
Build a LoyaltyBar component that shows a progress bar from 0 to 50 points,
displays current points, and shows "5€ de crédit disponible !" when threshold is reached.
Mobile first.
```

---

### 5. Review project for delivery
```
Agent: AGENT_CODE_REVIEWER
Task: Review the entire project for delivery readiness
```

---

## 📋 Checklist: Using Agents by Development Phase

### Weekend 1 — Docker + Backend Core
- [ ] Use **NestJS Generator** for User resource
- [ ] Use **NestJS Generator** for Product resource
- [ ] Use **API Tester** to verify auth flow (register → login → /users/me)
- [ ] Use **API Tester** to verify product catalogue

### Weekend 2 — Backend Orders + Loyalty
- [ ] Use **NestJS Generator** for Order resource
- [ ] Use **NestJS Generator** for Slot resource (if needed)
- [ ] Use **API Tester** for order creation flow
- [ ] Use **API Tester** for loyalty points calculation

### Weekend 3 — GDPR Cookie System
- [ ] Use **Component Builder** for ConsentManager.ts logic
- [ ] Use **Component Builder** for CookieBanner.tsx
- [ ] Use **Component Builder** for CookieSettings.tsx
- [ ] Use **GDPR Checker** on all cookie-related files ⚠️ CRITICAL

### Weekend 4 — Frontend Pages
- [ ] Use **Component Builder** for Home page
- [ ] Use **Component Builder** for Menu page
- [ ] Use **Component Builder** for ProductCard component
- [ ] Use **Component Builder** for Account page
- [ ] Use **Component Builder** for LoyaltyDashboard
- [ ] Use **GDPR Checker** on Register.tsx (newsletter checkbox must be unchecked!)

### Weekend 5 — Order Flow + Final Review
- [ ] Use **Component Builder** for Cart page
- [ ] Use **Component Builder** for Payment page (simulated Stripe form)
- [ ] Use **API Tester** for complete order flow (cart → order → payment → confirm)
- [ ] Use **GDPR Checker** final sweep
- [ ] Use **Code Reviewer** for comprehensive audit ⚠️ MANDATORY BEFORE DELIVERY

---

## 🎯 Agent Selection Decision Tree

```
Need to create backend code?
  ├─ New resource (User, Product, Order)? → NestJS Generator
  └─ Test an endpoint? → API Tester

Need to create frontend code?
  └─ React component? → Component Builder

Need to verify compliance or quality?
  ├─ Cookies or GDPR? → GDPR Checker
  └─ Final quality check? → Code Reviewer
```

---

## ⚠️ Critical Agent Usage Rules

### Always use GDPR Checker for:
- ❗ Any file that sets cookies (`setCookie()`, `document.cookie`)
- ❗ Any file that handles user consent
- ❗ Newsletter subscription forms
- ❗ Before final delivery

### Always use Code Reviewer:
- ❗ Before creating a Git tag for delivery
- ❗ Before showing work to the teacher
- ❗ After completing Weekend 5

### Always reference SPECS.md:
- ❗ Every agent call should start with: "Refer to SPECS.md for project context"
- ❗ Check SPECS.md before asking agents to generate code

---

## 🔥 Real Usage Examples

### Example 1: Creating the Cart system
```
Step 1: Generate backend
Agent: AGENT_NESTJS_GENERATOR
Prompt: "Refer to SPECS.md. Generate the Cart resource.
Fields: userId (ObjectId), items (array of cart items with productId, quantity, customization),
updatedAt (Date). Auth: All routes require JWT + CSRF."

Step 2: Test it
Agent: AGENT_API_TESTER
Prompt: "Test adding a product to cart, updating quantity, and removing an item."
```

### Example 2: Building the cookie banner
```
Step 1: Create the component
Agent: AGENT_COMPONENT_BUILDER
Prompt: "Refer to SPECS.md. Build the CookieBanner component.
Show 3 categories (technical exempt, marketing, functional).
Include Accept All, Reject All, and Save Preferences buttons.
Toggles unchecked by default. Mobile first."

Step 2: Verify compliance
Agent: AGENT_GDPR_CHECKER
Prompt: "Review the CookieBanner.tsx file for CNIL compliance."
```

### Example 3: Final delivery check
```
Agent: AGENT_CODE_REVIEWER
Prompt: "Refer to SPECS.md and PLANNING.md. Review the entire project.
Check all 5 categories: GDPR compliance, TypeScript quality, NestJS architecture,
React structure, and delivery readiness. Provide a go/no-go recommendation."
```

---

## 💡 Pro Tips

1. **Chain agents**: Generator → API Tester → Code Reviewer (sequential quality)
2. **Be specific**: Include field types, validation rules, and auth requirements
3. **Reference docs**: Always start with "Refer to SPECS.md for context"
4. **Use realistic data**: Give agents example product names, prices, French text
5. **Check twice**: Run GDPR Checker at least twice (Week 3 + Week 5)

---

## 📞 Emergency Fixes (Last minute)

### "Cookie banner not compliant!"
```bash
Agent: AGENT_GDPR_CHECKER
Files to check: CookieBanner.tsx, ConsentManager.ts, Register.tsx, Footer.tsx
```

### "API not working!"
```bash
Agent: AGENT_API_TESTER
Test sequence: Register → Login → Add to cart → Create order → Confirm order
```

### "TypeScript errors everywhere!"
```bash
Agent: AGENT_CODE_REVIEWER
Focus: TypeScript quality section only
```

---

> **Remember**: These agents are your team. Use them liberally and sequentially for best results!

# 🎯 How to Use the Orchestrator Agent

> The Orchestrator is your AI project manager for Oh My Matcha

---

## 🚀 Quick Start

### Option 1: Direct Invocation
Simply prefix your request with the orchestrator context:

```
You are the Project Orchestrator for Oh My Matcha.
Refer to /info/SPECS.md and _byan/agents/AGENT_ORCHESTRATOR.md.

Task: [your request here]
```

### Option 2: Shorter Version
If the AI already has context:

```
[Orchestrator Mode]
Task: [your request here]
```

---

## 📋 What the Orchestrator Does

### 1. **Task Delegation**
Instead of manually choosing which agent to use, just describe what you want:

❌ **Old way**:
```
"I need to use the NestJS Generator to create a User resource,
then use the API Tester to test it,
then update SPECS.md..."
```

✅ **New way with Orchestrator**:
```
"Add a user authentication system"
```

The Orchestrator automatically:
- Determines you need backend work → delegates to NestJS Generator
- Generates test cases → delegates to API Tester
- Updates SPECS.md with new endpoints
- Checks GDPR compliance → delegates to GDPR Checker

---

### 2. **Specification Management**
The Orchestrator keeps SPECS.md as your single source of truth:

**Example**: Change loyalty points threshold
```
[Orchestrator Mode]
Task: Change loyalty program from 50 points = 5€ to 100 points = 10€
```

**What happens**:
1. ✅ Reads current SPECS.md
2. ✅ Updates § 8. Loyalty Program in SPECS.md
3. ✅ Identifies all affected files (backend services, frontend components)
4. ✅ Generates code updates for each file
5. ✅ Generates new test cases
6. ✅ Provides a complete change report

---

### 3. **Change Propagation**
When you modify a feature, the Orchestrator ensures consistency:

**Example**: Add a new product customization option
```
[Orchestrator Mode]
Task: Add "topping" as a customization option (boba, jelly, none)
```

**What the Orchestrator does**:
1. Updates SPECS.md § 5 (Product schema)
2. Updates backend Product schema
3. Updates frontend customization types
4. Updates Customization.tsx component
5. Ensures the change works end-to-end

---

## 🎯 Common Use Cases

### Use Case 1: Full Feature Implementation
```
[Orchestrator Mode]
Task: Implement a wishlist feature where users can save favorite products
```

**Orchestrator will**:
- Create backend Wishlist resource
- Update SPECS.md with new collection + endpoints
- Create React wishlist components
- Generate API tests
- Check GDPR compliance for stored data

---

### Use Case 2: Bug Fix Across Multiple Files
```
[Orchestrator Mode]
Task: Fix the issue where loyalty points are calculated on totalAmount
instead of finalAmount (after credit deduction)
```

**Orchestrator will**:
- Verify SPECS.md § 8 (confirms finalAmount is correct)
- Identify the bug in loyalty.service.ts
- Fix the calculation
- Update any related frontend display logic
- Generate test cases to verify fix

---

### Use Case 3: Specification Change
```
[Orchestrator Mode]
Task: Change pickup slots from 15-minute intervals to 30-minute intervals
```

**Orchestrator will**:
- Update SPECS.md § 5 (slots collection)
- Update backend slot generation logic
- Update frontend slot selector UI
- Update PLANNING.md if timeline affected
- Verify no breaking changes

---

### Use Case 4: Pre-Delivery Audit
```
[Orchestrator Mode]
Task: Verify the project is ready for teacher delivery
```

**Orchestrator will**:
- Read current SPECS.md
- Delegate to Code Reviewer (comprehensive audit)
- Delegate to GDPR Checker (compliance verification)
- Check SPECS.md vs implementation alignment
- Provide go/no-go recommendation

---

### Use Case 5: Add New Page
```
[Orchestrator Mode]
Task: Add an FAQ page with common questions about matcha and orders
```

**Orchestrator will**:
- Update SPECS.md § 4 (add /faq route)
- Delegate to Component Builder for FAQ.tsx
- Add route to React Router configuration
- Update navigation/footer links
- Ensure mobile-first design

---

## 💡 Pro Tips

### 1. Be Natural
Don't over-specify. The Orchestrator is smart:

✅ Good:
```
"Add product reviews"
"Change the loyalty threshold to 100 points"
"Check if we're GDPR compliant"
```

❌ Over-specified:
```
"Use the NestJS Generator to create a Review schema with fields
reviewId, userId, productId, rating, comment, then use the Component
Builder to create a ReviewCard component..."
```

---

### 2. Ask for Impact Analysis
Before making big changes:

```
[Orchestrator Mode]
Task: Analyze the impact of adding real Stripe payment integration
instead of the simulated form
```

The Orchestrator will tell you:
- What parts of SPECS.md need updating
- How many files are affected
- What new dependencies are needed
- Timeline impact

---

### 3. Request Specification Clarification
```
[Orchestrator Mode]
Task: Clarify the exact behavior when a user has 120 points
and applies 10€ credit. Are 100 points deducted or all 120?
```

The Orchestrator will:
- Check SPECS.md § 8
- Identify if spec is ambiguous
- Ask you for clarification
- Update SPECS.md with the decision

---

### 4. Chain Complex Tasks
```
[Orchestrator Mode]
Task: Implement order status tracking. Users should see:
"Pending → Confirmed → In Preparation → Ready for Pickup"
with real-time updates.
```

The Orchestrator handles the full chain:
- Backend: Update Order schema + status endpoints
- Frontend: Create OrderStatus component
- Frontend: Add status badge to OrderHistory
- Testing: Generate status transition tests
- SPECS: Document new status flow

---

## 🔥 Real-World Examples

### Example 1: Week 1 Kickoff
```
[Orchestrator Mode]
Task: Set up the complete authentication system with registration,
login, logout, and profile management
```

**Orchestrator Output**:
```
✅ Task Analysis: Backend auth system + GDPR compliance
📋 Executing:
  1. NestJS Generator → Auth module, User resource
  2. Updating SPECS.md → Confirmed JWT cookie implementation
  3. API Tester → Generated auth flow tests
  4. GDPR Checker → Verified httpOnly cookies compliant

✅ Complete: 12 files created, SPECS.md updated
⚡ Next: Test the auth flow with provided API requests
```

---

### Example 2: Mid-Project Change
```
[Orchestrator Mode]
Task: The designer wants to add a "lactose-free" filter to the menu
```

**Orchestrator Output**:
```
📊 SPECIFICATION CHANGE DETECTED

Impact Analysis: MEDIUM (affects Product schema, Menu page, filtering logic)

Step 1: Updating SPECS.md
  ✅ Added "isLactoseFree: Boolean" to Product schema
  ✅ Updated § 5: products collection

Step 2: Propagating Changes
  Backend:
    - Product.schema.ts: Added isLactoseFree field
  Frontend:
    - Menu.tsx: Added lactose-free filter button
    - ProductCard.tsx: Added lactose-free badge
    - types/product.types.ts: Updated interface

Step 3: Testing
  🧪 Generated filter test cases

✅ COMPLETE: Lactose-free filter implemented
📋 5 files modified, SPECS.md updated
⚡ Seed database with isLactoseFree values
```

---

### Example 3: Pre-Weekend 5 Check
```
[Orchestrator Mode]
Task: Weekend 4 is done. Verify we're on track for final delivery next week.
```

**Orchestrator Output**:
```
🔍 PROGRESS AUDIT (Week 4 → Week 5)

Checking against PLANNING.md:

✅ Week 1: Backend core complete
✅ Week 2: Orders + Loyalty complete
✅ Week 3: Cookie banner complete
✅ Week 4: Frontend pages complete

Outstanding Week 5 tasks:
- [ ] Order flow (Cart → Payment → Success)
- [ ] Simulated payment form
- [ ] Final GDPR check
- [ ] Code review
- [ ] Teacher handoff prep

GDPR Pre-Check:
  ✅ Cookie banner: Compliant
  ⚠️ Newsletter checkbox: VERIFY unchecked by default
  ✅ httpOnly cookies: Correct

Code Quality Pre-Check:
  ✅ TypeScript: No errors
  ✅ NestJS: Proper architecture
  ⚠️ Frontend: 2 components missing error states

VERDICT: On track, 3 minor fixes needed before Week 5
Priority fixes: [lists the 3 issues]
```

---

## ⚠️ When NOT to Use the Orchestrator

Use specialized agents directly for:

1. **Quick single-agent tasks** where you know exactly what you need:
   ```
   "Generate a ProductCard component" → Use Component Builder directly
   ```

2. **Learning/exploration**: When you want to understand a specific agent's output format

3. **Testing agent behavior**: When debugging or improving agent prompts

**Use the Orchestrator** when:
- Task involves multiple steps or agents
- You're changing specifications
- You need impact analysis
- You want coordination and consistency

---

## 🎓 Advanced: Teaching the Orchestrator

If you develop new patterns, you can extend the Orchestrator:

```
[Orchestrator Mode]
Task: Learn this pattern: When adding a new product category,
always check if navigation menu needs updating

Context: [explain the pattern]
```

The Orchestrator will remember this for the current session.

---

## 📞 Getting Help

If the Orchestrator seems confused:

```
[Orchestrator Mode]
Task: Explain what you understand about [feature name] from SPECS.md
```

This helps verify the Orchestrator is reading specifications correctly.

---

## ✅ Success Checklist

You're using the Orchestrator correctly when:
- [ ] You describe WHAT you want, not HOW to do it
- [ ] Specification changes automatically update SPECS.md
- [ ] Changes propagate across frontend + backend
- [ ] You get clear impact analysis for modifications
- [ ] GDPR compliance is automatically checked
- [ ] You receive structured completion reports

---

> **Remember**: The Orchestrator is your AI project manager. Trust it to coordinate, delegate, and maintain consistency. You focus on requirements, it handles execution.

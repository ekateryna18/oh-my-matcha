# 🍵 Oh My Matcha ! — Feature List
### Team Validation Document — February 2026

> This document lists all planned features for the website.
> Please review it and let us know about any additions, changes or disagreements before development starts.
> ✅ = approved | 🔄 = to discuss | ➕ = to add

---

## 🌐 General

- [ ] Site entirely in **French**
- [ ] **Mobile first** design (smartphone priority, adapted for desktop)
- [ ] Accessible without an account: home page, menu, legal pages, newsletter
- [ ] All pages have a **header** (logo + navigation) and a **footer** (legal links + "Manage cookies")

---

## 📄 Pages

| Page | URL | Access |
|---|---|---|
| Home | `/` | Everyone |
| Menu / Catalogue | `/menu` | Everyone |
| Customization | `/menu/:id/customize` | Logged in |
| Cart | `/cart` | Logged in |
| Payment | `/payment` | Logged in |
| Order Confirmation | `/order/success` | Logged in |
| Order Cancellation | `/order/cancel` | Logged in |
| Login | `/login` | Not logged in |
| Register | `/register` | Not logged in |
| My Account | `/account` | Logged in |
| Privacy Policy | `/privacy` | Everyone |
| Terms of Service | `/terms` | Everyone |
| Legal Notice | `/legal` | Everyone |
| Cookie Policy | `/cookies` | Everyone |

---

## 🏠 Home Page

- [ ] Tea shop presentation (story, values, atmosphere)
- [ ] Highlight of the matcha / bubble tea concept
- [ ] Call-to-action button toward the menu or ordering
- [ ] Newsletter section (pop-up or dedicated section)

---

## 🍵 Menu / Catalogue

- [ ] Display of all available products
- [ ] **Photo** for each product
- [ ] Product **name** and **description** (in French)
- [ ] **Price** displayed in euros
- [ ] Filter by **3 categories**:
  - 🍵 Matcha Drinks
  - 🧋 Bubble Tea
  - 🍃 Teas
- [ ] Indication if a product is **unavailable**
- [ ] "Order" button on each product
  - If not logged in → redirects to the login page
  - If logged in → redirects to the customization page

---

## 🎨 Customization Page

> Dedicated page to personalize the selected product before adding it to the cart.

- [ ] Display of the selected product (name, photo, base price)
- [ ] Selection of customization options:
  - **Flavour** (e.g. original, vanilla, caramel, red fruits) — all products
  - **Syrup** (e.g. no syrup, vanilla syrup, caramel syrup, lavender syrup) — all products
  - **Sweetness level** (no sugar, lightly sweet, normal, very sweet) — all products
  - **Temperature** (hot, cold / iced) — all products
  - **Milk type** (cow milk, oat milk, almond milk, soy milk) — **only if the product contains milk**
- [ ] **Quantity** selection
- [ ] "Add to cart" button
- [ ] Customization summary visible before confirmation

---

## 👤 Register / Login

### Register
- [ ] Required fields: email, password, first name, last name, phone number, date of birth
- [ ] Newsletter checkbox **unchecked by default** (GDPR requirement)
- [ ] Field validation (email format, strong password, etc.)
- [ ] Error message if email is already in use

### Login
- [ ] Login with email + password
- [ ] Error message if credentials are incorrect
- [ ] Redirect to the previous page after login

---

## 🛒 Cart

- [ ] View all added items with their **customization** (flavour, syrup, sweetness, temperature, milk)
- [ ] Edit the **quantity** of each item
- [ ] Remove an item
- [ ] View the **order total**
- [ ] See if a **5€ loyalty credit** is applicable (if ≥ 50 points)
- [ ] Select a **pickup time slot** for today (15-minute intervals)
  - Only available slots are shown (max 5 orders per slot)
  - If `pickup_slot_pref` is active: preferred slot pre-selected
- [ ] "Place order" button

---

## 💳 Payment (simulated)

- [ ] Order summary before payment
- [ ] **Billing address** input (street, city, zip code)
- [ ] Simulated card payment form:
  - Card number (16 digits)
  - Expiry date (MM/YY)
  - CVV (3 digits)
  - Cardholder name
- [ ] Client-side field validation
- [ ] Automatic **5€ credit** applied if ≥ 50 loyalty points
- [ ] "Pay X€" button
- [ ] ⚠️ No real banking data is transmitted or stored — simulation only

---

## ✅ Order Confirmation

- [ ] Order number displayed (e.g. `OMM-2026-0042`)
- [ ] Summary of ordered items
- [ ] Confirmed pickup slot
- [ ] Number of **loyalty points credited** for this order
- [ ] New points balance displayed
- [ ] Button to return to the menu

---

## 👤 My Account

### Personal Information
- [ ] View and **edit**: first name, last name, email, phone number, date of birth
- [ ] **Change password**
- [ ] **Delete account** (with confirmation) — erases all personal data (GDPR)

### Loyalty Points
- [ ] Current points balance
- [ ] Progress bar toward 50 points (= 5€ credit)
- [ ] Points earnings history (date, order, amount)
- [ ] Indication when the 5€ credit is available

### Order History
- [ ] List of all past orders
- [ ] For each order: number, date, items, total, status, pickup slot

### Cookie Preferences
- [ ] View current consents (marketing / functional)
- [ ] Edit choices at any time
- [ ] Withdraw consent (GDPR right)

---

## 📧 Newsletter

- [ ] Subscription form accessible from the home page (pop-up or section)
- [ ] No segmentation — single list
- [ ] Real emails sent via **Brevo**
- [ ] **+5 loyalty points** credited on subscription (logged-in users only, once per account)
- [ ] Unsubscription possible at any time
- [ ] Consent date recorded in the database (GDPR requirement)

---

## 🎁 Loyalty Program

- [ ] **1€ spent = 1 point** (rounded down)
- [ ] Points credited only after **order confirmation**
- [ ] **50 points = 5€ credit** applied automatically at the next checkout
- [ ] 50 points are **deducted** from the balance when the credit is used
- [ ] Newsletter bonus: **+5 points** on first subscription (once per account)

---

## 🍪 Cookie Banner (GDPR/CNIL) — Core feature of the project

- [ ] Banner shown on **first visit** (or if cookies have changed)
- [ ] 3 categories presented:
  - **Essential** — always active, cannot be disabled (`session_id`, `csrf_token`, `cart_id`, `auth_token`)
  - **Functional** — memorizes preferred pickup slot (`pickup_slot_pref`)
  - **Marketing** — newsletter + Brevo (`newsletter_consent`)
- [ ] Buttons: **"Accept all"** · **"Reject all"** · **"Save my choices"**
- [ ] "Accept all" and "Reject all" buttons are visually identical (no dark patterns)
- [ ] Toggles are **unchecked by default**
- [ ] Optional scripts **not loaded** without consent
- [ ] Optional cookies **deleted immediately** if consent is withdrawn
- [ ] "**Manage cookies**" link always visible in the footer
- [ ] Preferences editable at any time from the account or the footer

---

## ⚖️ Legal Pages

- [ ] **Privacy Policy** — data collected, legal basis, retention periods, user rights
- [ ] **Terms of Service** — order terms, simulated payment, pickup, responsibilities
- [ ] **Legal Notice** — publisher identity, hosting provider
- [ ] **Cookie Policy** — detail of all 6 cookies, durations, purposes

---

## 🔒 Security

- [ ] Passwords hashed with bcrypt
- [ ] Login via JWT stored in an `httpOnly` cookie (not accessible to JavaScript)
- [ ] CSRF protection on all forms and order actions
- [ ] HTTPS mandatory in production
- [ ] `passwordHash` never returned in API responses

---

## ❓ Open Questions — To be decided by the team

These points have not been decided yet or need discussion:

1. **Home page** — what exact sections? (photo gallery, customer testimonials, interactive shop map?)
2. **Products** — how many products at launch in each category (Matcha / Bubble Tea / Teas)? Who creates the content (names, descriptions, photos)?
3. **Customization** — are the options (flavours, syrups) the same for all products in a category, or different per product?
4. **Pickup hours** — what are the opening and closing times for slots? (e.g. 9am–7pm?)
5. **Billing address** — is it saved for future orders or re-entered each time?
6. **Admin management** — is there a back-office to manage products / orders, or is everything managed directly in the database?
7. **Order status** — does the customer receive a notification when their order is ready, or do they just see the status in their history?
8. **Product images** — who provides the photos? Expected format?

---
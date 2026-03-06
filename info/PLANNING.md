# 🍵 Oh My Matcha — Technical Planning (5 weekends)

> Role: Fullstack development + GDPR/CNIL cookie consent banner integration  
> Stack: React 19 · NestJS · TypeScript · MongoDB · Docker  
> Constraint: Weekends only · Frontend depends on Figma mockups from designers  
> Payment: Simulated form (Stripe-style) — no real integration  
> Deployment: Local in dev · School server handled by teacher

---

## 📅 Overview

| Weekend | Focus | Deliverable |
|---|---|---|
| **W1** | Docker setup + Backend core (auth, users, products) | Working auth API + catalogue |
| **W2** | Backend orders + loyalty + newsletter | Full API tested |
| **W3** | GDPR cookie banner + React structure | ConsentManager + routing + empty pages |
| **W4** | Frontend pages *(Figma mockups required)* | Navigable integrated site |
| **W5** | Order flow + simulated payment + tests + handoff | Complete deliverable |

---

## 🗓️ Weekend 1 — Docker Setup & Backend Core

> **Goal**: Local environment running + complete authentication

### 🐳 Docker — Two environments

You work with **two separate Docker files**:

```
docker-compose.yml        → local dev (you)
docker-compose.prod.yml   → school server (your teacher)
```

**Your daily commands in local:**
```bash
docker-compose up          # start everything
docker-compose up -d       # start in background
docker-compose down        # stop
```

Your site runs on `http://localhost:3000` (app) and `http://localhost:3001` (api).

**`docker-compose.yml` — local version (simple, no Traefik):**
```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_PORT: 27017
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: development

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001

  db:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
      MONGO_INITDB_DATABASE: oh_my_matcha

volumes:
  mongo_data:
```

**`docker-compose.prod.yml` — server version (with Traefik, for your teacher):**
This is your existing adapted `docker-compose.yml` (`ommatcha_*` naming) with Traefik labels. Your teacher runs:
```bash
git clone <repo>
cp .env.example .env   # then fills in real values
docker-compose -f docker-compose.prod.yml up -d
```

**Never commit to Git:**
```
.env
```

**Commit this instead:**
```bash
# .env.example — all variables listed, no real values
DB_USERNAME=
DB_PASSWORD=
DOMAIN_NAME=
JWT_SECRET=
NODE_ENV=development
```

### Project setup
- [x] Create `docker-compose.yml` (local) (and `docker-compose.prod.yml` (server))
- [x] Create local `.env`( + `.env.example` on Git)
- [x] Add `.env` to `.gitignore`
- [x] Verify `docker-compose up` launches all 3 containers locally
- [x] Initialize Git repo + branches (`main`, `dev`)

### MongoDB models
- [x] `User` schema — email, passwordHash, firstName, lastName, billingAddress, loyaltyPoints, cookieConsents
- [x] `Product` schema — name, category, price, options (milks, sizes), allergens, availability
- [x] MongoDB seed — insert Oh My Matcha products (matcha latte, bubble tea, teas)

### Auth module (NestJS)
- [ ] `POST /auth/register` — registration, bcrypt password hash
- [ ] `POST /auth/login` — login, returns JWT
- [ ] `auth_token` cookie as `httpOnly` — 1 day duration
- [ ] `csrf_token` cookie — generated and validated on all forms
- [ ] JWT guard — protects private routes
- [ ] `GET /users/me` — logged-in user profile
- [ ] `PATCH /users/me` — update personal information
- [ ] `DELETE /users/me` — delete account (GDPR right to erasure)
- [ ] `PATCH /users/me/consents` — update cookie consents

---

## 🗓️ Weekend 2 — Backend Orders + Loyalty + Newsletter

> **Goal**: Complete API — catalogue, cart, orders, loyalty, newsletter

### Catalogue & Cart
- [ ] `GET /products` — list available products
- [ ] `GET /products/:id` — product detail
- [ ] `cart_id` cookie — persistent server-side cart
- [ ] `POST /cart` — add a product
- [ ] `GET /cart` — retrieve current cart
- [ ] `DELETE /cart/:itemId` — remove an item

### Orders & Time slots
- [ ] `Order` schema — userId, items, total, slot, status, billingAddress
- [ ] `GET /slots` — available pickup slots in 15-minute intervals
- [ ] `POST /orders` — create an order (status `pending`)
- [ ] `PATCH /orders/:id/confirm` — confirm order (simulates payment validation)
- [ ] `GET /users/me/orders` — order history

### Loyalty & Newsletter
- [ ] Loyalty logic: 1€ spent = 1 point, 50 points = 5€ credit
- [ ] `GET /users/me/loyalty` — points + earnings history
- [ ] `POST /newsletter/subscribe` — subscription + 5pts loyalty bonus
- [ ] `DELETE /newsletter/unsubscribe` — unsubscribe (GDPR right)
- [ ] Test all routes with Postman or Insomnia

---

## 🗓️ Weekend 3 — GDPR Cookie Banner + React Structure

> **Goal**: Complete ConsentManager + full React structure without design  
> ⚠️ **Request Figma mockups from designers this weekend**

### 🎨 Request from designers (this weekend)
```
Mockups needed for W4:
- Home page (mobile + desktop)
- Menu / product catalogue page
- Order / cart page + payment form
- User account page + loyalty dashboard
- Components: header, footer, product cards, buttons
- Complete design system (colors, typography, spacing)
```

### ConsentManager TypeScript — core of the project
- [ ] Create `src/lib/ConsentManager.ts`
- [ ] TypeScript interfaces: `ConsentChoices` and `ConsentData`
- [ ] `getConsents()` — read stored preferences
- [ ] `saveConsents(choices)` — save + apply immediately
- [ ] `shouldShowBanner()` — new visitor or version changed → show banner
- [ ] `revokeAll()` — consent withdrawal (GDPR right)
- [ ] Consent versioning — if cookies change, automatically re-ask
- [ ] Typed utilities: `setCookie`, `getCookie`, `deleteCookie`

### Conditional script triggering
- [ ] `newsletter_consent` active → set 14-day cookie + initialize email tool
- [ ] `newsletter_consent` inactive → delete cookie + script not loaded
- [ ] `pickup_slot_pref` active → allow preferred slot memorization
- [ ] `pickup_slot_pref` inactive → delete existing preference
- [ ] Initialize in `App.tsx` — apply existing consents on load
- [ ] Sync with backend (`PATCH /users/me/consents`) if user is logged in

### Banner components
- [ ] `CookieBanner.tsx` — 3 categories, unchecked toggles by default, Accept all / Reject all / Save buttons
- [ ] `CookieSettings.tsx` — settings modal accessible from account and footer
- [ ] `useConsent()` hook — access consents from any component

### React structure + routing
- [ ] React Router setup — all routes defined
- [ ] Main layout — Header, Footer, content area
- [ ] Empty pages: `Home`, `Menu`, `Cart`, `Order`, `Account`, `LoyaltyDashboard`, `Login`, `Register`
- [ ] Legal pages: `PrivacyPolicy`, `TermsOfService`, `LegalNotice`, `CookiePolicy`
- [ ] `AuthContext` — global login state
- [ ] "Manage cookies" link in footer — CNIL requirement

---

## 🗓️ Weekend 4 — Frontend Main Pages

> **Goal**: All showcase pages + account pages integrated with mockups  
> ✅ **Figma mockups required this weekend**

### Showcase site
- [ ] `Home` page — tea shop presentation, matcha values, call to action (mobile first)
- [ ] Responsive header + mobile hamburger menu
- [ ] `Menu` page — product grid from `GET /products`, category filters
- [ ] `ProductCard` component — name, price, options, allergens, add to cart button
- [ ] Complete footer — legal links + "Manage cookies"

### Authentication
- [ ] `Login` page — login form
- [ ] `Register` page — registration form, newsletter checkbox **unchecked by default** (CNIL)
- [ ] Error handling (email already used, wrong password)
- [ ] Protected routes — redirect to login if not authenticated

### User account + loyalty
- [ ] `Account` page — view and edit personal information
- [ ] Cookie consent management section inside account
- [ ] `LoyaltyDashboard` page — current points, progress bar to 50pts, earnings history
- [ ] Order history
- [ ] Account deletion with confirmation

---

## 🗓️ Weekend 5 — Order Flow + Simulated Payment + Tests + Handoff

> **Goal**: Complete order tunnel + final delivery to teacher

### Order flow
- [ ] `Cart` page — cart summary, edit quantities, remove items
- [ ] Pickup slot selection (15-min slots from `GET /slots`)
- [ ] If `pickup_slot_pref` active → pre-fill with memorized slot
- [ ] Order summary + billing address input

### Simulated payment form (Stripe-style)
- [ ] `Payment` page — fields: card number, expiry date, CVV, cardholder name
- [ ] Client-side field validation (card format, date, CVV)
- [ ] "Pay X€" button → calls `POST /orders` + `PATCH /orders/:id/confirm`
- [ ] `OrderSuccess` page — confirmation, credited points, slot reminder
- [ ] `OrderCancel` page — back to cart
- [ ] ⚠️ No real banking data transmitted — simulation only

### GDPR & cookie tests
- [ ] Optional scripts not loaded without consent
- [ ] Optional cookies deleted on consent withdrawal
- [ ] `auth_token` and `csrf_token` are `httpOnly` (not visible in JS)
- [ ] Account deletion → data erased in database
- [ ] Newsletter unsubscribe → cookie deleted

### Teacher handoff
- [ ] Verify `.env` is not on Git
- [ ] `.env.example` complete and up to date
- [ ] `docker-compose.prod.yml` tested and documented
- [ ] README with deployment instructions for teacher:
  ```bash
  git clone <repo>
  cp .env.example .env   # fill in real values
  docker-compose -f docker-compose.prod.yml up -d
  ```
- [ ] Git tag `v1.0.0`

---

## 🍪 Cookie logic reminder (core of the project)

```
User arrives on site
        │
        ▼
omm_cookie_consent exists?
        │
   NO  ─┼─ Show CookieBanner → choice → saveConsents()
        │
   YES ─┼─ applyConsents() on App.tsx load
        │
        ▼
applyConsents(data)
   ├── marketing = true  → setCookie('newsletter_consent', 14d) + init email tool
   ├── marketing = false → deleteCookie('newsletter_consent') + script not loaded
   ├── functional = true  → window.__pickupPrefEnabled = true
   └── functional = false → deleteCookie('pickup_slot_pref')

Technical cookies (session_id, csrf_token, cart_id, auth_token)
→ Set by NestJS as httpOnly — never managed by this system
```

---

## 📌 Critical dependencies

| Blocker | Required for | Deadline |
|---|---|---|
| Figma mockups from designers | Frontend integration W4 | **End of W3** |
| Complete `.env.example` | Teacher handoff W5 | **Start of W5** |

---

> 📁 Related files: `README.md` · `docker-compose.yml` · `docker-compose.prod.yml` · `.env.example` · `src/lib/ConsentManager.ts`
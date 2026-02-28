# 🍵 Oh My Matcha — Technical Specifications (SPECS)

> Single source of truth for the project.
> Reference this file in every AI agent prompt with: "Refer to SPECS.md for full project context."
> Last updated: February 2026

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Project name** | Oh My Matcha ! |
| **Type** | Tea shop showcase site + click & collect ordering |
| **Language** | French (all site content) |
| **Design approach** | Mobile first |
| **Target audience** | Urban tea / bubble tea lovers, 18–35 years old, Paris |
| **Context** | School project — France, February 2026 |

### What the site does
- Presents the tea shop (story, values, menu)
- Lets users create an account and manage personal info
- Lets users place click & collect orders with simulated payment
- Manages a loyalty program (1€ = 1 point, 50 points = 5€ credit at checkout)
- Handles newsletter subscriptions (no segmentation, real emails via Brevo)
- Fully GDPR/CNIL compliant with a functional cookie consent banner

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19 |
| **Frontend language** | TypeScript | 5.7 |
| **Frontend routing** | React Router DOM | 7 |
| **Backend framework** | NestJS | 11 |
| **Backend language** | TypeScript | 5.7 |
| **Database** | MongoDB | 7.0 |
| **ODM** | Mongoose | 9 |
| **Containerization** | Docker + Docker Compose | — |
| **Reverse proxy** | Traefik (prod only) | — |
| **Authentication** | JWT + httpOnly cookie | — |
| **Email** | Brevo (newsletter only) | — |
| **Payment** | Simulated form (Stripe-style UI, no real API) | — |

---

## 3. Project File Structure

```
oh-my-matcha/                         # Root monorepo
│
├── app/                              # React 19 frontend — separate deployable unit
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── CookieBanner.tsx      # GDPR cookie banner
│   │   │   ├── CookieSettings.tsx    # Cookie preferences modal
│   │   │   ├── ProductCard.tsx       # Menu product card
│   │   │   ├── CartItem.tsx          # Cart line item
│   │   │   ├── LoyaltyBar.tsx        # Points progress bar
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx            # Must include "Gérer mes cookies" link
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Customization.tsx     # Product customization before adding to cart
│   │   │   ├── Cart.tsx
│   │   │   ├── Payment.tsx
│   │   │   ├── OrderSuccess.tsx
│   │   │   ├── OrderCancel.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Account.tsx           # Includes loyalty points section
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── TermsOfService.tsx
│   │   │   ├── LegalNotice.tsx
│   │   │   └── CookiePolicy.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Global auth state
│   │   ├── hooks/
│   │   │   └── useConsent.ts         # Access cookie consents anywhere
│   │   ├── lib/
│   │   │   └── ConsentManager.ts     # Core GDPR cookie logic
│   │   └── types/                    # Shared TypeScript interfaces
│   │       ├── user.types.ts
│   │       ├── product.types.ts
│   │       ├── order.types.ts
│   │       └── consent.types.ts
│   ├── Dockerfile                    # Frontend container
│   └── package.json                  # React 19 dependencies
│
├── api/                              # NestJS backend — separate deployable unit
│   └── src/
│       ├── auth/                     # JWT auth module
│       ├── users/                    # User profile + account
│       ├── products/                 # Product catalogue
│       ├── cart/                     # Persistent cart
│       ├── orders/                   # Click & collect orders
│       ├── slots/                    # Pickup time slots
│       ├── loyalty/                  # Points logic
│       └── newsletter/               # Brevo subscription
│   ├── Dockerfile                    # Backend container
│   └── package.json                  # NestJS dependencies
│
├── docker-compose.yml                # Local development
├── docker-compose.prod.yml           # School server (Traefik)
├── .env                              # Never committed to Git
├── .env.example                      # Committed — no real values
├── README.md
├── PLANNING.md
└── SPECS.md                          # This file
```

---

## 4. Pages & Access Control

| Page | Route | Auth required | Description |
|---|---|---|---|
| Home | `/` | ❌ No | Shop presentation, hero, call to action |
| Menu | `/menu` | ❌ No | 3 drink categories — user picks a product to order |
| Customization | `/menu/:id/customize` | ✅ Yes | Personalize the selected product before adding to cart |
| Cart | `/cart` | ✅ Yes | Cart summary, slot selection, order recap |
| Payment | `/payment` | ✅ Yes | Simulated payment form |
| Order Success | `/order/success` | ✅ Yes | Confirmation + points credited |
| Order Cancel | `/order/cancel` | ✅ Yes | Return to cart |
| Login | `/login` | ❌ No | Login form |
| Register | `/register` | ❌ No | Registration form |
| Account | `/account` | ✅ Yes | Profile, loyalty points, order history, cookie prefs |
| Privacy Policy | `/privacy` | ❌ No | GDPR privacy policy |
| Terms of Service | `/terms` | ❌ No | CGV |
| Legal Notice | `/legal` | ❌ No | Mentions légales |
| Cookie Policy | `/cookies` | ❌ No | Full cookie details |

### What a visitor can do without an account
- Browse the menu (view products, images, categories)
- Subscribe to the newsletter (from the footer or a pop-up)
- Read all legal pages
- Manage cookie preferences

### What requires an account
- Adding to cart
- Placing an order
- Seeing loyalty points
- Accessing order history

---

## 5. Database — MongoDB Collections

### Collection: `users`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB auto-generated |
| `email` | String | ✅ | Unique, lowercase |
| `passwordHash` | String | ✅ | bcrypt — never returned in API responses |
| `firstName` | String | ✅ | |
| `lastName` | String | ✅ | |
| `phoneNumber` | String | ✅ | |
| `dateOfBirth` | Date | ✅ | |
| `billingAddress` | Object | ❌ | `{ street, city, zip }` — filled at first order |
| `loyaltyPoints` | Number | ✅ | Default: `0` |
| `loyaltyHistory` | Array | ✅ | Array of `{ date, amount, reason, orderId? }` |
| `newsletterSubscribed` | Boolean | ✅ | Default: `false` |
| `newsletterConsentDate` | Date | ❌ | Set when user subscribes |
| `cookieConsents` | Object | ✅ | `{ marketing: bool, functional: bool, date, version }` |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

---

### Collection: `products`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `name` | String | ✅ | In French |
| `description` | String | ✅ | In French |
| `category` | String | ✅ | Enum: `matcha`, `bubble_tea`, `tea` — 3 categories only |
| `price` | Number | ✅ | Base price in euros (e.g. `5.50`) |
| `image` | String | ❌ | Image filename or URL |
| `customizationOptions` | Object | ✅ | Which options apply to this product (see below) |
| `allergens` | Array | ❌ | Array of strings (e.g. `["lait", "gluten"]`) |
| `hasMilk` | Boolean | ✅ | **Flag — true if the product contains or can contain milk.** Determines whether the milk type selector appears on the customization page. Default: `false` |
| `available` | Boolean | ✅ | Default: `true` |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

**The 3 product categories:**
| Category value | Display name | Examples |
|---|---|---|
| `matcha` | Boissons Matcha | Matcha latte, Matcha glacé, Hojicha latte |
| `bubble_tea` | Bubble Tea | Taro bubble tea, Matcha bubble tea, Fruit bubble tea |
| `tea` | Thés | Thé vert, Thé noir, Thé aux fruits |

**Customization options structure — per product:**
```json
{
  "flavours": ["original", "vanille", "caramel", "fruits rouges"],
  "syrups": ["sans sirop", "sirop de vanille", "sirop de caramel", "sirop de lavande"],
  "sweetnessLevel": ["sans sucre", "peu sucré", "normal", "très sucré"],
  "temperature": ["chaud", "froid / glacé"],
  "milkType": ["lait de vache", "lait d'avoine", "lait d'amande", "lait de soja"]
}
```

> **Important rules for customization options:**
> - `flavours` — available on all products
> - `syrups` — available on all products
> - `sweetnessLevel` — available on all products
> - `temperature` — available on all products
> - `milkType` — **only shown on the customization page if `hasMilk: true`**. The `milkType` array is still stored in `customizationOptions` for all products, but the frontend only renders it when `hasMilk` is `true`
> - Each product defines its own available values per option (e.g. not all flavours apply to every product)

---

### Collection: `orders`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `orderNumber` | String | ✅ | e.g. `OMM-2026-0042` — auto-generated |
| `userId` | ObjectId | ✅ | Ref: `users` |
| `items` | Array | ✅ | Array of order items (see below) |
| `totalAmount` | Number | ✅ | In euros, before credit |
| `creditApplied` | Number | ✅ | 5€ deducted if user chose to apply credit — default `0` |
| `finalAmount` | Number | ✅ | `totalAmount - creditApplied` — amount actually charged |
| `pickupSlot` | String | ✅ | e.g. `"13:00"` — today only |
| `status` | String | ✅ | Enum: `pending`, `confirmed`, `ready`, `completed` |
| `billingAddress` | Object | ✅ | `{ street, city, zip }` snapshot at order time |
| `loyaltyPointsEarned` | Number | ✅ | Points credited for this order (based on `finalAmount`) |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

**Order item structure:**
```json
{
  "productId": "ObjectId",
  "name": "Matcha Latte",
  "price": 5.50,
  "quantity": 2,
  "customization": {
    "flavour": "vanille",
    "syrup": "sirop de caramel",
    "sweetnessLevel": "peu sucré",
    "temperature": "chaud",
    "milkType": "lait d'avoine"
  }
}
```
> `milkType` is only present in the customization object if the product has `hasMilk: true`.

---

### Collection: `slots`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `time` | String | ✅ | e.g. `"12:00"`, `"12:15"`, `"12:30"` |
| `maxOrders` | Number | ✅ | Max concurrent orders per slot — default `5` |
| `date` | String | ✅ | Today's date `YYYY-MM-DD` |
| `currentOrders` | Number | ✅ | Default `0` — incremented on order confirm |

> Slots are for **today only**. Available slots = slots where `currentOrders < maxOrders`.

---

### Collection: `newsletter_subscriptions`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `email` | String | ✅ | Unique |
| `userId` | ObjectId | ❌ | Ref: `users` — null if not a registered user |
| `consentDate` | Date | ✅ | When user subscribed — GDPR requirement |
| `bonusPointsCredited` | Boolean | ✅ | Default `false` — true once +5pts credited |
| `active` | Boolean | ✅ | Default `true` — set to false on unsubscribe |
| `unsubscribeDate` | Date | ❌ | Set when user unsubscribes |
| `createdAt` | Date | Auto | |

---

## 6. API Endpoints

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns JWT in httpOnly cookie |
| POST | `/auth/logout` | ✅ | Clears auth cookie |

---

### Users — `/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | ✅ | Get current user profile |
| PATCH | `/users/me` | ✅ | Update personal info |
| PATCH | `/users/me/password` | ✅ | Change password |
| DELETE | `/users/me` | ✅ | Delete account (GDPR right to erasure) |
| GET | `/users/me/orders` | ✅ | Get order history |
| GET | `/users/me/loyalty` | ✅ | Get loyalty points + history |
| PATCH | `/users/me/consents` | ✅ | Update cookie consent preferences |

---

### Products — `/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | ❌ | Get all available products |
| GET | `/products?category=matcha` | ❌ | Filter products by category (`matcha`, `bubble_tea`, `tea`) |
| GET | `/products/:id` | ❌ | Get one product + its full customization options |

---

### Cart — `/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | ✅ | Get current cart |
| POST | `/cart` | ✅ | Add item to cart |
| PATCH | `/cart/:itemId` | ✅ | Update item quantity or options |
| DELETE | `/cart/:itemId` | ✅ | Remove item from cart |
| DELETE | `/cart` | ✅ | Clear entire cart |

---

### Slots — `/slots`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/slots` | ✅ | Get available pickup slots for today |

---

### Orders — `/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders` | ✅ | Create order (status: `pending`) |
| PATCH | `/orders/:id/confirm` | ✅ | Confirm order + credit loyalty points |
| GET | `/orders/:id` | ✅ | Get one order |

---

### Newsletter — `/newsletter`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/newsletter/subscribe` | ❌ | Subscribe + credit 5pts if logged in |
| DELETE | `/newsletter/unsubscribe` | ❌ | Unsubscribe (GDPR right) |

---

## 7. Authentication & Security

| Mechanism | Detail |
|---|---|
| **JWT** | Stored in `auth_token` cookie — `httpOnly`, `SameSite=Lax`, `Secure` in prod |
| **JWT duration** | 1 day |
| **CSRF protection** | `csrf_token` cookie — sent by client in `X-CSRF-Token` header on all POST/PATCH/DELETE |
| **Password hashing** | bcrypt, 10 salt rounds |
| **Protected routes** | NestJS `JwtAuthGuard` on all routes requiring auth |
| **ObjectId validation** | `ParseMongoIdPipe` on all `/:id` params |
| **Sensitive fields** | `passwordHash` never returned in any API response |

---

## 8. Loyalty Program

| Rule | Detail |
|---|---|
| **Earning rate** | 1€ spent = 1 point (rounded down, based on `finalAmount`) |
| **Reward threshold** | 50 points = 5€ credit available |
| **Reward application** | **Not automatic** — user sees a message on the cart/payment page and ticks a checkbox to apply the credit |
| **Checkbox behaviour** | If user has ≥ 50 points: a notice appears ("Vous avez 5€ de crédit disponible") with an opt-in checkbox. Unchecked by default. |
| **Points deducted** | 50 points removed from balance only if user checked the box and order is confirmed |
| **Newsletter bonus** | +5 points credited once on first newsletter subscription (registered users only) |
| **Points visibility** | Shown on the Account page with progress bar toward 50pts |
| **Points base** | Loyalty points earned are calculated on `finalAmount` (after credit deduction if applied) |

---

## 9. Cookie System (GDPR/CNIL)

### The 6 cookies

| Cookie | Category | Consent required | Duration | Storage | Purpose |
|---|---|---|---|---|---|
| `session_id` | Technical | ❌ Exempt | Session | `httpOnly` | User session |
| `csrf_token` | Technical | ❌ Exempt | Session | JS accessible | Form/payment security |
| `cart_id` | Technical | ❌ Exempt | Session | `httpOnly` | Persistent cart |
| `auth_token` | Technical | ❌ Exempt | 1 day | `httpOnly` | Authentication |
| `newsletter_consent` | Marketing | ✅ Required | 14 days | JS accessible | Newsletter + Brevo init |
| `pickup_slot_pref` | Functional | ✅ Required | 14 days | JS accessible | Preferred pickup slot |

### Consent storage cookie

| Cookie | Duration | Content |
|---|---|---|
| `omm_cookie_consent` | 6 months | `{ version, date, marketing, functional }` |

### Conditional script triggering

```
newsletter_consent = true  → set cookie 14d + initialize Brevo
newsletter_consent = false → delete cookie + Brevo NOT loaded
pickup_slot_pref = true    → allow slot memorization
pickup_slot_pref = false   → delete existing preference
```

### CNIL requirements enforced
- Banner shown on first visit (or when consent version changes)
- "Accept all" and "Reject all" buttons at equal visual weight
- All optional toggles unchecked by default
- Consent withdrawal deletes optional cookies immediately
- "Gérer mes cookies" link always visible in footer
- Newsletter checkbox unchecked by default on Register page
- `auth_token`, `session_id`, `cart_id` are `httpOnly` — never accessible in JS

---

## 10. Newsletter (Brevo)

| Detail | Value |
|---|---|
| **Tool** | Brevo (formerly Sendinblue) |
| **Segmentation** | None — single list |
| **Trigger** | Only if `newsletter_consent` cookie is active |
| **Bonus** | +5 loyalty points credited once on first subscription (logged-in users only) |
| **Unsubscribe** | Via `DELETE /newsletter/unsubscribe` — sets `active: false` in DB + notifies Brevo |
| **GDPR** | `consentDate` stored in DB at subscription time |

---

## 11. Simulated Payment Form

> No real Stripe integration. The form looks like Stripe but calls the internal API only.

| Field | Validation |
|---|---|
| Card number | 16 digits, formatted `XXXX XXXX XXXX XXXX` |
| Expiry date | MM/YY format, must be in the future |
| CVV | 3 digits |
| Cardholder name | Required string |

**Flow:**
1. User fills form → client-side validation only
2. On submit → `POST /orders` (creates order, status `pending`)
3. Then → `PATCH /orders/:id/confirm` (simulates payment confirmation)
4. Loyalty points credited → redirect to `/order/success`

⚠️ No real banking data is ever transmitted or stored.

---

## 12. Environment Variables

```bash
# Database
DB_USERNAME=
DB_PASSWORD=

# Domain (prod only)
DOMAIN_NAME=

# Auth
JWT_SECRET=                    # Long random string

# Brevo (newsletter)
BREVO_API_KEY=

# Environment
NODE_ENV=development           # or production
DEV=true
```

---

## 13. Key Business Rules

- The project is split into two separate deployable units: `app/` (React frontend) and `api/` (NestJS backend), each with their own `Dockerfile` and `package.json`
- A user must be logged in to add items to cart or place an order
- Cart is lost if the user is not logged in (no guest checkout)
- Pickup slots are for today only, in 15-minute intervals
- A slot becomes unavailable when `currentOrders >= maxOrders` (default: 5)
- Loyalty points are credited only after order confirmation (not on creation)
- Points are calculated on `finalAmount` (i.e. after the 5€ credit deduction if applied)
- The 5€ credit is **not applied automatically** — the user must explicitly tick the checkbox on the cart or payment page to use it. The checkbox is unchecked by default.
- 50 points are only deducted when the user opted in AND the order is confirmed
- Newsletter bonus points are credited only once per user, never twice
- The `hasMilk` flag on a product controls whether the milk type selector appears on the customization page — the frontend must check this flag before rendering that option
- Deleting an account must erase all personal data from DB (GDPR right to erasure)
- `passwordHash` must never appear in any API response under any circumstance

### Ordering & Customization flow
1. User browses the **Menu** page — 3 categories displayed: Matcha, Bubble Tea, Tea
2. User clicks a product → redirected to `/menu/:id/customize` (must be logged in)
3. On the **Customization** page, user selects their options:
   - Flavour (all products)
   - Syrup (all products)
   - Sweetness level (all products)
   - Temperature: hot or iced (all products)
   - Milk type (only if `hasMilk: true` on the product)
4. User clicks "Ajouter au panier" → item + customization saved to cart
5. User proceeds to **Cart** → reviews items, selects pickup slot
   - If user has ≥ 50 loyalty points: a notice appears with an **opt-in checkbox** to apply the 5€ credit (unchecked by default)
6. User proceeds to **Payment** → fills billing address + simulated card form
   - `finalAmount` = `totalAmount - creditApplied` (0 if checkbox was not ticked)
7. On confirm → order created, points credited based on `finalAmount`, redirect to success page
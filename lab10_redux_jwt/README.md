# COMP3123 — Lab Exercise 10
## Self-Directed Research and Innovation: React Redux & JWT (JSON Web Token)

**Student:** Yigit Alkoc
**Student ID:** 101558073
**Course:** COMP3123 — Full Stack Development I (Fall 2026)

---

## 1. What This Application Does

This is a small full-stack demo built to research and demonstrate two concepts:

- **Part 1 — React Redux:** a single-page Redux demo with three slices (counter, todos, cart), a **live state viewer**, and an **action log** that makes the dispatch → action → reducer → state flow visible on screen.
- **Part 2 — JWT Authentication:** an Express backend signs a real JSON Web Token at login; the React frontend stores it in `localStorage`, decodes and displays it (header / payload / signature, with a live expiry countdown), and uses it as a Bearer token to open a protected profile page. When the token expires, the protected area closes automatically.

---

## 2. Research — Redux Core Concepts (0–5)

Redux is a predictable state container for JavaScript apps. Instead of scattering state across components, the whole app state lives in one place and can only change in one way. The six core concepts from the lab handout:

| # | Concept | Explanation |
|---|---------|-------------|
| 0 | **State** | The single source of truth: one plain JavaScript object tree that describes the entire UI state at a moment in time. State is read-only — it is never mutated directly. In this app: `{ counter, todos, cart }`. |
| 1 | **Store** | The object that holds the state. It is created with `configureStore()` (Redux Toolkit) and exposes `getState()`, `dispatch(action)` and `subscribe(listener)`. React accesses it through the `<Provider>` component. |
| 2 | **Reducer** | A pure function `(previousState, action) => newState` that decides how state changes. Reducers must never mutate the old state — Redux Toolkit's `createSlice` uses Immer, so "mutating" draft code produces a new immutable state safely. This app has one reducer per slice. |
| 3 | **Action** | A plain object describing *what happened*, with a `type` string (e.g. `counter/increment`) and an optional `payload`. `createSlice` auto-generates action creators, so calling `increment()` produces `{ type: 'counter/increment' }`. |
| 4 | **Dispatch** | `store.dispatch(action)` is the **only** way to trigger a state change. The store runs the action through the reducers, computes the new state, then notifies subscribers. In React, components get `dispatch` from the `useDispatch()` hook. |
| 5 | **Subscribe** | `store.subscribe(listener)` registers a callback that runs after every state change — used for logging, persistence, or syncing non-React code. In React apps, `useSelector()` subscribes a component to the store so it re-renders when the selected state changes. |

**The Redux flow:** `UI event → dispatch(action) → reducer computes new state → store updates → subscribers/UI re-render`.

### How this app maps each concept

| Concept | Where it lives in this project |
|---------|--------------------------------|
| State | Live JSON viewer on the page (`src/components/StateViewer.jsx`) |
| Store | `src/app/store.js` (`configureStore`, provided in `src/main.jsx`) |
| Reducer | `src/features/counter/counterSlice.js`, `todosSlice.js`, `cartSlice.js` |
| Action | Generated action creators, e.g. `counter/incrementByAmount` with a payload |
| Dispatch | Every button in the Redux section calls `dispatch(...)` |
| Subscribe | `store.subscribe()` in `store.js` counts state changes; a logging middleware records every dispatched action type into the on-screen **Action Log** |

---

## 3. Research — JSON Web Token (JWT)

### 3.1 Structure: `header.payload.signature`

A JWT (RFC 7519) is a compact, URL-safe string made of three Base64Url-encoded parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJzdWIiOjEsIm5hbWUiOiJEZW1v... . M8E4Fc2S0Z_Icd9a...
        HEADER                              PAYLOAD                        SIGNATURE
```

1. **Header** — metadata: the token type and signing algorithm.
   ```json
   { "alg": "HS256", "typ": "JWT" }
   ```
2. **Payload** — the *claims*: statements about the user. Standard claims include `sub` (subject/user id), `iat` (issued at), and `exp` (expiration time, Unix seconds). This app's payload: `{ sub, name, email, role, iat, exp }`.
3. **Signature** — `HMACSHA256(base64Url(header) + "." + base64Url(payload), secret)`. It proves the token was issued by the server and that the header/payload were not tampered with.

> Important: the header and payload are **encoded, not encrypted** — anyone can decode them (this app does it in the browser). Never put passwords or sensitive secrets in a payload.

### 3.2 How JWT authentication works

1. The user sends credentials to `POST /login`.
2. The server verifies them and **signs** a JWT with its secret, setting a short `exp` (this demo: **2 minutes**, so expiry can be watched live).
3. The client stores the token (here: `localStorage`) and sends it on every protected request: `Authorization: Bearer <token>`.
4. The server **verifies** the signature and expiry on each request (`jsonwebtoken`'s `jwt.verify`). Valid → the request proceeds and the decoded payload is available; invalid/expired → **401 Unauthorized**.
5. JWTs are **stateless**: the server keeps no session table — everything it needs is inside the verified token. Logging out = deleting the token on the client.

### 3.3 Security notes

- **Short expiry** limits the damage of a stolen token; refresh tokens are the usual companion in production.
- **Protect the secret** — anyone with the server secret can forge tokens. It belongs in an environment variable (the secret in `server/index.js` is a clearly-labelled demo value only).
- **Always verify on the server** — decoding on the client is only for display; trust comes from signature verification.
- **Use HTTPS** so tokens cannot be sniffed in transit.
- **Storage trade-off:** `localStorage` is simple but readable by any JS on the page (XSS risk); `httpOnly` cookies resist XSS but need CSRF care. This lab uses `localStorage` to keep the flow transparent.
- Passwords in this demo are a single fictional account in plain text for teaching purposes only — real systems hash passwords (e.g. bcrypt) and never hard-code users.

---

## 4. How the JWT Demo Works in This App

| Step | What happens |
|------|--------------|
| Login | Form posts to `POST http://localhost:5000/login` with the demo account `demo@gbc.ca` / `password123` |
| Token issued | Backend replies `{ token, tokenType: "Bearer", expiresIn: "2m" }` |
| Storage | Frontend saves the token to `localStorage` (`lab10_jwt_token`) |
| Decode & display | `src/utils/jwt.js` splits and Base64Url-decodes the token; the page shows header, payload, signature, and a **live countdown to `exp`** |
| Protected route | Frontend calls `GET /profile` with the Bearer header; profile data renders only on HTTP 200 |
| Expiry | When the countdown reaches 0, the app deletes the token and returns to the login form with an "expired" notice |
| Logout | Button deletes the token from `localStorage` and closes the protected area |
| Failures | Wrong password → 401; missing token → 401; invalid signature → 401; expired token → 401 ("Token has expired") — all verified with curl (see §6) |

---

## 5. Project Structure

```
comp3123_lab10/
├── index.html
├── package.json                 # frontend deps + scripts
├── README.md
├── server/
│   ├── package.json             # express, jsonwebtoken, cors
│   └── index.js                 # POST /login, GET /profile, auth middleware
└── src/
    ├── main.jsx                 # <Provider store={store}>
    ├── App.jsx                  # page layout
    ├── api.js                   # fetch helpers + localStorage token handling
    ├── app/
    │   ├── store.js             # STORE: configureStore + middleware + store.subscribe()
    │   └── actionLog.js         # action log storage + listener (subscribe pattern)
    ├── features/
    │   ├── counter/counterSlice.js
    │   ├── todos/todosSlice.js
    │   └── cart/cartSlice.js
    ├── components/
    │   ├── ReduxDemo.jsx        # counter / todos / cart controls (dispatch)
    │   ├── StateViewer.jsx      # live STATE as JSON
    │   ├── ActionLogPanel.jsx   # dispatched ACTIONs + subscribe() counter
    │   ├── ConceptsPanel.jsx    # concepts 0–5 mapped to files
    │   └── JwtPanel.jsx         # login form, decoded JWT, countdown, profile
    └── utils/
        └── jwt.js               # base64url decode, expiry helpers
```

---

## 6. How to Run

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1) Frontend dependencies (project root)
npm install

# 2) Backend dependencies
cd server && npm install && cd ..

# 3) Start the backend (terminal 1) — http://localhost:5000
npm run server
#    (equivalently: cd server && npm start)

# 4) Start the frontend (terminal 2) — http://localhost:5173
npm run dev
```

Open **http://localhost:5173**, try the Redux buttons, then log in with the demo account:

- **Email:** `demo@gbc.ca`
- **Password:** `password123`

Production build check: `npm run build`.

### Backend verification (curl)

```bash
# Login -> 200 + JWT
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" \
     -d '{"email":"demo@gbc.ca","password":"password123"}'

# Protected route with token -> 200
curl http://localhost:5000/profile -H "Authorization: Bearer <TOKEN>"

# No token -> 401 {"error":"Access denied. No token provided."}
curl http://localhost:5000/profile

# Wrong password -> 401 {"error":"Invalid email or password"}
```

All of the above were executed during development and returned the expected results (valid token → profile JSON with the decoded payload; wrong/expired/missing token → 401).

---

## 7. Screenshots

<!-- TODO: screenshots and demo video are added before submission. -->

- [ ] Screenshot 1 — Redux demo: counter / todos / cart with the live State viewer
- [ ] Screenshot 2 — Action Log after several dispatches (subscribe counter visible)
- [ ] Screenshot 3 — Login form and decoded JWT (header / payload / signature + countdown)
- [ ] Screenshot 4 — Protected profile page after login
- [ ] Screenshot 5 — Automatic logout after token expiry
- [ ] Demo video — short walkthrough of both parts

---

## 8. References

- Redux Toolkit documentation — https://redux-toolkit.js.org
- Redux fundamentals (core concepts) — https://redux.js.org/tutorials/fundamentals/part-1-overview
- JWT introduction & debugger — https://jwt.io/introduction
- RFC 7519 — JSON Web Token (JWT) — https://datatracker.ietf.org/doc/html/rfc7519
- `jsonwebtoken` (Auth0) Node.js library — https://github.com/auth0/node-jsonwebtoken

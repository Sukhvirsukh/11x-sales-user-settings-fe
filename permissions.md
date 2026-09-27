# Permissions — API & Data Contract

Everything the frontend needs from the backend to drive access control, and
everything it sends back. Read the *Read* section to know what to return, the
*Write* section to know what you will receive, and the *Database* section for a
worked SQL example.

Frontend code this describes:

| File | Role |
| --- | --- |
| `src/features/auth/permissionSchema.ts` | Action vocabulary + the wire schema |
| `src/features/auth/permissions.ts` | Section catalog, parse / serialise helpers |
| `src/features/auth/permissionsDefaultData.ts` | Temporary per-role defaults |
| `src/features/auth/usePermissions.ts` | The single read path (`usePermissions` / `useCan`) |
| `src/features/auth/RouteGuard.tsx` | Route-level enforcement |
| `src/features/settings/roleAndAccess/roleHistory/` | The role form that writes permissions |

---

## 1. The model

A **capability** is a flat string built from a **section** and an **action**:

```text
<section>.<action>        e.g.  settings.roles.edit
```

- **Actions** are fixed: `view`, `create`, `edit`, `delete`.
- **Sections** may themselves contain dots (`settings.roles`). A section key is
  *everything before the last dot*, so `settings.roles.edit` splits into section
  `settings.roles` + action `edit`. Do not invent a different split.

### Sections (the full catalog)

| Section key | Label in the UI | Notes |
| --- | --- | --- |
| `overview` | Overview | `/` |
| `contacts` | Contacts | `/contacts` |
| `conversations` | Conversations | `/conversations` |
| `reports` | Reports | `/reports` |
| `chatSettings` | Chat settings | `/chat-settings` |
| `aiTraining` | AI training | `/ai-training` |
| `askMe` | Ask me | `/ask-me` |
| `settings.profile` | Basic details | Settings → Role & access |
| `settings.roles` | Team roles | the role history table |
| `settings.plan` | Plan | Settings → Plan |
| `settings.payments` | Payments | Settings → Payments |
| `settings.store` | Stores | Settings → Store |

Every section offers all four actions, so there are **48 possible capabilities**.
The backend should accept and store any combination; it does not have to validate
against this table (but doing so is recommended, see §7).

> **Create implies edit.** In the UI `create` and `edit` are one checkbox — when
> the user grants one, the frontend sends `true` for **both**. Treat them as
> independent columns in storage (the payload has separate keys), just expect
> them to move together.
>
> **The frontend gates on `create` alone.** Because create implies edit, every
> change affordance in the UI asks for `<section>.create` — a role with `create`
> can add *and* edit. The default sets (§6) therefore leave `edit` `false`; only
> the role form ever writes it, and it writes both keys together when its
> **Changes** box is toggled.

---

## 2. Reading permissions (GET)

### 2.1 The signed-in user — auth responses

`POST /api/auth/sign-in`, `POST /api/auth/sign-up` (and any profile refresh)
should include the user's permissions:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "usr_1",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+1 555 0100",
    "role": "admin",
    "permissions": [
      { "overview": { "view": true, "create": true, "edit": true, "delete": true } },
      { "settings.roles": { "view": true, "create": true, "edit": true, "delete": true } }
    ]
  }
}
```

- Required: `accessToken`. Everything inside `user` is optional.
- `user.role` is a plain string used for display. While the temporary role
  defaults are in force (§6), a **known** role (`ADMIN` / `EDITOR` / `MEMBER`)
  takes its grants from the frontend's own table and **ignores** `permissions`
  entirely. The payload is only read for an unrecognised role.
- `permissions` may therefore be omitted for a known role. For an unrecognised
  role, omitting it (or sending `null`) grants nothing.

### 2.2 The role history list

```http
GET /api/admin/users
Authorization: Bearer <token>
```

Optional query parameters are `search` and `cursor`. Return a cursor-paginated JSON object:

```json
{
  "items": [{
    "id": "usr_1",
    "ownerId": "own_9",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+1 555 0100",
    "role": "ADMIN",
    "status": true,
    "createdAt": "2026-09-01T10:15:00.000Z",
    "permissions": [
      { "overview": { "view": true, "create": true, "edit": true, "delete": true } },
      { "settings.roles": { "view": true, "create": false, "edit": false, "delete": false } }
    ]
  }],
  "nextCursor": null,
  "hasMore": false,
  "currentPage": 1,
  "totalPages": 1,
  "totalCount": 1,
  "limit": 10
}
```

Field notes:

| Field | Required | Used for |
| --- | --- | --- |
| `id` | yes | row identity, PATCH/DELETE URLs |
| `name`, `email`, `role` | yes | table columns (`role` is display-cased client-side, so any casing is fine) |
| `status` | yes | Active / Inactive badge |
| `createdAt` | yes | "Created at" column — **ISO 8601**; an unparseable value renders as `-` |
| `permissions` | yes | the permission matrix in the edit modal |
| `phone`, `ownerId` | declared | not displayed, but part of the typed response — send them |

`items` contains the user records. `nextCursor` and `hasMore` control forward navigation; the client does not send a page number.

### 2.3 The payload shape itself

`permissions` is an **array of single-key section objects**:

```json
[
  { "overview":  { "view": true, "create": false, "edit": false, "delete": false } },
  { "chatSettings": { "view": true, "create": true, "edit": true, "delete": false } },
  { "settings.roles": { "view": true, "create": true, "edit": true, "delete": false } }
]
```

Parsing rules the client applies:

- Each array entry is an object mapping `section → { action → boolean }`.
- Entries are merged, so you may split one section per entry (preferred) or send
  fewer entries. Missing sections/actions are treated as `false`.
- Non-boolean values are ignored.
- A single nested object is also accepted defensively
  (`{ "overview": { "view": true } }`), but **the array is the contract** — send
  the array.
- Sections the client does not recognise are **preserved** and echoed back on the
  next save, so adding a section on the backend first does not lose data.

---

## 3. Writing permissions (POST / PATCH)

The role form posts the whole record, with `permissions` already in the array
shape above.

```http
POST /api/admin/users          # create
PATCH /api/admin/users/:id     # update
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "EDITOR",
  "status": true,
  "permissions": [
    { "overview": { "view": true, "create": true, "edit": true, "delete": true } },
    { "settings.profile": { "view": true, "create": true, "edit": true, "delete": false } },
    { "settings.roles": { "view": true, "create": false, "edit": false, "delete": false } }
  ]
}
```

Notes:

- `name` is trimmed, `email` is trimmed + lowercased, `role` is **upper-cased**
  (`"editor"` → `"EDITOR"`) before sending.
- `status` is always sent as `true`; the form has no status field.
- Every one of the 12 catalog sections is always present, each with all four
  action keys (`false` where unticked). It is harmless but normal to receive
  `false` values.
- The response body is ignored — return `200`/`201` with the saved record (or
  `{ success: true }`). A non-2xx response surfaces `message` to the user as a
  toast, so return errors as `{ "message": "…" }` (a `string[]` is also joined
  and shown).

### Delete

```http
DELETE /api/admin/users/:id
DELETE /api/admin/users/bulk          # body: { "ids": ["usr_2", "usr_3"] }
```

The bulk endpoint is used when more than one row is selected; single deletes use
the `:id` form.

### Endpoint summary

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/sign-in` | returns `accessToken` + `user.permissions` |
| `POST` | `/api/auth/sign-up` | same |
| `GET` | `/api/auth/profile` | restores the current user and `user.permissions` after a page refresh |
| `PATCH` | `/api/auth/profile` | returns the updated `user.permissions` |
| `GET` | `/api/admin/users` | list records with `permissions` |
| `POST` | `/api/admin/users` | create |
| `PATCH` | `/api/admin/users/:id` | update |
| `DELETE` | `/api/admin/users/:id` | delete one |
| `DELETE` | `/api/admin/users/bulk` | delete many (`{ ids }`) |

Authenticated requests carry `Authorization: Bearer <jwt>`, where the token is
the one stored at sign-in under the `vitalb.jwt` localStorage key. The sign-in
and sign-up calls deliberately omit it (`auth: false`). The client prefixes every
path with `/api` and prepends `VITE_AUTH_API_BASE_URL` (see `.env`), so the full
URL is `<VITE_AUTH_API_BASE_URL>/api/admin/users`.

---

## 4. Database

`permissions` is arbitrary nested JSON, so a JSON column is the simplest correct
store — no extra tables, and the array round-trips exactly as posted.

```sql
CREATE TABLE users (
  id          text        PRIMARY KEY,
  owner_id    text        NOT NULL,
  name        text        NOT NULL,
  email       text        NOT NULL UNIQUE,
  phone       text,
  role        text        NOT NULL DEFAULT 'MEMBER',
  status      boolean     NOT NULL DEFAULT true,
  permissions jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX users_owner_id_idx ON users (owner_id);
```

### Read

```sql
SELECT id, owner_id, name, email, phone, role, status, created_at, permissions
FROM users
WHERE owner_id = $1
ORDER BY created_at DESC;
```

Respond with the map keyed by `id`, mapping `snake_case` → `camelCase`
(`owner_id` → `ownerId`, `created_at` → `createdAt`) and serialising
`created_at` as ISO 8601. `permissions` is already the array — return it as-is,
do **not** reshape it.

### Write

```sql
INSERT INTO users (owner_id, name, email, role, status, permissions)
VALUES ($1, $2, $3, $4, $5, $6::jsonb)
RETURNING *;

UPDATE users
SET name = $2, email = $3, role = $4, status = $5, permissions = $6::jsonb
WHERE id = $1 AND owner_id = $7
RETURNING *;
```

In Node the parameter is just the parsed body value:

```js
const permissions = JSON.stringify(body.permissions); // → jsonb
```

### Querying inside the column (optional)

Only needed if you want server-side reporting over capabilities:

```sql
-- everyone who can view the store page
SELECT id, name
FROM users
WHERE permissions @> '[{"settings.store": {"view": true}}]'::jsonb;
```

> **Heads-up on the data model.** The "role history" screen is currently wired to
> `/admin/users`, so one row = one user with a `role` string *and* its own
> `permissions`. That means permissions are stored per user, not per reusable
> role entity. If you want true role records (several users sharing one editable
> permission set), keep the same request/response shapes but resolve
> `user.permissions` from the user's assigned role — the frontend needs no
> change.

---

## 5. What the frontend enforces

### Routes (`handle.permission`, checked by `RouteGuard`)

| Route | Capability | Notes |
| --- | --- | --- |
| `/` | `overview.view` | |
| `/contacts` | `contacts.view` | covers all child tabs |
| `/conversations` | `conversations.view` | covers all child tabs |
| `/reports` | `reports.view` | |
| `/chat-settings` | `chatSettings.view` | |
| `/chat-settings/visibility` | `chatSettings.view` | |
| `/ai-training` | `aiTraining.view` | covers all child tabs |
| `/ask-me` | `askMe.view` | |
| `/settings/role-n-access` | `settings.profile.view` | |
| `/settings/plan` | `settings.plan.view` | |
| `/settings/payments` | `settings.payments.view` | |
| `/settings/store` | `settings.store.view` | |
| anything else | — | open to any signed-in user (the 404 page) |

A blocked visit redirects to the user's first reachable page (`getHomeRoute`);
if nothing is reachable the 403 page renders.

### Sidebar

A nav item is shown only when its `view` capability is granted:

```text
overview.view · contacts.view · conversations.view · reports.view
chatSettings.view · aiTraining.view · settings.profile.view · askMe.view
```

Settings tabs are filtered the same way on `settings.profile.view`,
`settings.plan.view`, `settings.payments.view`, `settings.store.view`.

### In-page gates currently in the UI

| Capability | Gates |
| --- | --- |
| `settings.roles.view` | the role history table |
| `settings.roles.create` | "Add role" button and the edit action on a row |
| `settings.roles.delete` | delete action, row selection, bulk delete |
| `settings.store.create` | "Add store" button and the edit action on a store row |
| `settings.store.delete` | delete action, row selection, bulk delete |
| `contacts.create` | "Add segment" button on the Segments tab |
| `contacts.delete` | delete action, row selection, bulk delete on both Contacts tabs |

**All other actions are stored but not yet used to hide anything.** The other
sections (`overview`, `conversations`, `reports`, `chatSettings`, `aiTraining`,
`askMe`) still show their create/edit/delete affordances regardless of the
grant, so those actions remain a backend authorization matter only.

> Hiding UI is a convenience, not security. The backend must enforce every
> capability on every endpoint regardless of what the payload says.

---

## 6. Temporary role defaults

`permissionsDefaultData.ts` currently **overrides** the API payload for any role
it knows: `authStore` loads that role's set from the file and ignores whatever
`permissions` the response carried. Only an unrecognised role falls back to the
payload, and an unknown role with no payload grants nothing. The defaults also
pre-fill the role form.

This is transitional and deliberately blunt — it makes a role's entire access
editable in one file while the API payload is still incomplete. `ADMIN`'s set is
a hand-written literal array so a single line can be removed to test what the
role loses in the UI. Once every response carries a complete, authoritative
`permissions`, the override should be removed so the payload wins again.

| Role | Default |
| --- | --- |
| `ADMIN` | `view`, `create` and `delete` on every section (36) |
| `EDITOR` | `view`, `create` and `delete` on every section outside `settings.*`, plus `settings.profile.view` and `settings.profile.create` (23) |
| `MEMBER` | `conversations.view`, `reports.view`, `reports.create`, `settings.profile.view`, `settings.profile.create` (5) |
| anything else | none (fails closed) |

Role matching is case-insensitive and trimmed, so `"admin"` / `" Admin "` work.

No default grants `edit`: the UI only reads `create`, and create implies edit, so
`create` alone expresses a section's change capability. The payload still has an
`edit` key for each action set, left `false` by the defaults.

### 6.1 Backend objects for the default roles

The backend can return the following objects as `user.role` and
`user.permissions` in the authentication response. Every section and action is
included explicitly so the effective access for each role is unambiguous.

> While the §6 override is in force these payloads are **not applied** for a
> known role — the frontend's own table wins. They are what each role should
> return once the override is removed.

#### Admin

```json
{
  "role": "ADMIN",
  "permissions": [
    { "overview": { "view": true, "create": true, "edit": false, "delete": true } },
    { "contacts": { "view": true, "create": true, "edit": false, "delete": true } },
    { "conversations": { "view": true, "create": true, "edit": false, "delete": true } },
    { "reports": { "view": true, "create": true, "edit": false, "delete": true } },
    { "chatSettings": { "view": true, "create": true, "edit": false, "delete": true } },
    { "aiTraining": { "view": true, "create": true, "edit": false, "delete": true } },
    { "askMe": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.profile": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.roles": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.plan": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.payments": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.store": { "view": true, "create": true, "edit": false, "delete": true } }
  ]
}
```

#### Editor

```json
{
  "role": "EDITOR",
  "permissions": [
    { "overview": { "view": true, "create": true, "edit": false, "delete": true } },
    { "contacts": { "view": true, "create": true, "edit": false, "delete": true } },
    { "conversations": { "view": true, "create": true, "edit": false, "delete": true } },
    { "reports": { "view": true, "create": true, "edit": false, "delete": true } },
    { "chatSettings": { "view": true, "create": true, "edit": false, "delete": true } },
    { "aiTraining": { "view": true, "create": true, "edit": false, "delete": true } },
    { "askMe": { "view": true, "create": true, "edit": false, "delete": true } },
    { "settings.profile": { "view": true, "create": true, "edit": false, "delete": false } },
    { "settings.roles": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.plan": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.payments": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.store": { "view": false, "create": false, "edit": false, "delete": false } }
  ]
}
```

#### Member

```json
{
  "role": "MEMBER",
  "permissions": [
    { "overview": { "view": false, "create": false, "edit": false, "delete": false } },
    { "contacts": { "view": false, "create": false, "edit": false, "delete": false } },
    { "conversations": { "view": true, "create": false, "edit": false, "delete": false } },
    { "reports": { "view": true, "create": true, "edit": false, "delete": false } },
    { "chatSettings": { "view": false, "create": false, "edit": false, "delete": false } },
    { "aiTraining": { "view": false, "create": false, "edit": false, "delete": false } },
    { "askMe": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.profile": { "view": true, "create": true, "edit": false, "delete": false } },
    { "settings.roles": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.plan": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.payments": { "view": false, "create": false, "edit": false, "delete": false } },
    { "settings.store": { "view": false, "create": false, "edit": false, "delete": false } }
  ]
}
```

---

## 7. Rules & edge cases

1. **Fail closed.** A malformed payload grants nothing and the user is bounced to
   their first reachable page. For an **unrecognised** role, never send
   `permissions: null` for one that should have access — send an empty array or
   omit the field. Known roles are unaffected while the §6 override is in force.
2. **Casing.** `role` is compared upper-cased by the frontend. `status`,
   `createdAt` and `permissions` are the only other fields it reads.
3. **Unknown sections survive round-trips.** The edit form keeps grants it does
   not render and posts them back, so you can add a section server-side before
   the UI ships.
4. **`create` and `edit` travel together** (§1). Do not be surprised if both
   flip. The UI reads `create` for every change affordance, so flipping `edit`
   alone changes nothing a user can see.
5. **Validate on write.** The frontend's schema only checks that values are
   booleans. The backend should whitelist known section/action keys (reject or
   drop the rest), since a hand-crafted request can otherwise store anything.
6. **Validate on read too.** Only return grants you intend to honour; the client
   will faithfully enable the matching routes.
7. **`VITE_AUTH_API_BASE_URL` is build-time.** Changing it requires restarting
   the Vite dev server / rebuilding.

---

## 8. Adding a new section or action

**New section** (a new page): add one entry to `PERMISSION_GROUPS` in
`src/features/auth/permissions.ts` and one `handle.permission` on the route. The
permissions table, the form defaults and the payload pick it up automatically —
no backend change needed beyond accepting the extra section key.

**New action** (something other than view/create/edit/delete): add it to
`PERMISSION_ACTIONS` in `permissionSchema.ts` and map it into a table column in
`Permissions.tsx`. Every section gains it, so the payload grows accordingly.

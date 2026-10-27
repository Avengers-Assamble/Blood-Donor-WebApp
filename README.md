<img width="847" height="264" alt="red-heart-on-heartbeat-line-260nw-2516752555" src="https://github.com/user-attachments/assets/0bed9cf6-c208-4374-b045-4dbfda778626" />

# Lifeline - Blood Donor Web App

A little of you. A lifeline for someone.

Lifeline is a college project that helps blood donors and people looking for blood find each other. Donors create a profile, people in need create a blood request, and an admin reviews everything before it is shared.

**Live site:** https://avengers-assamble.github.io/Blood-Donor-WebApp/

> **Important:** Lifeline supports coordination only, not emergency care. For urgent medical help, contact your treating hospital or local emergency services. Submitting a request does not guarantee blood availability.

---

## Features

Working now:
- Register and log in with email and password (Supabase Auth)
- Log out button and a top bar that shows the logged-in user's name
- Donor profile form that saves to the database
- Blood request form that saves to the database
- Row Level Security on every table, so users can only see and change their own data
- Admin role that is separate from normal users

In progress / planned:
- Admin pages with approve / reject review
- Blood banks page loaded from the database
- Password reset, private hospital document upload, audit logs

---

## Tech stack

- HTML, CSS and plain JavaScript (no framework, no build step)
- Supabase (Auth, Postgres database, Storage) using the CDN client
- GitHub Pages for free hosting

---

## Team

| Member | Owns | Files in this repo |
|---|---|---|
| Himangshu | Database, deployment, integration. Supabase tables and security rules, seed data, GitHub repo and Pages, merging everyone's work, final testing | `supabase.js`, `auth.js`,  `login.js`, `topbar.js`, `admin pages` |
| Aarohi | Landing page and overall look. Shared colors, fonts, navbar, footer, hero section | `index.html`, `home.html`, `style.css`, `Hero.jpg`, `register.js` |
| Ankita | Donor registration. The donor form, validation, success and error messages | `donor-profile.html`, `donor.js` |
| Afrida | Receiving blood. The blood request form and results | `receiver-profile.html`, `receiver.js` |
| Bisakha | Information pages and content. How and where to donate, FAQ, donation centers list | `banks.html`, information sections of `index.html` |

---

## Project structure

```
index.html            Landing page
register.html         Sign up page
login.html            Log in page
home.html             Home page after login
donor-profile.html    Donor profile form
receiver-profile.html Blood request form
banks.html            Blood banks list
thank-you.html        Shown after submitting the donor form
admin-users.html      Admin: users
admin-requests.html   Admin: blood requests
admin-review.html     Admin: approve / reject
admin-banks.html      Admin: blood banks

style.css             Shared styles
script.js             Small shared helpers (table filters, status changes)
supabase.js           Supabase connection (URL + publishable key)
auth.js               requireLogin(), requireAdmin(), logout()
register.js           Sign up logic
login.js              Log in logic
donor.js              Saves the donor form
receiver.js           Saves the blood request form
topbar.js             Shows the user's name, Admin link and Log out button
```

Script order at the bottom of every page that uses the database:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase.js"></script>
<script src="auth.js"></script>
<script src="script.js"></script>
<script src="topbar.js"></script>
<!-- then the page's own file, e.g. donor.js -->
```

---

## How it works

1. A visitor registers. Supabase creates the login, and a database trigger creates a matching row in `profiles`.
2. After logging in, the user can fill the donor form or the blood request form. Each form sends one row to Supabase.
3. New rows start with the status `pending`. Only an admin can approve or reject them.
4. The page guards (`requireLogin`, `requireAdmin`) only redirect people for a better experience. The real protection is Row Level Security in the database.

### Database tables

- `profiles` - one row per user (name, email, phone, role)
- `donor_profiles` - donor details, status and review fields
- `blood_requests` - patient and hospital details, status and review fields
- `blood_banks` - public list of blood banks, written by admins
- `audit_logs` - admin-only log of important actions

Security rules in short:
- Users can read, insert and update only their own rows
- Admins can read and update everything
- Blood banks can be read by anyone, written only by admins
- Audit logs are admin-only
- Users cannot change their own role or approve their own rows (database triggers)

---

## Run it yourself

1. Clone the repo:
   ```
   git clone https://github.com/Avengers-Assamble/Blood-Donor-WebApp.git
   ```
2. Create a free project at https://supabase.com and run the schema SQL in the SQL editor.
3. Open `supabase.js` and set:
   - `SUPABASE_URL` to your project URL (`https://xxxx.supabase.co`)
   - `SUPABASE_KEY` to the **publishable / anon** key
4. In Supabase go to Authentication, then URL Configuration:
   - Site URL: your GitHub Pages link
   - Redirect URLs: the same link with `/**`, and `http://127.0.0.1:5500/**` for local testing
5. For the demo, turn off "Confirm email" so the built-in email limit does not block sign ups.
6. Open the folder in VS Code and start it with the Live Server extension (port 5500).

**Never put the `service_role` key in this project.** Only the publishable / anon key is safe in front-end code.

### Make yourself an admin

Register on the site first, then run this in the Supabase SQL editor:

```sql
update profiles set role = 'admin' where email = 'YOUR_EMAIL';
```

### Deploy on GitHub Pages

1. Repo Settings, then Pages
2. Source: Deploy from a branch, branch `main`, folder `/ (root)`
3. Wait a minute or two and open the live link

---

## License

MIT. See the `LICENSE` file.

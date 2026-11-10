# Gamuna Foundation website

Next.js 14 (App Router) · TypeScript · Supabase (Postgres + Auth + Storage)

Every piece of text, program, event, news post, team member and photo on the public site is stored in
Supabase and can be edited by an admin from **/admin** — no code changes needed.

| Public page | Content comes from |
|---|---|
| Home | `site_settings` (banner, mission) + `pillars` |
| About | `site_settings` (vision, mission, location) + `team_members` |
| Programs & Events | `programs`, `events`, `site_settings` (partnerships) |
| News | `news` |
| Contact | `site_settings` (contact details); form saves to `messages` |
| Footer (all pages) | `site_settings` (contact details) |

## 1. Set up Supabase (about 10 minutes)

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor** and run, in this order:
   1. `supabase/schema.sql` — creates the tables, security rules and the image bucket
   2. `supabase/seed.sql` — loads the current website content
3. **Create the first admin login:** *Authentication → Users → Add user → Create new user*
   (enter an email and a strong password, tick *Auto Confirm User*).
4. **Make that user an admin** — back in the SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'YOUR-EMAIL@example.com';
   ```
   Repeat with another email to add more admins. To remove one:
   `delete from public.admins where user_id = (select id from auth.users where email = '...');`
5. *Authentication → Sign In / Providers* → turn **off “Allow new users to sign up”**.
   (Signing up alone never grants admin access, but there is no reason to leave it open.)
6. *Project Settings → API*: copy the **Project URL** and the **anon public** key.

## 2. Run it locally

```bash
cp .env.example .env.local      # then paste in the URL and anon key
npm install
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (sign in with the email/password from step 3)

## 3. Deploy (Vercel)

Push the project to GitHub, import it in Vercel, and add the same two environment variables
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Visit `/admin` on the live site to sign in.

## Using the admin dashboard

- **Site text** – contact details, home banner, mission, vision, partnerships text.
- **Home cards / Programs / Events / News / Team** – add, edit, delete, and hide items
  (untick *Visible on the website* to hide without deleting). Use the *Order* number to rearrange.
- **Events** move from *Upcoming* to *Past* automatically once their date passes.
- **Photos** – upload images when editing a team member or news post (max 5 MB; stored in Supabase Storage).
- **Messages** – everything sent through the contact form appears here, with an unread badge.

Changes appear on the live site immediately.

## Security notes

- The anon key in the browser is meant to be public. Protection comes from **Row Level Security**
  in `schema.sql`: visitors can only read published content and submit contact messages; only users
  listed in `public.admins` can change anything or read messages.
- There is no default password. Never put the Supabase **service_role** key in this project.
- Contact messages are saved to the database. To also get an email for each one, add a
  Supabase Database Webhook / Edge Function (or a service such as Resend) later.

## Project structure

```
supabase/schema.sql, seed.sql      database + security rules + starting content
src/app/(site)/…                   public pages
src/app/admin/…                    login + dashboard
src/components/admin/config.ts     which fields each admin form shows (add a field here)
src/lib/data.ts                    all database reads for the public site
src/middleware.ts                  keeps /admin behind login
public/assets/…                    logo, backgrounds, existing team photos
```

To add a new field to a content type: add the column in SQL, add it to the type in `src/lib/types.ts`,
add it to `src/components/admin/config.ts`, and display it in the relevant page.

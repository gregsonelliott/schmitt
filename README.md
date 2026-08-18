# steveschmitt.ca / Steve Schmitt for Ward 1

Campaign website for Steve Schmitt, candidate for County of Brant Ward 1
Councillor (Ontario municipal election, Monday, October 26, 2026).

Plain static HTML/CSS/JS with no build step and no dependencies. Everything lives in:

```
index.html      the entire one-page site (all copy lives here)
css/styles.css  styling (flyer-matched navy/blue branding)
js/main.js      mobile nav + contact form handling
images/         photos (see "Photos" below)
llms.txt        fact sheet for AI/answer engines
robots.txt      crawler policy (allow-all, incl. AI crawlers)
sitemap.xml     sitemap
```

Preview locally: `python3 -m http.server 8000` in the repo root, then open
http://localhost:8000.

---

## Deploying on DigitalOcean App Platform (one-time setup)

1. In the DigitalOcean dashboard: **Create → App** → connect GitHub → select
   `gregsonelliott/schmitt`, branch `main`, leave **Autodeploy** on.
2. DO detects a **static site**. No build command needed; output directory is
   the repo root (`/`). Choose the **Starter (free)** static-site tier. It
   covers a campaign site's traffic; upgrade only if DO reports bandwidth
   overages.
3. After the first deploy, open the app's **Settings → Domains** and add
   `steveschmitt.ca` and `www.steveschmitt.ca`. DO shows you the DNS records
   to create. At the domain registrar, either:
   - add the **CNAME/A records** DO displays (simplest, keeps DNS at the
     registrar), or
   - switch the domain's **nameservers** to DigitalOcean and manage DNS in DO.
4. SSL (https) is issued automatically via Let's Encrypt once DNS resolves.
5. From then on: **every push to `main` deploys automatically** within a
   minute or two.

## Email for steve@steveschmitt.ca

App Platform doesn't handle email. Set up **forwarding** so mail to
`steve@steveschmitt.ca` lands in the campaign's existing inbox:

- **Option A (easiest):** most .ca registrars include free email forwarding.
  Enable it in the registrar panel and forward `steve@` to the campaign Gmail.
- **Option B:** [ImprovMX](https://improvmx.com) free tier. Add their two MX
  records and one TXT record at your DNS host, then create the alias.

Send a test email before printing the address anywhere else.

## Contact form (Google Form backend)

The Get Involved form is the site's own styled form, but it posts to a **Google
Form**, so responses collect in a Google Sheet and email the campaign. No
monthly cost, no account to maintain beyond Google, and nothing extra hosted.

**One-time setup:**

1. At [forms.google.com](https://forms.google.com), signed in as the campaign
   Google account, create a form with exactly four questions, in this order:
   - `Name` (short answer)
   - `Email` (short answer)
   - `How can we help?` (multiple choice) with these three options typed
     **exactly** as they appear on the site:
     `I have a question`, `Request a lawn sign`, `I want to volunteer`
   - `Message` (paragraph)
2. In the form's **Responses** tab, click the Sheets icon to create the
   spreadsheet, and turn on **Get email notifications for new responses**.
3. Click **Send**, choose the link icon, and copy the form's public URL.
4. Open that public URL, right-click the page, choose **View page source**, and
   search for `entry.` You will find a numeric id beside each question, e.g.
   `entry.1234567890`. Note which id belongs to which question.
5. In `index.html`, replace the five placeholders in the Get Involved form:
   - `GOOGLE_FORM_ID` in the form's `action` (the long id from the public URL,
     the part between `/d/e/` and `/viewform`)
   - `entry.NAME_ID`, `entry.EMAIL_ID`, `entry.TOPIC_ID`, `entry.MESSAGE_ID`
     with the four real entry ids
6. Commit and push, then send a test submission and confirm it lands in the
   spreadsheet.

**Until step 5 is done the form still works**: it opens the visitor's email app
with the message pre-filled, addressed to steve@steveschmitt.ca.

**Notes:** the dropdown options on the site must keep matching the Google Form's
choices exactly, or those responses will be rejected. The form includes a hidden
spam-trap field that bots fill and people never see; those submissions are
discarded. If questions are ever added or reordered in the Google Form, re-check
the entry ids.

---

## Editing content

### Adding a news post

In `index.html`, find the `<section ... id="news">` block. Copy an existing
`<article class="news-item">...</article>`, update the `datetime`, visible
date, heading, and text, and place it **above** the older posts (newest
first). Commit and push, and the site redeploys automatically.

### Activating the endorsements section

The "What Neighbours Are Saying" section ships **commented out**. When you
have two or three real quotes:

1. In `index.html`, find the HTML comment beginning
   `============ ENDORSEMENTS`.
2. Replace each `[QUOTE PLACEHOLDER]`, `[Name]`, and `[descriptor]` with the
   real quote and attribution (get each person's OK first).
3. Move the `<section>...</section>` outside the surrounding `<!-- ... -->`
   comment so it renders.

### Photos

Drop these files into `images/` (the site shows tidy "photo coming soon"
placeholders for any that are missing):

| File | What it should be |
|---|---|
| `images/headshot.jpg` | Steve's headshot (highest-res original available; also used for Facebook share previews) |
| `images/meet-steve.jpg` | A candid of Steve at the homestead/garden/workshop (portrait orientation); appears beside the Meet Steve bio |
| `images/banner.jpg` | A wide crowd/community shot with Steve in it; full-width banner between Experience and Priorities. **This band hides itself automatically until the photo exists.** |
| `images/tree-dedication.jpg` | Memorial tree dedication photo |
| `images/remembrance-day.jpg` | Remembrance Day / Legion photo |
| `images/quilts-of-valour.jpg` | Quilts of Valour presentation photo |
| `images/hoodless-plaque.jpg` | Adelaide Hunter Hoodless plaque event photo |

Before committing, resize to ~1600px on the long edge and save as JPEG
quality ~80 so the site stays fast (any photo tool or
`magick photo.jpg -resize 1600x1600 -quality 80 out.jpg`).

---

## Launch checklist

- [ ] **Verify with Steve** the exact business names in the Meet Steve
      section and `llms.txt`: "Electra Modern Controls", "Nature's Way
      Gardens", and the proper name of the Tim Hortons camps role (likely Tim
      Horton Children's Foundation / Onondaga Farms).
- [ ] Add real photos to `images/` (see table above).
- [ ] Replace the Facebook links: the site currently links to a Facebook
      *search* for "Steve Schmitt Ward 1". Swap all occurrences in
      `index.html` with the page's real URL (open the page on Facebook and
      copy the address).
- [ ] Set up Formspree and replace `YOUR_FORM_ID` in `index.html`.
- [ ] Set up email forwarding for steve@steveschmitt.ca and send a test.
- [ ] Add endorsement quotes when collected (see above).
- [ ] Closer to the election: confirm advance-voting dates on
      [brant.ca](https://www.brant.ca/council-and-county-administration/elections/)
      and add them to the "How to Vote" section and a news post.
- [ ] After DNS goes live: check https://steveschmitt.ca loads with a valid
      certificate, submit a test through the form, and paste the URL into
      Facebook to confirm the share preview shows the headshot and tagline.

# steveschmitt.ca — Steve Schmitt for Ward 1

Campaign website for Steve Schmitt, candidate for County of Brant Ward 1
Councillor (Ontario municipal election, Monday, October 26, 2026).

Plain static HTML/CSS/JS — no build step, no dependencies. Everything lives in:

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
   the repo root (`/`). Choose the **Starter (free)** static-site tier — it
   covers a campaign site's traffic; upgrade only if DO reports bandwidth
   overages.
3. After the first deploy, open the app's **Settings → Domains** and add
   `steveschmitt.ca` and `www.steveschmitt.ca`. DO shows you the DNS records
   to create. At the domain registrar, either:
   - add the **CNAME/A records** DO displays (simplest — keeps DNS at the
     registrar), or
   - switch the domain's **nameservers** to DigitalOcean and manage DNS in DO.
4. SSL (https) is issued automatically via Let's Encrypt once DNS resolves.
5. From then on: **every push to `main` deploys automatically** within a
   minute or two.

## Email for steve@steveschmitt.ca

App Platform doesn't handle email. Set up **forwarding** so mail to
`steve@steveschmitt.ca` lands in the campaign's existing inbox:

- **Option A (easiest):** most .ca registrars include free email forwarding —
  enable it in the registrar panel and forward `steve@` to the campaign Gmail.
- **Option B:** [ImprovMX](https://improvmx.com) free tier — add their two MX
  records and one TXT record at your DNS host, then create the alias.

Send a test email before printing the address anywhere else.

## Contact form (Formspree)

The Get Involved form posts to Formspree (free tier: 50 submissions/month).

1. Create a free account at https://formspree.io using the campaign email.
2. Create a new form; set the notification email to `steve@steveschmitt.ca`.
3. Copy the form ID and replace `YOUR_FORM_ID` in `index.html`
   (search for `formspree.io/f/YOUR_FORM_ID`).

**Until that's done the form still works**: it opens the visitor's email app
with the message pre-filled, addressed to steve@steveschmitt.ca.

---

## Editing content

### Adding a news post

In `index.html`, find the `<section ... id="news">` block. Copy an existing
`<article class="news-item">...</article>`, update the `datetime`, visible
date, heading, and text, and place it **above** the older posts (newest
first). Commit and push — the site redeploys automatically.

### Activating the endorsements section

The "What Neighbours Are Saying" section ships **commented out**. When you
have 2–3 real quotes:

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
| `images/headshot.jpg` | Steve's headshot (highest-res original available — also used for Facebook share previews) |
| `images/meet-steve.jpg` | A candid of Steve at the homestead/garden/workshop (portrait orientation) — appears beside the Meet Steve bio |
| `images/banner.jpg` | A wide crowd/community shot with Steve in it — full-width banner between Experience and Priorities. **This band hides itself automatically until the photo exists.** |
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

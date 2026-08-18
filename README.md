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

The Get Involved form is the site's own styled form, but it posts to the
campaign's **Google Form**, so responses collect in a Google Sheet and notify by
email. Nothing to pay for, nothing extra hosted, and the site stays fully static.

**It is already connected.** Form:
`1FAIpQLSc-c4d5jOELzXwNmR_Zk9omh-rYjqgqms404AJTXMs9jvDqPA`

| Site field | Google entry id |
|---|---|
| Name | `entry.1507147912` |
| Email | `entry.2126689742` |
| Phone | `entry.919759348` |
| How can we help? | `entry.1832474592` |
| Message | `entry.1556363333` |

**Three things keep it working. Do not break them:**

1. **The dropdown values must match the Google Form exactly**, including
   capitalisation: `I Have a question`, `Request a Lawn Sign`,
   `I want to volunteer`. The site shows sentence case to visitors but submits
   the exact strings via each option's `value` attribute. Change the wording in
   Google Forms and you must change these too, or those responses are rejected.
2. **"Collect email addresses" is switched on** in the form settings, so every
   submission must also include a built-in `emailAddress` field. `js/main.js`
   adds it automatically from the Email box. If that setting is ever turned off,
   the Sheet loses its duplicate email column and this line can go.
3. **Phone is marked required in the Google Form** but optional on the site, so
   `js/main.js` submits `Not provided` when it is left blank. Better: open the
   Google Form and untick Required on the Phone question, which makes the Sheet
   read more honestly.

**Two tidy-ups worth doing in Google Forms:**

- The Message question has **no title**, so its Sheet column header is blank.
  Give it the title `Message`.
- Delete the rows named `TEST SUBMISSION - please delete` / `TEST 2`.

**If a question is ever added, renamed, or reordered**, re-check the entry ids:
open the form's public URL, then View Page Source and search for `entry.`.
Easier still, use the form editor's **⋮ → Get pre-filled link**, fill dummy
values, and read the ids out of the resulting URL.

Submissions are sent with `mode: 'no-cors'`, so the browser cannot read Google's
reply; the success message is optimistic. A hidden spam-trap field catches bots,
and their submissions are discarded.

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
| `images/banner-mobile.jpg` | A tighter crop of the banner scene for phones, so Steve stays in frame |
| `images/tree-dedication.jpg` | Memorial tree planting for former Mayor Ron Eddy (also the source of the banner crops) |
| `images/remembrance-day.jpg` | Remembrance Day / Legion photo |
| `images/quilts-of-valour.jpg` | Quilts of Valour presentation photo |
| `images/hoodless-plaque.jpg` | Adelaide Hunter Hoodless High Tea photo |
| `images/with-will-bouma-mpp-SDHS-levy.jpg` | With MPP Will Bouma at the SDHS levee |

Gallery photos open in a lightbox on click. To add one, drop the file in
`images/`, then copy a `<figure>` block inside the `<div class="gallery">` in
`index.html` and point it at the new file; it joins the lightbox automatically.

Before committing, resize to ~1600px on the long edge and save as JPEG
quality ~80 so the site stays fast (any photo tool or
`magick photo.jpg -resize 1600x1600 -quality 80 out.jpg`).

---

## Launch checklist

- [ ] **Verify with Steve** the exact business names in the Meet Steve
      section and `llms.txt`: "Electra Modern Controls", "Nature's Way
      Gardens", "Walter's Greenhouses and Garden Centre", and the proper name of
      the Tim Hortons camps role (likely Tim Horton Children's Foundation /
      Onondaga Farms).
- [ ] Add real photos to `images/` (see table above).
- [x] Facebook links point at the real Page,
      https://www.facebook.com/SteveSchmittWard1/
- [x] Google Form connected and the entry ids wired in (see "Contact form"
      above). Still to do there: delete the test rows, title the Message
      question, untick Required on Phone.
- [ ] Set up email forwarding for steve@steveschmitt.ca and send a test.
- [ ] Add endorsement quotes when collected (see above).
- [ ] Closer to the election: confirm advance-voting dates on
      [brant.ca](https://www.brant.ca/council-and-county-administration/elections/)
      and add them to the "How to Vote" section and a news post.
- [ ] After DNS goes live: check https://steveschmitt.ca loads with a valid
      certificate, submit a test through the form, and paste the URL into
      Facebook to confirm the share preview shows the headshot and tagline.

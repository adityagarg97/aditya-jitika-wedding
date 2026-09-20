# Aditya & Jitika — wedding invitation

An elegant, responsive React + Vite invitation, with glass panels, four looping films, chronological celebrations, venue directions and click-to-call RSVP details. Event and family details are transcribed from the supplied invitation PDF.

## Run locally

```sh
npm install
npm run dev
```

Create the production site with `npm run build`. Preview it with `npm run preview`.

## Music

The supplied `data/Ishq Hai.mp3` is included as `public/media/music.mp3`. The website copy starts 37 seconds into the original song and loops from that point at 40% volume. The original audio in `data/` is unchanged. The audio loads immediately and attempts audible autoplay on load. If the browser blocks autoplay, the first click, tap or keypress starts it; the music control also works directly. Once playback starts, interaction retries are removed so pausing stays respected. The hero is shown immediately, without an entrance screen. A music control lets guests pause or resume. The four background videos are always muted. To change the song, replace `public/media/music.mp3` and rebuild.

## GitHub Pages

1. Push this project to the `main` branch of your GitHub repository.
2. In repository **Settings → Pages**, select **GitHub Actions** as the build source.
3. The included workflow builds and publishes `dist` on each push to `main`. You can also run it manually from Actions.

Vite uses relative asset paths, so the same build supports a repository subpath, a user site, or a custom domain. There is no server or router configuration required.

For a custom domain later, configure it in repository **Settings → Pages**, add the DNS records specified by GitHub, and enable HTTPS after the domain is verified. See https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site . If you add a `CNAME` file, put it in `public/` with only your domain name.

## Editing

- Names, schedule, contacts and content: `src/main.jsx`.
- Colours, typography and responsive layout: `src/styles.css`.
- Optimised videos and still-image fallbacks: `public/media/`.
- Archived invitation: `public/invitation.pdf`.
- Original provided assets: `data/` (not included in the production build).

Directions use the exact Google Maps links decoded from the invitation QR codes; Ghurchari uses an address search because no separate QR was supplied. Reduced-motion preferences pause films by default; guests can also pause them manually. Fonts load from Google Fonts, with local serif and sans-serif fallbacks.

The PDF and phone numbers are intentionally included for invited guests; a public GitHub Pages site makes them publicly accessible. No RSVP submissions or private guest information are stored.

Ghurchari and the reception of the baraat share one wedding-day card on 11 December, with separate times and venue directions.

Event panels span the full video width with compact date/time boxes and inline directions. Standard overlays occupy about 20% of the phone video; the combined wedding overlay is taller to retain both venues. Calendar buttons and floating date badges are omitted.

## Invitation links

Use the deployed site URL with these query strings:

- `?invite=wedding`: wedding day only, including Ghurchari and reception of baraat.
- `?invite=engagement-wedding`: engagement and the wedding day.
- `?invite=all`: all four celebration days (also the default).

The heading, schedule and footer dates adapt to the selected invitation. These are presentation variants, not private access controls. There is no guest-facing version switcher. Query-based links work on GitHub Pages and a future custom domain without routing rewrites.

Original files in `data/`, the archived PDF and replaced Ganesh images are excluded from the repository; only the assets currently used by the site are published.

# Anone Bank

A static, local fintech demo built with HTML, CSS, and JavaScript.

## Hosting

This project is ready to host as a static site using GitHub Pages.

### GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, go to Settings > Pages.
3. Select the `gh-pages` branch or the `main` branch and `/ (root)` folder.
4. Save and wait for the site to deploy.

A GitHub Actions workflow is included to build and publish the project automatically.

### Optional GitHub Pages extras

- `404.html` provides a styled fallback page for missing routes.
- `CNAME` can be customized with your own domain name.

### Local Preview

You can also preview locally using a static server.

```powershell
cd C:\Users\HomePC\anone-bank
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Files

- `index.html` — main dashboard
- `login.html`, `signup.html`, `support.html` — app pages
- `script.js`, `login.js`, `signup.js`, `support.js` — application logic
- `styles.css` — styling

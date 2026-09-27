# Economy Live: World Economy Globe

A 3D globe that shades every country by a key economic indicator, using the IMF's World Economic Outlook figures (actual data from 2000, plus IMF forecasts about five years ahead).

**Indicators:** real GDP growth, inflation, unemployment, government debt, GDP per head and the current account balance. The country card also shows the budget balance and population.

**Features**
- **Year slider and Play button:** watch the 2009 financial crisis, the 2020 pandemic and the 2022 inflation spike move across the world. There are quick buttons for each.
- **Rankings:** the highest and lowest 10 countries, plus where the UK ranks and how it compares with the world, advanced economies and emerging economies.
- **Country card:** every indicator side by side with the UK, and a line chart from 2000 to the forecast years with the UK for comparison.
- **For each indicator:** a definition and three discussion questions.
- **Classroom mode:** bigger text for the board. There's also a flat-map option.
- **Links straight to a view:** add `?show=PCPIPCH&year=2022` to the address to open on inflation in 2022. The other indicator codes are `NGDP_RPCH` (growth), `LUR` (unemployment), `GGXWDG_NGDP` (government debt), `NGDPDPC` (GDP per head) and `BCA_NGDPD` (current account).

## Setup

1. Create a new GitHub repository, for example `economy-live`, and upload everything in this folder, **including the hidden `.github` folder**. On a Mac, press Cmd+Shift+. in Finder to show hidden folders.
2. Go to **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** and save.
3. Publish the site using either:
   - **GitHub Pages:** go to **Settings → Pages**, choose `main` and `/ (root)`, then save.
   - **Vercel:** import the repository. There's no build step, so leave the settings at their defaults.

The site works immediately, because `data/imf.json` already contains the April 2026 figures.

## Automatic updates

Every Monday, a GitHub Action runs `scripts/update-imf.mjs`, which downloads the latest IMF figures and saves them if they have changed. The IMF publishes new forecasts every April and October. To update straight away, go to the **Actions** tab, open **Update economic data** and click **Run workflow**.

If the IMF website can't be reached, the script keeps the last good copy, so the site never breaks.

## Files

| File | Purpose |
|---|---|
| `index.html` | The globe |
| `data/imf.json` | IMF figures (updated automatically) |
| `data/shape-ids.json` | Links the map's country shapes to IMF country codes |
| `scripts/update-imf.mjs` | Downloads the IMF data |
| `.github/workflows/update-data.yml` | Runs the update every Monday |

The other Economy Live parts we planned, the UK Dashboard and Economics in the News, can be added to this same repository later.

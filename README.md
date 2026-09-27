# Economy Live: World Economy Globe

A 3D globe that shades every country by an economic indicator, using IMF World Economic Outlook figures (from 2000, plus IMF forecasts about five years ahead) and World Bank World Development Indicators.

**Indicators, in four groups**

| Group | Measures | Source |
|---|---|---|
| Headline | Real GDP growth, inflation, unemployment, government debt, GDP per head, current account | IMF |
| Size | GDP (size of economy), GDP per head at PPP, share of world GDP | IMF |
| Development | Life expectancy, income inequality (Gini), extreme poverty ($3.00 a day), CO₂ per head | World Bank |
| Trade | Trade openness, exports, FDI inflows, remittances, and agriculture, industry and services as a share of GDP | World Bank |

World Bank figures lag by a year or two, and some (Gini, poverty) are only measured every few years. For each country the globe shows its latest figure up to the chosen year, and the card shows which year it's from in brackets. By default, rankings leave out places with fewer than 1 million people (for example Macao and Bermuda), which would otherwise top many tables.

**Features**
- **Year slider and Play button:** watch the 2009 financial crisis, the 2020 pandemic and the 2022 inflation spike move across the world. There are quick buttons for each.
- **Rankings:** the highest and lowest 10 countries, plus where the UK ranks and how it compares with the world, advanced economies and emerging economies.
- **Country card:** every indicator side by side with the UK, and a line chart from 2000 to the forecast years with the UK for comparison.
- **For each indicator:** a definition and three discussion questions.
- **Classroom mode:** bigger text for the board. There's also a flat-map option.
- **Links straight to a view:** add `?show=PCPIPCH&year=2022` to the address to open on inflation in 2022. Other codes include `NGDP_RPCH` (growth), `LUR` (unemployment), `GGXWDG_NGDP` (government debt), `NGDPDPC` (GDP per head) and `BCA_NGDPD` (current account).

## Setup

1. Create a new GitHub repository, for example `economy-live`, and upload everything in this folder, **including the hidden `.github` folder**. On a Mac, press Cmd+Shift+. in Finder to show hidden folders.
2. Go to **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** and save.
3. Publish the site using either:
   - **GitHub Pages:** go to **Settings → Pages**, choose `main` and `/ (root)`, then save.
   - **Vercel:** import the repository. There's no build step, so leave the settings at their defaults.

The site works immediately, because the data files already contain the latest figures.

## Automatic updates

Every Monday, a GitHub Action downloads the latest IMF and World Bank figures and saves them if they have changed. The IMF publishes new forecasts every April and October, and the World Bank adds new figures throughout the year. To update straight away, go to the **Actions** tab, open **Update economic data** and click **Run workflow**.

If either website can't be reached, the script keeps the last good copy, so the site never breaks.

## Files

| File | Purpose |
|---|---|
| `index.html` | The globe |
| `data/imf.json` | IMF figures (updated automatically) |
| `data/worldbank.json` | World Bank figures (updated automatically) |
| `data/shape-ids.json` | Links the map's country shapes to IMF country codes |
| `scripts/update-imf.mjs` | Downloads the IMF data |
| `scripts/update-worldbank.mjs` | Downloads the World Bank data |
| `.github/workflows/update-data.yml` | Runs the update every Monday |

The other Economy Live parts we planned, the UK Dashboard and Economics in the News, can be added to this same repository later.

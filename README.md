# Crypto Mining Fleet Card

A Home Assistant custom dashboard card for monitoring a crypto miner fleet. Display real-time statistics for online and offline miners with a beautiful, responsive UI.

![Crypto Mining Fleet Card preview](https://raw.githubusercontent.com/daylehouse/crypo-mining-fleet-card/main/src/baselayer.png)

## Features

- **Real-time Miner Status**: Display count of online and offline miners
- **Responsive Design**: Works on desktop, tablet, and mobile devices  
- **Easy Configuration**: Simple UI for entity selection
- **Home Assistant Integration**: Full support for Home Assistant Lovelace dashboard
- **Background Image**: Customizable background with baselayer.png

## Installation

### Via HACS (Recommended)

1. Open **HACS** in your Home Assistant instance
2. Go to **Dashboards** (formerly called Plugins)
3. Click the **+ Explore & Download Repositories** button
4. Search for **"Crypto Mining Fleet Card"**
5. Click **Download**
6. **Restart Home Assistant**

### Manual Installation

1. Clone this repository or download as ZIP
2. Copy the `dist/crypo-mining-fleet-card.js` file to your Home Assistant config:
   ```
   <config>/www/crypo-mining-fleet-card.js
   ```
3. Add the resource to your `ui-lovelace.yaml` or through the dashboard:
   ```yaml
   resources:
     - url: /local/crypo-mining-fleet-card.js
       type: module
   ```
4. Restart Home Assistant

## Configuration

Add the card to your Lovelace dashboard via UI or YAML:

```yaml
type: custom:crypto-miner-card
title: Crypto Mining Fleet
online_miners_entity: sensor.online_miners
offline_miners_entity: sensor.offline_miners
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Crypto Mining Fleet" | Card title |
| `online_miners_entity` | string | - | Entity ID for online miners sensor |
| `offline_miners_entity` | string | - | Entity ID for offline miners sensor |

## Development

### Prerequisites

- Node.js 16+
- npm

### Setup & Build

```bash
npm install
npm run build
```

### Build Checklist

Run this before pushing changes to ensure generated artifacts are up to date:

```bash
npm run build:checklist
```

### Development Mode

```bash
npm run dev
```

Watches source files and rebuilds on changes.

### Lint

```bash
npm run lint
```

## Project Structure

```
.
├── src/
│   ├── crypto-miner-card.ts    # Main card component
│   ├── editor.ts               # Configuration UI editor
│   ├── types.ts                # TypeScript type definitions
│   ├── assets.d.ts             # Asset type declarations
│   └── base.jpg                # Background image
├── dist/                       # Compiled output (distribution)
├── .github/workflows/          # CI/CD workflows
│   ├── hacs.yml               # HACS validation
│   └── build.yml              # Build workflow
├── hacs.json                   # HACS manifest
├── package.json               # Dependencies
├── webpack.config.js          # Build configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## Resources

- [Home Assistant](https://www.home-assistant.io/)
- [HACS](https://hacs.xyz/)
- [Lit Element Documentation](https://lit.dev/)

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

For issues or feature requests, please open an issue on GitHub.

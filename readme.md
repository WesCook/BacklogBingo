# Backlog Bingo

[Open the web app](https://wescook.ca/BacklogBingo/) to get started!

## Intro

Created for the **Tildes Backlog Burner** event, this app will generate a personalized bingo card.  The categories come from either prebuilt lists or your own provided JSON.  While originally designed to target backlogs, this app can be effectively used for any type of bingo card.

To generate a card, first select or provide a list of categories.  Then choose a game mode to customize how you'd like to play.  Finally, you can filter out any categories that don't suit you.  Once you're ready, click _Generate Card_ to create your personalized bingo card.

The card will be saved to your browser, and you can return to update it at any time.  Some built-in logic is included, such as detecting duplicate entries or satisfying win conditions.  A Markdown table will be automatically generated below the card for easy sharing to supported social media.

Once loaded, this app runs entirely in your browser.  None of your settings are stored server-side.  As such, please do not clear your browser data to avoid data loss.

## Features

- [Category lists](https://github.com/WesCook/BacklogBingo/wiki/Category-List) come included, or can be imported via file or URL
- [Group system](https://github.com/WesCook/BacklogBingo/wiki/Groups) to discourage similar categories from generating together
- [Dynamic categories](https://github.com/WesCook/BacklogBingo/wiki/Dynamic-Categories) for more unique combinations
- [Game rules](https://github.com/WesCook/BacklogBingo/wiki/Game-Rules) can be customized individually, or chosen as game modes
- Import and export generated cards
- Seeded cards, to sync up with friends
- Light and dark mode support
- Accessibility for mobile and keyboard navigation
- Duplicate entry and win detection logic
- Markdown table generation for easy sharing
- Delightful animations to make the process feel rewarding

## Development

This app is developed with Vue 3, uses the Vite server, and requires [Node.js](https://nodejs.org/) for installation.  To set up a local development environment, first clone the repo, then run the following commands in the root directory:

```
npm install
npm run dev
```

This repo is configured with GitHub Actions to automatically build and deploy the `/dist` output.  You can generate this folder locally for testing by running `npm run build`, and then `npm run preview` to serve it.

If you wish to fork this repo and also deploy to Github Pages, the config file `/.github/workflows/deploy.yml` will help you configure your own GitHub Actions.  Other deployment targets such as Netlify are described [in the Vite documentation](https://vite.dev/guide/static-deploy).

If changing the repository name, you will need to update the base path in `vite.config.js`.  If targeting a regular domain name without a subdirectory, `base` should be set to `/` or simply deleted.

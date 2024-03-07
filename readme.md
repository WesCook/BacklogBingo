# Backlog Bingo

[Open the web app](https://wescook.ca/BacklogBingo/) to get started!

## Explanation

Created for the **Tildes Backlog Burner** event, this app will generate a bingo card to help you complete your backlog.  For example, a bingo card could have a tile labelled "a game in a genre you don't normally play".  You would then play that game and fill in the respective tile.  The goal is to complete a bingo pattern of your choosing.

The app allows you to customize the game rules, select from a list of possible challenges, and will then generates a unique bingo card for you.  You can update your progress by returning to the app to record any games you've played, and print a table in Markdown for easy sharing online.

Once downloaded, this app runs entirely in your browser.  None of your settings are stored server-side.  As such, please do not clear browser data such as local storage to avoid data loss.

## Development

This app is developed with Vue 3, uses the Vite server, and requires [Node.js](https://nodejs.org/)/npm for installation.  To set up a local development environment, first clone the repo, then run the following commands in the root directory:

```
npm install
npm run dev
```

This repo is configured with GitHub Actions to automatically build and deploy the `/dist` output.  You can generate this folder locally for testing by running `npm run build`, and then `npm run preview` to serve it.

If you wish to fork this repo and also deploy to Github Pages, the config file `/.github/workflows/deploy.yml` will help you configure your own GitHub Actions.  Other deployment targets such as Netlify can be found [in the Vite documentation](https://vitejs.dev/guide/static-deploy).

If changing the repository name, you will need to update the base path in `vite.config.js`.  For example if targeting a regular domain name without a subdirectory, base should be set to `/`, or simply deleted.

# DdChordsPwa

SPA UI client for songs with chords. See [Deployed Site] for project's CI built template view.

## Client Tech

Frameworks involved in the development of the client itself.

### UI Framework

[Angular UI Framework] (>= v11) is used to build the client.

#### UI Experience

No additional UI frameworks.

#### Localization

The client is doesn't contain any localization at the moment.

### Testing

[Jest] is used for unit testing (using matching-snapshot testing for components).

### CI

Currently no continuous integration, manually deploying to [Firebase] for hosting.

```
npm install -g firebase-tools
npm install -g @angular/cli
npm run build
firebase login
firebase deploy
```

## Local Dev

Use `npm run build:watch` to watch-build the client in `dist/*`, concurrently run `npm start` to serve with `express`.

### Manual Deployment

Use `npm run build` for production build, then `firebase login` and `firebase deploy`.

### HTTPS

Create `key.pem` and `cert.pem` with (in GitBash) `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`.
You will be prompted with a few questions after entering the command.
Use `127.0.0.1` as value for `Common name` to later install the certificate in your OS's root certificate store or browser.
This generates a cert-key pair and it will be valid for 3650 days (about 10 years).

[angular ui framework]: https://angular.io
[deployed site]: https://dd-chords.web.app/
[firebase]: https://firebase.google.com/
[jest]: https://facebook.github.io/jest

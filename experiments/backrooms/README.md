# Backrooms Gesture Portal

An on-device interaction study using MediaPipe face and hand landmarks to control a WebGL scene.

## Privacy boundary

- Camera access begins only after an explicit click.
- Frames and landmarks stay in the current browser tab.
- No Gemini/API key, upload, analytics, storage, microphone, or location access is used.
- Switching tabs, leaving the page, or pressing **Stop Camera** stops the camera tracks.

## Local development

```bash
npm install
npm run dev
```

Run `npm run build` to write the static production bundle to
`public/lab/backrooms`.

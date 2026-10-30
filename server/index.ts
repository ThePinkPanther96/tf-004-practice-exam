import { createApp } from "./app.js";
import { Store } from "./store.js";
const store = new Store();
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";
const server = createApp(store).listen(port, host, () =>
  console.log(`OpenPrep is ready at http://${host}:${port}`),
);
function shutdown() {
  server.close(() => {
    store.close();
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

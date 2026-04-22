import createApp from "./app.js";

const app = createApp;

app.listen(3000, () => {
  console.info(`Server running on port : localhost:${config.PORT}`);
  console.info(`Environment : ${config.ENV}`);
});

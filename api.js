require('dotenv').config();
const app = require('./src/express.js');

app.listen(process.env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`API started on port ${process.env.API_PORT}`);
});

module.exports = app;

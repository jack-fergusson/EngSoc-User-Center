const app = require("./app.js");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Authentication Service running on ${PORT}`);
});

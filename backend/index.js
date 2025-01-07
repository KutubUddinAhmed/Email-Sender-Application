const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const emailRoutes = require("./Routes/email.routes.js");

const CORS = require("cors");
app.use(CORS());
// Define the home route
app.get("/", async (req, res) => {
  res.send("Welcome USer");
});

app.use(emailRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

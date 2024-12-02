const express = require(`express`);
const mongoose = require(`mongoose`);
require(`dotenv`).config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // or '*' to allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // allow cookies and authentication
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Mongoose connected successfully`);
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => console.log(`App listening on Port: ${PORT}`));

const routes = require("./Routes/Ebook_libraryRoutes");
app.use(routes);

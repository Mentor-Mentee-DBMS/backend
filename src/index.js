const express = require("express");
require("./db/mongoose");
const mentorRouter = require("./routers/mentor.router");
const menteeRouter = require("./routers/mentee.router");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(mentorRouter);
app.use(menteeRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const cors = require("cors"); // Import the cors package
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  credentials: true, // Enable credentials if needed (e.g., cookies)
}));

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/post", require("./routes/postRoute"));
app.use("/api/messages", require("./routes/messageRoute"));


app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

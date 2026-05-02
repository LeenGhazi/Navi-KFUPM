const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/bus-routes", require("./routes/busRouteRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/buildings", require("./routes/buildingRoutes"));
app.use("/api/about-page", require("./routes/aboutPageRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tech-requests", require("./routes/techRequestRoutes"));
app.use("/api/building-comments", require("./routes/BuildingCommentRoutes"));
app.use("/api/building-reviews", require("./routes/buildingReviewRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/path-requests", require("./routes/pathRequestRoutes"));
app.use("/api/map-categories", require("./routes/mapCategoryRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
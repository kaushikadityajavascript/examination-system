const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8085;

const cors = require("cors");
const swaggerDocument = require("./config/swagger");
const { connectDB } = require("./middlewares/dbConnect");
connectDB();
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const examinationRoutes = require("./routes/examination.routes");

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", examinationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

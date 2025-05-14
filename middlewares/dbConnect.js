const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  mongoose.connection.close();
};

module.exports = {
  connectDB,
  disconnectDB,
};

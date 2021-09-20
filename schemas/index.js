const mongoose = require("mongoose");

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      dbName: "tutormap",
    },
    (error) => {
      if (error) {
        console.log("MongoDB connection failed", error);
      } else {
        console.log("MongoDB connection success");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected. Trying to reconnect...");
  connect();
});

module.exports = connect;

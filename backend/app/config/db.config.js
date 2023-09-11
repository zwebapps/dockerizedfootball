// module.exports = {
//   MONGO_DB_USERNAME :  process.env.MONGO_DB_USERNAME || "Admin",
//   MONGO_DB_PASSWORD : process.env.MONGO_DB_PASSWORD || "Password123",
//   MONGO_DB_HOST : process.env.MONGO_DB_HOST || "0.0.0.0",
//   MONGO_DB_PORT : process.env.MONGO_DB_PORT || "27017",
//   MONGO_DB_DATABASE : process.env.MONGO_DB_DATABASE || "football",
//   secret: process.env.SECRET || "Thisismysecret",
// };

module.exports = {
  mongodb: {
    uri:
      "mongodb://" +
      process.env.MONGO_DB_USERNAME +
      ":" +
      process.env.MONGO_DB_PASSWORD +
      "@" +
      process.env.MONGO_DB_HOST +
      (process.env.MONGO_DB_PORT
        ? ":" + process.env.MONGO_DB_PORT + "/"
        : "/") +
      process.env.MONGO_DB_DATABASE +
      process.env.MONGO_DB_PARAMETERS,
  },
  secret: process.env.SECRET,
};
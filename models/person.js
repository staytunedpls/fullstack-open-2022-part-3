const mongoose = require("mongoose");
const mongo_url = process.env.MONGO_URI;

console.log("Connecting to", mongo_url);

mongoose
  .connect(mongo_url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: /\d{2,3}-\d+/,
      message:
        "Number should be formed of two parts that are separated by -, \
   the first part has two or three numbers and the second part also consists of numbers",
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

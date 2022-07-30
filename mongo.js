const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide password as argument");
  process.exit();
}

const password = process.argv[2];
const mongo_url = `mongodb+srv://staytuned:${password}@cluster0.csb6ok7.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  mongoose.connect(mongo_url).then((result) => {
    console.log("Connected to Mongo");
    console.log("phonebook:");
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    });
  });
} else if (process.argv.length == 5) {
  mongoose
    .connect(mongo_url)
    .then((result) => {
      console.log("Connected to Mongo");
      const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });
      return newPerson.save();
    })
    .then(() => {
      console.log("person added");
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  console.log("Cannot process passed arguments, please check");
  process.exit();
}

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("build"));

morgan.token("postInfo", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postInfo"
  )
);

const Person = require("./models/person");

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const requestedId = Number(request.params.id);
  const person = persons.find((p) => p.id === requestedId);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const request_body = request.body;
  if (!request_body.name || !request_body.number) {
    return response.status(400).json({ error: "no name or number in request" });
  } else {
    const newPerson = new Person({
      name: request_body.name,
      number: request_body.number,
    });
    newPerson.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const request_body = request.body;
  if (!request_body.name || !request_body.number) {
    return response.status(400).json({ error: "no name or number in request" });
  } else {
    Person.findOneAndUpdate(
      { name: request_body.name },
      { $set: { number: request_body.number } },
      { new: true }
    )
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  }
});

app.get("/info", (request, response) => {
  const date = new Date();
  const length_info = `<p>Phonebook has info for ${persons.length} people</p>`;
  const date_info = `<p>${date}</p>`;
  response.send(`${length_info}\n${date_info}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "id has wrong format" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

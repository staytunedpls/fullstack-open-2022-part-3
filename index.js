const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("build"))

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

app.delete("/api/persons/:id", (request, response) => {
  const requestedId = Number(request.params.id);
  persons = persons.filter((p) => p.id !== requestedId);
  response.status(204).end();
});

const generateNewId = () => {
  const maxId = 10000;
  return Math.floor(Math.random() * maxId) + 1;
};

app.post("/api/persons", (request, response) => {
  const request_body = request.body;
  if (!request_body.name || !request_body.number) {
    return response.status(400).json({ error: "no name or number in request" });
  } else if (persons.map((p) => p.name).includes(request_body.name)) {
    return response
      .status(409)
      .json({ error: "name already in the phonebook" });
  } else {
    const person = {
      id: generateNewId(),
      name: request_body.name,
      number: request_body.number,
    };
    persons = persons.concat(person);
    return response.json(person);
  }
});

app.get("/info", (request, response) => {
  const date = new Date();
  const length_info = `<p>Phonebook has info for ${persons.length} people</p>`;
  const date_info = `<p>${date}</p>`;
  response.send(`${length_info}\n${date_info}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

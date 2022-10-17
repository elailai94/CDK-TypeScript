import axios from "axios";
import express from "express";
import path from "path";

// Environment variables that need to get passed in
const port = process.env.SERVER_PORT;
const apiBase = process.env.API_BASE;

const app = express();
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.get("/", async (_request, response) => {
  const documents = await getDocuments();
  response.render("index", { documents });
});

app.listen(port, () =>
  console.log(`Document Management Web Server Started. Port: ${port}`)
);

// Call our deployed API
async function getDocuments() {
  const { data: results } = await axios.get(`${apiBase}/getDocuments`);

  return results;
}

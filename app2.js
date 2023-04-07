const { createServer } = require("http");
const { appendFile, readFile, createReadStream, read } = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const PORT = 5001;

const MovieRecc = new EventEmitter();

const server = createServer((req, res) => {
  const { url, method } = req;
  req.on("error", (err) => {
    console.error(err);
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ msg: "Invalid request 404" }));
    res.end();
  });
  const chunks = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
    console.log(chunks);
  });
  req.on("end", () => {
    if (url === "/movie_likes" && method === "POST") {
      const body = JSON.parse(Buffer.concat(dataChunksArray).toString());
      const newMovie = `${body.username}, ${body.movie}\n`;
      MovieRecc.emit("new movie!", newMovie, res);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ msg: "Successfully added movie" }));
      res.end();
    } else if (url === "/movie_likes" && method === "GET") {
      res.setHeader("Content-Type", "text/html");
      const readStream = createReadStream(
        path.join(__dirname, "./public/index.html")
      );
      readStream.pipe(res);
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ msg: "Not a valid endpoint" }));
      res.end();
    }
  });
});
server.listen(PORT, () =>
  console.log(`server is listening at local host ${PORT}`)
);

MovieRecc.on("new movie!", (newMovie, res) => {
  appendFile(path(__dirname, "./assets/movieList.csv"), newMovie, (err) => {
    if (err) {
      MovieRecc.emit("error", err, res);
      return;
    }
    console.log("File was updated");
  });
});

MovieRecc.on("error", (err, res) => {
  console.error(err);
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  res.write(
    JSON.stringify({ msg: "There was an error in creating new movie" })
  );
  res.end();
});

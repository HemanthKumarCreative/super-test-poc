const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.get("/run-tests", (req, res) => {
  exec(
    "npx mocha **/*.spec.js --reporter json > reports/test-results.json",
    (error, stdout, stderr) => {
      // Read the JSON report file
      fs.readFile("reports/test-results.json", "utf8", (err, data) => {
        if (err) {
          console.error(`readFile error: ${err}`);
          res.status(500).send(`Error reading report: ${err.message}`);
          return;
        }
        // Send the JSON data as the response
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(data);
      });
    }
  );
});

app.get("/health-check", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({ isServerHealthy: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

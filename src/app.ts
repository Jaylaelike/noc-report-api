import express, { Request, Response } from "express";
import mysql, { FieldPacket, QueryError } from "mysql2";
// const YAML = require("yaml");
// const swaggerUi = require("swagger-ui-express");
// const fs = require("fs");
// const file = fs.readFileSync("./swagger.yaml", "utf8");
// const swaggerDocument = YAML.parse(file);

var cors = require("cors");

require("dotenv").config();

const { HOST_SQL, USER_SQL, PASSWORD_SQL, DATABASE_SQL, PORT, DATABASE_SQL_USER } = process.env;

const app = express();
const port = 4000;
app.use(cors());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());

const pool = mysql.createPool({
  host: HOST_SQL,
  user: USER_SQL,
  port: parseInt(PORT || "3306"),
  password: PASSWORD_SQL,
  database: DATABASE_SQL,
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "utc",
  // dateStrings: true
});

const pool2 = mysql.createPool({
    host: HOST_SQL,
    user: USER_SQL,
    port: parseInt(PORT || "3306"),
    password: PASSWORD_SQL,
    database: DATABASE_SQL_USER,
    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: "utc",
    // dateStrings: true
    });

try {
  pool.getConnection((err: QueryError | null) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }
    console.log("Connected to database!");
  });

    pool2.getConnection((err: QueryError | null) => {
        if (err) {
        console.error("Error connecting to database:", err);
        return;
        }
        console.log("Connected to database!");
    });
} catch (error) {
  console.error("Error connecting to database:", error);
}

app.get("/api/station/all", async function (req: Request, res: Response) {
  try {
    pool.query(
      "SELECT * FROM `engineering_center_new` WHERE 1;",
      function (err: QueryError | null, results: any, fields: FieldPacket[]) {
        if (err) {
          console.error("Error executing the query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
      }
    );
  } catch (error) {
    console.error("Error executing the query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/api/station/:stationName", async function (req: Request, res: Response) {
    const stationName = req.params.stationName;
    try {
      pool.query(
        `SELECT * FROM engineering_center_new WHERE  Station_Thai = '${stationName}';`,
        function (err: QueryError | null, results: any, fields: FieldPacket[]) {
          if (err) {
            console.error("Error executing the query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.json(results);
          console.log(results); // results contains rows returned by server
          console.log(fields); // fields contains extra meta data about results, if available
        }
      );
    } catch (error) {
      console.error("Error executing the query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

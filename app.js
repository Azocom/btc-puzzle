import express from "express";
import { createConnection } from "mysql";
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

var connectSql = createConnection({
  host: "34.95.167.202",
  user: "acesso",
  password: "CFm7m9iP[nIzR5(",
  database: "diversos",
});

app.get("/", async (req, res) => {
  // await operation
  connectSql.query(`SELECT * FROM T_Diversos WHERE 1=1`, function (err, rows) {
    if (err) {
      res.send(err);
    }
    res.send("hello world", JSON.parse(rows));
  });
  // const listar = listar;
  // console.log("listar", listar);
  // res.send("hello world");
});

app.listen(4000, () => console.log("🚀 Server listening on port 4000!"));

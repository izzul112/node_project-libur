const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_sewa_alat_penyemprot"
});
db.connect(err => {
  if (err) throw err;
  console.log("Database connected");
});

const isAuthorized = (request, result, next) => {

    if (typeof request.headers["token"] == "undefined") {
      return result.status(403).json({
        success: false,
        message: "Unauthorized. Token is not provided"
      });
    }
  
    let token = request.headers["token"];
  
    jwt.verify(token, "SuperSecRetKey", (err, decoded) => {
      if (err) {
        return result.status(401).json({
          success: false,
          message: "Unauthorized. Token is invalid"
        });
        }
    });
  
    next();
};
  
app.post('/daftar', (req, res) => { 
    var data = {
      nama: req.body.nama,
      email: req.body.email,
      password: req.body.password,
      no_telepon: req.body.no_telepon
    };
    db.query("INSERT INTO pelanggan SET?", data, function (err, result) {
      // memasukkan data form ke tabel database
      if (err) throw err;
      // jika gagal maka akan keluar error
      else {
        res.json({
          message: "Data has been added"
        })
      }
    });
})
  
app.post('/login', (req, res) => { //membuat end point untuk login akun
    var email = req.body.email; // mengimpor email dari form
    var password = req.body.password; //mengimpor password dari form
    const sql = "SELECT * FROM pelanggan WHERE email = ? AND password = ?"; // mencocokkan data form dengan data tabel
    if (email && password) {
      // jika email dan password ada
      db.query(sql, [email, password], function (err, rows) {
        if (err) throw err;
        // jika error akan menampilkan errornya
        else if (rows.length > 0) {
          // jika kolom lebih dari 0
          jwt.sign( // mengenkripsi data menggunakan jwt
            { email, password },
            "SuperSecRetKey",
            {
              expiresIn: 60 * 60 * 7// waktu durasi token yang dikeluarkan
            },
            (err, token) => {
              res.send(token); // menampilkan token yang sudah ada
            }
          );
        } else {
          res.json({
            message: "email or password is incorrect"
          }) // jika semua if tidak terpenuhi maka menampilkan kalimat tersebut
        }
      });
    }
})
  
app.get("/", isAuthorized, (request, result) => {
    result.json({
      success: true,
      message: "Welcome"
    });
 });

// CRUD ALAT SEMPROT

app.post("/tambahAlat", isAuthorized, function (request, result) {
    let data = request.body;
  
    var alat = {
      ukuran: data.ukuran,
      stok: data.stok,
      harga_sewa: data.harga_sewa
    }
  
    db.query("INSERT INTO alat_semprot SET ?", alat, (err, result) => {
      if (err) throw err;
    });
  
    result.json({
      success: true,
      message: "Data has been added"
    });
});

app.put("/editAlat/:id", isAuthorized, function (req, res) {
    let data = // membuat variabel data yang berisi sintaks untuk mengupdate tabel di database
      'UPDATE alat_semprot SET ukuran="' +
      req.body.ukuran +
      '", stok="' +
      req.body.stok +
      '", harga_sewa="' +
      req.body.harga_sewa +
      '" WHERE id=' +
      req.params.id;
    db.query(data, function (err, result) { // mengupdate data di database
      if (err) throw err;
      // jika gagal maka akan keluar error
      else {
        result.json({
          success: true,
          message: "Data has been updated"
        });
      }
    });
});

app.delete("/deleteAlat/:id", isAuthorized, function (req, res) { // membuat end point delete
    let id = "DELETE FROM alat_semprot WHERE id=" + req.params.id;
  
    db.query(id, function (err, result) { // mengupdate data di database
      if (err) throw err;
      // jika gagal maka akan keluar error
      else {
        res.json({
          success: true,
          message: "Data has been Deleted"
        });
      }
    });
});

app.listen(port, () => {
    console.log('Aplikasi berjalan di ' + port)
})
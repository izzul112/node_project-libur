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

// LOGIN ADMIN

const isAdmin = (request, result, next) => {

  if (typeof request.headers["admin"] == "undefined") {
    return result.status(403).json({
      success: false,
      message: "Unauthorized. Token is not provided"
    });
  }

  let token = request.headers["admin"];

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

app.post('/loginAdmin', (req, res) => { //membuat end point untuk login akun
  var username = req.body.username; // mengimpor email dari form
  var password = req.body.password; //mengimpor password dari form
  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?"; // mencocokkan data form dengan data tabel
  if (username && password) {
    // jika email dan password ada
    db.query(sql, [username, password], function (err, rows) {
      if (err) throw err;
      // jika error akan menampilkan errornya
      else if (rows.length > 0) {
        // jika kolom lebih dari 0
        jwt.sign( // mengenkripsi data menggunakan jwt
          { username, password },
          "SuperSecRetKey",
          {
            expiresIn: 60 * 60 * 7// waktu durasi token yang dikeluarkan
          },
          (err, admin) => {
            res.send(admin); // menampilkan token yang sudah ada
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

app.get("/admin", isAdmin, (request, result) => {
  result.json({
    success: true,
    message: "Welcome"
  });
});

// LOGIN USER

const isUser = (request, result, next) => {

  if (typeof request.headers["user"] == "undefined") {
    return result.status(403).json({
      success: false,
      message: "Unauthorized. Token is not provided"
    });
  }

  let token = request.headers["user"];

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
  let email = req.body.email;

  const sql = "SELECT * FROM pelanggan WHERE email = ?";
  if (email) {
    db.query(sql, [email], function (err, rows) {
      if (err) throw err;

      else if (rows.length > 0) {
        res.json({
          message: "EMAIL TERSEBUT SUDAH DIGUNAKAN"
        })
      }
      else {
        const data = {
          nama: req.body.nama,
          email: req.body.email,
          password: req.body.password,
          no_telepon: req.body.no_telepon
        }

        db.query("INSERT INTO pelanggan SET?", data, function (err, result) {
          // memasukkan data form ke tabel database
          if (err) throw err;
          // jika gagal maka akan keluar error
          else {
            res.json({
              message: "DATA SUKSES DITAMBAH"
            })
          }
        });
      }
    })
  }
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
          (err, user) => {
            res.send(user); // menampilkan token yang sudah ada
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

app.get("/", isUser, (request, result) => {
  result.json({
    success: true,
    message: "Welcome"
  });
});

// untuk jika ada suatu endpoint yang ingin supaya yang mengakses bisa admin atau user

const isAuth = (request, result, next) => {
  if (isUser || isAdmin) {
    next();
  }
  else {
    result.json({
      success: false,
      message: "data salah"
    });
  }
}

// CRUD ALAT SEMPROT

app.post("/tambahAlat", isAdmin, function (request, result) {
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
    message: "DATA SUKSES DITAMBAH"
  });
});

app.get("/tampilkanAlat/:id", isAdmin, (req, res) => {
  db.query(`SELECT * FROM alat_semprot WHERE id = ` + req.params.id + ``,
    (err, result) => {
      if (err) throw err;

      res.json({
        message: "MENAMPILKAN DATA ALAT SEMPROT BERDASAR ID",
        data: result
      });
    }
  );
});

app.get("/tampilkanSemuaAlat", isAuth, (req, res) => {
  db.query(`SELECT * FROM alat_semprot`,
    (err, result) => {
      if (err) throw err;

      res.json({
        message: "MENAMPILKAN SEMUA DATA ALAT SEMPROT",
        data: result
      });
    })
})

app.put("/editAlat/:id", isAdmin, function (req, res) {
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
      res.json({
        success: true,
        message: "DATA SUKSES DIEDIT"
      });
    }
  });
});

app.delete("/deleteAlat/:id", isAdmin, function (req, res) { // membuat end point delete
  let id = "DELETE FROM alat_semprot WHERE id=" + req.params.id;

  db.query(id, function (err, result) { // mengupdate data di database
    if (err) throw err;
    // jika gagal maka akan keluar error
    else {
      res.json({
        success: true,
        message: "DATA SUKSES DIHAPUS"
      });
    }
  });
});

// CRUD PELANGGAN

app.get('/getPelanggan/:id', isAdmin, (req, res) => {
  let sql = `
      SELECT * FROM pelanggan
      WHERE id = `+ req.params.id + `
      LIMIT 1
  `

  db.query(sql, (err, result) => {
    if (err) throw err

    res.json({
      message: "SUKSES METAMPILKAN PELANGGAN BERDASAR ID",
      data: result[0]
    })
  })
})

app.get("/tampilkanSemuaPelanggan", isAdmin, (req, res) => {
  db.query(`SELECT * FROM pelanggan`,
    (err, result) => {
      if (err) throw err;

      res.json({
        message: "MENAMPILKAN SEMUA DATA PELANGGAN",
        data: result
      });
    })
})

app.put("/editPelanggan/:id", isAuth, function (req, res) {
  let data =
    'UPDATE pelanggan SET nama="' +
    req.body.nama +
    '", email="' +
    req.body.email +
    '", password="' +
    req.body.password +
    '", no_telepon="' +
    req.body.no_telepon +
    '" WHERE id=' +
    req.params.id;
  db.query(data, function (err, result) {
    if (err) throw err;

    else {
      res.json({
        success: true,
        message: "DATA SUKSES DIUPDATE"
      });
    }
  });
});

app.delete('/deletePelanggan/:id', isAdmin, (req, res) => {
  let sql = `
      DELETE FROM pelanggan
      WHERE id = '`+ req.params.id + `'
  `

  db.query(sql, (err, result) => {
    if (err) throw err

    res.json({
      message: "DATA SUKSES DIHAPUS",
      data: result
    })
  })
});

// TRANSAKSI

app.post("/tambahTransaksi/:id/take", isAuth, (req, res) => {
  let data = req.body;

  db.query(
    `
      INSERT INTO transaksi_alat_semprot (id_pelanggan, id_alat_semprot, jumlah, harga_sewa, total_harga, status)
      VALUES ('` +
    data.id_pelanggan +
    `', '` +
    req.params.id +
    `', '` +
    data.jumlah +
    `', '` +
    data.harga_sewa +
    `', '` +
    data.jumlah +
    `' * '` +
    data.harga_sewa +
    `', 'disewa')
          `,
    (err, result) => {
      if (err) throw err;
    }
  );

  db.query(
    `
      UPDATE alat_semprot
      SET stok = stok - '` +
    data.jumlah +
    `'
      WHERE id = '` +
    req.params.id +
    `'
      `,
    (err, result) => {
      if (err) throw err;
    }
  );

  res.json({
    message: "BERHASIL TAMBAH TRANSAKSI ALAT SEMPROT"
  });
});

app.get("/pelanggan/:id/tampilkanTransaksiBerdasarID", isAdmin, (req, res) => {
  let data = req.params.id;
  db.query(`SELECT * FROM transaksi_alat_semprot WHERE transaksi_alat_semprot.id_pelanggan = ` + data,
    (err, result) => {
      if (err) throw err;

      res.json({
        message: "MENAMPILKAN DATA ALAT SEMPROT YANG DISEWA BERDASAR ID Pelanggan",
        data: result
      });
    }
  );
});

app.get("/tampilkanSemuaTransaksi", isAdmin, (req, res) => {
  db.query(`SELECT * FROM transaksi_alat_semprot`,
    (err, result) => {
      if (err) throw err;

      res.json({
        message: "MENAMPILKAN SEMUA DATA TRANSAKSI",
        data: result
      });
    })
})

app.put("/editTransaksi/:id", isAdmin, function (req, res) {

  db.query(
    `
    UPDATE alat_semprot
    SET stok = stok + '` +
    (req.body.jumlahAwal - req.body.jumlahAkhir) +
    `'
    WHERE id = '` +
    req.body.id_alat_semprot +
    `'
    `,
    (err, result) => {
      if (err) throw err;
    }
  );

  let status =
    'UPDATE transaksi_alat_semprot SET id_pelanggan="' +
    req.body.id_pelanggan +
    '", id_alat_semprot="' +
    req.body.id_alat_semprot +
    '", jumlah="' +
    req.body.jumlahAkhir +
    '", harga_sewa="' +
    req.body.harga_sewa +
    '", total_harga="' +
    req.body.harga_sewa * req.body.jumlahAkhir +
    '" WHERE id=' +
    req.params.id;
  db.query(status, function (err, result) {
    if (err) throw err;

    else {
      res.json({
        success: true,
        message: "DATA SUKSES DIEDIT"
      });
    }
  });
});

app.put('/pengembalianAlatSemprot/:id', isAuth, function (req, res) {
  let data = req.body;

  db.query(
    `
    UPDATE alat_semprot
    SET stok = stok + '` +
    data.jumlah +
    `'
    WHERE id = '` +
    data.id +
    `'
    `,
    (err, result) => {
      if (err) throw err;
    }
  );

  db.query(
    `
        UPDATE transaksi_alat_semprot
        SET status = 'kembali'
        WHERE id = '` +
    req.params.id +
    `'
        `,
    (err, result) => {
      if (err) throw err;
    }
  );

  res.json({
    message: "SUKSES DIKEMBALIKAN"
  });
})

app.delete("/deleteTransaksi/:id", isAdmin, function (req, res) {
  // membuat end point delete
  let id = "DELETE FROM transaksi_alat_semprot WHERE id=" + req.params.id;

  db.query(id, function (err, result) {
    // mengupdate data di database
    if (err) throw err;
    // jika gagal maka akan keluar error
    else {
      res.json({
        success: true,
        message: "DATA SUKSES DIHAPUS"
      });
    }
  });
});

app.listen(port, () => {
  console.log('Aplikasi berjalan di ' + port)
})

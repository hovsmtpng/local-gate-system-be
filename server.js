// Section 1
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const multer = require("multer");

// Section 2
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/fetchImage', express.static('./assets/logo'));

// Section 3

// var upload = multer({ dest: './assets/logo'})
// var type = upload.single('file')

app.get("/", (req, res) => {
  res.send("<h1>Server Page</h1>");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/logo");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "logo" + path.extname(file.originalname)
    );
  },
});

const uploadImg = multer({ storage: storage }).single("file");
// console.log(uploadImg)

// var upload = multer({dest:'./assets/logo'});

// app.post('/logo', uploadImg, function(req, res) {
//   console.log(req.body.logo)

//  res.send("file saved on server");
//  });

app.post("/createsettingjson", uploadImg, (req, res) => {
  let inputText = `[{
    "headerName": "${req.body.headerName}",
    "inOut": "${req.body.inOut}",
    "terminalName": "${req.body.terminalName}",
    "gateName": "${req.body.gateName}",
    "stid": "${req.body.stid}",
    "NumberCopied": "${req.body.NumberCopied}",
    "logo": "${req.body.logo}"
  }]`;
  console.log("inp nya",inputText);
  fs.writeFile("settings_docs/local-settings.json", inputText, function (err) {
    if (err) {
      return console.log(err);
    } else {
      res.status(200).json({
        code: "001",
        msg: "Data Local Setting Berhasil disimpan",
        data: req.body,
      });
      console.log("The file was saved!");
    }
  });
});

app.get("/readsettingjson", (req, res) => {
  fs.readFile(
    "settings_docs/local-settings.json",
    "utf8",
    function (err, data) {
      // Display the file content
      if (err) {
        console.log(err);
      } else {
        let result = JSON.parse(data);
        res.status(200).json({
          code: "001",
          msg: "Data Header Found, Feel Free to Use It..",
          data: result,
        });
      }
    }
  );
});


app.post("/SaveLogLastData", (req, res) => {
  let dirLastDataJSON = `logger/LAST DATA/`;
  let defaultLastDataJSON = `{"LastData":[]}`;

  var MyDate = new Date();
  var ScanDate;

  MyDate.setDate(MyDate.getDate());

  ScanDate =
    ("0" + MyDate.getDate()).slice(-2) +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    MyDate.getFullYear();

  const { truck_no, container_no, gate_time } = req.body;

  let ndata = `{
  "truck_no": "${req.body.truck_no}",
  "container_no": "${req.body.container_no}",
  "gate_time": "${req.body.gate_time}"
}`;

  try {
    if (!fs.existsSync(dirLastDataJSON)) {
      try {
        fs.mkdirSync(dirLastDataJSON);
        fs.writeFile(
          dirLastDataJSON + ScanDate + ".json",
          defaultLastDataJSON,
          function (err) {
            if (err) {
              return console.log(err);
            } else {
              fs.readFile(
                dirLastDataJSON + ScanDate + ".json",
                "utf8",
                function (err, data) {
                  // Display the file content
                  if (err) {
                    console.log(err);
                  } else {
                    var obj = JSON.parse(data);
                    var nobj = JSON.parse(ndata);
                    obj["LastData"].push(nobj);
                    jsonStr = JSON.stringify(obj);
                    fs.writeFile(
                      dirLastDataJSON + ScanDate + ".json",
                      jsonStr,
                      function (err) {
                        if (err) {
                          return console.log(err);
                        } else {
                          console.log("Last Data Saved!");
                        }
                      }
                    );
                  }
                }
              );
              console.log("The Log Last Data JSON file was saved !");
            }
          }
        );
        res.status(200).json({
          code: "001",
          msg: "JSON Folder successfully created and the Last Data JSON file was saved !",
          data: req.body,
        });
      } catch (error) {}
    } else {
      if (!fs.existsSync(dirLastDataJSON + ScanDate + ".json")) {
        fs.writeFile(
          dirLastDataJSON + ScanDate + ".json",
          defaultLastDataJSON,
          function (err) {
            if (err) {
              return console.log(err);
            } else {
              console.log("Initial File JSON!");
            }
          }
        );
        fs.readFile(
          dirLastDataJSON + ScanDate + ".json",
          "utf8",
          function (err, data) {
            // Display the file content
            if (err) {
              console.log(err);
            } else {
              var obj = JSON.parse(data);
              var nobj = JSON.parse(ndata);
              obj["LastData"].push(nobj);
              jsonStr = JSON.stringify(obj);
              fs.writeFile(
                dirLastDataJSON + ScanDate + ".json",
                jsonStr,
                function (err) {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log("Last Data Saved!");
                    res.status(200).json({
                      code: "001",
                      msg: "JSON File successfully created and the Last Data JSON file was saved !",
                      data: req.body,
                    });
                  }
                }
              );
              console.log("The Log file was saved!");
            }
          }
        );
      } else {
        fs.readFile(
          dirLastDataJSON + ScanDate + ".json",
          "utf8",
          function (err, data) {
            // Display the file content
            if (err) {
              console.log(err);
            } else {
              var obj = JSON.parse(data);
              var nobj = JSON.parse(ndata);
              obj["LastData"].push(nobj);
              jsonStr = JSON.stringify(obj);
              fs.writeFile(
                dirLastDataJSON + ScanDate + ".json",
                jsonStr,
                function (err) {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log("Last Data Saved!");
                  }
                }
              );
              console.log("The Log file was saved!");
            }
          }
        );
        res.status(200).json({
          code: "001",
          msg: "The Log Last Data was saved into existing JSON file!",
          data: req.body,
        });
      }
    }
  } catch (error) {}
});

app.get("/ReadLogLastData", (req, res) => {
  var MyDate = new Date();
  var ScanDate;

  MyDate.setDate(MyDate.getDate());

  ScanDate =
    ("0" + MyDate.getDate()).slice(-2) +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    MyDate.getFullYear();

  // let dirLastDataJSON = `settings_docs/LAST DATA/`;
  let dirLastDataJSON = `logger/LAST DATA/`;

  if (!fs.existsSync(dirLastDataJSON + ScanDate + ".json")) {
    res.status(200).json({
      code: "001",
      msg: "Direktori " + ScanDate + ".txt tidak ditemukan",
    });
    // console.log("Data Detail is Empty");
  } else {
    fs.readFile(
      dirLastDataJSON + ScanDate + ".json",
      "utf8",
      function (err, data) {
        // Display the file content
        if (err) {
          console.log(err);
        } else {
          let result = JSON.parse(data);
          res.status(200).json({
            code: "001",
            msg: "Log Last Data Sukses GIN GOUT or FAILED " + ScanDate,
            data: result,
          });
        }
      }
    );
  }
});

app.post("/SaveLogGateInOutFail", (req, res) => {
  const {
    Status,
    Lane,
    scanRFIDTime,
    RFIDNumb,
    ReadrfidDate,
    GateTimes,
    truck,
    containerNumb,
    CMSEIRDatePrint,
    STIDIntegrasiDate,
    successDate,
    FailInfo,
  } = req.body;

  if(FailInfo === "01"){
    resFailInfo = "Proses Gate Berhasil";
  } else if(FailInfo === "02"){
    resFailInfo = "STID Belum Terdaftar";
  } else if(FailInfo === "03"){
    resFailInfo = "Truk Belum Terasosisasi";
  }else if(FailInfo === "04"){
    resFailInfo = "Gagal Proses Gate, Mohon Cek di Palapa";
  } else if(FailInfo === "05"){
    resFailInfo = "Gate Manager Gagal Dieksekusi (Token not Authorize)";
  } else {
    resFailInfo = "Check Gate System";
  }

  let logdatatxt = `Scan RFID | ${scanRFIDTime}
RFID Terbaca ${RFIDNumb} | ${ReadrfidDate}
Proses Gate ${Status} Dilakukan | ${GateTimes}
${Status} Proses Gate. Truck ${truck} Container ${containerNumb} | ${GateTimes}
Cetak ${Lane} ${Status} | ${CMSEIRDatePrint}
Proses Integrasi STID ${Status} | ${STIDIntegrasiDate}
Proses Gate ${Status} | ${successDate}
Keterangan | ${resFailInfo}
`;

  let logdatajson = `{
  "Status": "${Status}",
  "Lane": "${Lane}",
  "scanRFIDTime": "${scanRFIDTime}",
  "RFIDNumb": "${RFIDNumb}",
  "ReadrfidDate": "${ReadrfidDate}",
  "GateTimes": "${GateTimes}",
  "truck": "${truck}",
  "containerNumb": "${containerNumb}",
  "CMSEIRDatePrint": "${CMSEIRDatePrint}",
  "STIDIntegrasiDate": "${STIDIntegrasiDate}",
  "successDate": "${successDate}",
  "FailInfo":"${resFailInfo}"
}`;

  var MyDate = new Date();
  var ScanDate;

  MyDate.setDate(MyDate.getDate());

  ScanDate =
    ("0" + MyDate.getDate()).slice(-2) +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    MyDate.getFullYear();

  let dirGInGOutFailJSON = `settings_docs/logsGInGOutFailJSON/`;
  // let dirGInGOutFailJSON = `logger/logsGInGOutFailJSON/`;
  let defaultJSON = `{"logsGInGOutFail":[]}`;

  let dirGInGOutFailTXT = `logger/logsGInGOutFailTXT/`;
  let defaultTXT = `Log File Sukses Gate In, Sukses Gate Out dan Gagal Proses Gate Tanggal ${ScanDate}
`;
  // for TXT
  if (!fs.existsSync(dirGInGOutFailTXT)) {
    try {
      fs.mkdirSync(dirGInGOutFailTXT);
      fs.writeFile(
        dirGInGOutFailTXT + ScanDate + ".txt",
        defaultTXT + "\n" + logdatatxt,
        function (err) {
          if (err) {
            return console.log(err);
          } else {
            res.status(200).json({
              code: "001",
              msg: "TXT and JSON Folder successfully created and the Log Gate Process TXT and JSON file was saved ! -> logger/logsGInGOutFail/[date.txt]",
              data: req.body,
            });
            console.log("The Log Gate Process txt file was saved !");
          }
        }
      );
    } catch (error) {}
  } else {
    if (!fs.existsSync(dirGInGOutFailTXT + ScanDate + ".txt")) {
      fs.writeFile(
        dirGInGOutFailTXT + ScanDate + ".txt",
        defaultTXT,
        function (err) {
          if (err) {
            return console.log(err);
          } else {
            console.log("Initial File TXT!");
          }
        }
      );
      fs.readFile(
        dirGInGOutFailTXT + ScanDate + ".txt",
        "utf8",
        function (err, olddata) {
          // Display the file content
          if (err) {
            console.log(err);
          } else {
            // let old = data;
            var join = olddata + "\n" + logdatatxt;
            fs.writeFile(
              dirGInGOutFailTXT + ScanDate + ".txt",
              join,
              function (err) {
                if (err) {
                  return console.log(err);
                } else {
                  res.status(200).json({
                    code: "001",
                    msg: "The Log Gate Process was saved into existing TXT and JSON file!",
                    data: req.body,
                  });
                  console.log("The Log file was saved!");
                }
              }
            );
          }
        }
      );
    } else {
      fs.readFile(
        dirGInGOutFailTXT + ScanDate + ".txt",
        "utf8",
        function (err, olddata) {
          // Display the file content
          if (err) {
            console.log(err);
          } else {
            // let old = data;
            var join = olddata + "\n" + logdatatxt;
            fs.writeFile(
              dirGInGOutFailTXT + ScanDate + ".txt",
              join,
              function (err) {
                if (err) {
                  return console.log(err);
                } else {
                  res.status(200).json({
                    code: "001",
                    msg: "The Log Gate Process was saved into existing TXT and JSON file!",
                    data: req.body,
                  });
                  console.log("The Log file was saved!");
                }
              }
            );
            console.log("The Log file was saved!");
          }
        }
      );
    }
  }
  //for JSON
  if (!fs.existsSync(dirGInGOutFailJSON)) {
    try {
      fs.mkdirSync(dirGInGOutFailJSON);
      fs.writeFile(
        dirGInGOutFailJSON + ScanDate + ".json",
        defaultJSON,
        function (err) {
          if (err) {
            return console.log(err);
          } else {
            fs.readFile(
              dirGInGOutFailJSON + ScanDate + ".json",
              "utf8",
              function (err, data) {
                // Display the file content
                if (err) {
                  console.log(err);
                } else {
                  var obj = JSON.parse(data);
                  var nobj = JSON.parse(logdatajson);
                  obj["logsGInGOutFail"].push(nobj);
                  jsonStr = JSON.stringify(obj);
                  fs.writeFile(
                    dirGInGOutFailJSON + ScanDate + ".json",
                    jsonStr,
                    function (err) {
                      if (err) {
                        return console.log(err);
                      } else {
                        console.log("Last Data Saved!");
                      }
                    }
                  );
                }
              }
            );
            console.log("The Log Gate Process JSON file was saved !");
          }
        }
      );
      // res.status(200).json({
      //   code: "001",
      //   msg: "JSON Folder successfully created and the Log Gate Process JSON file was saved !",
      //   data: req.body,
      // });
    } catch (error) {}
  } else {
    if (!fs.existsSync(dirGInGOutFailJSON + ScanDate + ".json")) {
      fs.writeFile(
        dirGInGOutFailJSON + ScanDate + ".json",
        defaultJSON,
        function (err) {
          if (err) {
            return console.log(err);
          } else {
            console.log("Initial File JSON!");
          }
        }
      );
      fs.readFile(
        dirGInGOutFailJSON + ScanDate + ".json",
        "utf8",
        function (err, data) {
          // Display the file content
          if (err) {
            console.log(err);
          } else {
            var obj = JSON.parse(data);
            var nobj = JSON.parse(logdatajson);
            obj["logsGInGOutFail"].push(nobj);
            jsonStr = JSON.stringify(obj);
            fs.writeFile(
              dirGInGOutFailJSON + ScanDate + ".json",
              jsonStr,
              function (err) {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("Last Data Saved!");
                }
              }
            );
          }
        }
      );
    } else {
      fs.readFile(
        dirGInGOutFailJSON + ScanDate + ".json",
        "utf8",
        function (err, data) {
          // Display the file content
          if (err) {
            console.log(err);
          } else {
            var obj = JSON.parse(data);
            var nobj = JSON.parse(logdatajson);
            obj["logsGInGOutFail"].push(nobj);
            jsonStr = JSON.stringify(obj);
            fs.writeFile(
              dirGInGOutFailJSON + ScanDate + ".json",
              jsonStr,
              function (err) {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("Last Data Saved!");
                }
              }
            );
          }
        }
      );
      // res.status(200).json({
      //   code: "001",
      //   msg: "The Log Gate Process was saved into existing JSON file!",
      //   data: req.body,
      // });
    }
  }
});

app.get("/ReadLogDetailData", (req, res) => {
  var MyDate = new Date();
  var ScanDate;

  MyDate.setDate(MyDate.getDate());

  ScanDate =
    ("0" + MyDate.getDate()).slice(-2) +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    MyDate.getFullYear();

  let dirGInGOutFailJSON = `settings_docs/logsGInGOutFailJSON/`;
  // let dirGInGOutFailJSON = `logger/logsGInGOutFailJSON/`;

  if (!fs.existsSync(dirGInGOutFailJSON + ScanDate + ".json")) {
    res.status(200).json({
      code: "001",
      msg: "Direktori " + ScanDate + ".txt tidak ditemukan",
    });
    // console.log("Data Detail is Empty");
  } else {
    fs.readFile(
      dirGInGOutFailJSON + ScanDate + ".json",
      "utf8",
      function (err, data) {
        // Display the file content
        if (err) {
          console.log(err);
        } else {
          let result = JSON.parse(data);
          res.status(200).json({
            code: "001",
            msg: "Log Detail Sukses GIN GOUT or FAILED " + ScanDate,
            data: result,
          });
        }
      }
    );
  }
});

// Section 4
app.listen(8080, () => {
  console.log("local Server running di port 8080, Mohon Halaman ini Jangan Ditutup (Cukup di Minimize)");
});

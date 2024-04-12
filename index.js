const express = require('express');
const mysql = require("mysql");
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const sqlite3 = require('sqlite3');

const ifaces = os.networkInterfaces();
let locatIp = '';
for (let dev in ifaces) {
    if (dev === '本地连接' || dev === 'WLAN') {
        for (let j = 0; j < ifaces[dev].length; j++) {
            if (ifaces[dev][j].family === 'IPv4') {
                locatIp = ifaces[dev][j].address;
                break;
            }
        }
    }
}

// const db = mysql.createPool({

//     host: '127.0.0.1',

//     user: 'root',

//     password: '@xuewuqiushuang',

//     database: 'farmer'
// })

let db = new sqlite3.Database(rootPath, (err) => {
    if (err) throw err;
    console.log('数据库连接')
})

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use(express.static(__dirname + "/static"));

app.get("/api/collecter", (req, res) => {
    db.each(`select * from collecter`, (error, result) => {
        if (!error) {
            res.send({
                code: 200,
                data: result
            })
        }
    })
})

app.get("/api/controller", (req, res) => {
    db.each(`select * from controller`, (error, result) => {
        if (!error) {
            res.send({
                code: 200,
                data: result
            })
        }
    })
})

app.get('/api/video', (req, res) => {
    db.each(`select * from collecter where CAMERA_VIDEO is not null`, (error, result) => {
        if (!error) {
            res.send({
                code: 200,
                data: result
            })
        }
    })
})

app.listen(3000, () => {
    console.log('服务已经启动, 端口监听为 3000...');
    console.log('局域网IP为    ' + locatIp)
});
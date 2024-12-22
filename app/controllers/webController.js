
const config = require('../config/config')
const fs = require('fs');


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maskMiddle(str) {
    const len = str.length;

    if (len <= 3) {
        return '*'.repeat(len);
    }

    const middleStart = Math.floor(len / 2) - Math.floor(len / 4);
    const middleEnd = middleStart + Math.floor(len / 2);

    return str.slice(0, middleStart) + '*'.repeat(middleEnd - middleStart) + str.slice(middleEnd);
}


exports.nhanLiXi = (req, res, next) => {
    try{
        const ten_tai_khoan = req.body.ten_tai_khoan
        const nhanLiXi_file = config.QUAYTHUONG
        const danhsach_file = config.DANHSACH
        const user_file = config.USERFILE
        const rawData = fs.readFileSync(user_file, 'utf-8');
        const jsonData = JSON.parse(rawData);
        const randomNumber = getRandomNumber(50, 200);
        if (jsonData.hasOwnProperty(ten_tai_khoan)){
            let luot_quay = parseInt(jsonData[ten_tai_khoan])
            const rawData_lixi = fs.readFileSync(nhanLiXi_file, 'utf-8');
            const jsonData_lixi = JSON.parse(rawData_lixi);
            let data = jsonData_lixi.data
            const currentDate = new Date();
            const data_add = `${ten_tai_khoan} - ${randomNumber} - ${currentDate.toLocaleString()}`
            data.push(data_add)
            jsonData_lixi.data = data
            const datalixi_json = JSON.stringify(jsonData_lixi, null, 2);
            fs.writeFileSync(nhanLiXi_file, datalixi_json);
            const rawData_danhsach = fs.readFileSync(danhsach_file, 'utf-8');
            const jsonData_danhsach = JSON.parse(rawData_danhsach);
            let data_ds = jsonData_danhsach.data
            const datads_add = `${maskMiddle(ten_tai_khoan)}:${randomNumber}`
            data_ds.push(datads_add)
            jsonData_danhsach.data = data_ds
            const datads_json = JSON.stringify(jsonData_danhsach, null, 2);
            fs.writeFileSync(danhsach_file, datads_json);
            luot_quay = luot_quay - 1
            if (luot_quay == 0){
                delete jsonData[ten_tai_khoan]
            }
            else{
                jsonData[ten_tai_khoan] = luot_quay
            }
            const datauser_json = JSON.stringify(jsonData, null, 2);
            fs.writeFileSync(user_file, datauser_json);
            return res.status(200).send({"sotien": randomNumber})
        }
        else{
            return res.status(404).send({"sotien": -3})
        }
    }
    catch (err){
        return res.status(500).send({"sotien": -2})
    }
}

exports.addUser = (req, res, next) => {
    // try{
        const user_file = config.USERFILE
        const { ten_tai_khoan, so_luong } = req.body;
        const user_name = ten_tai_khoan
        const luot_quay = so_luong
        const rawData = fs.readFileSync(user_file, 'utf-8');
        const jsonData = JSON.parse(rawData);
        if (jsonData.hasOwnProperty(user_name)){
            jsonData[user_name] = parseInt(jsonData[user_name]) + parseInt(luot_quay)
        }
        else{
            jsonData[user_name] = luot_quay
        }
        const en_data_json = JSON.stringify(jsonData, null, 2);
        console.log("en_data_json", jsonData)
        fs.writeFileSync(user_file, en_data_json);
        return res.status(200).send("ok")
    // }
    // catch (err){
    //     return res.status(500).send({"have errr": err})
    // }
}

exports.getds = (req, res, next) => {
    try{
        const danhsach_file = config.DANHSACH
        const rawData_lixi = fs.readFileSync(danhsach_file, 'utf-8');
        const jsonData_lixi = JSON.parse(rawData_lixi);
        const data = jsonData_lixi.data
        const last100 = data.slice(-100);
        return  res.status(200).send(last100)
    }
    catch (err){
        return res.status(500).send({"have errr": err})
    }
}

exports.getdslichsu = (req, res, next) => {
    try{
        const ten_tai_khoan = req.body.ten_tai_khoan
        console.log("ten_tai_khoan", ten_tai_khoan)
        const danhsach_file = config.QUAYTHUONG
        const rawData_lixi = fs.readFileSync(danhsach_file, 'utf-8');
        const jsonData_lixi = JSON.parse(rawData_lixi);
        const data = jsonData_lixi.data
        const last100_init = [];
        if (ten_tai_khoan){
            const last100 = data.filter((item) => item.includes(ten_tai_khoan)).slice(-100);
            console.log("last100", last100)
            return  res.status(200).send(last100)
        }
        return  res.status(200).send(last100_init)
    }
    catch (err){
        return res.status(500).send({"have errr": err})
    }
}
const express = require('express')
const webController = require('../controllers/webController')

const router = express.Router();

router
  .route('/luck.do')
  .get(webController.getds)

router
  .post('/nhan_li_xi', webController.nhanLiXi);

router
  .post('/add_user', webController.addUser);

router
.route('/getlichsu')
.post(webController.getdslichsu);
module.exports = router
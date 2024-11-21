const express = require('express');
const router = express.Router();
const {
    getBloodSugar,
    addBloodSugar  
} = require('../controller/BloodsugarController');

// 혈당 데이터 조회
router.get('/:user_id', getBloodSugar);

// 혈당 데이터 추가
router.post('/:user_id', addBloodSugar);

module.exports = router;

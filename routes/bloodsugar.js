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

router.get('/:user_id', (req, res, next) => {
    console.log(`GET /bloodsugar/${req.params.user_id}`);
    try {
        getBloodSugar(req, res, next);
    } catch (err) {
        next(err);
    }
});


module.exports = router;

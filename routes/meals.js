const express = require('express');
const router = express.Router();
const{
    getMeals,
    updateMeals,
    modifyMeals
} = require('../controller/MealsController');

router.use(express.json());

//식사 데이터 조회
router.get('/:user_id', getMeals);

//식사 데이터 입력
router.post('/:user_id', updateMeals);

//식사 데이터 수정
router.put('/:id', modifyMeals);


module.exports = router;


const express = require('express');
const router = express.Router();
const{
    register,
    login,
    additional_info
} = require('../controller/UserController');

router.use(express.json());

router.get('/', (req, res) => {
    res.send('Welcome to the Users API');
  });

//회원가입
router.post('/register', register);

//회원가입 후 추가정보 입력
router.put('/:id', additional_info);

//로그인
router.post('/login', login);


module.exports = router;
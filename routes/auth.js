const express = require('express');

const router = express.Router();

// 로그인 /auth/login
router.post('/login');

// 회원가입 /auth/signup
router.post('/signup');

module.exports = router;
const connection = require('../mariadb'); // 데이터베이스 연결 함수
const { StatusCodes } = require('http-status-codes'); // HTTP 상태 코드 모듈
const jwt = require('jsonwebtoken'); // JWT 모듈
const dotenv = require('dotenv');
dotenv.config();


// 회원가입
const register = async (req, res) => {
  const { user_id } = req.body;

  // 필수 입력값 검증
  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: '이름, 이메일, 비밀번호를 모두 입력해주세요.' });
  }

  const sql = `INSERT INTO users(name, email, password) VALUES(?, ?, ?)`;
  const values = [name, email, password];

  let conn;
  try {
    conn = await connection(); // 데이터베이스 연결 생성
    const [results] = await conn.query(sql, values); // 쿼리 실행
    await conn.end(); // 연결 닫기

    // 성공 응답
    return res.status(StatusCodes.CREATED).json({
      id: results.insertId,
      message: '회원가입 성공',
    });
  } catch (err) {
    console.error('회원가입 오류:', err);

    // 이메일 중복 처리
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(StatusCodes.CONFLICT).json({
        error: '이미 존재하는 이메일입니다.',
      });
    }

    // 일반적인 서버 오류 처리
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: '서버 내부 오류', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.end(); // 연결 닫기
      } catch (closeErr) {
        console.error('데이터베이스 연결 종료 중 오류:', closeErr);
      }
    }
  }
};


//회원가입 후 추가 정보 입력
const additional_info = async (req, res) => {
    const { id } = req.params; // URL에서 사용자 ID 추출
    const { gender, birth, height, weight, medical_condition } = req.body;
  
    // 필수 입력값 검증
    if (!id || !gender || !birth || !height || !weight || !medical_condition) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: '모든 필드를 입력해주세요.' });
    }
  
    const sql = `
      UPDATE users
      SET gender = ?, birth = ?, height = ?, weight = ?, medical_condition = ?
      WHERE id = ?
    `;
    const values = [gender, birth, height, weight, medical_condition, id]; // 배열로 전달
  
    let conn;
    try {
      conn = await connection(); // 데이터베이스 연결 생성
      const [results] = await conn.query(sql, values); // 쿼리 실행
      await conn.end(); // 연결 닫기
  
      // 업데이트 성공 응답
      if (results.affectedRows === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: '해당 사용자를 찾을 수 없습니다.' });
      }
  
      return res
        .status(StatusCodes.OK)
        .json({ message: '추가 정보가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
      console.error('추가 정보 업데이트 오류:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: '서버 내부 오류', details: err.message });
    } finally {
      if (conn) {
        try {
          await conn.end(); // 연결 닫기
        } catch (closeErr) {
          console.error('데이터베이스 연결 종료 중 오류:', closeErr);
        }
      }
    }
  };


//로그인
  const login = async (req, res) => {
    const { email, password } = req.body;
  
    // 입력값 검증
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: '이메일과 비밀번호를 모두 입력해주세요.' });
    }
  
    const sql = `SELECT * FROM users WHERE email = ?`;
    const values = [email];
  
    let conn;
    try {
      conn = await connection();
      const [results] = await conn.query(sql, values);
      await conn.end();
  
      const loginUser = results[0];
  
      if (loginUser && loginUser.password === password) {
        if (!process.env.PRIVATE_KEY) {
          console.error('JWT 비밀키가 설정되지 않았습니다.');
          return res.status(500).json({ error: '서버 설정 오류: 비밀키가 없습니다.' });
        }
  
        // 토큰 생성
        const token = jwt.sign(
          {
            id: loginUser.id,
            email: loginUser.email,
          },
          process.env.PRIVATE_KEY, // 비밀키
          {
            expiresIn: '60m',
            issuer: 'jina',
          }
        );
  
        // 쿠키에 토큰 저장
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 1000,
        });
  
        return res.status(StatusCodes.OK).json({ message: '로그인 성공' });
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }
    } catch (err) {
      console.error('로그인 처리 중 오류:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: '서버 내부 오류', details: err.message });
    } finally {
      if (conn) {
        try {
          await conn.end();
        } catch (closeErr) {
          console.error('데이터베이스 연결 종료 중 오류:', closeErr);
        }
      }
    }
  };




module.exports = {
    register,
    additional_info,
    login
}
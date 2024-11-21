const connection = require('../mariadb'); // 데이터베이스 연결 함수
const express = require('express');
const app = express();
const { StatusCodes } = require('http-status-codes'); // HTTP 상태 코드 모듈

app.use(express.json());

// 혈당 데이터 조회
const getBloodSugar = async (req, res) => {
    const { user_id } = req.params;

    // 디버깅 로그
    console.log('Received user_id:', user_id);

    // 입력값 검증
    if (!user_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'user_id 값이 필요합니다.'
        });
    }

    const sql = `SELECT * FROM bloodsugar WHERE user_id = ? ORDER BY recorded_at DESC`;
    const values = [user_id];

    let conn;
    try {
        conn = await connection(); // 데이터베이스 연결
        const [results] = await conn.query(sql, values); // 쿼리 실행
        await conn.end(); // 연결 닫기

        // 데이터가 없을 경우 처리
        if (results.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '해당 유저의 혈당 데이터가 없습니다.'
            });
        }

        return res.status(StatusCodes.OK).json(results); // 결과 반환
    } catch (err) {
        console.error('혈당 데이터 조회 오류:', err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: '서버 내부 오류',
            details: err.message
        });
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

  

//혈당 데이터 추가
const addBloodSugar = async (req, res) => {
    const { user_id } = req.params; // URL 파라미터에서 user_id 추출
    const { level } = req.body;    // 요청 본문에서 level 추출

    // 디버깅 로그
    console.log('Received user_id:', user_id);
    console.log('Received level:', level);

    // 입력값 검증
    if (!user_id || !level) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'user_id와 level 값이 필요합니다.'
        });
    }

    const sql = `INSERT INTO bloodsugar (user_id, level) VALUES (?, ?)`;
    const values = [user_id, level];

    let conn;
    try {
        conn = await connection(); // 데이터베이스 연결
        const [results] = await conn.query(sql, values); // 쿼리 실행
        await conn.end(); // 연결 닫기

        return res.status(StatusCodes.OK).json(results); // 결과 반환
    } catch (err) {
        console.error('혈당 데이터 추가 오류:', err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: '서버 내부 오류',
            details: err.message
        });
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



module.exports = {
    getBloodSugar,
    addBloodSugar
}

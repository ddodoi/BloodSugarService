const mariadb = require('mysql2/promise');

const connection = async () => {
  try {
    const conn = await mariadb.createConnection({
      host: '127.0.0.1', // 데이터베이스 호스트
      user: 'root',       // 사용자 이름
      password: 'root',   // 비밀번호
      database: 'BloodSugarService', // 데이터베이스 이름
      dateStrings: true   // 날짜를 문자열로 반환
    });
    return conn;
  } catch (err) {
    console.error('데이터베이스 연결 실패:', err);
    throw err;
  }
};

module.exports = connection;

const express = require('express');
const app = express();

app.use(express.json());

// 라우터 추가
const userRouter = require('./routes/users');
const bloodsugarRouter = require('./routes/bloodsugar');
// const a1cRouter = require('./routes/a1c');
// const mealsRouter = require('./routes/meals');
// const exerciseRouter = require('./routes/exercise');

app.use('/users', userRouter);
app.use('/bloodsugar', bloodsugarRouter);
// app.use('/a1c', a1cRouter);
// app.use('/meals', mealsRouter);
// app.use('/exercise', exerciseRouter);

// 루트 경로 처리
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports = app;

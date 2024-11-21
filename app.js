const express = require('express');
const app = express();

app.use(express.json());

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

// Vercel에서는 app.listen이 필요하지 않습니다.
// 대신, Express 앱을 내보냅니다.
module.exports = app;

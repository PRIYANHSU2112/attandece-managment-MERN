const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

const app = express();

const path = require('path');

app.use(helmet());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send('Attendance API is running...');
});

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const testRoutes = require('./routes/testRoutes');

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/overtime', overtimeRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', testRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

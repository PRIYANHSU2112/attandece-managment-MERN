const app = require('./app');
const connectDB = require('./config/db');
const { initCronJobs } = require('./services/cronService');

const PORT = process.env.PORT || 5000;

connectDB();

initCronJobs();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

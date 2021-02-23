const app = require('./app');
const connectDB = require('./config/database');

const dotenv = require('dotenv');

//setting up config file
dotenv.config({ path: 'backend/config/config.env' });

const server = app.listen(process.env.PORT, () => {
  connectDB();
  console.log(
    `Server run on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
// handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});

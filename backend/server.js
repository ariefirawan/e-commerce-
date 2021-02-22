const app = require('./app');
const connectDB = require('./config/database');

const dotenv = require('dotenv');

//setting up config file
dotenv.config({ path: 'backend/config/config.env' });


app.listen(process.env.PORT, () => {
  connectDB();
  console.log(
    `Server run on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

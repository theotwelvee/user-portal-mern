const { default: mongoose } = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      'Mongodb Connection established successfully...',
      connection.connection.host
    );
    return connection;
  } catch (err) {
    console.error('Error while connecting to mongodb', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

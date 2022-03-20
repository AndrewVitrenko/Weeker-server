const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://andrew:M81dy140@cluster0.p3agv.mongodb.net/users?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('succefuly connected to mongodb');
  } catch (e) {
    console.log(e);
  }
};

module.exports = connect;

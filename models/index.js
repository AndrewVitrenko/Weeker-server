const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  tasks: [
    {
      id: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      backgroudColor: {
        type: String,
        required: false,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = model('Users', userSchema);

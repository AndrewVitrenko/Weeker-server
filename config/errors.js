const ERRORS = {
  INTERNAL_SERVER_ERROR: 'An error occurred on server. Reload and try again',
  USER_NOT_FOUND: 'User was not found. Check your email',
  WRONG_CREDENTIALS: 'Wrong credentials',
  ALL_FIELDS_REQUIRED: 'All fields are required',
  USER_REGISTERED: 'User is already registered',
  TOKEN_REQUIRED: 'Token is required for authentication',
  TOKEN_EXPIRED: 'Token is expired',
  TODO_TEXT_REQUIRED: "Todo's text is required",
  TODO_START_REQUIRED: "Todo's start time is required",
  TODO_END_REQUIRED: "Todo's end time is required",
  TODO_NOT_FOUND: 'Todo not found',
  TODO_REQUIRED: 'Todo is required',
};

module.exports = ERRORS;

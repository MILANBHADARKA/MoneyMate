//to handle the error in a better way, we will create a class called ApiError for make the error handling standardize

class ApiError extends Error {
    constructor(
          statusCode,
          message= 'somthing went wrong',
          errors= [],
          stack= ""
      ) {
          super(message);
          this.statusCode = statusCode;
          this.data = null;
          this.message = message;
          this.success = false;
          this.errors = errors;
  
          //if this if else is not understood, then avoid it
          if(stack) {
              this.stack = stack;
          } else {
              Error.captureStackTrace(this, this.constructor);        //this is used to capture the stack trace
          }
  
      }
  }
  
  export { ApiError }
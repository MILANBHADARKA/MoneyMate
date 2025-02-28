class ApiResponse {
    constructor(
        statusCode, 
        message= "Sucess", 
        data
    ) {
        this.status = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}


export {ApiResponse}
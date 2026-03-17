class Showerror extends Error {
    constructor( statusCode, message  = "Error is comming from showerror", error = [], stack = "" )
    {
        super( message );
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.success = true; 
        this.data = null;

        if  (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this , this.constructor);
        }
    }
} 
export default Showerror;
class apiresponse {
    constructor (statuscode , message = "success" , data = null) {
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.success = true; 
    }
}
export default apiresponse;
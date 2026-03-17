import AsyncHandler from '../Utils/AsyncHandler.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';

const healthcheck = AsyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, "Server is healthy", null));
})

export {
    healthcheck
}
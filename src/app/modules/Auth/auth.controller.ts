import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResonse';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user logged in successfully',
    data: result,
  });
});



// const changePassword = catchAsync(async (req, res) => {

//   const{...passwordData} = req.body

//   const result = await AuthServices.changePassword(req.user,passwordData);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'password updated successfully',
//     data: result,
//   });
// });


export const AuthControllers = {
    loginUser,
    // changePassword
}
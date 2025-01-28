import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { FacultyServices } from "./faculty.service";
import httpStatus from 'http-status'

const getSingleFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.getSingleFacultyFromDB( id );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is retrieved succesfully',
      data: result,
    });
  });
  

  const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties are retrieved succesfully',
      data: result,
    });
  });
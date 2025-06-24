//Scheme to upload data in the MongoDB collection 'Excel_data':
import mongoose from "mongoose";

const excelSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String
  },
  data: {
    type: Array,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const ExcelData = mongoose.model('ExcelData', excelSchema, 'Excel_Data');
export default ExcelData;
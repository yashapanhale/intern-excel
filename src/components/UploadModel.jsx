import React from 'react';

const UploadModel = ({ isOpen, onClose, onFileChange, onUpload }) => {
    if (!isOpen) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload Excel File</h3>
                <input type='file' 
                accept='.csv, .xlsx, .xls' 
                onChange={onFileChange} 
                className='mb-4 w-full border border-gray-300 rounded-md px-3 py-2' />
                <div className='flex justify-end space-x-2'>
                    <button onClick={onClose}
                    className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400'>Cancel</button>
                    <button onClick={() => {
                        onUpload();
                        onClose();
                    }}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'>Upload</button>
                </div>
            </div>
        </div>
    );
};
export default UploadModel;
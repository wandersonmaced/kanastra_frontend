import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {Popup} from './popup';

const CHUNK_SIZE = 1048576 * 5; // 5 MB

const FileUploadForm: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [chunkUploadMessages, setChunkUploadMessages] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setUploadMessage('Please select only CSV files.');
      return;
    }

    const file = acceptedFiles[0];
    const chunk_qtd = Math.ceil(file.size / CHUNK_SIZE);
    const file_uuid = uuidv4();

    for (let i = 0; i < chunk_qtd; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min((i + 1) * CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('file_uuid', file_uuid);
      formData.append('file_name', file.name);
      formData.append('chunk_idx', String(i + 1));
      formData.append('chunk_qtd', String(chunk_qtd));

      try {
        await axios.post('http://localhost:8000/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        });
        const message = `Chunk ${i + 1}/${chunk_qtd} uploaded successfully`;
        setChunkUploadMessages(prevMessages => [...prevMessages, message]);

        // Update upload message upon completion
        if (i === chunk_qtd - 1) {
          setUploadMessage('File upload complete');
          setShowSuccessPopup(true);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadMessage('Upload failed. Please try again later.');
        return;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept:{'text/csv': ['.csv']} });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-semibold mb-6">Drop your CSV Files Here:</h1>
        <div {...getRootProps()} className="w-full max-w-lg p-6 bg-white shadow-md rounded-md border-2 border-dashed border-gray-400 cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ?
            <p className="p-4">Drop the files here ...</p> :
            <p className="p-4">Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && <progress className="mt-4" value={uploadProgress} max={100}></progress>}
        {uploadMessage && <p className="mt-4">{uploadMessage}</p>}
        <div className="mt-4">
          {chunkUploadMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        {showSuccessPopup && <Popup onClose={() => setShowSuccessPopup(false)} />}
      </div>
    </div>
  );
};

export { FileUploadForm };

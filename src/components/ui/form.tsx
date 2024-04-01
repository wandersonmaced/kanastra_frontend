import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CHUNK_SIZE = 1048576 * 5; // 5 MB

const FileUploadForm: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadMessage, setUploadMessage] = useState<string>('');

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
        const response = await axios.post('http://localhost:8000/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        });
        console.log(`Chunk ${i + 1}/${chunk_qtd} uploaded successfully`);

        // Update upload message upon completion
        if (i === chunk_qtd - 1) {
          setUploadMessage('File upload complete');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadMessage('Upload failed. Please try again later.');
        return;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  return (
    <div className="md:container md:mx-auto">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Drop your CSV Files Here:</h1>
        <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-md cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ?
              <p className="p-4">Drop the files here ...</p> :
              <p className="p-4">Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && <progress value={uploadProgress} max={100}></progress>}
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
};

export { FileUploadForm };

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { exit } from 'process';

const CHUNK_SIZE = 1024 * 5; // 5 MB

const FileUploadForm: React.FC = () => {
  const onDrop = useCallback(async (acceptedFiles: File[], _fileRejections: FileRejection[]) => {
    const file = acceptedFiles[0];
    const chunk_qtd = Math.ceil(file.size / CHUNK_SIZE);
    console.log(chunk_qtd, file.size)
    const file_uuid = uuidv4()

    for (let i = 0; i < chunk_qtd; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min((i + 1) * CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('file_uuid', file_uuid);
      formData.append('file_name', file.name);
      formData.append('chunk_idx', i + 1);
      formData.append('chunk_qtd', chunk_qtd);

      try {
        await axios.post('http://localhost:8000/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(`Chunk ${i + 1}/${chunk_qtd} uploaded successfully`);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    console.log('File upload complete');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="md:container md:mx-auto">
      
      <div className="flex flex-col items-center justify-center h-screen">

        <h1>Drop your Files Here:</h1>
        <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-md cursor-pointer">
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p className="p-4">Drop the files here ...</p> :
                <p className="p-4">Drag 'n' drop some files here, or click to select files</p>
            }
            </div>
        </div>
        </div>
    </div>

  );
};

export {FileUploadForm};

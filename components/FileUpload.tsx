"use client"
import { UploadDropzone } from '@/lib/uploadthing';
import React, { useState } from 'react'

import "@uploadthing/react/styles.css"
import Image from 'next/image';
import { FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  changeType?: (fileType: string) => void;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({
  onChange,
  value,
  changeType,
  endpoint
}: FileUploadProps) => {
  const [fileType, setFileType] = useState("");
  const isPDF = fileType.split('/').includes('pdf');
  if (value && !isPDF) {
    return (
      <div className='relative h-20 w-20'>
        <Image 
          src={value}
          alt='Upload'
          fill
          className='rounded-full'
        />
        <button 
          onClick={() => onChange("")}
          className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
          type="button"
        >
          <X className='h-4 w-4'/>
        </button>
      </div>
    )
  }
  if (value && isPDF) {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a 
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
          type="button"
        >
          <X className='h-4 w-4'/>
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone 
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (endpoint === "messageFile") {
          setFileType(res?.[0]?.type);
          if (changeType) changeType(res?.[0]?.type);
        }
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  )
}

export default FileUpload

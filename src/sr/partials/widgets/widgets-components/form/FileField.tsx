import React, {ChangeEvent, FocusEvent, useState, useEffect} from 'react'
import {uploadMedia} from 'sr/utils/api/media'
import getSignedURL from 'sr/utils/helpers/getSignedURL'
import Spinner from 'sr/layout/common/Spinner'
import {toast} from 'react-toastify'

interface Props {
  label?: string
  wrapperLabel?: string
  filePath?: string
  required?: boolean
  id?: string
  name: string
  onChange?: any
  disabled?: boolean
  isProfilePic?: string
  error?: any
  signedPhoto?: string
  errorText?: string
  className?: string
  wrapperClassName?: string
  value?: string
  autoComplete?: string
  autofocus?: boolean
  register?: any
}

const FileField = ({
  label,
  wrapperLabel,
  className,
  signedPhoto,
  wrapperClassName,
  disabled,
  name,
  id,
  onChange,
  register,
  error,
  errorText,
  required,
}: Props) => {
  return (
    <div className={`${wrapperClassName}`}>
      <label htmlFor={id} className={`${wrapperClassName}`}>
        <p className='file-label ml-6'>
          {wrapperLabel}
          {required && <span className='required-field'>*</span>}
        </p>
        <div className='upload-land-btn-wrapper relative'>
          <div className='upload-land-btn flex flex-col items-center justify-center text-sm'>
            <>
              <span className='fa fa-upload text-2xl'></span>
              <p className='mb-2 text-sm text-[#B3B3B3] font-medium'>{label}</p>
            </>

            <p className='text-xs text-gray-500 dark:text-gray-400'>
              PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>

          <input
            type='file'
            name={name}
            id={id || name}
            className={`${className} hover:cursor-pointer`}
            placeholder=''
            disabled={disabled}
            onChange={onChange}
            {...register}
          />
          {required && error && <p className='error-cls mt-4'>{errorText}</p>}
        </div>
      </label>
      {signedPhoto && (
        <a className='float-right mt-[70px]' href={signedPhoto} target='_blank' rel='noreferrer'>
          {' '}
          View{' '}
        </a>
      )}
    </div>
  )
}

export default FileField

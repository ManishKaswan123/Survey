import {useForm} from 'react-hook-form'
import axios from 'axios'
import React, {useCallback, useEffect, useState} from 'react'
import {AiOutlinePlus} from 'react-icons/ai'
import {InputBox} from '../Input'
import DropdownField from 'sr/partials/widgets/widgets-components/form/DropdownField'
import {uploadMedia} from 'sr/utils/api/media'

const PopupForm: React.FC<{formComponent: React.FC}> = ({formComponent: FormComponent}) => {
  const [onClose, setOnClose] = useState<boolean>(false)
  return (
    <>
      {!onClose && (
        <div className='w-screen fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <FormComponent />
          </div>
        </div>
      )}
    </>
  )
}

export default PopupForm

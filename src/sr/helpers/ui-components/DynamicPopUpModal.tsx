import React, {useEffect, useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import TextField from 'sr/partials/widgets/widgets-components/form/TextField'
import DropdownField from 'sr/partials/widgets/widgets-components/form/DropdownField'
import FileField from 'sr/partials/widgets/widgets-components/form/FileField'
import {Button} from './Button'
import {toast} from 'react-toastify'
import {uploadMedia} from 'sr/utils/api/media'
import {ExtractFieldNames, FieldsArray} from 'sr/constants/fields'
import TextArea from './TextArea'
// import {formatDateForInput} from 'sr/utils/helpers/formateDateForInput'

interface DynamicModalProps {
  setSelectedState?: any
  setSelectedDistrict?: any
  setSelectedSubDistrict?: any
  imageType?: string
  label: string
  isOpen: boolean
  onClose: () => void
  fields: FieldsArray
  defaultValues?: {[key: string]: any}
  onSubmit: (formData: any) => void
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  setSelectedState,
  setSelectedDistrict,
  setSelectedSubDistrict,
  imageType,
  label,
  isOpen,
  onClose,
  fields,
  defaultValues = {},
  onSubmit,
}) => {
  type FormFields = {
    [K in ExtractFieldNames<typeof fields>]: string
  }
  const [uploading, setUploading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: {errors},
  } = useForm<FormFields>({mode: 'onBlur', reValidateMode: 'onSubmit', defaultValues})

  useEffect(() => {
    // Check if defaultValues is not null or undefined
    if (defaultValues) {
      const fieldNames = new Set(
        fields.map((field) => (field.type === 'dropdown' ? field.label : field.name))
      )

      const filteredDefaultValues = Object.keys(defaultValues).reduce<{[key: string]: any}>(
        (acc, key) => {
          if (fieldNames.has(key)) {
            acc[key] = defaultValues[key]
          }
          return acc
        },
        {}
      )
      // console.log('Fields: ', fields)
      // console.log('Default values: ', defaultValues)

      reset(filteredDefaultValues)
    }
  }, [fields])

  // useEffect(() => {
  //   console.log(fields)
  // }, [fields])
  // useEffect(() => {
  //   console.log(defaultValues)
  // }, [defaultValues])

  const stateCode = watch('stateCode')
  const districtCode = watch('districtCode')
  const subDistrictCode = watch('subDistrictCode')
  useEffect(() => {
    // console.log('inside state use effect', stateCode)
    if (stateCode && setSelectedState) {
      setSelectedState(stateCode)
      // setValue('districtCode', '') // Reset districtCode
      // setValue('subDistrictCode', '') // Reset subDistrictCode
    }
  }, [stateCode])

  useEffect(() => {
    // console.log('inside district use effect', districtCode)
    if (districtCode && setSelectedDistrict) {
      setSelectedDistrict(districtCode)
    }
  }, [districtCode])

  useEffect(() => {
    // console.log('inside subDistrict use effect', subDistrictCode)
    if (subDistrictCode && setSelectedSubDistrict) {
      setSelectedSubDistrict(subDistrictCode)
    }
  }, [subDistrictCode])

  const handleFileSelect = async (e: any) => {
    const file: File = e.target.files[0] || null
    const formData = new FormData()
    if (file) {
      let fileType = 'image'
      if (file.type.includes('image')) {
        fileType = 'image'
      } else {
        toast.error('File type should be image')
        return false
      }
      let fileNameIs = file.name
      fileNameIs = fileNameIs.replace(/[^a-zA-Z0-9. ]/g, '').replace(/ /g, '-')
      formData.append('file', file, fileNameIs)
      formData.append('file_type', fileType)

      const uploadFile = async (retryCount = 3) => {
        try {
          const res: any = await uploadMedia(formData)
          if (res && res.status) {
            if (imageType === 'image') {
              // @ts-expect-error
              setValue('images', [res.results.fileName])
            } else {
              setValue('imagePath', res.results.fileName)
            }
            // console.log('File name is ', res.results.fileName)
          } else {
            toast.error(res?.error)
          }
        } catch (error) {
          if (retryCount > 0) {
            await uploadFile(retryCount - 1)
          } else {
            toast.error('Failed to upload file after multiple attempts.')
          }
        }
      }
      setUploading(true)
      await uploadFile()
      setUploading(false)
    }
  }

  const onSubmitForm: SubmitHandler<any> = (data: FormData) => {
    // console.log(getValues('images'), getValues('imagePath'))
    // console.log('Submitting form data: ', data)
    onSubmit(data)
    reset()
    // onClose()
  }
  // useEffect(() => {
  //   console.log(defaultValues)
  // }, [defaultValues])
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-4'>{label}</h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {fields.map((field, index) => {
            switch (field.type) {
              case 'dropdown':
                return (
                  <DropdownField
                    key={index}
                    data={field.name}
                    labelKey={field.labelKey ? field.labelKey : 'name'}
                    label={field.topLabel}
                    placeholder={field.placeholder}
                    valueKey={field.id ? field.id : 'id'}
                    name={field.label}
                    required={field.required && field.required}
                    register={register(field.label, {
                      required: true,
                      onChange: field.onChange ? field.onChange : () => {},
                      // onChange: (e) => {
                      //   console.log('inside onchange')
                      // },
                    })}
                    error={errors[field.label]}
                    errorText={`Please enter ${field.placeholder}`}
                  />
                )
              case 'file':
                return (
                  <FileField
                    key={index}
                    label={field.label}
                    wrapperLabel={field.wrapperLabel}
                    wrapperClassName='m-2'
                    id={field.name}
                    onChange={handleFileSelect}
                    name={field.name}
                    required={field.required}
                    error={errors.fileField}
                    errorText={`Please select a file`}
                  />
                )
              case 'textArea':
                return (
                  <TextArea
                    // key={index}

                    // type={field.type}
                    type={field.type}
                    labelStyle='style1'
                    label={field.label}
                    className='custom-input form-input p-2 border rounded mb-2'
                    id={field.name}
                    required={field.required}
                    disabled={field.disabled}
                    name={field.name}
                    placeholder={field.placeholder}
                    register={register(field.name, {required: field.required})}
                    error={errors[field.name]}
                    errorText={`Please enter ${field.placeholder}`}
                    rows={10}
                  />
                )
              default:
                return (
                  <TextField
                    key={index}
                    type={field.type}
                    labelStyle='style1'
                    label={field.label}
                    className='custom-input form-input p-2 border rounded mb-2'
                    id={field.name}
                    required={field.required}
                    disabled={field.disabled}
                    name={field.name}
                    placeholder={field.placeholder}
                    register={register(field.name, {required: field.required})}
                    error={errors[field.name]}
                    errorText={`Please enter ${field.placeholder}`}
                  />
                )
              // case 'number':
              //   return (
              //     <TextField
              //       key={index}
              //       type={field.type}
              //       labelStyle='style1'
              //       label={field.label}
              //       className='custom-input form-input p-2 border rounded mb-2'
              //       id={field.name}
              //       required={field.required}
              //       disabled={field.disabled}
              //       name={field.name}
              //       placeholder={field.placeholder}
              //       register={register(field.name, {required: field.required})}
              //       error={errors[field.name]}
              //       errorText={`Please enter ${field.placeholder}`}
              //     />
              //   )
              // case 'datetime-local':
              //   return (
              //     <TextField
              //       key={index}
              //       type={field.type}
              //       labelStyle='style1'
              //       label={field.label}
              //       className='custom-input form-input p-2 border rounded mb-2'
              //       id={field.name}
              //       required={field.required}
              //       name={field.name}
              //       placeholder={field.placeholder}
              //       register={register(field.name, {required: field.required})}
              //       error={errors[field.name]}
              //       errorText={`Please enter ${field.placeholder}`}
              //     />
              //   )
              // case 'date':
              //   return (
              //     <TextField
              //       key={index}
              //       type={field.type}
              //       labelStyle='style1'
              //       label={field.label}
              //       className='custom-input form-input p-2 border rounded mb-2'
              //       id={field.name}
              //       required={field.required}
              //       name={field.name}
              //       placeholder={field.placeholder}
              //       register={register(field.name, {required: field.required})}
              //       error={errors[field.name]}
              //       errorText={`Please enter ${field.placeholder}`}
              //     />
              //   )
              // case 'checkbox':
              //   return (
              //     <TextField
              //       key={index}
              //       type={field.type}
              //       labelStyle='style1'
              //       label={field.label}
              //       className='custom-input form-input p-2 border rounded mb-2'
              //       id={field.name}
              //       required={field.required}
              //       name={field.name}
              //       placeholder={field.placeholder}
              //       register={register(field.name, {required: field.required})}
              //       error={errors[field.name]}
              //       errorText={`Please enter ${field.placeholder}`}
              //     />
              //   )
            }
          })}
          <div className='flex justify-around items-center mt-4'>
            <Button
              onClick={onClose}
              label='Cancel'
              className='bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center mb-2 sm:mb-0 sm:mr-3'
            />
            <Button
              disabled={
                uploading ||
                (getValues('images') == null && getValues('imagePath') == null && imageType != null)
              }
              type='submit'
              label={label}
              className='bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center mb-2 sm:mb-0 sm:mr-3'
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default DynamicModal

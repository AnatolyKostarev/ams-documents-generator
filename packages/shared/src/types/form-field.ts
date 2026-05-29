export type FormFieldType = 'text' | 'select' | 'date' | 'number'

export type FormFieldOption = {
  value: string
  label: string
}

export type FormField = {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  options?: FormFieldOption[]
}

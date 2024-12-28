import _InitButton from "../../../../init-frontend/src/components/individual-components/InitButton"
import _InitInput from "../../../../init-frontend/src/components/individual-components/InitInput"
import _InitTextArea from "../../../../init-frontend/src/components/individual-components/InitTextArea"
import _InitForm, { InitFormProps } from "../../../../init-frontend/src/components/individual-components/InitForm"
import { ButtonProps, InputProps, TextAreaProps } from "react-aria-components"

const AdminButton = (props: ButtonProps) => {
    return <_InitButton className={`bg-blue-200 border-2 border-blue-900 rounded-md [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900 ${props.className}`} {...props} />
}

const AdminInput = (props: InputProps) => {
    return <_InitInput className={`bg-blue-200 border-2 border-blue-900 rounded-md [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900 ${props.className}`} {...props} />
}

const AdminTextArea = (props: TextAreaProps) => {
    return <_InitTextArea className={`bg-blue-200 border-2 border-blue-900 rounded-md [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900 ${props.className}`} {...props} />
}

const AdminForm = (props: InitFormProps) => {
    return <_InitForm className={`bg-blue-200 border-2 border-blue-900 rounded-md [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900 ${props.className}`} {...props} />
}



export { AdminButton, AdminInput, AdminTextArea, AdminForm }
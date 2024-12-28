/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import { useTextField } from 'react-aria';
import { TextAreaProps } from 'react-aria-components';
const InitTextArea = ({ className, ...props }: TextAreaProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const {
        ...inputProps
    } = useTextField<'textarea'>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(props as any),
        inputElementType: 'textarea',
    }, ref as any)

    return (
        <textarea {...inputProps} rows={5} className={
            `bg-white rounded-md p-2 border-2 border-blue-900 ${className} text-l w-full`
        } />
    )
}

export default InitTextArea;
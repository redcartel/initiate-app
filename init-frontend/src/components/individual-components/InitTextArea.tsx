import { useRef } from 'react';
import { useTextField } from 'react-aria';
const InitTextArea = ({ value, onChange: _onChange, className, labelId }: { value: string, onChange: (value: string) => void, className?: string, labelId?: string }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const {
        inputProps,
    } = useTextField({
        onChange: (value) => _onChange(value),
        value,
        "aria-labelledby": labelId,
        inputElementType: 'textarea',
    }, ref)

    return (
        <textarea aria-labelledby={labelId} {...inputProps} value={value} rows={5} className={
            `bg-white rounded-md p-2 border-2 border-blue-900 ${className} text-l w-full`
        } />
    )
}

export default InitTextArea;
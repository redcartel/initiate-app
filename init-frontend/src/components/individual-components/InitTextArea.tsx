import { useRef } from 'react';
import { useTextField } from 'react-aria';
const InitTextArea = ({ value, onChange: _onChange, className }: { value: string, onChange: (value: string) => void, className?: string }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const {
        inputProps,
    } = useTextField({
        onChange: (value) => _onChange(value),
        value,
        inputElementType: 'textarea',
    }, ref)

    return (
        <textarea {...inputProps} value={value} rows={5} className={
            `bg-white rounded-md p-2 border-2 border-blue-900 ${className} text-l w-full`
        } />
    )
}

export default InitTextArea;
import { ChangeEventHandler } from 'react';
import { Input } from 'react-aria-components';

const InitInput = ({ value, onChange, className, labelId }: { value: string, onChange: ChangeEventHandler<HTMLInputElement>, className?: string, labelId?: string }) => {
    return (
        <Input type="text" aria-labelledby={labelId} value={value} onChange={onChange} className={
            `bg-white rounded-md p-2 border-2 border-blue-900 ${className} text-xl`
        } />
    )
}

export default InitInput;
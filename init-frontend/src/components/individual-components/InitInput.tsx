import { ChangeEventHandler } from 'react';
import { Input, InputProps } from 'react-aria-components';

const InitInput = ({ className, ...props }: InputProps) => {
    return (
        <Input type="text" className={`bg-white rounded-md p-2 border-2 border-blue-900  text-xl ${className}`} {...props} />
    )
}

export default InitInput;
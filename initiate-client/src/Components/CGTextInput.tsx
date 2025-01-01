import { Input, InputProps } from "react-aria-components";

export const CGTextInput = ({ hue, ...props }: InputProps & { hue?: 'light' | 'dark' }) => {
    const themeClassName = hue === 'light' ? 'bg-secondary-100 text-secondary-800' : hue === 'dark' ? 'bg-secondary-600 text-secondary-50' : 'bg-secondary-400 text-secondary-950';
    
    return <Input type="text"  {...props} className={`px-8 py-4 text-2xl tracking-wider text-center rounded-xl rounded-2xl ${themeClassName} ${props.className}`} />
}
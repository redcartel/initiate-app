import { TextareaHTMLAttributes } from "react"

export const CGTextAreaInput = ({ hue, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { hue?: 'light' | 'dark' }) => {
    const themeClassName = hue === 'light' ? 'bg-secondary-100 text-secondary-800' : hue === 'dark' ? 'bg-secondary-600 text-secondary-50' : 'bg-secondary-400 text-secondary-950';
    const disabledClassName = hue === 'light' ? 'bg-tertiary-200 text-tertiary-900 hover:bg-tertiary-200 text-tertiary-900' : hue === 'dark' ? 'bg-tertiary-600 text-tertiary-50 hover:bg-tertiary-600 text-tertiary-50' : 'bg-tertiary-400 text-tertiary-950 hover:bg-tertiary-400 text-tertiary-950';

    return <textarea {...props} className={`text-2xl tracking-wide p-2 rounded-2xl w-full ${props.disabled ? disabledClassName : themeClassName} ${props.className} `} rows={props.rows ?? 5} />
}
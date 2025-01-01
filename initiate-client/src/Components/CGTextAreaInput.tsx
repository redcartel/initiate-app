import { TextareaHTMLAttributes } from "react"

export const CGTextAreaInput = ({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {

    return <textarea {...props} className={`bg-secondary-200 text-secondary-900 hover:bg-secondary-100 hover:text-secondary-800 text-2xl tracking-wide p-2 rounded-2xl ${props.className} w-full ${props.disabled ? 'bg-tertiary-200 text-tertiary-900 hover:bg-tertiary-200 text-tertiary-900' : ''}`} rows={props.rows ?? 5} />
}
import { Button, PressEvent, ButtonProps } from "react-aria-components";

const InitButton = ({ children,
    className,
    ...props
}: ButtonProps) => {
    return (
        <Button className={`p-2 bg-blue-200 border-2 border-blue-900 rounded-md ${className} [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900`} {...props}>{children}</Button>
    )
}

export default InitButton;
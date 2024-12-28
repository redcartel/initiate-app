import { useId } from "react";
import { Form, Label, Text, FormProps } from "react-aria-components";

export type InitFormProps = FormProps & {
    label: string;
    description: string;
}

const InitForm = ({ className, label, description, ...props }: InitFormProps) => {
    const id = useId();
    return (
        <Form {...props} className={`flex flex-col flex-1 gap-2 p-1 py-6 m-1 border-2 border-blue-200 rounded-lg bg-blue-50 ${className}`} aria-labelledby={id} aria-describedby={`${id}-description`}
            onSubmit={(e) => {
                e.preventDefault();
                props.onSubmit?.(e);
                return false;
            }}>
            <div className="flex flex-col items-center gap-2 p-1 text-white bg-blue-600 rounded-lg">
                <Label id={id} className="text-lg">{label}</Label>
                <Text className="text-sm" id={`${id}-description`} slot='description'>{description}</Text>
            </div>
            {props.children}
        </Form>
    );
}

export default InitForm;
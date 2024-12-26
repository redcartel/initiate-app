import { ListBoxItem } from "react-aria-components";

export default function InitListItem({ children, value, id }: { key: string, textValue: string, children: React.ReactNode, value: Set<string>, id: string }) {
    if (value.has(id)) {
        console.log(id);
    }
    return (
        <>
            {!value.has(id) ? (
                <ListBoxItem id={id} className="m-2 bg-gray-200 rounded-md">
                    {children}
                </ListBoxItem>
            ) : (
                <ListBoxItem id={id} className="m-2 text-gray-800 bg-blue-200 rounded-m">
                    {children}
                </ListBoxItem>
            )
            }
        </>
    )
}
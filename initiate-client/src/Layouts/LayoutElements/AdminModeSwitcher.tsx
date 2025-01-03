import { CGButton } from "../../Components/CGButton";
import { ThemeOption } from "../../types";

export const AdminModeSwitcher = ({adminModeSelect}: {adminModeSelect: {label: string, href: string, theme?: ThemeOption}[]}) => {
    return <>{
        adminModeSelect.map(({ label, href, theme }) => (
            <CGButton key={href} href={href} theme={theme}>{label}</CGButton>
        ))
    }</>
};

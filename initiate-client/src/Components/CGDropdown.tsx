import { ThemeOption } from "../types"
import { CGButton } from "./CGButton";
import { CGIcon } from "./CGIcon";
import { CGText } from "./CGText";

export const CGDropdown = ({ children, label, theme, hue, open, onToggle }: { children: React.ReactNode, label: string, theme?: ThemeOption, hue?: 'light' | 'dark', open: boolean, onToggle: (open: boolean) => void }) => {
    theme = theme || 'tertiary';
    let [barShade, dropShade] = hue === 'light' ? [`bg-${theme}-200`, `bg-${theme}-100`] : hue === 'dark' ? [`bg-${theme}-800`, `bg-${theme}-600`] : [`bg-${theme}-600`, `bg-${theme}-400`];
    let [barText, dropText] = hue === 'light' ? [`text-${theme}-900`, `text-${theme}-800`] : hue === 'dark' ? [`text-${theme}-100`, `text-${theme}-200`] : [`text-${theme}-50`, `text-${theme}-950`];

    return <div className={`flex flex-col items-center justify-center bg-${theme}-${hue ? hue : '500'} p-1 w-full`}>
        <div className={`flex flex-row items-center justify-between ${barShade} ${barText} p-1 w-full`}>
            <div className={`flex flex-row items-center justify-start p-1 flex-1`}>
                <CGText>{label}</CGText>
            </div>
            <div className={`flex flex-row items-center justify-center p-1`}>
                <CGButton theme={theme} hue={hue} onPress={() => onToggle(!open)}>{open ? <CGIcon iconKey="chevron-up" className={barText} /> : <CGIcon iconKey="chevron-down" className={barText} />}</CGButton>
            </div>
        </div>
        {open && <div className={`ease-in-out overflow-y-auto max-h-96 ${open ? 'transform-scale-y-100' : 'transform-scale-y-0'} flex flex-col items-center justify-center ${dropShade} ${dropText} p-1 w-full`}>
            {children}
        </div>}
    </div>
}
import { Heading, HeadingProps } from "react-aria-components";
import { ThemeOption } from "../types";

export default function CGHeading({ children, level, theme, hue, ...props }: HeadingProps & { theme?: ThemeOption, hue?: 'light' | 'dark' }) {
    const hueValue = hue === 'light' ? '200' : hue === 'dark' ? '900' : '600';

    const themeClassName = `text-${theme}-${hueValue}`;

    return <Heading aria-level={level} {...props} className={`font-title ${themeClassName} ${level === 1 ? 'text-4xl'
        : level === 2 ? 'text-3xl'
            : level === 3 || level === undefined ? 'text-2xl'
                : level === 4 ? 'font-sans font-bold text-xl'
                    : level === 5 ? 'font-sans font-bold text-lg'
                        : level === 6 ? 'font-sans font-bold text-base'
                            : ''} ${props.className ?? ''}`}>{children}</Heading>;
}
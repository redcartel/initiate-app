import { Text, TextProps } from 'react-aria-components'
import { ThemeOption } from '../types';

export const CGText = ({ theme, hue, children, ...props }: TextProps & { theme?: ThemeOption, hue?: 'light' | 'dark' }) => {
    let themeClassName = `text-${theme}-${hue === 'light' ? '100' : hue === 'dark' ? '900' : '600'} group-hover:text-${theme}-${hue === 'light' ? '200' : hue === 'dark' ? '800' : '500'}`

    return <Text {...props} className={`group-hover:transform-scale-105 ${themeClassName} ${props.className}`}>{children}</Text>
}
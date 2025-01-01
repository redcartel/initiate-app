import { Text, TextProps } from 'react-aria-components'

export const CGText = ({ theme, light, children, ...props }: TextProps & { theme?: 'primary' | 'secondary' | 'action' | 'destructive', light?: boolean }) => {
    let themeClassName = '';

    if (theme === 'primary') {
        themeClassName = !light ? 'text-amber-900 group-hover:text-amber-800' : 'text-amber-100 group-hover:text-amber-200';
    } else if (theme === 'secondary') {
        themeClassName = !light ? 'text-cyan-900 group-hover:text-cyan-800' : 'text-cyan-100 group-hover:text-cyan-200';
    } else if (theme === 'action') {
        themeClassName = light ? 'text-lime-900 group-hover:text-lime-800' : 'text-lime-100 group-hover:text-lime-200';
    } else if (theme === 'destructive') {
        themeClassName = light ? 'text-red-900 group-hover:text-red-800' : 'text-red-100 group-hover:text-red-200';
    }

    return <Text {...props} className={`${themeClassName} ${props.className}`}>{children}</Text>
}
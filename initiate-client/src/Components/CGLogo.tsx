import CreationLogoBig from '../assets/CreationLogoBig'
import { ThemeOption } from '../types';

const CGLogo = ({ className, theme, hue }: { className?: string, theme?: ThemeOption, hue?: 'light' | 'dark' }) => {

    const hueVal = hue === 'light' ? '100' : hue === 'dark' ? '800' : '400'

    const colorClassName = theme ? `text-${theme}-${hueVal}` : 'text-primary-400'

    return (
        <div className={`inline-block p-8 ${colorClassName} ${className}`}>
            <CreationLogoBig width='100%' fill='currentColor' shapeRendering='optimizeQuality' strokeWidth={10} />
        </div>
    )
}

export default CGLogo;
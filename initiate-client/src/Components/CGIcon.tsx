
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faUser, faScroll, faInfo, faBars, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ThemeOption } from '../types';

export type IconKey = 'user' | 'character' | 'check' | 'xmark' | 'scroll' | 'info' | 'menu' | 'chevron-up' | 'chevron-down';

export const CGIcon = ({ iconKey, className, width, theme, hue }: { iconKey: IconKey, className?: string, width?: number, theme?: ThemeOption, hue?: 'light' | 'dark'}) => {
    let themeClassName = 'text-black';

    if (hue === 'light') {
        themeClassName = `text-${theme}-100 group-hover:text-${theme}-200`;
    }
    else if (hue === 'dark') {
        themeClassName = `text-${theme}-900 group-hover:text-${theme}-800`;
    }
    else if (theme) {
        themeClassName = `text-${theme}-600 group-hover:text-${theme}-500`;
    }

    let icon : IconDefinition = faUser;

    switch (iconKey) {
        case 'user':
            icon = faUser;
            break;
        case 'character':
            icon = faUser;
            break;
        case 'check':
            icon = faCheck;
            break;
        case 'xmark':
            icon = faXmark;
            break;
        case 'scroll':
            icon = faScroll;
            break;
        case 'info':
            icon = faInfo;
            break;
        case 'menu':
            icon = faBars;
            break;
        case 'chevron-up':
            icon = faChevronUp;
            break;
        case 'chevron-down':
            icon = faChevronDown;
            break;
        default:
            icon = faUser;
            break;
    }

    return <FontAwesomeIcon icon={icon} className={`${themeClassName} ${className}`} width={width} />
}
import { ThemeOption } from "../types";

export interface GetResponse {
    '!setSessionKey'?: string;
    '!redirect'?: string;
    'layout': 'basic' | 'client' | 'admin';
    content: {
        type: 'info',
        title: string;
        subtitle?: string;
        description?: string;
        logo?: boolean;
        linkButtons: {
            label: string;
            href: string;
            theme: ThemeOption
        }[];
    } | {
        type: 'select';
        title: string;
        subtitle?: string;
        description?: string;
        longDescription?: string;
        multiSelect?: boolean;
        selected?: string | string[];
        playerGMSwitch?: boolean;
        phaseSelect?: { label: string, value: string }[]
        options: {
            label: string;
            subtitle?: string;
            icon?: string;
            value: string;
            default?: boolean;
            description?: string;
            longDescription?: string;
            disabled?: boolean;
            theme: ThemeOption
        }[];
    } | {
        type: 'text';
        textArea?: boolean;
        title: string;
        subtitle?: string;
        description?: string;
        longDescription?: string;
        playerGMSwitch?: boolean;
        phaseSelect?: { label: string, value: string }[]
    } | {
        type: 'textarea';
        title: string;
        subtitle?: string;
        description?: string;
        longDescription?: string;
        playerGMSwitch?: boolean;
        phaseSelect?: { label: string, value: string }[]
    } | {
        type: 'move';
        title: string;
        subtitle?: string;
        description?: string;
        longDescription?: string;
        playerGMSwitch?: boolean;
        phaseSelect?: { label: string, value: string }[]
    }
}
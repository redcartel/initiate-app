import { ThemeOption } from "../types";

export type Layout = 'basic' | 'client' | 'admin';

export type ContentType = 'info' | 'select' | 'text' | 'textarea' | 'move' | 'auto' | 'popup';

export interface InfoContent {
    type: 'info';
    title: string;
    subtitle?: string;
    description?: string;
    logo?: boolean;
    key?: string;
    linkButtons: {
        label: string;
        href: string;
        theme: ThemeOption
    }[];
}

export interface SelectOption {
    label: string;
    description?: string;
    value: string;
    key: string;
    followUp?: OrderContent;
    longDescription?: string;
    disabled?: boolean;
    disableCondition?: string;
    theme?: ThemeOption;
}

export interface SelectContent {
    type: 'select';
    title: string;
    subtitle?: string;
    description?: string;
    longDescription?: string;
    multiSelect?: boolean;
    selected?: string | string[];
    instantSubmit?: boolean;
    multiMax?: number;
    multiMin?: number;
    poll?: boolean;
    key: string;
    options: SelectOption[];
    followUp?: OrderContent;
}

export interface TextContent {
    type: 'text';
    key: string;
    title: string;
    subtitle?: string;
    description?: string;
    longDescription?: string;
    playerGMSwitch?: boolean;
    phaseSelect?: { label: string, value: string }[]
    followUp?: OrderContent;
}

export interface TextareaContent {
    type: 'textarea';
    key: string;
    title: string;
    subtitle?: string;
    description?: string;
    longDescription?: string;
    playerGMSwitch?: boolean;
    phaseSelect?: { label: string, value: string }[]
    followUp?: OrderContent;
}

export interface MoveContent {
    type: 'move';
    key?: string;
    title: string;
    subtitle?: string;
    description?: string;
    longDescription?: string;
    followUp?: OrderContent;
}

export type AutoContent = {
    'type': 'auto';
    key: string;
    title?: string;
    subtitle?: string;
    description?: string;
    longDescription?: string;
    followUp?: OrderContent;
}

export type OrderContent = SelectContent | TextContent | TextareaContent | MoveContent | InfoContent | AutoContent;

export type PopupContent = {
    'type': 'popup';
    key?: string;
    longDescription?: string;
}

export type HeaderInfo = {
    title: string;
    subtitle?: string;
    showPlayerSwitch?: boolean;
}

export type FooterInfo = {
    infoText?: string;
}

export type BasicResponse = {
    layout: 'basic';
    content: OrderContent;
}

export type ClientResponse = {
    layout: 'client';
    gmPlayerSwitch?: boolean;
    phaseSelect?: { label: string, href: string, theme?: ThemeOption }[];
    header?: HeaderInfo;
    footer?: FooterInfo;
    content: OrderContent;
}

export type PhaseLink = {
    label: string;
    href: string;
    theme?: ThemeOption;
}

export type AdminResponse = {
    layout: 'admin';
    gmPlayerSwitch?: boolean;
    phaseSelect?: { label: string, href: string, theme?: ThemeOption }[];
    header?: HeaderInfo;
    footer?: FooterInfo;
    content: OrderContent;
}

export type GetResponse = BasicResponse | ClientResponse | AdminResponse;
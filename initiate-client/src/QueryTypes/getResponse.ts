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
    htmlLink?: string;
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
    savedValue?: string;
    followUp?: OrderContent;
    disabled?: boolean;
    disableCondition?: string;
    theme?: ThemeOption;
    htmlLink?: string;
}

export interface SelectContent {
    type: 'select';
    title: string;
    subtitle?: string;
    description?: string;
    multiSelect?: boolean;
    selected?: string | string[];
    savedValue?: string | string[];
    instantSubmit?: boolean;
    multiMax?: number;
    multiMin?: number;
    poll?: boolean;
    key: string;
    htmlLink?: string;
    options: SelectOption[];
    followUp?: OrderContent;
}

export interface DropdownListOption {
    label: string;
    description?: string;
    htmlLink?: string;
    value: string;
    key: string;
    theme?: ThemeOption;
}

export interface DropdownListContent {
    type: 'dropdownList';
    title: string;
    subtitle?: string;
    description?: string;
    key: string;
    savedValue?: string[];
    openKeys?: string[];
    options: DropdownListOption[];
    htmlLink?: string;
    linkButtons?: {
        label: string;
        href: string;
        theme: ThemeOption
    }[];
}

export interface TextContent {
    type: 'text';
    key: string;
    title: string;
    savedValue?: string;
    subtitle?: string;
    description?: string;
    playerGMSwitch?: boolean;
    htmlLink?: string;
    followUp?: OrderContent;
}

export interface TextareaContent {
    type: 'textarea';
    key: string;
    savedValue?: string;
    title: string;
    subtitle?: string;
    description?: string;
    playerGMSwitch?: boolean;
    htmlLink?: string;
    followUp?: OrderContent;
}

export interface MoveContent {
    type: 'move';
    key?: string;
    title: string;
    savedValue?: string;
    subtitle?: string;
    description?: string;
    htmlLink?: string;
    followUp?: OrderContent;
}

export type AutoContent = {
    'type': 'auto';
    key: string;
    title?: string;
    subtitle?: string;
    description?: string;
    followUp?: OrderContent;
}

export type OrderContent = SelectContent | TextContent | TextareaContent | MoveContent | InfoContent | AutoContent | DropdownListContent;

export type PopupContent = {
    'type': 'popup';
    key?: string;
}

export type HeaderInfo = {
    title: string;
    subtitle?: string;
    showPlayerSwitch?: boolean;
}

export type FooterInfo = {
    htmlLink?: string;
}

export type BasicResponse = {
    layout: 'basic';
    content: OrderContent;
}

export type ClientResponse<T extends OrderContent = OrderContent> = {
    layout: 'client';
    gmPlayerSwitch?: boolean;
    phaseSelect?: { label: string, href: string, theme?: ThemeOption }[];
    header?: HeaderInfo;
    footer?: FooterInfo;
    content: T;
}

export type PhaseLink = {
    label: string;
    href: string;
    theme?: ThemeOption;
}

export type AdminResponse<T extends OrderContent = OrderContent> = {
    layout: 'admin';
    gmPlayerSwitch?: boolean;
    phaseSelect?: { label: string, href: string, theme?: ThemeOption }[];
    header?: HeaderInfo;
    footer?: FooterInfo;
    content: T;
    adminModeSelect?: { label: string, href: string, theme?: ThemeOption }[];
}

export type GetResponse = BasicResponse | ClientResponse | AdminResponse;
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

interface ImportMeta {
    env: ImportMetaEnv;
}

interface ImportMetaEnv {
    VITE_API_URL: string;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: string;
    export default content;
}
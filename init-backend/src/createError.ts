import { ErrorResponse } from "./types";

export function createError(message: string, status: number): ErrorResponse;

export function createError(status: number): ErrorResponse;

export function createError(message: string): ErrorResponse;

export function createError(): ErrorResponse;

export function createError(...args: any[]): ErrorResponse {
    if (args.length === 0) {
        const err = new Error('Internal Server Error') as ErrorResponse;
        err.status = 500;
        return err;
    }
    if (args.length === 1 && typeof args[0] === 'string') {
        const err = new Error(args[0]) as ErrorResponse;
        err.status = 500;
        return err;
    }
    else if (args.length === 1 && typeof args[0] === 'number') {
        const err = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Payload Too Large',
            414: 'URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Range Not Satisfiable',
            417: 'Expectation Failed',
            418: 'I\'m a teapot',
            421: 'Misdirected Request',
            422: 'Unprocessable Entity',
            423: 'Locked',
            424: 'Failed Dependency',
            425: 'Too Early',
            426: 'Upgrade Required',
            428: 'Precondition Required',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            506: 'Variant Also Negotiates',
            507: 'Insufficient Storage',
            508: 'Loop Detected',
            510: 'Not Extended',
            511: 'Network Authentication Required',
        }[args[0]];
        const error = new Error(err) as ErrorResponse;
        error.status = args[0];
        return error;
    }
    else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'string') {
        const message = args[1];
        const status = args[0] ?? 500;
        const error = new Error(message) as ErrorResponse;
        error.status = status;
        return error;
    }
    else {
        const err = new Error('Internal Server Error') as ErrorResponse;
        err.status = 500;
        return err;
    }
}
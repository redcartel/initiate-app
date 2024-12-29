
const shouldLog = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (...args: any[]) => {
    if (shouldLog) {
        console.log(...args);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function evalExpression(expression: string, state: any, prefix: string): number | string {
    const tokenList = expression.split(' ').reverse();
    const _prefix = prefix.split('.')
    const stack = tokenList.map(token => parseToken(token, state, _prefix));

    function parse(_stack: typeof stack): number | string {
        const token = _stack.pop();
        if (typeof token === 'number') {
            return token;
        }
        if (typeof token === 'string') {
            return token;
        }
        if (typeof token === 'function') {
            return token(parse(_stack), parse(_stack));
        }
        throw new Error('Invalid token: ' + token);
    }

    return parse(stack);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseToken(token: string, state: any = {}, prefix: string[] = []): number | string | ((a: number | string, b?: number | string) => string | number) {
    log('parseToken', token, state, prefix);

    if (/^d\d+$/i.test(token)) {
        log('die')
        const res = Math.floor(Math.random() * parseInt(token.slice(1))) + 1;
        log('die', res);
        return res;
    }

    if (/".*"/.test(token)) {
        log('string');
        return token.slice(1, -1);
    }

    if (!['==', '!=', '&&', '||', '!', '>', '<', '>=', '<=', '+', '-', '*', '/', '//', '%', '[contains]', '[min]', '[max]'].includes(token)) {
        try {
            const res = parseInt(token);
            log('res', res);
            return res;
        }
        catch {
            // token is not a number
        }
    }

    console.log('not a number', token);

    if (token === '==') {
        log('==');
        return (a: number | string, b?: number | string) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for ==');
            }
            const res = `${a}` === `${b}` ? 1 : 0;
            log('==', res);
            return res;
        }
    }

    if (token === '!=') {
        log('!=');
        return (a: number | string, b?: number | string) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for !=');
            }
            const res = `${a}` !== `${b}` ? 1 : 0;
            log('!=', res);
            return res;
        }
    }

    if (token === '&&') {
        log('&&');
        return (a: number | string, b?: number | string) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for &&');
            }
            const res = (!!a && !!b) ? 1 : 0;
            log('&&', res);
            return res;
        }
    }

    if (token === '||') {
        log('||');
        return (a: number | string, b?: number | string) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for ||');
            }
            const res = (!!a || !!b) ? 1 : 0;
            log('||', res);
            return res;
        }
    }

    if (token === '!') {
        log('!');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (a: number | string, b?: number | string) => {
            if (typeof a === 'undefined') {
                throw new Error('Missing argument for !');
            }
            const res = a ? 0 : 1;
            log('!', res);
            return res;
        }
    }

    if (token === '>') {
        log('>');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for >');
            }
            try {
                const res = parseInt(`${a}`) > parseInt(`${b}`) ? 1 : 0;
                log('>', res);
                return res;
            }
            catch {
                throw new Error('Invalid argument for > ' + a + ' ' + b);
            }
        }
    }

    if (token === '<') {
        log('<');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for <');
            }
            try {
                const res = parseInt(`${a}`) < parseInt(`${b}`) ? 1 : 0;
                log('<', res);
                return res;
            }
            catch {
                throw new Error('Invalid argument for < ' + a + ' ' + b);
            }
        }
    }

    if (token === '>=') {
        log('>=');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for >=');
            }
            try {
                const res = parseInt(`${a}`) >= parseInt(`${b}`) ? 1 : 0;
                log('>=', res);
                return res;
            }
            catch {
                throw new Error('Invalid argument for >= ' + a + ' ' + b);
            }
        }
    }

    if (token === '<=') {
        log('<=');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for <=');
            }
            try {
                const res = parseInt(`${a}`) <= parseInt(`${b}`) ? 1 : 0;
                log('<=', res);
                return res;
            }
            catch {
                throw new Error('Invalid argument for <= ' + a + ' ' + b);
            }
        }
    }

    if (token === '+') {
        log('+');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for +');
            }
            try {
                console.log('a', a, typeof a);
                console.log('b', b, typeof b);
                const res = parseInt(`${a}`) + parseInt(`${b}`);
                log('+', res);
                return res;
            }
            catch {
                const res = `${a} + ${b}`;
                log('+', res);
                return res;
            }
        }
    }

    if (token === '-') {
        log('-');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for -');
            }
            try {
                const res = parseInt(`${a}`) - parseInt(`${b}`);
                log('-', res);
                return res;
            }
            catch {
                throw new Error('Invalid arguments');
            }
        }
    }

    if (token === '*') {
        log('*');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for *');
            }
            try {
                const res = parseInt(`${a}`) * parseInt(`${b}`);
                log('*', res);
                return res;
            }
            catch {
                throw new Error('Invalid arguments');
            }
        }
    }

    if (token === '/') {
        log('/');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for /');
            }
            try {
                const res = Math.ceil(parseInt(`${a}`) / parseInt(`${b}`));
                log('/', res);
                return res;
            }
            catch {
                throw new Error('Invalid arguments');
            }
        }
    }

    if (token === '//') {
        log('//');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for //');
            }
            try {
                return Math.floor(parseInt(`${a}`) / parseInt(`${b}`));
            }
            catch {
                throw new Error('Invalid arguments');
            }
        }
    }

    if (token === '%') {
        log('%');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for %');
            }
            try {
                return parseInt(`${a}`) % parseInt(`${b}`);
            }
            catch {
                throw new Error('Invalid argument for % ' + a + ' ' + b);
            }
        }
    }

    if (token === '[contains]') {
        log('[contains]');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for [in]');
            }
            return (`${a}`.split(',') as string[]).includes(`${b}`) ? 1 : 0;
        }
    }

    if (token === '[min]') {
        log('[min]');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for [min]');
            }
            try {
                const res = Math.min(parseInt(`${a}`), parseInt(`${b}`));
                log('[min]', res);
                return res;
            }
            catch {
                throw new Error('Invalid arguments for [min] ' + a + ' ' + b);
            }
        }
    }

    if (token === '[max]') {
        log('[max]');
        return (a: number | string, b?: number | string | undefined) => {
            if (typeof b === 'undefined') {
                throw new Error('Missing argument for [max]');
            }
            try {
                const res = Math.max(parseInt(`${a}`), parseInt(`${b}`));
                log('[max]', res);
                return res;
            }
            catch {
                throw new Error('Invalid arguments for [max] ' + a + ' ' + b);
            }
        }
    }

    if (/^'.*'$/.test(token)) {
        const res = token.slice(1, -1);
        log('string', res);
        return res;
    }

    const keys = [...prefix, ...token.split('.')];
    log('keys', keys);
    try {
        const val = keys.reduce((acc, key) => acc[key], state);
        if (typeof val === 'undefined') {
            throw new Error('Key not found: ' + token);
        }
        return val;
    }
    catch {
        throw new Error('Key not found: ' + token);
    }
}


export { evalExpression };

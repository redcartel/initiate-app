/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const destructure = (path: string, state: any) => {
    const keys = path.split('.');
    try {
        return keys.reduce((acc, key) => acc[key], state);
    } catch (e) {
        console.error(`Error destructuring ${path}`, e);
        return undefined;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setDestructured = (path: string, value: any, state: any) => {
    const keys = path.split('.').reverse();
    const _state = state;
    while (keys.length > 0) {
        const key = keys.pop();
        if (typeof key !== 'string' || !key) {
            throw new Error(`Invalid path: ${path}`);
        }
        if (!state[key]) {
            state[key] = {};
        }
        state = state[key];
    }
    state = value;
    return _state;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findOrderOption = (path: string, characterId: string, state: any): any => {


    const option = state.orderOptions[characterId];

    const _path = path.split('.').reverse();

    function findOption(option: any, path: string[]) {

        const key = path.pop();



        let _option: any;

        if (option.key === key) {

            _option = option;
        }
        else {
            return null;
        }


        if (path.length === 0) {
            return _option;
        }

        if (option.type === 'select') {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _optionOption = option.options!.find((option: any) => option.key === path[path.length - 1]);
            if (_optionOption) {
                return findOption(_optionOption, path);
            }
        }

        if (option.followUp) {
            return findOption(option.followUp, path);
        }

        return null;
    }
    const _ret = findOption(option, _path);

    return _ret;

    // const option = makeOrderOption(state.orderOptions[characterId]);

    // if (!option) {
    //     return undefined;
    // }

    // function findOption(option: OrderOption | OrderSelection, path: string) {
    //     const keys = path.split('.').reverse();
    //     const key = keys.pop();
    //     // 
    //     if (option.vals.followUp) {
    //         if (keys.length === 0) {
    //             return option.vals.followUp;
    //         }
    //         
    //         //
    //         if (option.vals.followUp.key.toLowerCase() === key!.toLowerCase()) {
    //             if (keys.length === 0) {
    //                 return option.vals.followUp;
    //             }
    //             return findOption(option.vals.followUp, keys.reverse().join('.'));
    //         }
    //     }
    //     else if (option instanceof OrderOption && option.vals.selectOptions) {
    //         //
    //         const followUp = option.vals.selectOptions.find(option => option.vals.key.toLowerCase() === key!.toLowerCase());
    //         if (followUp) {
    //             if (keys.length > 0) {
    //                 return followUp;
    //             }
    //             return findOption(followUp, keys.reverse().join('.'));
    //         }
    //     }
    //     return findOption(option, keys.reverse().join('.'));
    // }

    // return findOption(option, path);
}
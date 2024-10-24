import { penner } from './external/penner';

/**
 * Returns correct Penner equation using string or Function.
 *
 * @internal
 * @ignore
 * @param {(function|string)} [ease]
 * @param {defaults} default penner equation to use if none is provided
 */
// eslint-disable-next-line consistent-return
export default function ease(ease: any, defaults?: any): any
{
    if (!ease)
    {
        // @ts-expect-error ...
        return penner[defaults];
    }
    else if (typeof ease === 'function')
    {
        return ease;
    }
    else if (typeof ease === 'string')
    {
        // @ts-expect-error ...
        return penner[ease];
    }
}

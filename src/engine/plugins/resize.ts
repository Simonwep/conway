import {ActorInstance} from '../../actor/actor.main';
import {on}            from '../../lib/dom-events';

/**
 * Panning feature
 * @param canvas
 * @param current
 */
export const resize = (
    canvas: HTMLCanvasElement,
    current: ActorInstance
) => {
    let timeout: unknown = 0;
    on(window, 'resize', () => {
        clearTimeout(timeout as number);
        timeout = setTimeout(async () => {
            await current.call('updateConfig', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 1000);
    });
};

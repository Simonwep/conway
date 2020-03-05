import {Component} from 'preact';


/**
 * Utility to create a single class-name based on an object or array.
 * @param values
 */
export function cn(...values: Array<string | {[key: string]: boolean}>): string {
    let str = '';

    for (const item of values) {
        switch (typeof item) {
            case 'object': {
                for (const [key, val] of Object.entries(item)) {
                    if (val) {
                        str += `${key  } `;
                    }
                }

                break;
            }
            case 'string': {
                str += `${item  } `;
            }
        }
    }

    return str;
}


/**
 * A decorator which binds a function to the class instance.
 * Taken from https://github.com/GoogleChromeLabs/squoosh/blob/master/src/lib/initial-util.ts#L16
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function bind(target: Component<any, any>, propertyKey: string, descriptor: PropertyDescriptor) {
    return {
        // the first time the prototype property is accessed for an instance,
        // define an instance property pointing to the bound function.
        // This effectively "caches" the bound prototype method as an instance property.
        get() {
            const bound = descriptor.value.bind(this);

            Object.defineProperty(this, propertyKey, {
                value: bound
            });

            return bound;
        }
    };
}

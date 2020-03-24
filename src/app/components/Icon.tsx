/* eslint-disable @typescript-eslint/no-var-requires */
import {h}           from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import Element = JSXInternal.Element;

const icons = new Map();

// Load icons dynamically
const svgContext = require.context('../icons');
for (const path of svgContext.keys()) {
    const nameWithExt = path.slice(2);
    const name = nameWithExt.slice(0, -4);

    icons.set(name, require(`../icons/${nameWithExt}`));
}

type Props = {
    name: string;
};

export default ({name}: Props): Element => {
    const svg = icons.get(name);

    if (!svg) {
        throw new Error(`Icon not found: ${name}`);
    }

    return (
        <div className="icon" dangerouslySetInnerHTML={{__html: svg}}/>
    );
};

import path from 'path';
import parse from './parseComponentAst';
const ATOMIC_DESIGN_REGEX = /(atoms|molecules|organisms|pages|templates)/g;

function mapComponentByAtomic(entries, result) {
    if (!result) return null;

    return entries
        .map(item => {
            var component = result.find(i => item.includes(i + '/'));
            if (component) {
                const matched = item.match(ATOMIC_DESIGN_REGEX);
                return {
                    component,
                    type: matched[0],
                };
            }
        })
        .filter(item => item);
}

function generateComponentModel() {
    let components = require.context('!raw-loader!./../../src/components', true, /.jsx$/);
    const files = components.keys().map(filename => filename);

    const fileAndComponentContent = files.map(item => {
        return {
            file: path.resolve('../src/components', item),
            content: components(item),
        };
    });

    const getUsedComponents = fileAndComponentContent.map(item => {
        const usedComponents = parse(item.content);
        const components = mapComponentByAtomic(files, usedComponents);
        return {
            file: item.file,
            components,
        };
    });

    return getUsedComponents;
}

export default generateComponentModel;

import traverse from 'babel-traverse';
import { parse } from '@babel/parser';
class Parser {
    constructor(code) {
        this.code = code;
        return this.init();
    }

    init() {
        const code = parse(this.code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'objectRestSpread'
            ],
        });

        const foundComponents = [];

        traverse(code, {
            ImportDeclaration(path) {
                const node = path.node;

                var regex = /(\.+\/.+)|\.\/|\.+/g;
                const isRelative = node.source.value.match(regex);
                if (isRelative) {
                    const importSpecifierPaths = path.get('specifiers');

                    for (const importSpecifierPath of importSpecifierPaths) {
                        const node = importSpecifierPath.node;
                        const id = node.local;
                        const shouldBeLUpperCase = id.name.charAt(0) === id.name.toUpperCase().charAt(0)
                        const secondCharLowerCase = id.name.charAt(1) !== id.name.toUpperCase().charAt(1)
                        if (shouldBeLUpperCase && secondCharLowerCase) {
                            foundComponents.push(id.name)
                        }
                    }
                }
            }
        });

        return foundComponents;
    }
}

module.exports = code => new Parser(code);

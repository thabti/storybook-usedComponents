import traverse from 'babel-traverse';
import { parse } from '@babel/parser';

// this code takes a string file of es6/react component and parses the ast to see which components are used
// it is very basic and makes the assumption that all ImportDeclaration which start with a capital letter are components
// very react focused
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

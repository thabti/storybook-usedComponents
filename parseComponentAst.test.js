import parseAst from './parseComponentAst';
import * as parser from '@babel/parser';
describe('Parse AST', () => {
    it('should return used components from code', () => {
        const parserSpy = sinon.spy(parser, 'parse');
        const code = `
            import { InputButton, UserAvatar, DONOTINCLUDEME, } from '../../components';
            import classnames from 'classnames';
        `
        const sut = parseAst(code);

        expect(sut).to.have.deep.members(['InputButton', 'UserAvatar'])
        expect(sut).to.not.have.deep.members(['DONOTINCLUDEME', 'classnames'])
        expect(parserSpy).to.have.been.calledWith(code)
    });
})

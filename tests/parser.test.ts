import { expect, test } from 'vitest';
import Parser, { ParseError } from '../src/language/parser';
import Scanner from '../src/language/scanner';
import { Arrow, Statement, Types } from '../src/language/ast';

const parse = (source: string): Parser => {
    const scanner = new Scanner(source)
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens, source);
    parser.parse();
    return parser
}

test('test actor declaration', () => {
    const source = 'actor u = "string";'
    const stmts = parse(source).statements;
    const expected: Statement[] = [
        {
            type:Types.ACTOR_DECLARATION,
            name: 'u',
            value: 'string'
        }
    ]
    expect(stmts).toEqual(expected)
})

test('test action declaration', () => {
    const source = 'action A -> B = "perform some action";'
    const stmts = parse(source).statements;
    const expected: Statement[] = [
        {
            type: Types.ACTION_DECLARATION,
            leftActor: 'A',
            rightActor: 'B',
            direction: Arrow.RIGHT,
            value: 'perform some action',
        }
    ]
    expect(stmts).toEqual(expected)
})

test('test missing actor name error', () => {
    const source = 'action -> B = "somestring";'
    const errors = parse(source).parseErrors;
    expect(errors).toMatchSnapshot();
})

test('synchronization', () => {
    const source = `
        action -> B = "somestring";
        action A -> B = "somestring";
    `
    const parser = parse(source);
    expect(parser.parseErrors).toMatchSnapshot();
    expect(parser.statements).toMatchSnapshot();
})

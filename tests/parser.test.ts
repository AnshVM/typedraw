import { expect, test } from 'vitest'
import Scanner, { Token, TokenType } from '../src/parser/scanner'

const eof = (source: string, line: number): Token => {
    return { type: TokenType.EOF, start: source.length, end: source.length + 1, line };
}

test('test string', () => {
    const source = '"12345"'
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const expected: Token[] = [
        {
            type: TokenType.STRING,
            start: 1,
            end: 6,
            line: 1
        },
        eof(source, 1)
    ]
    expect(tokens).toEqual(expected);
})

test('test fixed size tokens', () => {
    const source = '( ) ; -> <- ';
    const expected = [
        { type: TokenType.LEFT_PAREN, length: 1 },
        { type: TokenType.RIGHT_PAREN, length: 1 },
        { type: TokenType.SEMICOLON, length: 1 },
        { type: TokenType.RIGHT_ARROW, length: 2 },
        { type: TokenType.LEFT_ARROW, length: 2 },
        { type: TokenType.EOF, length: 1 }
    ]
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    let expectedTokens: Token[] = []

    for (let i = 0, start = 0; i < tokens.length; i++) {
        const expectedToken: Token = {
            type: expected[i].type,
            start,
            end: start + expected[i].length,
            line: 1
        }
        expectedTokens.push(expectedToken);
        start += expected[i].length + 1;
    }
    expect(tokens).toEqual(expectedTokens);
})

test('test identifiers', () => {
    const source = 'a123';
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    expect(tokens).toEqual([
        {
            type: TokenType.IDENTIFIER,
            start: 0,
            end: 4,
            line: 1
        },
        eof(source, 1)
    ])
})

test('test keywords', () => {
    const source = 'actor';
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    expect(tokens).toEqual([
        {
            type:TokenType.ACTOR,
            start:0,
            end:5,
            line:1,
        },
        eof(source,1)
    ])
})
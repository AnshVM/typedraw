// U = "user"
// U -> E = "some thing"

export enum TokenType {
    EQUAL = 0,
    STRING = 1,
    LEFT_ARROW = 2,
    RIGHT_ARROW = 3,
    ACTOR = 4,
    ACTION = 5,
    IDENTIFIER = 6,
    SEMICOLON = 7,
    LEFT_PAREN = 8,
    RIGHT_PAREN = 9,
    ERROR = 10,
    EOF = 11
}

const KEYWORDS = new Map<string, number>();
KEYWORDS.set("actor", TokenType.ACTOR);
KEYWORDS.set("action", TokenType.ACTION);

export type Token = {
    type: TokenType,
    line: number,
    start: number,
    end: number
}

export type ScanError = {
    message: string,
    token: Token
}

function isAlpha(char: string): boolean {
    return (char.length == 1 && /^[a-zA-Z]$/.test(char)) || char == '_';
}

function isAlphaNumeric(char: string): boolean {
    return (char.length == 1 && /^[a-zA-Z0-9]$/.test(char)) || char == '_';
}

export default class Scanner {
    private start = 0;
    private current = 0;
    private line = 1;
    private tokens: Token[] = [];
    private source: string;
    errors: string[] = [];

    constructor(source: string) {
        this.source = source + '\0';
    }

    isAtEnd(): boolean {
        return this.source[this.current] === '\0';
    }

    advance(): string {
        if (this.isAtEnd()) return ''
        return this.source[this.current++];
    }

    peek(): string {
        if (this.isAtEnd()) return ''
        return this.source[this.current]
    }

    match(c: string): boolean {
        if (this.isAtEnd()) return false;
        return this.peek() == c;
    }

    addToken(type: TokenType): Token {
        const token: Token = {
            type,
            start: this.start,
            end: this.current,
            line: this.line
        }
        this.tokens.push(token);
        this.start = this.current;
        return token;
    }

    string() {
        this.start++; //string token should include the double quotes, only the string value
        while (this.peek() != '"') {
            const c = this.advance();
            if (this.isAtEnd() || c == '\n') {
                this.scannerError("Unterminated string");
                return;
            }
        }
        this.addToken(TokenType.STRING);
        this.start++;
        this.advance();
    }

    identifier() {
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const lexeme = this.source.slice(this.start, this.current);
        const tokenType = KEYWORDS.get(lexeme);
        if (tokenType != undefined) {
            this.addToken(tokenType);
        } else {
            this.addToken(TokenType.IDENTIFIER);
        }
    }

    scannerError(message: string): string {
        const error = `[Line ${this.line}]: ${message} at '${this.source.slice(this.start, this.current)}'.`;
        this.errors.push(error);
        this.start++;
        return error
    }

    addEOF() {
        this.tokens.push({
            type: TokenType.EOF,
            start: this.source.length - 1,
            end: this.source.length,
            line: this.line,
        })
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            const c = this.advance();

            switch (c) {
                case ' ':
                case '\t':
                case '\r':
                    this.start++;
                    break;
                case '\n':
                    this.start++;
                    this.line++;
                    break;
                case ';':
                    this.addToken(TokenType.SEMICOLON);
                    break;
                case '(':
                    this.addToken(TokenType.LEFT_PAREN);
                    break;
                case ')':
                    this.addToken(TokenType.RIGHT_PAREN);
                    break;
                case '=':
                    this.addToken(TokenType.EQUAL);
                    break;
                case '-':
                    if (this.match('>')) {
                        this.advance();
                        this.addToken(TokenType.RIGHT_ARROW);
                    } else {
                        this.scannerError("Unexpected character");
                    }
                    break;
                case '<':
                    if (this.match('-')) {
                        this.advance();
                        this.addToken(TokenType.LEFT_ARROW);
                    } else {
                        this.scannerError("Unexpected character");
                    }
                    break;
                case '"':
                    this.string();
                    break;
                default:
                    if (isAlpha(c)) {
                        this.identifier();
                    } else {
                        this.scannerError("Unexpected character");
                    }
                    break;
            }
        }
        this.addEOF()
        return this.tokens;
    }
}

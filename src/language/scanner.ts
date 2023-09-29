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

const CLASS_TOKEN_SEMICOLON = 'class_token_semicolon';
const CLASS_TOKEN_EQUAL = 'class_token_equal';
const CLASS_TOKEN_LEFTARROW = 'class_token_leftarrow';
const CLASS_TOKEN_RIGHTARROW = 'class_token_rightarrow';
const CLASS_TOKEN_ACTOR = 'class_token_actor';
const CLASS_TOKEN_ACTION = 'class_token_action';
const CLASS_TOKEN_IDENTIFIER = 'class_token_identifier';
const CLASS_TOKEN_STRING = 'class_token_string';

const KEYWORDS = new Map<string, number>();
KEYWORDS.set("actor", TokenType.ACTOR);
KEYWORDS.set("action", TokenType.ACTION);

const HIGHLITED = new Map<number,string>();
HIGHLITED.set(TokenType.ACTOR,span("actor",CLASS_TOKEN_ACTOR));
HIGHLITED.set(TokenType.ACTION,span("action",CLASS_TOKEN_ACTION));


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

function span(innerHTML:string, className:string) {
    return `<span class="${className}">${innerHTML}</span>`
}

export default class Scanner {
    private start = 0;
    private current = 0;
    private line = 1;
    private source: string;
    tokens: Token[] = [];
    errors: string[] = [];
    highlited:string[] = [];

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
            this.highlited.push(span(c,''));
            if (this.isAtEnd() || c == '\n') {
                this.scannerError("Unterminated string");
                return;
            }
        }
        while(this.highlited.pop() != span('"','')) {};
        this.highlited.push(span(`"${this.source.slice(this.start,this.current)}"`,CLASS_TOKEN_STRING));
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
            this.highlited.push(HIGHLITED.get(tokenType) as string);
            this.addToken(tokenType);
        } else {
            this.highlited.push(span(lexeme,CLASS_TOKEN_IDENTIFIER));
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
                this.highlited.push(span(' ',''));
                this.start++;
                break;
                case '\t':
                case '\r':
                    this.start++;
                    break;
                case '\n':
                    this.highlited.push('<br>')
                    this.start++;
                    this.line++;
                    break;
                case ';':
                    this.highlited.push(span(c,CLASS_TOKEN_SEMICOLON));
                    this.addToken(TokenType.SEMICOLON);
                    break;
                case '(':
                    this.highlited.push(span(c,''));
                    this.addToken(TokenType.LEFT_PAREN);
                    break;
                case ')':
                    this.highlited.push(span(c,''));
                    this.addToken(TokenType.RIGHT_PAREN);
                    break;
                case '=':
                    this.highlited.push(span(c,CLASS_TOKEN_EQUAL));
                    this.addToken(TokenType.EQUAL);
                    break;
                case '-':
                    this.highlited.push(span('-',''))
                    if (this.match('>')) {
                        this.advance();
                        this.addToken(TokenType.RIGHT_ARROW);
                        this.highlited.pop()
                        this.highlited.push(span('->',CLASS_TOKEN_RIGHTARROW));
                    } else {
                        this.scannerError("Unexpected character");
                    }
                    break;
                case '<':
                    this.highlited.push(span('-',''))
                    if (this.match('-')) {
                        this.advance();
                        this.addToken(TokenType.LEFT_ARROW);
                        this.highlited.pop();
                        this.highlited.push(span('<-',CLASS_TOKEN_LEFTARROW));
                    } else {
                        this.scannerError("Unexpected character");
                    }
                    break;
                case '"':
                    this.highlited.push(span('"',''));
                    this.string();
                    break;
                default:
                    if (isAlpha(c)) {
                        this.identifier();
                    } else {
                        this.scannerError("Unexpected character");
                        this.highlited.push(span(c,''));
                    }
                    break;
            }
        }
        this.addEOF()
        return this.tokens;
    }
}

// U = "user"
// U -> E = "some thing"

enum TokenType {
    EQUAL,
    STRING,
    LEFT_ARROW,
    RIGHT_ARROW,
    IDENTIFIER,
    SEMICOLON,
    ERROR
}

type Token = {
    type: TokenType,
    line: number,
    start: number,
    end: number
}

function isAlpha(char: string): boolean {
    return (char.length == 1 && /^[a-zA-Z]$/.test(char)) || char == '_';
}

function isAlphaNumeric(char: string): boolean {
    return (char.length == 1 && /^[a-zA-Z0-9]$/.test(char)) || char == '_';
}

class Scanner {
    start = 0;
    current = 0;
    line = 1;
    tokens: Token[] = [];
    source: string;

    constructor(source: string) {
        this.source = source;
    }

    isAtEnd(): boolean {
        return this.current >= this.source.length - 1;
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

    peekNext(): string {
        return this.source[this.current + 1];
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
        this.advance();
    }

    identifier() {
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }
        this.addToken(TokenType.IDENTIFIER);
    }

    scannerError(message: string) {
        const error = `[Line ${this.line}]: ${message} at ${this.source.slice(this.start, this.current)}`
        //for now, we are only logging the error
        console.log(error)
        if (this.isAtEnd()) {
            return
        }
        while (this.peek() != ';') {
            this.advance();
        }
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            const c = this.advance();

            switch (c) {
                case ' ':
                case '\t':
                case '\r':
                    continue;
                case '\n':
                    this.line++;
                    break;
                case ';':
                    this.addToken(TokenType.SEMICOLON)
                    break;
                case '=':
                    this.addToken(TokenType.EQUAL);
                    break;
                case '-':
                    if (this.match('>')) {
                        this.advance();
                        this.addToken(TokenType.RIGHT_ARROW);
                    } else {
                        this.scannerError("Unexpected character '-'");
                    }
                    break;
                case '<':
                    if (this.match('-')) {
                        this.advance();
                        this.addToken(TokenType.LEFT_ARROW);
                    } else {
                        this.scannerError("Unexpected character '<'");
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
            }
        }
        return this.tokens;
    }
}


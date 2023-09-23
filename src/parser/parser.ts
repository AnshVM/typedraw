// actor U = "user";
// action U -> E = "some thing";

// stmt -> (actorDecl | actionDecl)";"
// actorDecl -> "actor" identifier "=" string
// actionDecl -> "action" identifier (RIGHT_ARROW | LEFT_ARROW) identifier "=" string

import { ActionDeclaration, ActorDeclartion, Arrow, Statement } from './ast';
import { Token, TokenType } from './scanner';

export default class Parser {
    tokens: Token[] = [];
    current = 0;
    source: string

    constructor(tokens: Token[], source: string) {
        this.tokens = tokens;
        this.source = source;
    }

    peek(): Token {
        return this.tokens[this.current];
    }

    previous(): Token | null{
        if(this.current == 0) return null;
        return this.tokens[this.current - 1]; 
    }

    isAtEnd(): boolean {
        return this.peek().type == TokenType.EOF;
    }

    action(): ActionDeclaration {
        const left = this.consume(TokenType.IDENTIFIER,"Expected actor name");
        let arrow;        
        switch(this.peek().type){
            case TokenType.RIGHT_ARROW:
                this.advance()
                arrow = Arrow.RIGHT;
                break;
            case TokenType.LEFT_ARROW:
                this.advance()
                arrow = Arrow.LEFT;
                break;
            default:
                throw new Error(this.generateParseError("Expected '->' or '<-'"));
        }

        const right = this.consume(TokenType.IDENTIFIER,"Expected actor name");
        this.consume(TokenType.EQUAL,"Expected '='");
        const value = this.consume(TokenType.STRING,"Expected string");
        return {
            leftActor:this.source.slice(left.start,left.end),
            rightActor:this.source.slice(right.start,right.end),
            direction: arrow,
            value: this.source.slice(value.start,value.end),
        }
    }

    actor(): ActorDeclartion {
        const name = this.consume(TokenType.IDENTIFIER,"Expected actor name");
        this.consume(TokenType.EQUAL,"Expected '='");
        const value = this.consume(TokenType.STRING,"Expected string");
        return {
            name: this.source.slice(name.start,name.end),
            value: this.source.slice(value.start,value.end),
        }
    }

    generateParseError(message: string): string {
        return `[Line: ${this.peek().line}] ${message} : at '${this.source[this.peek().start, this.peek().end]}'`
    }

    advance() {
        if (this.isAtEnd()) return this.peek();
        return this.tokens[this.current++];
    }

    match(type: TokenType): boolean {
        return this.peek().type === type;
    }

    consume(type: TokenType, message: string):Token {
        if (this.match(type)) {
            return this.advance();
        }
        throw new Error(this.generateParseError(message));
    }

    statement(): Statement {
        let stmt: Statement;
        switch (this.peek().type) {
            case TokenType.ACTOR:
                this.advance();
                stmt = this.actor();
                break;
            case TokenType.ACTION:
                this.advance();
                stmt = this.action();
                break;
            default:
                throw new Error(this.generateParseError("Expected declaration"));
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' at end of statement");
        return stmt;
    }

    synchronize() {
        this.advance();
        while(!this.isAtEnd()) {
            if(this.previous()?.type === TokenType.SEMICOLON) return;

            switch(this.peek().type) {
                case TokenType.ACTION:
                case TokenType.ACTOR:
                    return;
            }
            this.advance();
        } 
    }

    parse(): Statement[] {
        const statements: Statement[] = [];
        while (!this.isAtEnd()) {
            try {
                let stmt = this.statement();
                statements.push(stmt);
            } catch (error) {
                this.synchronize();
            }
        }
        return statements;
    }

}
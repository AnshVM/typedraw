import { Statement, ActionDeclaration, ActorDeclartion, Types, Arrow } from "../language/ast";
import { drawArrow, drawLine } from "./utils";

const SPACING = 100;
const HEIGHT = 100;
const PADDING = HEIGHT / 2;
const ACTION_SPACING_VERTICAL = 50;
const TIMELINE_LENGTH = 100;
const X = 0;
const Y = 0;
const FONT_SIZE = 20;
const MAX_BOX_WIDTH = 150;
const DEFAULT_FONT = `${FONT_SIZE}x arial`;

type Actor = {
    index: number,
    value: string
}

export default class Renderer {
    statements: Statement[];
    context: CanvasRenderingContext2D;
    actors = new Map<string, Actor>();
    actions: ActionDeclaration[] = [];
    width: number;
    fontSize:number = 20; 
    timelineLength = 0;

    constructor(statements: Statement[], context: CanvasRenderingContext2D, width: number) {
        this.statements = statements;
        this.context = context;
        this.width = width;
        context.font = `${this.fontSize}px arial`;
    }

    actor(stmt: ActorDeclartion) {
        const index = this.actors.size;
        this.actors.set(stmt.name, { index, value: stmt.value });
    }

    action(stmt: ActionDeclaration) {
        this.actions.push(stmt);
    }

    statement(stmt: Statement) {
        switch (stmt.type) {
            case Types.ACTOR_DECLARATION:
                this.actor(stmt);
                break;
            case Types.ACTION_DECLARATION:
                this.action(stmt);
                break;
        }
    }

    scaleFont(n:number) {
        this.fontSize = this.fontSize + n;
        this.context.font = `${this.fontSize}px arial`;
    }

    defaultFont() {
        this.fontSize = 28;
        this.context.font = DEFAULT_FONT;
    }

    drawActors(x: number, y: number) {
        this.actors.forEach(({ value }) => {
            const boxWidth = this.getBoxWidth();
            this.context.strokeRect(x, y, boxWidth, HEIGHT);

            let textMetrics = this.context.measureText(value);

            while(textMetrics.width > boxWidth ) {
                this.scaleFont(-1); 
                textMetrics = this.context.measureText(value);
            } 

            const x_text = x + (boxWidth - textMetrics.width) / 2

            this.context.fillText(value, x_text, y + PADDING, boxWidth);
            x += boxWidth + SPACING;
        })
    }

    getBoxWidth(): number {
        const available = (this.width - ((this.actors.size - 1) * SPACING)) / this.actors.size
        return available > MAX_BOX_WIDTH ? MAX_BOX_WIDTH : available;
    }

    boxBottomMid(index: number): number[] {
        const boxWidth = this.getBoxWidth();
        const boxMid_x = X + ((boxWidth + SPACING) * (index)) + boxWidth / 2;
        const boxMid_y = Y + HEIGHT;
        return [boxMid_x, boxMid_y]
    }

    extendTimeline() {
        if (this.timelineLength === 0) {
            this.timelineLength = TIMELINE_LENGTH;
        } else {
            this.timelineLength = this.timelineLength + TIMELINE_LENGTH;
        }
        console.log(this.timelineLength)
        this.actors.forEach(actor => {
            const [boxMid_x, boxMid_y] = this.boxBottomMid(actor.index)
            drawLine(this.context, boxMid_x, boxMid_y, boxMid_x, boxMid_y + this.timelineLength)
        })
    }

    check(actor: string): Actor {
        if (this.actors.has(actor)) {
            return this.actors.get(actor) as Actor;
        } else {
            throw new Error(`${actor} is undefined`);
        }
    }

    next(name: string, index: number): number[] {
        const actor = this.check(name);
        const [boxBottomMid_x, boxBottomMid_y] = this.boxBottomMid(actor.index);
        return [boxBottomMid_x, boxBottomMid_y + ACTION_SPACING_VERTICAL * (index + 1)];
    }


    drawActions() {
        this.actions.forEach((action, index) => {
            this.extendTimeline()
            const leftActor = action.leftActor;
            const rightActor = action.rightActor;
            const direction = action.direction;

            this.check(leftActor);
            this.check(rightActor);

            const [x1, y1] = this.next(leftActor, index)
            const [x2, y2] = this.next(rightActor, index);

            let textMetrics = this.context.measureText(action.value);
            
            while(textMetrics.width > Math.abs(x2-x1)) {
                this.scaleFont(-1);
                textMetrics = this.context.measureText(action.value);
            }
            const padding = Math.abs(x2 - x1) - textMetrics.width;
            this.context.fillText(action.value,Math.min(x1,x2)+padding/2,y1-3,Math.abs(x2-x1));
            this.defaultFont();
            switch (direction) {
                case Arrow.RIGHT:
                    drawArrow(this.context, x1, y1, x2, y2);
                    break;
                case Arrow.LEFT:
                    drawArrow(this.context, x2, y2, x1, y1);
                    break;
            }

        })
    }

    render() {
        this.statements.forEach((stmt: Statement) => {
            this.statement(stmt)
        })

        const requiredWidth = (this.getBoxWidth() * this.actors.size) + (SPACING * (this.actors.size - 1));

        this.context.translate((this.width - requiredWidth)/2,20);

        this.drawActors(X, Y);
        this.drawActions();
    }

}

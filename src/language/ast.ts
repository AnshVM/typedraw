
// actor U = "user";
// action U -> E = "some thing";

// stmt -> (actorDecl | actionDecl)";"
// actorDecl -> "actor" identifier "=" string
// actionDecl -> "action" identifier (RIGHT_ARROW | LEFT_ARROW) identifier "=" string

export type Statement = ActorDeclartion | ActionDeclaration;
export enum Types {
    ACTOR_DECLARATION,
    ACTION_DECLARATION,
}

export type ActorDeclartion = {
    type: Types.ACTOR_DECLARATION,
    name: string,
    value: string
};

export enum Arrow {
    LEFT,
    RIGHT 
}

export type ActionDeclaration = {
    type: Types.ACTION_DECLARATION,
    leftActor: string,
    rightActor: string,
    direction: Arrow,
    value: string
};
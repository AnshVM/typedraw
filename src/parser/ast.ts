
// actor U = "user";
// action U -> E = "some thing";

// stmt -> (actorDecl | actionDecl)";"
// actorDecl -> "actor" identifier "=" string
// actionDecl -> "action" identifier (RIGHT_ARROW | LEFT_ARROW) identifier "=" string

export type Statement = ActorDeclartion | ActionDeclaration;

export type ActorDeclartion = {
    name: string,
    value: string
};

export enum Arrow {
    LEFT,
    RIGHT 
}

export type ActionDeclaration = {
    leftActor: string,
    rightActor: string,
    direction: Arrow,
    value: string
};
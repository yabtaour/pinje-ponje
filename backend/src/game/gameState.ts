type Player = {
    id: number,
    paddlePosition: number,
    score: number,
}

export class GameState {
    player1: Player;
    player2: Player;
    ballPosition: {x: number, y: number};
    ballVelocity: {x: number, y: number};

    constructor(
        player1: Player,
        player2: Player,
        ballVelocity: {x: number, y: number}
    ) {
        this.player1 = player1;
        this.player2 = player2;
        this.ballVelocity = ballVelocity;
    } 
    
}
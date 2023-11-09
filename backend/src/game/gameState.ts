type Player = {
    id: number,
    paddlePosition: number,
    score: number,
}

export class GameState {
    constructor(
        player1: Player,
        player2: Player,
        ballPosition: {x: number, y: number},
        ballVelocity: {x: number, y: number}
    ) {
        this.player1 = player1;
        this.player2 = player2;
        this.ballPosition = ballPosition;
        this.ballVelocity = ballVelocity;
    }
    
    private player1: Player;
    private player2: Player;
    private ballPosition: {x: number, y: number};
    private ballVelocity: {x: number, y: number};


    updatePlayerPaddlePosition(playerId: number, position: number) {
        if (playerId === this.player1.id) {
            this.player1.paddlePosition = position;
        } else if (playerId === this.player2.id) {
            this.player2.paddlePosition = position;
        } else {
            throw new Error(`Player with id ${playerId} not found`);
        }
    }

    getPlayerPaddlePosition(playerId: number) {
        if (playerId === this.player1.id) {
            return this.player1.paddlePosition;
        } else if (playerId === this.player2.id) {
            return this.player2.paddlePosition;
        } else {
            throw new Error(`Player with id ${playerId} not found`);
        }
    }

    updateBallPosition() {
        this.ballPosition.x += this.ballVelocity.x;
        this.ballPosition.y += this.ballVelocity.y;
    }

    getBallPosition() {
        return this.ballPosition;
    }

    updatePlayersScores(playerId: number, score: number) {
        if (playerId === this.player1.id) {
            this.player1.score = score;
        } else if (playerId === this.player2.id) {
            this.player2.score = score;
        } else {
            throw new Error(`Player with id ${playerId} not found`);
        }
    }

    getPlayersScores() {
        return [this.player1.score, this.player2.score];
    }

    getGameState() {
        return {
            player1: {
                paddlePosition: this.player1.paddlePosition,
                score: this.player1.score,
            },
            player2: {
                paddlePosition: this.player2.paddlePosition,
                score: this.player2.score,
            },
            ballPosition: this.ballPosition,
        }
    }
}
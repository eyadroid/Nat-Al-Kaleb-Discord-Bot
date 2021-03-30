import Stone from './Stone';
import Board from './Board';
import Strike from './Strike';
import Player from './Player';

export default class Game {
    public player1:Player;
    public player2:Player;
    public role:Player;
    public groupId:String;
    public stones:Array<Stone> = []
    public strike:Strike = null;
    static games:Array<Game> = [];
    constructor(player1:Player,player2:Player, groupId:String) {
        this.player1 = player1;
        this.player2 = player2;
        this.groupId = groupId;
        this.role = player1;
        // this.stones= [
        //     new Stone(player2,2,2),
        //     new Stone(player2,3,3),
        //     new Stone(player2,3,1),
        //     new Stone(player1,4,3),
        //     new Stone(player1,4,4),
        // ]
        for (var col=1;col<=Board.columns;col++) {
            for (var row=1;row<=Board.rows;row++) {
                if (row < 3) this.stones.push(new Stone(player1,col,row));
                else if ( row > 3) this.stones.push(new Stone(player2,col,row));
                else if (row == 3) {
                    if (col < 3 )this.stones.push(new Stone(player1,col,row));
                    else if (col > 3) this.stones.push(new Stone(player2,col,row));
                }
            }
        }
    }

    getStoneFromXY(x:number,y:number) {
        for (var i=0;i<this.stones.length;i++)
            if (this.stones[i].x == x && this.stones[i].y == y) return this.stones[i]
    }

    canMove(stone:Stone, x:number, y:number) {
        // check if the coords are vaild
        if (x > 5 || x < 1 ||  y > 5 || y < 1) return false;
        // check if no other stone there
        if (this.getStoneFromXY(x,y) != null) return false;
        // check if stone can go there
        return true;
    }

    canKill(stone:Stone, x:number, y:number) {
        if (!this.canMove(stone,x,y)){
            return null;}
        if (Math.abs(stone.x - x) == 2) {
            // check if can kill someone
            var toBeKilled = this.getStoneFromXY(Math.min(stone.x,x) + 1,stone.y);
            if (toBeKilled && toBeKilled.player != stone.player) {
                return toBeKilled;
            }
        }
        else if (Math.abs(stone.y - y) == 2) {
            // check if can kill someone
            var toBeKilled = this.getStoneFromXY(x,Math.max(stone.y,y) - 1);
            if (toBeKilled && toBeKilled.player != stone.player) {
                return toBeKilled;
            }
        }
    }

    canMakeStrike(stone:Stone) {
        return (
            this.canKill(stone,stone.x+2,stone.y) ||
            this.canKill(stone,stone.x-2,stone.y) ||
            this.canKill(stone,stone.x,stone.y+2) ||
            this.canKill(stone,stone.x,stone.y-2)
        )
    }

    getTheWinner():Player {
        var scoors = {};
        if (this.stones.filter((stone)=> stone.player.id == this.player1.id).length == 0) {
            return this.player2
        }
        else if(this.stones.filter((stone)=> stone.player.id == this.player2.id).length == 0) {
            return this.player1
        }
        else return null;
    }

    public static userHaveGameInGroup(player:Player, groupId:String) {
        for(var game of this.games) {
            if ((game.player1.id == player.id || game.player2.id == player.id) && game.groupId == groupId) 
            return game
        }
    }
}
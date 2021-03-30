import Player from "./Player";

export default class Stone {
    public player:Player;
    public x:number;
    public y:number;

    constructor(player:Player,x:number,y:number) {
        this.player = player;
        this.x = x;
        this.y = y;
    }

    move(x:number,y:number) {
        this.x , this.y = x,y;
    }

    

    
}
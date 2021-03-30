import Player from './Player';

export default class Message {
    public groupId:String;
    public sender:Player;
    public mention:Player;
    public content:String;

    constructor(groupId:String,sender:Player,content:String,mention:Player) {
        this.groupId = groupId;
        this.sender = sender;
        this.content = content;
        this.mention = mention;
    }
}
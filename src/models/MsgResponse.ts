export default class MsgResponse {
    public msg:String;
    public image:Buffer;
    constructor(msg:String,image:Buffer) {
        this.msg = msg;
        this.image = image;
    }
}
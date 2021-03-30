import Command from "../models/Command";
import Message from "../models/Message";
import MsgResponse from "../models/MsgResponse";



export default class CommandProcesser {
    public static proccessCommand(msg:Message):Promise<MsgResponse> {
        return new Promise((resolve, reject)=> {
            if (msg.content == null || msg.content == "") reject("أمر غير معروف")
            if (msg.content.substring(0,1) != '!') reject("أمر غير معروف")
    
            let promise:Promise<MsgResponse>;
            let spacePosistion = msg.content.indexOf(' ');
            switch(msg.content.substring(1,spacePosistion>-1 ?spacePosistion : msg.content.length)) {
                case 'أرح':
                    promise = Command.play.proccess(msg)
                break;
                case 'ارح':
                    promise = Command.play.proccess(msg)
                break;
                case 'arah':
                    promise = Command.play.proccess(msg)
                break;
                case 'حرك':
                    promise = Command.move.proccess(msg)
                break;
                case 'move':
                    promise = Command.move.proccess(msg)
                break;
                case 'الحالة':
                    promise = Command.status.proccess(msg)
                break;
                case 'status':
                    promise = Command.status.proccess(msg)
                break;
                case 'الحنك':
                    promise = Command.help.proccess(msg)
                break;
                case 'alhanak':
                    promise = Command.help.proccess(msg)
                break;
            }
            if (promise) {
                promise.then((data:MsgResponse)=> {
                    resolve(data)
                }, error=> reject(error))
            }
            else {
                reject('no command')
            }
        })
    }
}


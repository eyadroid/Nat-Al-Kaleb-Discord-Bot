import Message from './models/Message';
import Player from './models/Player';
import MsgResponse from './models/MsgResponse';
import CommandProcesser from './services/proccess';
import Rendere from './services/rendere';
import randomCommenter from './services/randomCommentr'
let player1 = new Player(
  "1",
  "Player1",
  null
);
let player2 = new Player(
  "2",
  "Player2",
  null
);
let groupId = "122"

let msgs = [
  new Message(groupId, player1,"!الحنك", player2),
  // new Message(groupId, player1,"!حرك ٢٣ ل ٣٣", player2),
  // new Message(groupId, player2,"!حرك 43 ل 23", player1),

  // new Message(groupId, player1,"!move 21 to 41", null),
];

for(let msg of msgs)
  CommandProcesser.proccessCommand(msg).then(async(response:MsgResponse)=> {
    console.log(response.msg)
    if (response.image) await Rendere.saveImg(response.image)
  }, reject=> {
    console.log(reject)
  })


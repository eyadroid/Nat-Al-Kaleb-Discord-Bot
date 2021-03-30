import RandomCommenter from '../services/randomCommentr';
import Rendere from '../services/rendere';
import Game from './Game';
import Message from './Message';
import MsgResponse from './MsgResponse';
import Player from './Player';
import Stone from './Stone';
import Strike from './Strike';

export default class Command {
    public proccesser:Function;
    constructor(
        proccesser:Function,
    ){
        this.proccesser = proccesser
    }

    public proccess(msg:Message):Promise<MsgResponse> {
        return this.proccesser(msg)
    }

    

    public static play:Command = new Command((msg:Message)=> {
        return new Promise(async (resolve, reject)=> {
            if (!msg.mention) {
                return resolve(new MsgResponse("يجب عمل مينشن لمستخدم تاني", null))
            }
            else {
                let perviousUserGame = Game.userHaveGameInGroup(msg.sender, msg.groupId);
    
                if (perviousUserGame) {
                    Game.games.splice(Game.games.indexOf(perviousUserGame));
                }
    
                var theNewGame = new Game(
                    msg.sender,
                    msg.mention,
                    msg.groupId
                );
                Game.games.push(theNewGame)
                return resolve(new MsgResponse(
                    "تم عمل لعبة جديدة",
                    await Rendere.renderGame(theNewGame)
                ))
            }
        })
    });
    public static move:Command = new Command((msg:Message)=> {
        return new Promise(async (resolve, reject)=> {
            
            let game = Game.userHaveGameInGroup(msg.sender, msg.groupId);

            
            let killStone = async (killer:Stone,killed:Stone)=> {
                game.stones.splice(game.stones.indexOf(killed), 1)
                killer.x = tox;
                killer.y = toy;
                if (game.canMakeStrike(killer)) {
                    game.strike = new Strike(
                        killer 
                    );
                    let theWinner = game.getTheWinner();
                    if (theWinner) {
                        Game.games.splice(Game.games.indexOf(game), 1);
                        return resolve(new MsgResponse("الفائز: "+theWinner.name, null))
                    }
                    else
                        return resolve(new MsgResponse(RandomCommenter.getRandomDoubleKillComment(), await Rendere.renderGame(game)))
                }
                else {
                    game.role = killer.player==game.player1 ?game.player2:game.player1;
                    game.strike = null;
                    let theWinner = game.getTheWinner(); 
                    if (theWinner) {
                        Game.games.splice(Game.games.indexOf(game), 1);
                        return resolve(new MsgResponse("الفائز: "+theWinner.name, null))
                    }
                    else
                        return resolve(new MsgResponse(RandomCommenter.getRandomKillComment(), await Rendere.renderGame(game)))
                }
            };
            if (!game) {
                return resolve(new MsgResponse(("ليس لديك لعبة حالية"), null))
            }

            var params = msg.content.split(" ");
            if (params.length != 4) return reject("");
            
            var stonexy = fixNumbers(params[1]).split('');
            
            if (stonexy.length != 2 || (parseInt(stonexy[0]) == NaN && parseInt(stonexy[1]) == NaN)) {
                return reject("");
            }

            if (params[2] != 'to' && params[2] != 'ل') return reject("")

            var toxy = fixNumbers(params[3]).split('');
        
            if (toxy.length != 2 || (parseInt(toxy[0]) == NaN && parseInt(toxy[1]) == NaN)) {
                return reject("");
            }


            var stonex = parseInt(stonexy[0])
            var stoney = parseInt(stonexy[1])
            
            var tox = parseInt(toxy[0])
            var toy = parseInt(toxy[1])
            
            var selectedStone = game.getStoneFromXY(stonex,stoney)

            if (selectedStone == null) {
                return resolve(new MsgResponse("لا يوجد حجر هنا",null));
            }
            else if (msg.sender.id != game.role.id) {
                return resolve(new MsgResponse("ما جيمك",null));
            }
            else if (selectedStone.player.id != game.role.id) {
                return resolve(new MsgResponse("ما حجرك",null));
            }
            
            else {
                console.log("Stones good");
                if (game.strike) {
                    if (selectedStone != game.strike.stone) {
                        return resolve(new MsgResponse("عندك نطة بحجر تاني",null));
                    }
                    var stoneWillBeKilled = game.canKill(selectedStone, tox, toy);
                    if (stoneWillBeKilled == null) return resolve(new MsgResponse("حركة غير صالحة",null));
                    else {
                        killStone(selectedStone,stoneWillBeKilled)
                    }
                }
                else {
                    // if moving 1
                    if (
                        (Math.abs(selectedStone.x -tox) == 1 && selectedStone.y == toy)
                        ||
                        (Math.abs(selectedStone.y -toy) == 1 && selectedStone.x == tox)
                    ) {
                        if (game.canMove(selectedStone, tox, toy)) {
                            selectedStone.x = tox;
                            selectedStone.y = toy;
                            game.role = selectedStone.player==game.player1 ?game.player2:game.player1;
                            // render(game);
                            return resolve(new MsgResponse("إتحركت", await Rendere.renderGame(game)))
                        }
                        else {
                            return resolve(new MsgResponse(("ما مكن يتحرك هناك"), null));
                        }
                    }
                    else if (
                        (Math.abs(selectedStone.x -tox) == 2 && selectedStone.y == toy)
                        ||
                        (Math.abs(selectedStone.y -toy) == 2 && selectedStone.x == tox)
                    ) {
                        var stoneWillBeKilled = game.canKill(selectedStone, tox, toy);
                        if (stoneWillBeKilled != null) {
                            killStone(selectedStone,stoneWillBeKilled)
                        }
                        else {
                            return resolve(new MsgResponse(("ما بتقدر تقتلو"), null));
                        }
                    }
                    else {
                        return resolve(new MsgResponse("الحجر ما بمشي أكتر من مربع واحد إلا لو داير يقتل بمشي مربعين", null));
                    }
                    
                }
            }

            
        })
    });

    public static status:Command = new Command((msg:Message)=> {
        return new Promise(async (resolve, reject)=> {
            if (msg.mention == null) return resolve(new MsgResponse(("يجب عمل مينشن لمستخدم تاني"), null))
            let perviousUserGame = Game.userHaveGameInGroup(msg.sender, msg.groupId);

            if (!perviousUserGame) {
                return resolve(new MsgResponse(("ما عندك لعبة أصلاً"), null));
            }
            return resolve(new MsgResponse("لعبتك", await Rendere.renderGame(perviousUserGame)))
        })
    });
    public static help:Command = new Command((msg:Message)=> {
        return new Promise(async (resolve, reject)=> {
            return resolve(new MsgResponse( `الأوامر المتوفرة:
                !ارح (arah): عشان تبدا جيم جديد ولازم تمنشن الحتلعب معاهو 
                !الحالة (status): عشان تشوف الجيم الحالي ولازم تمنشن اللاعب معاهو
                !حرك ل (move to): بعديها الحجر الداير تحركو ثم "ل" ثم الموقع الحترحكو ليهو
                !الحنك (alhanak): لحنك الأوامر دا
                شرح كيف تلعب اللعبة: https://www.youtube.com/watch?v=kkIGLxcQnCc
            `, null))
        })
    });
}

var
persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
fixNumbers = function (str)
{
  if(typeof str === 'string')
  {
    for(var i=0; i<10; i++)
    {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
};
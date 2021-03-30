import Message from './models/Message';
import Player from './models/Player';
import MsgResponse from './models/MsgResponse';
import CommandProcesser from './services/proccess';

import cron from 'cron';
import fetch from 'node-fetch';
import RandomCommenter from './services/randomCommentr';

const url = "https://gentle-ravine-78108.herokuapp.com/";

(() => {

  const cronJob = new cron.CronJob('0 */25 * * * *', () => {

    fetch(url)
      .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
      .catch((e)=>{})
  });
  cronJob.start();
})();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
    const setCustomStatusCronJop = new cron.CronJob('0 */2 * * *', () => {
        let customStatus = RandomCommenter.getRandomStatus();
        client.user.setPresence({ activity: { name: customStatus.name, type:customStatus.status, application:"test"}, status: 'online' })
      });
      setCustomStatusCronJop.start();
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content == null || msg.content == "") return
    if (msg.content.substring(0,1) != '!') return
    if (msg.channel.guild == null) return;
    let mentionsArray = msg.mentions.users.array();
    if (mentionsArray.length > 1) return;

    let mention = null;
    if (mentionsArray.length == 1) {
        let mentionedUser = mentionsArray[0];

        mention = new Player(
            mentionedUser.id,
            mentionedUser.username,
            mentionedUser.avatar
        );
    }
    let message = new Message(
        msg.channel.guild.id,
        new Player(
            msg.author.id,
            msg.author.username,
            msg.author.avatar
        ),
        msg.content,
        mention
    );
    console.log(message);
    CommandProcesser.proccessCommand(message).then((response:MsgResponse)=> {

        let files = [];
        if (response.image) files[0] = response.image
        msg.reply(response.msg, {
            files
        });
    }, reject=> {

    })

});
try {
    client.login('NzU5MzU0MDEzMTExNjgxMDU0.X28RiA.Hqn4c7Adj_8tLhewjBDM2uL80v0');
}
catch (e) {
    console.log(e)
}

var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(request.url);
    response.end();
}).listen(process.env.PORT || 5000);


console.log(`sever listening in port: ${process.env.PORT || 5000}`)
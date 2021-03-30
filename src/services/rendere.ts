import {Canvas, Image, registerFont} from 'canvas';
import Board from '../models/Board';
import Game from '../models/Game';
import fs from 'fs'

const config = require("../config.json");

const player1ImageFile = fs.readFileSync(__dirname + '/../../assets/images/player1.png');
const player2ImageFile = fs.readFileSync(__dirname + '/../../assets/images/player2.png');
const player1Image = new Image;
player1Image.src = player1ImageFile;
const player2Image = new Image;
player2Image.src = player2ImageFile;
const playernoAvatarImage = fs.readFileSync(__dirname + '/../../assets/images/user.png');
const playernoAvatar = new Image;
playernoAvatar.src = playernoAvatarImage;
const canvas = new Canvas(config.WINDOW_WIDTH, config.WINDOW_HEIGHT)
const ctx = canvas.getContext('2d')
registerFont('./assets/fonts/22876-gen01.ttf', { family: '22876-gen01' })
const roundedImage = (img,x,y,width,height,radius)=>{
    ctx.drawImage(img, x, y, width, height);

  }
function createImgFromUrl(url):Promise<Image>{ 
    return new Promise((resolve, reject)=> {
        let image = new Image;
        image.src = url;
        image.onload = ()=> resolve(image)
    })
}

export default class Rendere {

    private static clearCanvas() {
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        ctx.restore();
        ctx.fillStyle = 'rgba(164, 86, 50,1)'
        ctx.fillRect(0,0,config.WINDOW_WIDTH,config.WINDOW_HEIGHT)
        ctx.fillStyle = 'rgba(244, 175, 120,1)'
        ctx.strokeStyle = 'rgba(244, 175, 120,1)'
        ctx.lineWidth = 5;
        ctx.textAlign = "start";
    }

    private static drawBackground() {
        ctx.beginPath()
        ctx.lineTo(0, (config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2)
        ctx.lineTo(config.WINDOW_WIDTH ,(config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2)
        ctx.stroke()
        ctx.fillRect(0,0, config.WINDOW_WIDTH, (config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2)

    }

    private static drawBoard() {
        for (var i=1;i<Board.columns;i++) {
            ctx.beginPath()
            ctx.lineTo((((config.BOARD_WIDTH/5)*i)-1)+((config.WINDOW_WIDTH-config.BOARD_WIDTH)/2), (config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2)
            ctx.lineTo((((config.BOARD_WIDTH/5)*i)-1)+((config.WINDOW_WIDTH-config.BOARD_WIDTH)/2), config.BOARD_HEIGHT+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))
            ctx.stroke()
        }
        for (var i=1;i<Board.rows;i++) {
            ctx.beginPath()
            ctx.lineTo(0, (((config.BOARD_HEIGHT/5)*i)-1)+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))
            ctx.lineTo(config.BOARD_WIDTH, (((config.BOARD_HEIGHT/5)*i)-1)+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))
            ctx.stroke()
        }

        ctx.beginPath()
        ctx.lineTo(0, config.WINDOW_HEIGHT-((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))
        ctx.lineTo(config.WINDOW_WIDTH ,config.WINDOW_HEIGHT-((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))
        ctx.stroke()
    }

    private static drawStones(game:Game) {
        ctx.font = "30px 22876-gen01";
        ctx.fillStyle = 'rgba(255,255,255,1)'
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'

        for (var col=0;col<Board.columns;col++) {
            for (var row=0;row<Board.rows;row++) {
                ctx.fillText(((col+1)+(row+1).toString()),((config.WINDOW_WIDTH/5)*col)+5, (((config.BOARD_HEIGHT/5)*row)+30+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))+(config.GAP_HEIGHT-30), config.GAP_WIDTH-50)
                game.stones.forEach(stone => {
                    if (stone.x == col+1 && stone.y==row+1)
                    ctx.drawImage(stone.player == game.player1 ? player1Image : player2Image,(((config.BOARD_WIDTH/5)*col)+(config.GAP_WIDTH/2))+((config.WINDOW_WIDTH-config.BOARD_WIDTH)/2)-(config.GAP_HEIGHT/2)+((config.GAP_HEIGHT-50)/2), (((config.BOARD_HEIGHT/5)*row)+(config.GAP_HEIGHT/2)+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2))-((config.GAP_HEIGHT-50)/2), config.GAP_WIDTH-50, config.GAP_HEIGHT-50)
                    // ctx.fillText(stone.player == game.player1 ? "X" : "O",(((config.BOARD_WIDTH/5)*col)+(config.GAP_WIDTH/2))+((config.WINDOW_WIDTH-config.BOARD_WIDTH)/2), (((config.BOARD_HEIGHT/5)*row)+(config.GAP_HEIGHT/2)+((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2)))
                });
            }
        }
    }

    private static drawPlayers() {

    }

    public static async renderGame(game:Game):Promise<Buffer> {
        if (!game) return
        if (!game.player1 || !game.player2) return;
        
        this.clearCanvas();
        this.drawBackground();
        this.drawBoard();
        
        this.drawStones(game);
        ctx.fillStyle = "rgba(244, 175, 120, 1)"
        ctx.fillRect(0,config.WINDOW_HEIGHT-((config.WINDOW_HEIGHT-config.BOARD_HEIGHT)/2), config.WINDOW_WIDTH, config.WINDOW_HEIGHT);
        
        // draw players avatar and name
        ctx.font = "50px 22876-gen01";
        var player1Avatar;
        var player2Avatar;
        if (game.player1.avatar != null) {
            try {
                player1Avatar = await createImgFromUrl('https://cdn.discordapp.com/avatars/'+game.player1.id+"/"+game.player1.avatar+'.png');
            }
            catch(e) {console.log(e)}
        }
        else {
            player1Avatar = playernoAvatar;
        }
        if (game.player2.avatar != null) {
            player2Avatar = await createImgFromUrl('https://cdn.discordapp.com/avatars/'+game.player2.id+"/"+game.player2.avatar+'.png');
        }
        else {
            player2Avatar = playernoAvatar;
        }

        
        
        roundedImage(player1Avatar, 50, 10, 80, 80, 40);
        roundedImage(player2Avatar, config.WINDOW_WIDTH-80-50, config.WINDOW_HEIGHT-90, 80, 80, 40);
        ctx.fillStyle = "rgba(164, 86, 50, 1)"
        ctx.fillText(game.player1.name.toString(), 50+80+20, 60)
        
        ctx.textAlign = "end";
        ctx.fillText(game.player2.name.toString(), config.WINDOW_WIDTH-80-50-40, config.WINDOW_HEIGHT-40)

        ctx.strokeStyle = "rgba(50,205,50,1)"
        ctx.lineWidth = 10
        ctx.beginPath();
        if (game.role == game.player1)
        // ctx.arc(50+40, 10+40, 45, 0, 2 * Math.PI);
            ctx.strokeRect(50, 10, 80,80);
        else {
        // ctx.arc(config.WINDOW_WIDTH-80-10, config.WINDOW_HEIGHT-60, 45, 0, 2 * Math.PI);
            ctx.strokeRect(config.WINDOW_WIDTH-80-50, config.WINDOW_HEIGHT-90, 80,80);
        }
        ctx.stroke();
        return canvas.toBuffer()

           
    }


    public static async saveImg(image:Buffer) {
        var fs = require("fs");
        try {
            await fs.writeFileSync("./images/example.jpg", image)
        }
        catch (er){ console.log(er)}
    }
}

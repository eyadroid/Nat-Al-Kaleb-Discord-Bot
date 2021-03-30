const killComments = require("../killComments.json");
const doubleKillComments = require("../doubleKillComments.json");
const statuses = require("../statuses.json");

export default class RandomCommenter {
    private static lastComments = {};

    public static getRandomKillComment() {
        return killComments[Math.floor(Math.random() * killComments.length)]
    }
    public static getRandomDoubleKillComment() {
        return doubleKillComments[Math.floor(Math.random() * doubleKillComments.length)]
    }
    public static getRandomStatus() {
        let randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        if (this.lastComments['status'] != randomStatus) {
            this.lastComments['status'] = randomStatus;
            return randomStatus
        }
        else return this.getRandomStatus();
    }
}
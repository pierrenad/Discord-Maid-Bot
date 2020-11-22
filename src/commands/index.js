const Discord = require('discord.js');
const glob_prefix = require('../bot').prefix;
const help = require('./help');
const prefix = require('./prefix');
const ping = require('./ping');
const eightBall = require('./8ball');
const test = require('./test');
const play = require('./music');
const leave = require('./music');
const pause = require('./music');
const resume = require('./music');
const skip = require('./music');
const queue = require('./music');
const clearqueue = require('./music');


const commands = {
    help,
    prefix,
    ping,
    '8ball': eightBall,
    test,
    play,
    pause,
    resume,
    leave,
    skip,
    queue,
    clearqueue
}

module.exports = async (msg) => {
    if (msg.guild.id === process.env.GUILD_ID) {
        if (msg.author.bot) return;
        const args = msg.content.split(' '); // split with spaces 
        if (args.length == 0 || args[0].charAt(0) !== glob_prefix[0]) return;
        const command = args.shift().substr(1); // remove first argument from the array and remove '!'
        if (Object.keys(commands).includes(command)) {
            commands[command](msg, args, command);
        }
    }
    else if (msg.guild.id === '509462489935904794') { // serveur test 
        const args = msg.content.split(' '); // split with spaces 
        if (args.length == 0 || args[0].charAt(0) !== glob_prefix[0]) return;
        const command = args.shift().substr(1); // remove first argument from the array and remove '!'
        if (Object.keys(commands).includes(command)) {
            commands[command](msg, args, command);
        }
    }
}
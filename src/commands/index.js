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
const setChannelReglement = require('./admin');
const setChannelAssistant = require('./admin');
const setChannelAfk = require('./admin');
const setChannelMusique = require('./admin');

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
    clearqueue,
    setChannelReglement,
    setChannelAssistant,
    setChannelAfk,
    setChannelMusique
}

module.exports = async (msg) => {
    if (msg.author.bot) return;
    const args = msg.content.split(' '); // split with spaces 
    if (args.length == 0 || args[0].charAt(0) !== glob_prefix[0]) return;
    const command = args.shift().substr(1); // remove first argument from the array and remove '!'
    if (Object.keys(commands).includes(command)) {
        commands[command](msg, args, command);
    }
}
// const glob_prefix = require('../bot').prefix;
const servers = require('../bot').servers;
const help = require('./help');
const helpAdmin = require('./help');
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
const setChannelAi = require('./admin');
const setNewMemberRole = require('./admin');
const setAcceptedRole = require('./admin');
const addAdminRole = require('./admin');
const removeAdminRole = require('./admin');
const nukeChannel = require('./admin');

const commands = {
    help,
    helpAdmin,
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
    setChannelAi,
    setNewMemberRole,
    setAcceptedRole,
    addAdminRole,
    removeAdminRole,
    nukeChannel
}

module.exports = async (msg) => {
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: [],
            channels: [],
            roles: {
                roles: [],
                admin: []
            },
            prefix: ['$']
        }
    }
    var server = servers[msg.guild.id];
    if (msg.author.bot) return;
    const args = msg.content.split(' '); // split with spaces 
    if (args.length == 0 || args[0].charAt(0) !== server.prefix[0]) return;
    const command = args.shift().substr(1); // remove first argument from the array and remove '!'
    if (Object.keys(commands).includes(command)) {
        commands[command](msg, args, command);
    }
}
const ping = require('./ping');
const eightBall = require('./8ball');
const test = require('./test');
const { Message } = require('discord.js');

const commands = {
    ping,
    '8ball': eightBall,
    test
}

module.exports = async (msg) => {
    if (msg.guild.id === process.env.GUILD_ID && msg.channel.id === process.env.CHANNEL_AI_ID) {
        if(Message.author.bot) return; 
        const args = msg.content.split(' '); // split with spaces 
        if(args.length == 0 || args[0].charAt(0) !== '!') return; 
        const command = args.shift().substr(1); // remove first argument from the array and remove '!'
        if(Object.keys(commands).includes(command)) {
            commands[command](msg, args); 
        }
    }
}
const Discord = require('discord.js');
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: [],
            channels: []
        }
    }

    switch (command) {
        case 'setChannelReglement': // arrival if we want to manage roles
            if (!args.length) return;
            console.log(args);
            break;
        case 'setChannelAssistant': // notifications when something happens
            if (!args.length) return;
            break;
        case 'setChannelAfk': // vocal afk channel 
            if (!args.length) return;
            break;
        case 'setChannelAi': // channel for musique / other stuff with bot
            if (!args.length) return;
            break;
        default:
    }
}
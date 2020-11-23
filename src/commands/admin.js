const Discord = require('discord.js');
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
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

    if (!args.length && command !== 'nukeChannel' && command !== 'getChannelsConfig' && command !== 'getRolesConfig') return;
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Admin')
            .setColor(0xff0000)
            .setDescription('T\'es qui toi ? T\'as pas les droits 😠');
        await msg.channel.send(embed);
        return;
    }
    var server = servers[msg.guild.id];

    switch (command) {
        case 'setChannelReglement': // arrival if we want to manage roles
            if (server.channels.some(item => item.name === 'rules')) {
                var index = server.channels.findIndex(item => item.name === 'rules');
                server.channels.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            server.channels.push({ name: 'rules', id: channelId });
            break;
        case 'setChannelAssistant': // notifications when something happens
            if (server.channels.some(item => item.name === 'assistant')) {
                var index = server.channels.findIndex(item => item.name === 'assistant');
                server.channels.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            server.channels.push({ name: 'assistant', id: channelId });
            break;
        case 'setChannelAi': // channel for musique / other stuff with bot
            if (server.channels.some(item => item.name === 'ai')) {
                var index = server.channels.findIndex(item => item.name === 'ai');
                server.channels.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            server.channels.push({ name: 'ai', id: channelId });
            break;
        case 'getChannelsConfig': // arrival if we want to manage roles
            const embed = new Discord.MessageEmbed()
                .setTitle('Liste des channels configurés')
                .setColor(0xff0000);
            await server.channels.forEach(async element => {
                var listChannels = await msg.guild.channels.cache.get(element.id).name;
                await embed.addField(element.name, listChannels)
            });
            if (embed)
                await msg.channel.send(embed);
            break;
        case 'setNewMemberRole': // arrival if we want to manage roles
            if (server.roles.roles.some(item => item.name === 'newMember')) {
                var index = server.roles.roles.findIndex(item => item.name === 'newMember');
                server.roles.roles.splice(index, 1);
            }
            var roleId = msg.mentions.roles.first().id;
            server.roles.roles.push({ name: 'newMember', id: roleId });
            break;
        case 'setAcceptedRole': // role after member accept rules
            if (server.roles.roles.some(item => item.name === 'accepted')) {
                var index = server.roles.roles.findIndex(item => item.name === 'accepted');
                server.roles.roles.splice(index, 1);
            }
            var roleId = msg.mentions.roles.first().id;
            server.roles.roles.push({ name: 'accepted', id: roleId });
            break;
        case 'addAdminRole': // add a role as admin for the bot
            var roleId = msg.mentions.roles.first().id;
            if (!server.roles.admin.includes(roleId)) {
                server.roles.admin.push(roleId);
            }
            break;
        case 'removeAdminRole': // remove an admin role (admin for the bot)
            var roleId = msg.mentions.roles.first().id;
            if (server.roles.admin.includes(roleId)) {
                var index = server.roles.admin.indexOf(roleId);
                server.roles.admin.splice(index, 1);
            }
            break;
        case 'getRolesConfig': // arrival if we want to manage roles
            const embedRole = new Discord.MessageEmbed()
                .setTitle('Liste des roles configurés')
                .setColor(0xff0000);
            await server.roles.roles.forEach(async element => {
                var listRole = await msg.guild.roles.cache.get(element.id).name;
                await embedRole.addField(element.name, listRole)
            });
            if (embedRole)
                await msg.channel.send(embedRole);
            break;
        case 'nukeChannel': // remove an admin role (admin for the bot)
            if (args.length) {
                if (msg.guild.channels.cache.has(msg.mentions.channels.first().id)) {
                    var channel = msg.guild.channels.cache.get(msg.mentions.channels.first().id);
                }
            }
            else {
                var channel = msg.channel;
            }
            var newChannel = await {
                type: channel.type,
                deleted: channel.deleted,
                id: channel.id,
                name: channel.name,
                rawPosition: channel.rawPosition,
                position: channel.position,
                parentID: channel.parentID,
                permissionOverwrites: channel.permissionOverwrites,
                topic: channel.topic,
                nsfw: channel.nsfw,
                lastMessageID: channel.lastMessageID,
                ratePinTimestamp: channel.ratePinTimestamp,
                guild: channel.guild,
                _typing: channel._typing
            }
            channel.delete();
            var channelCreated = await msg.guild.channels.create(newChannel.name, newChannel);
            await channelCreated.setParent(newChannel.parentID);
            await channelCreated.setPosition(newChannel.position);
            console.log('channel nuked');

            // once channel is nuked, change the channels variable if it was one of them 
            if (server.channels.some(item => item.id === newChannel.id)) {
                var chan = server.channels.find(item => item.id === newChannel.id);
                var index = server.channels.findIndex(item => item.id === newChannel.id);
                server.channels.splice(index, 1);
                server.channels.push(({ name: chan.name, id: channelCreated.id }))
            }
            break;
        default:
    }
}
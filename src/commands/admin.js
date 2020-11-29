const Discord = require('discord.js');
const servers = require('../bot').servers;
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (msg, args, command) => {
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
            const cliRule = await pool.connect();
            var GetDbChannels = await cliRule.query(`SELECT channels FROM servers WHERE id=${msg.guild.id};`);
            dbChannels = GetDbChannels.rows[0].channels;
            if (dbChannels.items.some(item => item.name === 'rules')) {
                var index = dbChannels.items.findIndex(item => item.name === 'rules');
                dbChannels.items.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            dbChannels.items.push({ name: 'rules', id: channelId });
            await cliRule.query(`UPDATE servers SET channels='${JSON.stringify(dbChannels)}' WHERE id=${msg.guild.id};`);
            servers[msg.guild.id].channels = dbChannels;
            cliRule.release();
            msg.react('👌');
            break;
        case 'setChannelAssistant': // notifications when something happens
            const cliAssist = await pool.connect();
            var GetDbChannels = await cliAssist.query(`SELECT channels FROM servers WHERE id=${msg.guild.id};`);
            dbChannels = GetDbChannels.rows[0].channels;
            if (dbChannels.items.some(item => item.name === 'assistant')) {
                var index = dbChannels.items.findIndex(item => item.name === 'assistant');
                dbChannels.items.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            dbChannels.items.push({ name: 'assistant', id: channelId });
            await cliAssist.query(`UPDATE servers SET channels='${JSON.stringify(dbChannels)}' WHERE id=${msg.guild.id};`);
            servers[msg.guild.id].channels = dbChannels;
            cliAssist.release();
            msg.react('👌');
            break;
        case 'setChannelAi': // channel for musique / other stuff with bot
            const cliAi = await pool.connect();
            var GetDbChannels = await cliAi.query(`SELECT channels FROM servers WHERE id=${msg.guild.id};`);
            dbChannels = GetDbChannels.rows[0].channels;
            if (dbChannels.items.some(item => item.name === 'ai')) {
                var index = dbChannels.items.findIndex(item => item.name === 'ai');
                dbChannels.items.splice(index, 1);
            }
            var channelId = msg.mentions.channels.first().id;
            dbChannels.items.push({ name: 'ai', id: channelId });
            await cliAi.query(`UPDATE servers SET channels='${JSON.stringify(dbChannels)}' WHERE id=${msg.guild.id};`);
            servers[msg.guild.id].channels = dbChannels;
            cliAi.release();
            msg.react('👌');
            break;
        case 'getChannelsConfig': // arrival if we want to manage roles
            const embed = new Discord.MessageEmbed()
                .setTitle('Liste des channels configurés')
                .setColor(0xff0000);
            await server.channels.items.forEach(async element => {
                var listChannels = await msg.guild.channels.cache.get(element.id).name;
                await embed.addField(element.name, listChannels)
            });
            if (embed)
                await msg.channel.send(embed);
            break;
        case 'setNewMemberRole': // arrival if we want to manage roles
            const cliNewM = await pool.connect();
            var GetDbRoles = await cliNewM.query(`SELECT roles FROM servers WHERE id=${msg.guild.id};`);
            dbRoles = GetDbRoles.rows[0].roles;
            if (dbRoles.items.some(item => item.name === 'newMember')) {
                var index = dbRoles.items.findIndex(item => item.name === 'newMember');
                dbRoles.items.splice(index, 1);
            }
            var roleId = msg.mentions.roles.first().id;
            dbRoles.items.push({ name: 'newMember', id: roleId });
            await cliNewM.query(`UPDATE servers SET roles='${JSON.stringify(dbRoles)}' WHERE id=${msg.guild.id};`);
            servers[msg.guild.id].roles = dbRoles;
            cliNewM.release();
            msg.react('👌');
            break;
        case 'setAcceptedRole': // role after member accept rules
            const cliAcceptM = await pool.connect();
            var GetDbRoles = await cliAcceptM.query(`SELECT roles FROM servers WHERE id=${msg.guild.id};`);
            dbRoles = GetDbRoles.rows[0].roles;
            if (dbRoles.items.some(item => item.name === 'accepted')) {
                var index = dbRoles.items.findIndex(item => item.name === 'accepted');
                dbRoles.items.splice(index, 1);
            }
            var roleId = msg.mentions.roles.first().id;
            dbRoles.items.push({ name: 'accepted', id: roleId });
            await cliAcceptM.query(`UPDATE servers SET roles='${JSON.stringify(dbRoles)}' WHERE id=${msg.guild.id};`);
            servers[msg.guild.id].roles = dbRoles;
            cliAcceptM.release();
            msg.react('👌');
            break;
        // case 'addAdminRole': // add a role as admin for the bot
        //     var roleId = msg.mentions.roles.first().id;
        //     if (!server.roles.admin.includes(roleId)) {
        //         server.roles.admin.push(roleId);
        //     }
        //     break;
        // case 'removeAdminRole': // remove an admin role (admin for the bot)
        //     var roleId = msg.mentions.roles.first().id;
        //     if (server.roles.admin.includes(roleId)) {
        //         var index = server.roles.admin.indexOf(roleId);
        //         server.roles.admin.splice(index, 1);
        //     }
        //     break;
        case 'getRolesConfig': // arrival if we want to manage roles
            const embedRole = new Discord.MessageEmbed()
                .setTitle('Liste des roles configurés')
                .setColor(0xff0000);
            await server.roles.items.forEach(async element => {
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
            if (server.channels.items.some(item => item.id === newChannel.id)) {
                var chan = server.channels.items.find(item => item.id === newChannel.id);
                var index = server.channels.items.findIndex(item => item.id === newChannel.id);
                server.channels.items.splice(index, 1);
                server.channels.items.push(({ name: chan.name, id: channelCreated.id }));
            }
            break;
        default:
    }
}
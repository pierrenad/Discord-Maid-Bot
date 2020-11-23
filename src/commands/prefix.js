const Discord = require('discord.js');
const prefix = require('../bot').prefix;
const servers = require('../bot').servers;

module.exports = async (msg, args) => {
    if (args.length) {
        if (!servers[msg.guild.id]) {
            servers[msg.guild.id] = {
                queue: [],
                channels: [],
                roles: {
                    roles: [],
                    admin: []
                }
            }
        }
        var server = servers[msg.guild.id];
        // array1.filter(value => array2.includes(value))
        // if (msg.member.roles.cache.array().filter(value => server.roles.admin.includes(value))) { // find if one of the role of the member is in the admin array
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            oldPrefix = prefix[0];
            require('../bot').prefix.push(args[0]);
            require('../bot').prefix.splice(0, 1);

            const embed = new Discord.MessageEmbed()
                .setTitle('Le prefix a été changé')
                .setColor(0xff0000)
                .setDescription('Nouveau prefix: ' + prefix[0]);
            await msg.channel.send(embed);
            var client = await msg.guild.members.fetch(process.env.BOT_ID);
            client.user.setPresence({ status: "online", activity: { name: prefix[0] + 'help | v1.0' } })
        }
        else {
            const embed = new Discord.MessageEmbed()
                .setTitle('Admin')
                .setColor(0xff0000)
                .setDescription('T\'es qui toi ? T\'as pas les droits 😠');
            await msg.channel.send(embed);
        }
    } else {
        const embed = new Discord.MessageEmbed()
            .setTitle('Prefix')
            .setColor(0xff0000)
            .setDescription('Le prefix actuel est: ' + prefix[0]);
        await msg.channel.send(embed);
    }
}
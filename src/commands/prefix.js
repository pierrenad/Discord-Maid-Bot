const Discord = require('discord.js');
// const prefix = require('../bot').prefix;
const servers = require('../bot').servers;

module.exports = async (msg, args) => {
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
    if (args.length) {
        // array1.filter(value => array2.includes(value))
        // if (msg.member.roles.cache.array().filter(value => server.roles.admin.includes(value))) { // find if one of the role of the member is in the admin array
        if (msg.member.hasPermission('ADMINISTRATOR')) {
            oldPrefix = server.prefix[0];
            server.prefix.push(args[0]);
            server.prefix.splice(0, 1);

            const embed = new Discord.MessageEmbed()
                .setTitle('Le prefix a été changé')
                .setColor(0xff0000)
                .setDescription('Nouveau prefix: ' + server.prefix[0]);
            await msg.channel.send(embed);
            // var client = await msg.guild.members.fetch(process.env.BOT_ID);
            // client.user.setPresence({ status: "online", activity: { name: server.prefix[0] + 'help | v1.0' } }) // can't have differents presence in differents guilds
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
            .setDescription('Le prefix actuel est: ' + server.prefix[0]);
        await msg.channel.send(embed);
    }
}
const Discord = require('discord.js');
const servers = require('../bot').servers;
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (msg, args) => {
    var server = servers[msg.guild.id];
    if (args.length) {
        if (msg.member.hasPermission('ADMINISTRATOR')) {
            const cli = await pool.connect();
            await cli.query(`UPDATE servers SET prefix='${args[0]}' WHERE id=${msg.guild.id};`);
            cli.release(); 
            servers[msg.guild.id].prefix = args[0]; 
            server = servers[msg.guild.id]; 

            const embed = new Discord.MessageEmbed()
                .setTitle('Le prefix a été changé')
                .setColor(0xff0000)
                .setDescription('Nouveau prefix: ' + server.prefix);
            await msg.channel.send(embed);
            var client = await msg.guild.members.fetch(process.env.BOT_ID);
            client.user.setPresence({ status: "online", activity: { name: server.prefix + 'help | v1.0' } }) // can't have differents presence in differents guilds
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
            .setDescription('Le prefix actuel est: ' + server.prefix);
        await msg.channel.send(embed);
    }
}
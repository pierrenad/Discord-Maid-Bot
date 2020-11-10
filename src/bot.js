/***************************
 * Created by pierrenad
 * Maid Bot for discord
 **************************/

require('dotenv').config(); // get the environment variables into process.env
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = ['$'];
exports.prefix = prefix;
exports.servers = {};

const commandHandler = require('./commands');

client.once('ready', () => {
    console.log('Here I am');
    client.user.setPresence({ status: "idle", activity: { name: prefix[0] + 'help | v1.0' } });
});

client.on('message', commandHandler);

client.on('guildMemberAdd', (member) => {
    if (member.user.bot.valueOf()) return;

    const role = Discord.Guild.roles.cache.find(role => role.name === 'Recrue');
    member.roles.add(role); 
    const embed = new Discord.MessageEmbed()
        .setTitle('Welcome !')
        .setColor(0xff0000)
        .setDescription("Bienvenue à " + member.nickname + "!");
    member.guild.channels.get(process.env.CHANNEL_ASSISTANT).send(embed);
});

client.login(process.env.BOT_TOKEN);
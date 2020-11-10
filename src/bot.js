/***************************
 * Created by pierrenad
 * Maid Bot for discord
 **************************/

require('dotenv').config(); // get the environment variables into process.env
const Discord = require('discord.js');
const client = new Discord.Client();

const commandHandler =  require('./commands')

client.once('ready', () => {
    console.log('Here I am');
})

client.on('message', commandHandler); 

client.on('guildMemberAdd', (member) => {
    if(member.user.bot.valueOf()) return; 
    
    const embed = new Discord.MessageEmbed()
    .setTitle('Welcome !')
      .setColor(0xff0000)
      .setDescription("Bienvenue à " + member.nickname + "!");
    member.guild.channels.get(process.env.CHANNEL_GENERAL).send(embed); 
})

client.login(process.env.BOT_TOKEN);
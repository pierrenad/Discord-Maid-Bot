const Discord = require('discord.js');

module.exports = async (msg, args) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Disconnecting !')
        .setColor(0xff0000)
    msg.channel.send(embed); 
    msg.member.voice.channel.leave();
}
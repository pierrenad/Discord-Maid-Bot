const Discord = require('discord.js');
const prefix = require('../bot').prefix; 

module.exports = async (msg) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('MaidBot Help')
        .setColor(0xff0000)
        .addFields(
            {name: 'Commands', value: '**'+prefix[0]+'prefix**\t\tMontre le prefix ou le change si argument donné\n**'+prefix[0]+'ping**\t\tSi channel nsfw, répond \'pong\'\n\
            **'+prefix[0]+'8ball**\t\t8ball répond à votre question\n**'+prefix[0]+'play**\t\Lance une musique demandée par un titre ou une url\n\
            **'+prefix[0]+'test**\t\tTest the bot response'}
        )
        // .addFields(
        //     { value: '**'+prefix+'test**', inline: true },
        //     { value: 'Test the bot response', inline: true },
        // )
        // .addFields(
        //     { value: prefix+'ping', inline: true }, 
        //     { value: 'If in a nsfw channel, say \'pong\'', inline: true }, 
        // )
    await msg.channel.send(embed);
}
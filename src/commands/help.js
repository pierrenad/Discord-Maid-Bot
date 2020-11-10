const Discord = require('discord.js');
const prefix = require('../bot').prefix; 

module.exports = async (msg) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('MaidBot Help')
        .setColor(0xff0000)
        .addFields(
            {name: 'Commands', value: '\
            **'+prefix[0]+'prefix**\tMontre le prefix ou le change si un argument est donné\n\
            **'+prefix[0]+'play**\tLance une musique demandée via l\'argument\n\
            **'+prefix[0]+'skip**\tPasse à la musique suivante si il y en a dans la queue\n\
            **'+prefix[0]+'pause**\tMet la musique sur pause\n\
            **'+prefix[0]+'resume**\tReprend la musique\n\
            **'+prefix[0]+'leave**\tQuitte le channel vocal\n\
            **'+prefix[0]+'queue**\tPermet de visualiser les titres ajoutés dans la queue\n\
            **'+prefix[0]+'8ball**\tRépond à votre question\n\
            **'+prefix[0]+'ping**\tSi channel nsfw, répond \'pong\'\n\
            **'+prefix[0]+'test**\tTest the bot response'}
        )
    await msg.channel.send(embed);
}
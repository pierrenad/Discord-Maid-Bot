const Discord = require('discord.js');
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
    var server = servers[msg.guild.id];
    // if admin then can't be in a normal channel ?
    if (command === 'helpadmin') {
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Admin')
                .setColor(0xff0000)
                .setDescription('T\'es qui toi ? T\'as pas les droits 😠');
            await msg.channel.send(embed);
            return;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('Admin commands')
            .setColor(0xff0000)
            .setURL(process.env.WEB_PAGE);
        await msg.author.send(embed);
        await msg.delete(); 
    }
    else if (command === 'help') {
        const embed = new Discord.MessageEmbed()
            .setTitle('MaidBot Help')
            .setColor(0xff0000)
            .addFields(
                {
                    name: 'Commands', value: '\
                    **'+ server.prefix + 'helpAdmin**\tAffiche l\'aide pour les admins.\n\
                    **'+ server.prefix + 'play**\tLance une musique demandée via l\'argument.\n\
                    **'+ server.prefix + 'skip**\tPasse à la musique suivante si il y en a dans la queue.\n\
                    **'+ server.prefix + 'pause**\tMet la musique sur pause.\n\
                    **'+ server.prefix + 'resume**\tReprend la musique.\n\
                    **'+ server.prefix + 'leave**\tQuitte le channel vocal.\n\
                    **'+ server.prefix + 'queue**\tPermet de visualiser les titres ajoutés dans la queue.\n\
                    **'+ server.prefix + 'delQueueSong**\tPermet de supprimer la musique, donnée par son numéro, de la queue.\n\
                    **'+ server.prefix + 'clearqueue**\tPermet de vider la queue.\n\
                    **'+ server.prefix + 'gif**\tEnvoie un gif correspondant à la demande (faite en anglais).\n\
                    **'+ server.prefix + '8ball**\tRépond à votre question.\n\
                    **'+ server.prefix + 'timeLeft**\tTemps restant avant que le bot ne sois down.\n\
                    **'+ server.prefix + 'ping**\tSi channel nsfw, répond \'pong\'.'
                }
            );
        await msg.channel.send(embed);
    }
}
const Discord = require('discord.js');
// const prefix = require('../bot').prefix;
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
    var server = servers[msg.guild.id];
    // if admin then can't be in a normal channel ?
    if (command === 'helpAdmin') {
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Admin')
                .setColor(0xff0000)
                .setDescription('T\'es qui toi ? T\'as pas les droits 😠');
            await msg.channel.send(embed);
            return;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('MaidBot Help')
            .setColor(0xff0000)
            .addFields(
                {
                    name: 'Admin commands', value: '\
                    **'+ server.prefix + 'prefix**\tMontre le prefix ou le change si un argument est donné.\n\
                    **'+ server.prefix + 'setChannelReglement**\tModifier le channel d\'arrivée des membres afin qu\'ils acceptents les règles.\n\
                    **'+ server.prefix + 'setChannelAssistant**\tChannel où le bot envoie des notifications (ex: nouveaux membres, etc).\n\
                    **'+ server.prefix + 'setChannelAi**\tChannel où faire des appels au bot (ex: musique, etc).\n\
                    **'+ server.prefix + 'setNewMemberRole**\tRôle des nouveaux arrivants.\n\
                    **'+ server.prefix + 'setAcceptedRole**\tRôle des membres qui ont acceptés le règlement.\n\
                    **'+ server.prefix + 'addAdminRole**\tAjouter un rôle comme étant admin pour la gestion du bot.\n\
                    **'+ server.prefix + 'removeAdminRole**\tRetirer un rôle vu comme admin pour la gestion du bot.\n\
                    **'+ server.prefix + 'nukeChannel**\tVider un channel. \
                                        Possibilité de passer le nom d\'un channel pour faire la commande à partir d\'un autre endroit.\n\
                    **'+ server.prefix + 'test**\tTest the bot response.'
                });
        await msg.channel.send(embed);
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
                    **'+ server.prefix + 'clearqueue**\tPermet de vider la queue.\n\
                    **'+ server.prefix + 'gif**\tEnvoie un gif correspondant à la demande (faite en anglais).\n\
                    **'+ server.prefix + '8ball**\tRépond à votre question.\n\
                    **'+ server.prefix + 'ping**\tSi channel nsfw, répond \'pong\'.'
                }
            );
        await msg.channel.send(embed);
    }
}
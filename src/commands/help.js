const Discord = require('discord.js');
const prefix = require('../bot').prefix;

module.exports = async (msg, args, command) => {
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
                    **'+ prefix[0] + 'prefix**\tMontre le prefix ou le change si un argument est donné.\n\
                    **'+ prefix[0] + 'setChannelReglement**\tModifier le channel d\'arrivée des membres afin qu\'ils acceptents les règles.\n\
                    **'+ prefix[0] + 'setChannelAssistant**\tChannel où le bot envoie des notifications (nnouveaux membres, etc).\n\
                    **'+ prefix[0] + 'setChannelAi**\tChannel où le bot écoutera les demandes (musiques, etc).\n\
                    **'+ prefix[0] + 'setNewMemberRole**\tRôle des nouveaux arrivants.\n\
                    **'+ prefix[0] + 'setAcceptedRole**\tRôle des membres qui ont acceptés le règlement.\n\
                    **'+ prefix[0] + 'addAdminRole**\tAjouter un rôle comme étant admin pour la gestion du bot.\n\
                    **'+ prefix[0] + 'removeAdminRole**\tRetirer un rôle vu comme admin pour la gestion du bot.\n\
                    **'+ prefix[0] + 'nukeChannel**\tVider un channel. \
                                        Possibilité de passer le nom d\'un channel pour faire la commande à partir d\'un autre endroit.\n\
                    **'+ prefix[0] + 'test**\tTest the bot response.'
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
                    **'+ prefix[0] + 'helpAdmin**\tAffiche l\'aide pour les admins.\n\
                    **'+ prefix[0] + 'play**\tLance une musique demandée via l\'argument.\n\
                    **'+ prefix[0] + 'skip**\tPasse à la musique suivante si il y en a dans la queue.\n\
                    **'+ prefix[0] + 'pause**\tMet la musique sur pause.\n\
                    **'+ prefix[0] + 'resume**\tReprend la musique.\n\
                    **'+ prefix[0] + 'leave**\tQuitte le channel vocal.\n\
                    **'+ prefix[0] + 'queue**\tPermet de visualiser les titres ajoutés dans la queue.\n\
                    **'+ prefix[0] + 'clearqueue**\tPermet de vider la queue.\n\
                    **'+ prefix[0] + '8ball**\tRépond à votre question.\n\
                    **'+ prefix[0] + 'ping**\tSi channel nsfw, répond \'pong\'.'
                }
            );
        await msg.channel.send(embed);
    }
}
// const glob_prefix = require('../bot').prefix;
const servers = require('../bot').servers;
const help = require('./help');
const helpAdmin = require('./help');
const prefix = require('./prefix');
const ping = require('./ping');
const eightBall = require('./8ball');
const test = require('./test');
const play = require('./music');
const leave = require('./music');
const pause = require('./music');
const resume = require('./music');
const skip = require('./music');
const queue = require('./music');
const delQueueSong = require('./music');
const clearQueue = require('./music');
const setChannelReglement = require('./admin');
const setChannelAssistant = require('./admin');
const setChannelAi = require('./admin');
const setNewMemberRole = require('./admin');
const setAcceptedRole = require('./admin');
const addAdminRole = require('./admin');
const removeAdminRole = require('./admin');
const getChannelsConfig = require('./admin');
const getRolesConfig = require('./admin');
const deleteChannelsConfig = require('./admin');
const deleteChannelConfig = require('./admin');
const deleteRolesConfig = require('./admin');
const deleteRoleConfig = require('./admin');
const nukeChannel = require('./admin');
const timeLeft = require('./timeLeft');
const gif = require('./gifs');
const random = require('./randomCommands');
const flip = require('./randomCommands');

const commands = {
    help,
    helpadmin: helpAdmin,
    prefix,
    ping,
    '8ball': eightBall,
    test,
    play,
    pause,
    resume,
    leave,
    skip,
    queue,
    delqueuesong: delQueueSong,
    clearqueue: clearQueue,
    setchannelreglement: setChannelReglement,
    setchannelassistant: setChannelAssistant,
    setchannelai: setChannelAi,
    setnewmemberrole: setNewMemberRole,
    setacceptedrole: setAcceptedRole,
    addadminrole: addAdminRole,
    removeadminrole: removeAdminRole,
    getchannelsconfig: getChannelsConfig,
    getrolesconfig: getRolesConfig,
    deletechannelsconfig: deleteChannelsConfig,
    deletechannelconfig: deleteChannelConfig,
    deleterolesconfig: deleteRolesConfig,
    deleteroleconfig: deleteRoleConfig,
    nukechannel: nukeChannel,
    //timeleft: timeLeft,
    random,
    flip,
    gif
}

module.exports = async (msg) => {
    if (msg.author.bot) return;
    var server = servers[msg.guild.id];
    const args = msg.content.split(' '); // split with spaces 
    if (args.length == 0 || args[0].charAt(0) !== server.prefix) return;
    // if (args.length == 0 || args[0].charAt(0) !== server.prefix && args[0].charAt(0) !== '/') return; // for the tests
    const command = args.shift().substr(1).toLowerCase(); // remove first argument from the array (remove prefix)
    if (Object.keys(commands).includes(command)) {
        commands[command](msg, args, command);
    }
}
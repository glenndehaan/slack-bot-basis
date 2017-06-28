const SlackBot = require('slackbots');
const log = require('color-console');
const slackBotUtils = require('./utils/slackBotUtils');
const config = require('./config/config');
let utils = null;

/**
 * Create a new slack bot
 *
 * @see https://my.slack.com/services/new/bot
 * @type {Bot}
 */
const bot = new SlackBot({
    token: config.slackToken,
    name: config.botName
});

/**
 * Bot is ready to start firing events
 */
bot.on('start', () => {
    log.green("[General] I'm alive !!");

    /**
     * Init Utils
     */
    utils = new slackBotUtils(bot);
});

/**
 * All ingoing slack events
 *
 * @see https://api.slack.com/rtm
 */
bot.on('message', (data) => {
    /**
     * Log al unnecessary events like reconnect and hello messages
     */
    if (data.type != "hello" && data.type != "reconnect_url" && data.type != "message") {
        log.yellow("[" + data.type + "] " + "User: " + utils.users[data.user]);
    }

    /**
     * Process user messages from chat
     */
    if (data.type === 'message') {
        if (typeof utils.channels[data.channel] !== 'undefined') {
            /**
             * User sends a message in a channel
             */

            // Check if user isn't the bot / to prevent endless loop of events
            if (typeof utils.users[data.user] !== 'undefined') {
                bot.postMessageToUser(utils.users[data.user], 'Hey you are talking in a channel !');
            }
        } else if (typeof utils.users[data.user] !== 'undefined' || utils.users[data.user] === config.botName || data.user === '') {
            if (data.channel.charAt(0) === 'D') {
                /**
                 * User sends a direct message
                 */

                bot.postMessageToUser(utils.users[data.user], 'Hey you are talking in private !');
            } else if (data.channel.charAt(0) === 'G') {
                /**
                 * User sends a message in a group
                 */

                bot.postMessageToGroup(utils.groups[data.channel], 'Hey you are talking in a group !');
            }
        }
    }
});

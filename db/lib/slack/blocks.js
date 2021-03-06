/**
 * Slack message blocks. 
 * 
 * Slack has a GUI block editor: https://app.slack.com/block-kit-builder/ 
 * Note: The GUI gives you a malformed JSON string you need to take the top
 * level "blocks" key out. Properly formatted it should be [{},{},{}].
 */
const messageBlocks = {

    /**
     * Welcome to project message block.
     * 
     * @param {object} project - Object with project information for the welcome message.
     *  @param {string} project.name - Project name.
     *  @param {string} project.description - Summary of the project.
     *  @param {string} project.needs - Current project needs summary. "Front-end, UX Research, etc."
     *  @param {string} project.cadence - Meeting cadence. "Every other Monday..."
     *  @param {string} project.tech - Project technologies. "Wordpress, Figma, ..."
     *  @param {string} project.additionalInfo - Additional info blurb.
     * 
     * @returns {array} - Slack block array of block objects.
     */
    projectWelcomeConfirm: (project) => {
        return [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there 👋! We've determined that based on your preferences and experience, ${project.name} would be the most fitting for you.`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Summary*: ${project.description}`,
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Current Needs*: ${project.needs}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Meeting Cadence*: ${project.cadence}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Tech*: ${project.text}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${project.additionalInfo}`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Would you like to join?"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "radio_buttons",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Yes, I would like to join this project.",
                                    "emoji": true
                                },
                                "value": "yes"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "No, I would not like to join this project.",
                                    "emoji": true
                                },
                                "value": "no"
                            }
                        ],
                        "action_id": "projectWelcomeConfirm"
                    }
                ]
            }
        ];
    },

    /**
     * Welcome to project message block - User responds "No".
     * @param {string} - Schedule followup meeting link.
     * @returns {array} - Slack block array of block objects.
     */
    projectWelcomeConfirmNo: (scheduleFollowupMeetingLink) => {
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `It looks like you don't want to join. Please use <${scheduleFollowupMeetingLink}|this link> to schedule a 1:1 with the project admin.`
                }
            }
        ];
    },

    /**
     * Welcome to the project message block - User responds "Yes".
     * 
     * @param {object} project - Object with project information for the welcome message.
     *  @param {string} project.name - Project name
     *  @param {array}  project.links - Project links ie. [{label:'Google Drive', url: 'https://link.com'}, ...]
     * @returns {array} - Slack block array of block objects.
     */
    projectWelcomeConfirmYes: (project) => {
        let blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Thank you for your interest in joining ${project.name}. You will be assigned a Trello ticket shortly with details pertaining to the team and project which will need to be completed in order to officially join.`,
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Once you complete the ticket, please review and save the following project links. If applicable, join the channel, group, or board."
                }
            },
            {
                "type": "divider"
            }
        ];

        for (let i=0; i<project.links.length; i++) {
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `🔗 <${project.links[i].url}|${project.links[i].label}>`,
                }
            })
        }

        return blocks;
    }

};

module.exports = {
    messageBlocks,
};
var Telegram = require('./telegram');

function MessageDispatcher() {
    this.dispatchMessage = function(sender, receiver, message, additionalInfo) {
        if (receiver == null) {
            return;
        }

        var telegram = new Telegram(sender, receiver, message, additionalInfo);

        this.discharge(receiver, telegram);
    };

    this.discharge = function(receiver, telegram) {
        receiver.handleMessage(telegram);
    };
}

module.exports = MessageDispatcher;

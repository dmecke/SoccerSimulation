var Telegram = require('./telegram');

function MessageDispatcher() {
    this.dispatchMessage = function(delay, sender, receiver, message, additionalInfo) {
        if (receiver == null) {
            return;
        }

        var telegram = new Telegram(0, sender, receiver, message, additionalInfo);

        if (delay == 0) {
            this.discharge(receiver, telegram);
        } else {
            // @todo
        }
    };

    this.discharge = function(receiver, telegram) {
        receiver.handleMessage(telegram);
    };
}

module.exports = MessageDispatcher;

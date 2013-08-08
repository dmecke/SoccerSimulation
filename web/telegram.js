function Telegram(delay, sender, receiver, message, additionalInfo) {
    this.delay = delay;
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.additionalInfo = additionalInfo;
}

module.exports = Telegram;

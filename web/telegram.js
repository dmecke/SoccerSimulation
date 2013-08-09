function Telegram(sender, receiver, message, additionalInfo) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.additionalInfo = additionalInfo;
}

module.exports = Telegram;

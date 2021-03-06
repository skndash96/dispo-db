const { APIMessage, Structures } = require("discord.js");

class ExtAPIMessage extends APIMessage {
    resolveData(pingOn) {
      if (this.data) return this;
      super.resolveData();
      
      if((this.options.allowedMentions || {}).repliedUser !== undefined) {
        if(this.data.allowed_mentions === undefined) this.data.allowed_mentions = {};
        this.data.allowed_mentions.replied_user = false;
        delete this.options.allowedMentions.repliedUser;
      }
      else if (!pingOn) {
        this.data.allowed_mentions = {};
        this.data.allowed_mentions.replied_user = false;
      }
      
      if (this.options.replyTo !== undefined) {
        Object.assign(this.data, { message_reference: { message_id: this.options.replyTo.id } });
      }
      return this;
    }
}

class Message extends Structures.get("Message") {
    reply(content, options) {
      return this.channel.send(ExtAPIMessage.create(this, content, options, { replyTo: this }).resolveData());
    }

    edit(content, options) {
      return super.edit(ExtAPIMessage.create(this, content, options, { replyTo: this }).resolveData(true));
    }
}

Structures.extend("Message", () => Message);
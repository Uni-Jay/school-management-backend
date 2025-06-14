const { Message, CallHistory, Notification, User } = require('../../models');
const { serverClient } = require('../../utils/stream');
const { Op } = require('sequelize');


// Create private 1-on-1 Stream channel
exports.createPrivateChannel = async (req, res) => {
  const { userAId, userBId, school_id } = req.body;
  const sortedMembers = [userAId, userBId].sort();
  const channelId = `private_${sortedMembers.join('_')}`;

  const channel = serverClient.channel('messaging', channelId, {
    name: `Chat: ${userAId} ↔ ${userBId}`,
    members: sortedMembers,
    school_id,
    type: 'private',
  });

  await channel.create();
  res.json(channel);
};

// Create group chat Stream channel
exports.createGroupChannel = async (req, res) => {
  const { channelId, name, members, school_id } = req.body;

  const channel = serverClient.channel('messaging', channelId, {
    name,
    members,
    school_id,
    type: 'group',
  });

  await channel.create();
  res.json(channel);
};

// Save message to DB (optional if using Stream directly)
exports.saveMessage = async (req, res) => {
  const { sender_id, receiver_id, content, channel_id, school_id } = req.body;
  const message = await Message.create({ sender_id, receiver_id, content, channel_id, school_id });
  res.status(201).json(message);
};

// Save call log
exports.saveCall = async (req, res) => {
  const { caller_id, receiver_ids, type, duration, status, school_id, is_group } = req.body;

  const calls = await Promise.all(
    receiver_ids.map(receiver_id =>
      CallHistory.create({ caller_id, receiver_id, type, duration, status, school_id, is_group })
    )
  );

  res.status(201).json({ message: 'Call(s) saved', calls });
};

// Notify user
exports.notifyCall = async (req, res) => {
  const { user_id, type, data } = req.body;
  const notification = await Notification.create({ user_id, type, data });
  res.status(201).json(notification);
};

// Get chat messages between two users
// Get chat messages (one-on-one or group)
exports.getMessageHistory = async (req, res) => {
    const { userAId, userBId, channel_id, type } = req.query;
  
    try {
      let messages;
  
      if (type === 'group' && channel_id) {
        // Group chat history by channel_id
        messages = await Message.findAll({
          where: { channel_id },
          order: [['createdAt', 'ASC']],
        });
      } else if (userAId && userBId) {
        // One-on-one chat history
        messages = await Message.findAll({
          where: {
            [Op.or]: [
              { sender_id: userAId, receiver_id: userBId },
              { sender_id: userBId, receiver_id: userAId },
            ]
          },
          order: [['createdAt', 'ASC']],
        });
      } else {
        return res.status(400).json({ message: 'Invalid parameters' });
      }
  
      res.json(messages);
    } catch (error) {
      console.error('getMessageHistory error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get call history for a user
exports.getCallHistory = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const callHistory = await CallHistory.findAll({
        where: {
          [Op.or]: [
            { caller_id: userId },
            { receiver_id: userId }
          ]
        },
        order: [['createdAt', 'DESC']],
      });
  
      res.json(callHistory);
    } catch (error) {
      console.error('getCallHistory error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Webhook from Stream
exports.streamWebhookHandler = async (req, res) => {
    const event = req.body;
  
    try {
      switch (event.type) {
        case 'message.new':
          await Message.create({
            sender_id: event.user.id,
            channel_id: event.channel_id,
            content: event.message.text,
            type: event.channel.type === 'messaging' ? 'one-on-one' : 'group',
          });
          break;
  
        case 'call.started':
          await CallHistory.create({
            user_id: event.user.id,
            channel_id: event.call.id,
            call_type: event.call.type,
            started_at: new Date(event.created_at),
          });
          break;
  
        case 'call.ended':
          const callLog = await CallLog.findOne({
            where: { channel_id: event.call.id },
            order: [['createdAt', 'DESC']],
          });
          if (callLog) {
            callLog.ended_at = new Date(event.created_at);
            await callLog.save();
          }
          break;
  
        default:
          console.log(`Unhandled event: ${event.type}`);
      }
  
      return res.status(200).json({ message: 'Webhook processed' });
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(500).json({ message: 'Webhook failed' });
    }
};


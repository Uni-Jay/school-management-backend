// utils/stream.js
const { StreamChat } = require('stream-chat');

const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_SECRET_KEY);

// utils/stream.js
// async function createPrivateChannel(userAId, userBId, school_id) {
//     const sortedMembers = [userAId, userBId].sort(); // Ensure uniqueness
//     const channelId = `private_${sortedMembers.join('_')}`;
  
//     const channel = serverClient.channel('messaging', channelId, {
//       name: `Chat: ${userAId} ↔ ${userBId}`,
//       members: sortedMembers,
//       school_id,
//       type: 'private',
//     });
  
//     await channel.create();
//     return channel;
// }
// async function createGroupChannel(channelId, name, members, school_id) {
//     const channel = serverClient.channel('messaging', channelId, {
//       name,
//       members,
//       school_id,
//       type: 'group',
//     });
  
//     await channel.create();
//     return channel;
// }
  
  

module.exports = serverClient;

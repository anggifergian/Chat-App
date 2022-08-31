class WebSockets {
    users = [];

    connection(client) {
        client.on("disconnect", () => {
            this.users = this.users.filter(u => u.socketId !== client.id)
        })

        // Add identify of user mapped to the socket id
        client.on("identity", (userId) => {
            this.users.push({
                socketId: client.id,
                userId: userId
            })
        })

        // Subscribe person to chat & other user 
        client.on("subscribe", (room, otherUserId = "") => {
            this.subcribeOtherUser(room, otherUserId);
            
            client.join(room);
        })

        // Mute a chat room
        client.on('unsubscribe', (room) => {
            client.leave();
        })
    }

    subcribeOtherUser(room, otherUserId) {
        const userSockets = this.users.filter(
            user => user.userId === otherUserId
        )

        userSockets.map(userInfo => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);

            if (socketConn) {
                socketConn.join(room)
            }
        })
    }
}

module.exports = new WebSockets()
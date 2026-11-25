import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { User } from "../models/user.model.js";



const getCookie = (
    cookieHeader,
    name
) => {

    if (!cookieHeader) {
        return null;
    }

    const cookies =
        cookieHeader.split(";");

    for (
        const cookie of cookies
    ) {

        const [key, ...valueParts] =
            cookie.trim().split("=");

        if (key === name) {

            return decodeURIComponent(
                valueParts.join("=")
            );
        }
    }

    return null;
};



export const initializeSocket = (
    httpServer
) => {

    const io =
        new Server(
            httpServer,
            {
                cors: {
                    origin: (origin, callback) => {
                        const allowed = [
                            process.env.CORS_ORIGIN,
                            "http://localhost:5173",
                            "http://127.0.0.1:5173",
                            "http://localhost:3000",
                        ].filter(Boolean);
                        if (!origin || allowed.includes(origin) || allowed.includes("*")) {
                            return callback(null, true);
                        }
                        return callback(null, true);
                    },
                    credentials: true,
                },

                transports: [
                    "websocket",
                    "polling",
                ],
            }
        );



    io.use(
        async (
            socket,
            next
        ) => {

            try {

                const cookieHeader =
                    socket.handshake
                        .headers
                        .cookie;

                const accessToken =
                    getCookie(
                        cookieHeader,
                        "accessToken"
                    );

                const authToken =
                    socket.handshake
                        .auth
                        ?.token;

                const token =
                    accessToken ||
                    authToken;

                if (!token) {

                    return next(
                        new Error(
                            "Unauthorized socket connection"
                        )
                    );
                }

                const decodedToken =
                    jwt.verify(
                        token,
                        process.env
                            .ACCESS_TOKEN_SECRET
                    );

                const user =
                    await User.findById(
                        decodedToken?._id
                    ).select(
                        "_id fullname username avatar"
                    );

                if (!user) {

                    return next(
                        new Error(
                            "User not found"
                        )
                    );
                }

                socket.user =
                    user;

                next();

            } catch (error) {

                console.error(
                    "Socket authentication error:",
                    error.message
                );

                next(
                    new Error(
                        "Invalid socket authentication"
                    )
                );
            }
        }
    );



    io.on(
        "connection",
        (socket) => {

            const userId =
                socket.user._id.toString();

            console.log(
                `🟢 Socket connected: ${socket.user.username}`
            );



            socket.join(
                `user:${userId}`
            );



            io.emit(
                "user:online",
                {
                    userId,
                }
            );



            socket.on(
                "ping:server",
                () => {

                    socket.emit(
                        "pong:server"
                    );

                }
            );



            socket.on(
                "typing:start",
                ({
                    receiverId,
                } = {}) => {

                    if (!receiverId) {
                        return;
                    }

                    io.to(
                        `user:${receiverId}`
                    ).emit(
                        "typing:start",
                        {
                            userId,
                        }
                    );
                }
            );



            socket.on(
                "typing:stop",
                ({
                    receiverId,
                } = {}) => {

                    if (!receiverId) {
                        return;
                    }

                    io.to(
                        `user:${receiverId}`
                    ).emit(
                        "typing:stop",
                        {
                            userId,
                        }
                    );
                }
            );



            socket.on(
                "disconnect",
                (reason) => {

                    console.log(
                        `🔴 Socket disconnected: ${socket.user.username}`,
                        reason
                    );

                    io.emit(
                        "user:offline",
                        {
                            userId,
                        }
                    );
                }
            );
        }
    );


    return io;
};
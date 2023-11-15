import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { Message, chat } from '../../interfaces/comman';



const ChatModal = (props: chat) => {

    const { rideId, role, handleChangeTheChatState } = props
    const [socket, setsocket] = useState<Socket | null>(null)

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const [reload, SetReload] = useState(false)

    useEffect(() => {

        const socketClient = io(import.meta.env.VITE_SOCKET_PORT, {
            transports: ["websocket"]
        });
        setsocket(socketClient)

        socketClient.on('connect', () => {
            console.log('Connected to the Socket.IO server');
        })

        socketClient.emit('join-chat', rideId)

        socketClient.on('chat-message', (message: Message, messageRideId: string) => {
            console.log("chat-message", message)
            if (message && (messageRideId == rideId)) {
                setMessages(message as unknown as Message[]);
            }
        });

        return () => {
            socket?.disconnect();
            socketClient.disconnect();
        };

    }, [reload]);

    const handleReload = () => {
        socket?.emit('join-chat', rideId)

        socket?.on('chat-message', (message: Message, messageRideId: string) => {
            console.log("chat-message", message)
            if (message && (messageRideId == rideId)) {
                setMessages(message as unknown as Message[]);
            }
        });
    }

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const message: Message = {
                sender: role,
                content: newMessage,
                timestamp: new Date(),
            };
            socket?.emit('update-chat-message', { rideId, message })
            setMessages([...messages, message]);
            SetReload(!reload)
            handleReload()
            setNewMessage('');
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex  justify-end h-screen z-50 bg-gray-700 bg-opacity-50">
                <div className="bg-green-200 m-3 w-96 p-6 rounded-lg shadow-lg relative">
                    <div className="flex border-b-2 border-b-gray-50 p-2  justify-between items-center ">
                        <h2 className="text-xl font-bold">Chat</h2>
                        <h2 className="text-xl font-bold">{role == "driver" ? "Driver" : "User"}</h2>
                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none " onClick={() => handleChangeTheChatState()}>
                            Close
                        </button>
                    </div>
                    <div className="w-96  h-5/6 overflow-y-auto scrollbar-hide">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${message.sender === role ? 'flex justify-end chat chat-end me-9' : 'flex justify-start chat chat-start'}`}
                            >
                                <div
                                    className={`p-2 chat-bubble  transition duration-300 ease-in-out text-black border rounded-xl ${message.sender === 'driver' ? ' self-end chat chat-end' : 'self-start chat chat-start '} ${message.sender == role ? "bg-green-400" : "bg-gray-300"}`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-2 m-2 border-2 border-gray-300 rounded-xl left-0 right-0 flex items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 p-2 border rounded-s-xl focus:outline-none"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-700 focus:outline-none"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ChatModal;

import { Socket } from 'socket.io-client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { handleError, handleSuccess } from '../components/utils';
import './Chats.css'
import { Search, Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import CryptoJS from "crypto-js";
import UnauthorizedChatView from '../unauthorized/UnauthorizedChatView';


interface Message {
    sender_id: string,
    receiver_id: string,
    message: string
}

interface Employee {
    _id: string,
    email: string;
    name: string;
    position: string;
    employee_id: string;
    company: string;
    password: string;
}

interface MessageArray {
    client: number,
    chats: Message[]
}

interface EmployeePageProps {
    socket1: Socket;
    socket2: Socket;
}

const ChatPage: React.FC<EmployeePageProps> = ({ socket1, socket2 }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [messages1, setMessages1] = useState<Message[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const [newMessage, setNewMessage] = useState("");

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/info/details`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEmployees(result.users);
            } else {
                handleError(result.message || "Failed to fetch employees");
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messages1]);

    // Using useCallback to create a stable function reference
    const handleNewMessage = useCallback((data: Message) => {
        const bytes = CryptoJS.AES.decrypt(data.message, import.meta.env.VITE_SECRET_KEY);
        const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

        setMessages(prevMessages => [...prevMessages, { ...data, message: decryptedMessage }]);
    }, []);

    // Using useCallback for loadChats handler
    const handleLoadChats = useCallback((data: MessageArray) => {

        const decryptedChats = data.chats.map((chat) => {
            const bytes = CryptoJS.AES.decrypt(chat.message, import.meta.env.VITE_SECRET_KEY);
            const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
            return { ...chat, message: decryptedMessage };
        });

        setMessages([]);
        setMessages1(decryptedChats);
    }, []);

    useEffect(() => {
        // Clear any existing listeners first to prevent duplicates
        socket1.off("newMessageResponse");
        socket2.off("newMessageResponse");
        socket1.off("loadChats");

        // Setup event listeners
        socket1.on("newMessageResponse", handleNewMessage);
        socket2.on("newMessageResponse", handleNewMessage);
        socket1.on("loadChats", handleLoadChats);

        // Cleanup event listeners on unmount
        return () => {
            socket1.off("newMessageResponse");
            socket2.off("newMessageResponse");
            socket1.off("loadChats");
        };
    }, [socket1, socket2, handleNewMessage, handleLoadChats]);

    const exitChat = (emp: Employee) => {
        setSelectedEmployee(emp);
        socket1.emit('exitsChat', { client: 1, sender_id: user._id, receiver_id: emp?._id });
    }


    const handleSendMessage = async () => {

        if (selectedEmployee !== null) {
            const encryptedMessage = CryptoJS.AES.encrypt(newMessage, import.meta.env.VITE_SECRET_KEY).toString();
            const chatInfo = {
                sender_id: user._id,
                receiver_id: selectedEmployee._id,
                message: encryptedMessage
            }
            try {
                const url = `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/info/save-chat`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chatInfo)
                });
                const result = await response.json();
                const { success, message, error } = result;
                if (success) {
                    handleSuccess(message);
                    socket1.emit('newMessage', {
                        client: 1,
                        sender_id: user._id,
                        receiver_id: selectedEmployee._id,
                        message: encryptedMessage
                    });
                    socket2.emit('newMessage', {
                        client: 1,
                        sender_id: user._id,
                        receiver_id: selectedEmployee._id,
                        message: encryptedMessage
                    });

                    setNewMessage('');
                } else if (error) {
                    const details = error?.details[0].message;
                    handleError(details);
                } else if (!success) {
                    handleError(message);
                }
            } catch (err) {
                if (err instanceof Error) {
                    handleError(err.message);
                } else {
                    handleError(String(err));
                }
            }
        }
    }

    return (
        <>
            {user && user.isAuthorized ? <>
                <div className="chat-container">
                    <div className="chat-sidebar">
                        <div className="chat-search">
                            <Search className="chat-search-icon" />
                            <input placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="chat-employee-list">
                            {employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
                                <div key={emp.employee_id} className={`chat-employee ${selectedEmployee?.employee_id === emp.employee_id ? "chat-active" : ""}`} onClick={() => exitChat(emp)}>
                                    {/* <img src={emp.avatar} alt={emp.name} className="chat-avatar" /> */}
                                    <img src="#" alt={emp.name} className="chat-avatar" />
                                    <div className="chat-employee-info">
                                        <span className="chat-employee-name">{emp.name}</span>
                                        {/* <span className="chat-employee-message">{emp.lastMessage}</span> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-main">
                        {selectedEmployee ? (
                            <>
                                <div className="chat-header">
                                    {/* <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="chat-avatar" /> */}
                                    <img src="#" alt={selectedEmployee.name} className="chat-avatar" />
                                    <div>
                                        <h2>{selectedEmployee.name}</h2>
                                        <p>{selectedEmployee.position}</p>
                                    </div>
                                </div>
                                <div className="chat-messages">
                                    {messages1.map((message, index) =>
                                        message.sender_id === user._id && message.receiver_id === selectedEmployee._id ? (
                                            <div key={index} className={`chat-message chat-message-admin`}>
                                                <div>{message.message}</div>
                                                {/* <span>{msg.timestamp.toLocaleTimeString()}</span> */}
                                            </div>
                                        ) : message.receiver_id === user._id ? (
                                            <div key={index} className={`chat-message chat-message-employee`}>
                                                <div>{message.message}</div>
                                                {/* <span>{msg.timestamp.toLocaleTimeString()}</span> */}
                                            </div>
                                        ) : (
                                            <p key={index}></p>
                                        )
                                    )}
                                    {messages.map((message, index) =>
                                        message.sender_id === user._id && message.receiver_id === selectedEmployee._id ? (
                                            <div key={index} className={`chat-message chat-message-admin`}>
                                                <div>{message.message}</div>
                                            </div>
                                        ) : message.sender_id === selectedEmployee._id && message.receiver_id === user._id ? (
                                            <div key={index} className={`chat-message chat-message-employee`}>
                                                <div>{message.message}</div>
                                            </div>
                                        ) : (
                                            <p key={index}></p>
                                        )
                                    )}
                                </div>
                                <div className="chat-input">
                                    <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
                                    <button onClick={handleSendMessage}><Send /></button>
                                </div>
                            </>
                        ) : (
                            <div className="chat-placeholder">Select an employee to start chatting</div>
                        )}
                    </div>

                </div>
            </> :
                <>
                    <UnauthorizedChatView />
                </>}
        </>
    );
};


export default ChatPage;
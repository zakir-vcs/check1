import React, { useState, useEffect, useRef } from 'react';

export default function ChatMaX() {
    const [placeholder, setPlaceholder] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatStarted, setIsChatStarted] = useState(false);
    
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);

    const placeholders = [
        "Finding your today's mess? Let me help you!",
        "What would you like to eat today?",
        "Need info about your hostel?",
        "Struggling with studies? Let's eat something first!",
        "What's on your mind today?",
        "Looking for the best food near campus?",
    ];

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * placeholders.length);
        setPlaceholder(placeholders[randomIndex]);
    }, []);

    // Effect for auto-resizing the textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [inputValue]);
    
    // Effect for auto-scrolling the chat container
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;

        // Add user message to the chat
        const userMessage = { id: Date.now(), text: trimmedInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Start the chat view on first message
        if (!isChatStarted) {
            setIsChatStarted(true);
        }

        // Clear the input
        setInputValue('');

        // Simulate a bot response
        setTimeout(() => {
            const botMessage = { id: Date.now() + 1, text: "Test Reply. This is only for testing. 😊", sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };
    
    // Handle "Enter" to send, "Shift+Enter" for new line
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <main className={`flex flex-col h-full w-full items-center p-4 transition-all duration-500 ease-in-out ${isChatStarted ? 'justify-between' : 'justify-center gap-y-10'}`}>
            
            {/* -- Initial Welcome Title -- */}
            {!isChatStarted && (
                <h1 className="text-4xl font-bold transition-opacity duration-300">ChatMaX</h1>
            )}

            {/* -- Chat Messages Area -- */}
            {isChatStarted && (
                <div ref={chatContainerRef} className="flex-grow w-full max-w-3xl max-h-[80vh] mx-auto overflow-y-auto pr-2">
                    <div className="flex flex-col gap-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`py-2 px-4 rounded-2xl max-w-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-secondary text-primary rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* -- Text Input Form -- */}
            
            <form onSubmit={handleSendMessage} className={`w-full max-w-2xl flex bg-secondary rounded-3xl py-3 px-4 shadow-lg transition-all duration-500 ease-in-out ${isChatStarted ? 'mt-4' : ''}`}>
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isChatStarted ? "Ask ChatMaX" : placeholder}
                    className="flex-grow bg-transparent focus:outline-none text-primary placeholder-gray-500 px-2 py-2 max-h-18 text-md resize-none overflow-y-auto"
                    rows="1"
                />
                <button type="submit" className="bg-primary rounded-full p-2 cursor-pointer hover:opacity-80 transition self-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>
        </main>
    );
}
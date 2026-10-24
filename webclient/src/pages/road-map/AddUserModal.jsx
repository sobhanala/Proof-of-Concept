import { useState, useEffect, useRef, useCallback } from 'react';

function AddUserModal({ show, onClose, onSave }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [canSave, setCanSave] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const sessionIdRef = useRef(null);
    const neededModulesRef = useRef({});
    const descriptionRef = useRef('');

    const resetForm = useCallback((includeWelcomeMessage = false) => {
        setName('');
        setRole('');
        setUserMessage('');
        setCanSave(false);
        setIsLoading(false);
        sessionIdRef.current = null;
        neededModulesRef.current = {};
        descriptionRef.current = '';
        
        if (includeWelcomeMessage) {
            setChatMessages([{
                id: 1,
                sender: 'ai',
                message: 'سلام! من آماده‌ام تا با کاربر جدید آشنا شوم. لطفاً اطلاعات بیشتری در مورد این کاربر به من بدهید.'
            }]);
        } else {
            setChatMessages([]);
        }
    }, []);

    // Initialize AI welcome message when modal opens
    useEffect(() => {
        if (show) {
            resetForm(true);
        }
    }, [show, resetForm]);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!userMessage.trim() || isLoading) return;

        // Add user message
        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            message: userMessage
        };
        setChatMessages(prev => [...prev, newUserMessage]);

        const messageToSend = userMessage;
        // Clear input
        setUserMessage('');
        setIsLoading(true);

        try {
            // Prepare request body
            const requestBody = {
                session_id: "",
                role: role,
                message: messageToSend
            };

            // Add session_id if we have one
            if (sessionIdRef.current) {
                requestBody.session_id = sessionIdRef.current;
            }

            // Make API call
            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Update session_id if we received one
            if (data.session_id) {
                sessionIdRef.current = data.session_id;
            }

            if (data.done) {
                setCanSave(true);
                neededModulesRef.current = data.roadmap.needed_modules;
                descriptionRef.current = data.description;
            }

            // Add AI response to chat
            if (data.response) {
                const aiResponse = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    message: data.response
                };
                setChatMessages(prev => [...prev, aiResponse]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show error message to user
            const errorResponse = {
                id: Date.now() + 1,
                sender: 'ai',
                message: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.'
            };
            setChatMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!name.trim() || !role.trim()) {
            alert('لطفاً نام و نقش کاربر را وارد کنید.');
            return;
        }

        onSave({
            name: name,
            role: role,
            description: (descriptionRef.current) ? descriptionRef.current : 'توضیحاتی وارد نشده است',
            neededModules: neededModulesRef.current
        });
    };

    const handleClose = () => {
        resetForm(false);
        onClose();
    };

    if (!show) return null;

    return (
        <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-lg" style={{ direction: 'rtl', maxWidth: '800px' }}>
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <h5 className="modal-title">افزودن کاربر جدید</h5>
                        <button 
                            type="button" 
                            className="btn-close p-0 m-0" 
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body" style={{ direction: 'rtl' }}>
                        {/* Name and Role Inputs */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="userName" className="form-label">نام کاربر</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="userName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="نام کاربر را وارد کنید"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="userRole" className="form-label">نقش در شرکت</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="userRole"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="نقش کاربر در شرکت را وارد کنید"
                                />
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="mb-3">
                            <label className="form-label">گفتگو با دستیار هوش مصنوعی</label>
                            <div 
                                className="border rounded p-3" 
                                style={{ 
                                    height: '400px', 
                                    overflowY: 'auto', 
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* Chat Messages */}
                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                                    {chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                                        >
                                            <div
                                                className={`p-3 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}
                                                style={{
                                                    maxWidth: '70%',
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                            >
                                                <div className="small mb-1 opacity-75">
                                                    {msg.sender === 'ai' ? '🤖 دستیار هوش مصنوعی' : '👤 شما'}
                                                </div>
                                                <div>{msg.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="پیام خود را بنویسید..."
                                        style={{ direction: 'rtl' }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSendMessage}
                                        disabled={!userMessage.trim() || isLoading || !role.trim()}
                                    >
                                        {isLoading ? 'در حال ارسال...' : 'ارسال'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ direction: 'rtl' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleClose}
                        >
                            انصراف
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success"
                            disabled={!canSave} 
                        >
                            سطح بندی
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            disabled={!canSave} 
                            onClick={handleSave}
                        >
                            ذخیره کاربر
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUserModal;
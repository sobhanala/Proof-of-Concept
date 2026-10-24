function ContentWindow() {
    return (
        <div 
            className="border rounded p-4 bg-white shadow-sm"
            style={{ 
                direction: 'rtl',
                textAlign: 'right',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="64" 
                    height="64" 
                    fill="currentColor" 
                    className="bi bi-window" 
                    viewBox="0 0 16 16"
                    style={{ color: '#6c757d', marginBottom: '15px' }}
                >
                    <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                    <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm13 2v2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1M2 14a1 1 0 0 1-1-1V6h14v7a1 1 0 0 1-1 1z"/>
                </svg>
                <p className="text-muted mb-0" style={{ direction: 'rtl', fontSize: '1.1rem' }}>
                    ContentWindow - این بخش برای محتوای آینده در نظر گرفته شده است
                </p>
            </div>
        </div>
    );
}

export default ContentWindow;


function UserCard({id, name, role, description, neededModules, onSelect, isSelected}) {
    // Filter neededModules to only include string values
    const stringModules = neededModules ? Object.entries(neededModules)
        .filter(([key, value]) => typeof value === 'string')
        .map(([key, value]) => ({ key, value })) : [];

    return (
        <div 
            onClick={() => onSelect && onSelect(id)} 
            className={`card ${isSelected ? 'shadow' : 'shadow-sm'}`}
            style={{ 
                cursor: "pointer", 
                direction: 'rtl', 
                textAlign: 'right', 
                width: '300px', 
                margin: '20px 10px',
                border: isSelected ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,.125)',
                backgroundColor: isSelected ? '#e7f1ff' : 'white',
                transition: 'all 0.2s ease-in-out'
            }}
        >
            <div className="card-body">
                {/* User Info Section */}
                <div className="d-flex align-items-center mb-3" style={{ direction: 'rtl' }}>
                    <div className="me-0 ms-3 d-flex align-items-center justify-content-center rounded-circle bg-light" 
                         style={{ width: '60px', height: '60px' }}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="32" 
                            height="32" 
                            fill="currentColor" 
                            className="bi bi-person-fill" 
                            viewBox="0 0 16 16"
                            style={{ color: '#6c757d' }}
                        >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </div>
                    <div>
                        <h5 className="card-title mb-0" style={{ direction: 'rtl' }}>
                            {name || 'کاربر'}
                        </h5>
                        <small className="text-muted">{role}</small>
                    </div>
                </div>

                <hr />

                {/* Description Section */}
                {description && (
                    <div className="mb-3">
                        <p className="mb-0" style={{ direction: 'rtl', textAlign: 'right', color: '#6c757d' }}>
                            {description}
                        </p>
                    </div>
                )}

                {/* Needed Modules Section */}
                <div>
                    <h6 className="mb-3" style={{ direction: 'rtl' }}>
                        ماژول‌های مورد نیاز:
                    </h6>
                    {stringModules.length > 0 ? (
                        <div className="list-group" style={{ direction: 'rtl' }}>
                            {stringModules.map(({ key, value }, index) => (
                                <div 
                                    key={index} 
                                    className="list-group-item d-flex justify-content-between align-items-start"
                                    style={{ direction: 'rtl', textAlign: 'right' }}
                                >
                                    <div className="ms-2">
                                        <div className="fw-bold ">{key}</div>
                                        <small className="text-muted">{value}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-center" style={{ direction: 'rtl' }}>
                            ماژولی انتخاب نشده است
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserCard;

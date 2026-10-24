function PersonaMetrics({ persona }) {
    if (!persona) {
        return (
            <div 
                className="border rounded p-4 bg-light d-flex align-items-center justify-content-center"
                style={{ 
                    minHeight: '200px',
                    direction: 'rtl',
                    textAlign: 'center'
                }}
            >
                <p className="text-muted mb-0" style={{ direction: 'rtl' }}>
                    لطفاً یک یادگیرنده را از فهرست انتخاب کنید
                </p>
            </div>
        );
    }

    const defaultVark = persona.varkStyle || { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };
    const defaultHoneyMumford = persona.honeyMumfordStyle || { activist: 0, reflector: 0, theorist: 0, pragmatist: 0 };
    const defaultFsls = persona.fslsStyles || { active: 0, reflective: 0, sensing: 0, intuitive: 0, visual: 0, verbal: 0, sequential: 0, global: 0 };

    // VARK styles
    const varkStyles = [
        { name: 'Visual', key: 'visual', color: '#4A90E2' },
        { name: 'Auditory', key: 'auditory', color: '#50C878' },
        { name: 'Reading/Writing', key: 'reading', color: '#FF6B6B' },
        { name: 'Kinesthetic', key: 'kinesthetic', color: '#FFA500' }
    ];

    // Honey and Mumford styles
    const honeyMumfordStyles = [
        { name: 'Activist', key: 'activist', color: '#9B59B6' },
        { name: 'Reflector', key: 'reflector', color: '#3498DB' },
        { name: 'Theorist', key: 'theorist', color: '#E74C3C' },
        { name: 'Pragmatist', key: 'pragmatist', color: '#F39C12' }
    ];

    // FSLS styles (Felder-Silverman Learning Style)
    const fslsStylesList = [
        { name: 'Active', key: 'active', opposite: 'reflective', color: '#1ABC9C' },
        { name: 'Reflective', key: 'reflective', opposite: 'active', color: '#16A085' },
        { name: 'Sensing', key: 'sensing', opposite: 'intuitive', color: '#E67E22' },
        { name: 'Intuitive', key: 'intuitive', opposite: 'sensing', color: '#D35400' },
        { name: 'Visual', key: 'visual', opposite: 'verbal', color: '#3498DB' },
        { name: 'Verbal', key: 'verbal', opposite: 'visual', color: '#2980B9' },
        { name: 'Sequential', key: 'sequential', opposite: 'global', color: '#8E44AD' },
        { name: 'Global', key: 'global', opposite: 'sequential', color: '#7D3C98' }
    ];

    const renderStyleBar = (style, value, maxValue = 100) => {
        const percentage = Math.min((value / maxValue) * 100, 100);
        return (
            <div className="mb-2" style={{ direction: 'rtl' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-bold">{style.name}</span>
                    <span className="small text-muted">{value}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: style.color,
                            transition: 'width 0.3s ease'
                        }}
                        aria-valuenow={value}
                        aria-valuemin="0"
                        aria-valuemax={maxValue}
                    ></div>
                </div>
            </div>
        );
    };

    const renderFSLSPair = (style1, style2) => {
        const value1 = defaultFsls[style1.key] || 0;
        const value2 = defaultFsls[style2.key] || 0;
        const total = value1 + value2 || 1;
        const percentage1 = (value1 / total) * 100;
        const percentage2 = (value2 / total) * 100;

        return (
            <div className="mb-3" style={{ direction: 'rtl' }}>
                <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">{style1.name}</span>
                    <span className="small fw-bold">{style2.name}</span>
                </div>
                <div className="d-flex" style={{ height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${percentage1}%`,
                            backgroundColor: style1.color,
                            transition: 'width 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {percentage1 > 15 && <span className="small text-white fw-bold">{Math.round(percentage1)}%</span>}
                    </div>
                    <div
                        style={{
                            width: `${percentage2}%`,
                            backgroundColor: style2.color,
                            transition: 'width 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {percentage2 > 15 && <span className="small text-white fw-bold">{Math.round(percentage2)}%</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="border rounded p-4 bg-white shadow-sm"
            style={{ 
                direction: 'rtl',
                textAlign: 'right'
            }}
        >
            <h5 className="mb-4 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                {persona.name} - معیارهای سبک یادگیری
            </h5>
            
            {/* Description */}
            {persona.description && (
                <div className="mb-4">
                    <p className="mb-0 small" style={{ direction: 'rtl', textAlign: 'right', color: '#6c757d', lineHeight: '1.6' }}>
                        {persona.description}
                    </p>
                </div>
            )}

            {/* Metrics aligned horizontally */}
            <div className="d-flex flex-wrap gap-4" style={{ direction: 'rtl' }}>
                {/* VARK Learning Styles */}
                <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        VARK Learning Styles
                    </h6>
                    {varkStyles.map((style) => (
                        <div key={style.key}>
                            {renderStyleBar(style, defaultVark[style.key] || 0)}
                        </div>
                    ))}
                </div>

                {/* Honey and Mumford Learning Styles */}
                <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        Honey & Mumford Learning Styles
                    </h6>
                    {honeyMumfordStyles.map((style) => (
                        <div key={style.key}>
                            {renderStyleBar(style, defaultHoneyMumford[style.key] || 0)}
                        </div>
                    ))}
                </div>

                {/* FSLS (Felder-Silverman Learning Style) */}
                <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        FSLS (Felder-Silverman)
                    </h6>
                    {renderFSLSPair(
                        fslsStylesList.find(s => s.key === 'active'),
                        fslsStylesList.find(s => s.key === 'reflective')
                    )}
                    {renderFSLSPair(
                        fslsStylesList.find(s => s.key === 'sensing'),
                        fslsStylesList.find(s => s.key === 'intuitive')
                    )}
                    {renderFSLSPair(
                        fslsStylesList.find(s => s.key === 'visual'),
                        fslsStylesList.find(s => s.key === 'verbal')
                    )}
                    {renderFSLSPair(
                        fslsStylesList.find(s => s.key === 'sequential'),
                        fslsStylesList.find(s => s.key === 'global')
                    )}
                </div>

                {/* Platform Analisys (simple message) */}
                <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        Platform Analisys
                    </h6>
                    <div className="border rounded p-3 bg-light text-center" style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p className="mb-0 text-muted">تعاملی با سامانه صورت نگرفته</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonaMetrics;


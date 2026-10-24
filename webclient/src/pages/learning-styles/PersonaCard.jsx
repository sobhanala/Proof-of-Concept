function PersonaCard({ personaName, description, varkStyle, honeyMumfordStyle, fslsStyles }) {
    // Default values if not provided
    const defaultVark = varkStyle || { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };
    const defaultHoneyMumford = honeyMumfordStyle || { activist: 0, reflector: 0, theorist: 0, pragmatist: 0 };
    const defaultFsls = fslsStyles || { active: 0, reflective: 0, sensing: 0, intuitive: 0, visual: 0, verbal: 0, sequential: 0, global: 0 };

    // VARK styles
    const varkStyles = [
        { name: 'Visual', key: 'visual', color: '#4A90E2', icon: '👁️' },
        { name: 'Auditory', key: 'auditory', color: '#50C878', icon: '👂' },
        { name: 'Reading/Writing', key: 'reading', color: '#FF6B6B', icon: '📖' },
        { name: 'Kinesthetic', key: 'kinesthetic', color: '#FFA500', icon: '🤲' }
    ];

    // Honey and Mumford styles
    const honeyMumfordStyles = [
        { name: 'Activist', key: 'activist', color: '#9B59B6', icon: '⚡' },
        { name: 'Reflector', key: 'reflector', color: '#3498DB', icon: '🔍' },
        { name: 'Theorist', key: 'theorist', color: '#E74C3C', icon: '🧠' },
        { name: 'Pragmatist', key: 'pragmatist', color: '#F39C12', icon: '🔧' }
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
            className="card shadow-sm"
            style={{
                direction: 'rtl',
                textAlign: 'right',
                width: '100%',
                maxWidth: '600px',
                margin: '0',
                border: '1px solid rgba(0,0,0,.125)',
                backgroundColor: 'white',
                transition: 'all 0.2s ease-in-out'
            }}
        >
            <div className="card-body">
                {/* Persona Name */}
                {personaName && (
                    <div className="mb-3">
                        <h5 className="card-title mb-0" style={{ direction: 'rtl' }}>
                            {personaName}
                        </h5>
                    </div>
                )}

                {/* Description Section */}
                {description && (
                    <div className="mb-4">
                        <h6 className="mb-2 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                            توضیحات سبک یادگیری:
                        </h6>
                        <p className="mb-0 small" style={{ direction: 'rtl', textAlign: 'right', color: '#6c757d', lineHeight: '1.6' }}>
                            {description}
                        </p>
                    </div>
                )}

                <hr />

                {/* VARK Learning Styles */}
                <div className="mb-4">
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        VARK Learning Styles
                    </h6>
                    {varkStyles.map((style) => (
                        <div key={style.key}>
                            {renderStyleBar(style, defaultVark[style.key] || 0)}
                        </div>
                    ))}
                </div>

                <hr />

                {/* Honey and Mumford Learning Styles */}
                <div className="mb-4">
                    <h6 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                        Honey & Mumford Learning Styles
                    </h6>
                    {honeyMumfordStyles.map((style) => (
                        <div key={style.key}>
                            {renderStyleBar(style, defaultHoneyMumford[style.key] || 0)}
                        </div>
                    ))}
                </div>

                <hr />

                {/* FSLS (Felder-Silverman Learning Style) */}
                <div className="mb-3">
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
            </div>
        </div>
    );
}

export default PersonaCard;

import { useState } from 'react';
import AddPersonaModal from './AddPersonaModal';

function PersonaList({ personas, selectedPersonaId, onPersonaClick, onAddPersona }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div 
                className="border rounded p-3 bg-white shadow-sm d-flex flex-column"
                style={{ 
                    minWidth: '250px', 
                    maxWidth: '300px',
                    direction: 'rtl',
                    textAlign: 'right'
                }}
            >
                <h5 className="mb-3 fw-bold" style={{ direction: 'rtl', color: '#495057' }}>
                    فهرست یادگیرندگان
                </h5>
                <div className="list-group flex-grow-1" style={{ direction: 'rtl' }}>
                    {personas.map(persona => (
                        <button
                            key={persona.id}
                            type="button"
                            className={`list-group-item list-group-item-action ${
                                selectedPersonaId === persona.id ? 'active' : ''
                            }`}
                            onClick={() => onPersonaClick(persona.id)}
                            style={{
                                direction: 'rtl',
                                textAlign: 'right',
                                cursor: 'pointer',
                                border: selectedPersonaId === persona.id ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,.125)',
                                transition: 'all 0.2s ease-in-out',
                                marginBottom: '5px',
                                borderRadius: '4px'
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="me-0 ms-3 d-flex align-items-center justify-content-center rounded-circle bg-light" 
                                     style={{ 
                                         width: '40px', 
                                         height: '40px',
                                         backgroundColor: selectedPersonaId === persona.id ? 'rgba(255,255,255,0.3)' : '#f8f9fa'
                                     }}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="20" 
                                        height="20" 
                                        fill="currentColor" 
                                        className="bi bi-person-fill" 
                                        viewBox="0 0 16 16"
                                        style={{ color: selectedPersonaId === persona.id ? '#fff' : '#6c757d' }}
                                    >
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-bold" style={{ 
                                        direction: 'rtl',
                                        color: selectedPersonaId === persona.id ? '#fff' : '#212529'
                                    }}>
                                        {persona.name}
                                    </h6>
                                </div>
                                {selectedPersonaId === persona.id && (
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="16" 
                                        height="16" 
                                        fill="currentColor" 
                                        className="bi bi-chevron-left" 
                                        viewBox="0 0 16 16"
                                        style={{ color: '#fff' }}
                                    >
                                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="btn btn-success mt-3 w-100 fw-bold"
                    onClick={() => setShowModal(true)}
                    style={{ direction: 'rtl' }}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-person-plus" 
                        viewBox="0 0 16 16"
                        style={{ marginLeft: '5px' }}
                    >
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"/>
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    یادگیرنده جدید
                </button>
            </div>
            <AddPersonaModal show={showModal} onClose={() => setShowModal(false)} onSave={onAddPersona} />
        </>
    );
}

export default PersonaList;


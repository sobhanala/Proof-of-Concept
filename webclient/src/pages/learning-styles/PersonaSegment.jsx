import { useState, useRef } from "react";
import PersonaList from "./PersonaList";
import PersonaMetrics from "./PersonaMetrics";
import ContentWindow from "./ContentWindow";

function PersonaSegment() {
    // Example personas with learning style data
    const [personas, setPersonas] = useState([
        {
            id: 1,
            name: "رضا حسینی",
            description: "این شخص دارای سبک یادگیری بصری و فعال است. ترجیح می‌دهد از طریق مشاهده و تجربه مستقیم یاد بگیرد.",
            varkStyle: { visual: 80, auditory: 20, reading: 30, kinesthetic: 70 },
            honeyMumfordStyle: { activist: 75, reflector: 25, theorist: 40, pragmatist: 60 },
            fslsStyles: { active: 70, reflective: 30, sensing: 60, intuitive: 40, visual: 80, verbal: 20, sequential: 50, global: 50 }
        },
        {
            id: 2,
            name: "محسن ملایری",
            description: "این شخص دارای سبک یادگیری شنیداری و نظریه‌پرداز است. از طریق گوش دادن و تحلیل منطقی بهتر یاد می‌گیرد.",
            varkStyle: { visual: 30, auditory: 85, reading: 60, kinesthetic: 25 },
            honeyMumfordStyle: { activist: 20, reflector: 70, theorist: 80, pragmatist: 30 },
            fslsStyles: { active: 30, reflective: 70, sensing: 40, intuitive: 60, visual: 30, verbal: 70, sequential: 75, global: 25 }
        },
        {
            id: 3,
            name: "احمد راد",
            description: "این شخص دارای سبک یادگیری خواندن/نوشتن و عمل‌گرا است. از طریق مطالعه و تمرین عملی بهتر یاد می‌گیرد.",
            varkStyle: { visual: 40, auditory: 30, reading: 90, kinesthetic: 40 },
            honeyMumfordStyle: { activist: 50, reflector: 30, theorist: 50, pragmatist: 85 },
            fslsStyles: { active: 60, reflective: 40, sensing: 70, intuitive: 30, visual: 40, verbal: 60, sequential: 60, global: 40 }
        },
        {
            id: 4,
            name: "نوید نویدبخش",
            description: "این شخص دارای سبک یادگیری حرکتی و بازتاب‌گرا است. از طریق تجربه عملی و تفکر عمیق بهتر یاد می‌گیرد.",
            varkStyle: { visual: 50, auditory: 40, reading: 35, kinesthetic: 85 },
            honeyMumfordStyle: { activist: 40, reflector: 80, theorist: 45, pragmatist: 35 },
            fslsStyles: { active: 45, reflective: 55, sensing: 75, intuitive: 25, visual: 50, verbal: 50, sequential: 40, global: 60 }
        }
    ]);

    const nextPersonaIdRef = useRef(5);
    const [selectedPersonaId, setSelectedPersonaId] = useState(null);

    const handlePersonaClick = (id) => {
        // Toggle: if clicking the same persona, collapse it; otherwise expand the new one
        setSelectedPersonaId(selectedPersonaId === id ? null : id);
    };

    const handleAddPersona = (newPersona) => {
        newPersona.id = nextPersonaIdRef.current;
        nextPersonaIdRef.current++;
        setPersonas([newPersona, ...personas]);
        // Auto-select the new persona
        setSelectedPersonaId(newPersona.id);
    };

    const selectedPersona = personas.find(p => p.id === selectedPersonaId);

    return (
        <div className="d-flex" style={{ minHeight: '500px', gap: '20px' }}>
            {/* Left Sidebar - Persona List */}
            <PersonaList 
                personas={personas}
                selectedPersonaId={selectedPersonaId}
                onPersonaClick={handlePersonaClick}
                onAddPersona={handleAddPersona}
            />

            {/* Right Side - Content Area */}
            <div className="flex-grow-1 d-flex flex-column" style={{ gap: '20px' }}>
                {/* Upper Right - ContentWindow */}
                <ContentWindow />

                {/* Bottom - Persona Metrics */}
                <PersonaMetrics persona={selectedPersona} />
            </div>
        </div>
    );
}

export default PersonaSegment;

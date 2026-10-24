from typing import Dict, List, Optional, Tuple
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import arabic_reshaper
from bidi.algorithm import get_display
import uuid

from .llm import (
    call_llm,
    clean_output,
    format_modules,
    extract_roadmap,
    detect_learning_style,
)
from .models import (
    StartSessionInput,
    StartSessionResponse,
    ChatInput,
    ChatResponse,
    LearningStyleInput,
    LearningStyleResponse,
    VarkStyle,
    FslStyles,
    HoneyMumfordStyle,
)
from .prompts import SYSTEM_PROMPT_CHAT, SYSTEM_PROMPT_DESC, LEARNING_STYLE


app = FastAPI(title="AI Roadmap Agent (OpenRouter)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------
# In-memory sessions
# -----------------------
NEXT_SESSION_ID: int = 0
SESSIONS: Dict[str, List[Dict[str, str]]] = {}


# -----------------------
# Routes
# -----------------------
@app.post("/chat", response_model=ChatResponse)
def chat(chat_input: ChatInput):
    """Interactive (step-by-step) roadmap builder."""
    global NEXT_SESSION_ID

    session_id = chat_input.session_id
    if session_id == "":
        session_id = str(NEXT_SESSION_ID)
        NEXT_SESSION_ID += 1

    user_message = chat_input.message.strip()

    if session_id not in SESSIONS:
        system_msg = SYSTEM_PROMPT_CHAT.format(modules=format_modules())
        SESSIONS[session_id] = [{"role": "system", "content": system_msg}]

    history = SESSIONS[session_id]
    history.append({"role": "user", "content": user_message})

    output = call_llm(history)
    output = clean_output(output)
    history.append({"role": "assistant", "content": output})

    done, roadmap, clean_text = extract_roadmap(output)
    return ChatResponse(
        response=clean_text, done=done, roadmap=roadmap, session_id=session_id
    )


@app.post("/roadmap", response_model=ChatResponse)
def roadmap(chat_input: ChatInput):
    """Generate roadmap in one shot based on full description."""
    user_description = chat_input.message.strip()

    system_msg = SYSTEM_PROMPT_DESC.format(
        modules=format_modules(),
        person_description=user_description,
    )

    history = [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_description},
    ]

    output = call_llm(history)
    output = clean_output(output)
    done, roadmap, clean_text = extract_roadmap(output)
    return ChatResponse(response=clean_text, done=done, roadmap=roadmap, session_id="")


@app.post("/learning-styles", response_model=LearningStyleResponse)
def learning_styles_chat(payload: LearningStyleInput):
    data = detect_learning_style(payload.questionnaire)

    return LearningStyleResponse(
        id=uuid.uuid4(),
        name=payload.name,
        description=data["description"],
        varkStyle=VarkStyle(**data["varkStyle"]),
        honeyMumfordStyle=HoneyMumfordStyle(**data["honeyMumfordStyle"]),
        fslsStyles=FslStyles(**data["fslsStyles"]),
    )

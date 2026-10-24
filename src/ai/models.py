from pydantic import BaseModel
from typing import Dict, List, Optional, Tuple
import uuid


class BaseQuestion(BaseModel):
    question: str
    answer: str
    type: str
    explanation: Optional[str] = None


class Questionnaire(BaseModel):
    question1: BaseQuestion
    question2: BaseQuestion
    question3: BaseQuestion
    question4: BaseQuestion
    question5: BaseQuestion
    question6: BaseQuestion
    question7: BaseQuestion


class LearningStyleInput(BaseModel):
    name: str
    questionnaire: Questionnaire


class VarkStyle(BaseModel):
    visual: int
    auditory: int
    reading: int
    kinesthetic: int


class HoneyMumfordStyle(BaseModel):
    activist: int
    reflector: int
    theorist: int
    pragmatist: int


class FslStyles(BaseModel):
    active: int
    reflective: int
    sensing: int
    intuitive: int
    visual: int
    verbal: int
    sequential: int
    global_: int

    class Config:
        fields = {"global_": "global"}


class LearningStyleResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    varkStyle: VarkStyle
    honeyMumfordStyle: HoneyMumfordStyle
    fslsStyles: FslStyles


class ChatInput(BaseModel):
    session_id: str
    role: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    response: str
    done: bool = False
    roadmap: Optional[Dict] = None


class StartSessionInput(BaseModel):
    frameworkId: str


class StartSessionResponse(BaseModel):
    sessionId: str

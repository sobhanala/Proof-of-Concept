import os
import re
import json
from typing import Dict, List, Optional, Tuple
from openai import OpenAI
from .prompts import LEARNING_STYLE

CLIENT = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
)
MODEL = os.getenv("OPENROUTER_MODEL", "google/gemma-3-27b-it:free")
with open("./ai/modules.json", "r", encoding="utf-8") as f:
    MODULES = json.load(f)


def format_modules() -> str:
    """Render module list for prompt injection."""
    return "\n".join(
        f"- {name}:\n"
        f"  Description: {m['description']}\n"
        f"  Who needs it: {m['who_needs_it']}\n"
        f"  Skills gained: {m.get('skills_gained', 'N/A')}\n"
        for name, m in MODULES.items()
    )


def detect_learning_style(questionnaire: str) -> Dict:
    prompt = LEARNING_STYLE.format(payload=questionnaire)

    response = CLIENT.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    output_text = response.choices[0].message.content
    print(output_text[7:-4])
    learing_style = json.loads(output_text[7:-4])

    return learing_style


def call_llm(messages: List[Dict[str, str]]) -> str:
    """Call the OpenRouter LLM and return text output."""
    completion = CLIENT.chat.completions.create(
        model=MODEL,
        messages=messages,
        extra_headers={
            "X-Title": "AI Roadmap Advisor",
        },
    )
    return completion.choices[0].message.content


def clean_output(output: str) -> str:
    """Remove any internal reasoning sections."""
    return re.sub(
        r"### INTERNAL THINKING ###.*?### END INTERNAL THINKING ###",
        "",
        output,
        flags=re.DOTALL,
    )


def extract_roadmap(output: str) -> Tuple[bool, Optional[Dict], str]:
    """Extract final roadmap JSON if present."""
    if "FINAL ROADMAP" not in output:
        return False, None, output

    try:
        json_part = output.split("FINAL ROADMAP:")[1].strip()
        json_part = re.sub(r"^```(?:json)?\s*|\s*```$", "", json_part)
        roadmap = json.loads(json_part)
        output_clean = output.split("FINAL ROADMAP:")[0].strip()
        return True, roadmap, output_clean
    except Exception:
        return True, {"error": "Could not parse roadmap JSON."}, output

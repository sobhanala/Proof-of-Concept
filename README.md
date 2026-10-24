# AI Roadmap Advisor — Proof of Concept

A learning-roadmap prototype with a FastAPI backend and React frontend. It uses an OpenRouter-hosted language model for conversation, roadmap generation, and questionnaire-based learning-style output.

## Structure

- `src/ai/`: API, LLM adapter, prompts, models, and module catalog.
- `webclient/`: React 19 client, including learning-style interfaces.

## Backend setup

Create a Python environment and install `src/ai/requirements.txt`. Uvicorn is included in that requirements file.

Set `OPENROUTER_API_KEY` in your local environment. The public source reads it from the environment; the original committed keys are excluded. Optionally set `OPENROUTER_MODEL` to a model available to your account.

From the repository root:

```sh
python -m pip install -r src/ai/requirements.txt
cd src
python -m uvicorn ai.main:app --host 127.0.0.1 --port 8080
```

The `src` working directory is required because the source reads `./ai/modules.json`. Open `http://127.0.0.1:8080/docs` for request schemas and available endpoints.

Model availability and responses depend on the configured provider. The application stores sessions in memory; restarting it clears that session state.

## Frontend setup

In a separate terminal:

```sh
cd webclient
npm ci
npm start
```

Review its API base URL before connecting it to the backend. Roadmaps and learning-style classifications are experimental generated output; the repository does not establish educational effectiveness.

## Credits and source

This is a public portfolio copy of the shared project [UTeam-400/Proof-of-Concept](https://github.com/UTeam-400/Proof-of-Concept), prepared for Sobhan Alaeddini's account. Original authorship and existing license notices are retained. See [SOURCE.md](SOURCE.md) for the source revision and publication notes.

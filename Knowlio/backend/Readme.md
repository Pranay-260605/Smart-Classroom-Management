# Knowlio - Your AI-Powered Knowledge Assistant  

Knowlio is an intelligent chatbot designed to provide insightful responses, assist with various queries, and streamline knowledge retrieval.  

## Features  

- **Conversational AI**: Engages in meaningful discussions and provides detailed responses.  
- **Lightweight and Fast**: Optimized for speed and efficiency in terminal-based environments.  
- **Expandable**: Future support for a frontend interface via API integration.  

## Installation  

### Prerequisites  

1. **Install Python** (Version 3.8+ recommended)  
   - Download from [Python's official website](https://www.python.org/downloads/).  

2. **Download LLAMA3.2 Model**  
   - Visit [Meta’s official website](https://ai.meta.com/resources/models-and-libraries/llama-downloads/) to download LLAMA3.2.  
   - Follow the installation instructions provided there.  

3. **Install Python Dependencies**  

Knowlio relies on the following Python libraries:  

| Dependency    | Purpose |
|--------------|---------|
| `langchain`  | AI conversation handling |
| `openai`     | OpenAI API for advanced processing |
| `llama-cpp-python` | Running LLAMA models locally |
| `fastapi`    | For future API integration |
| `uvicorn`    | ASGI server for FastAPI |

To install all dependencies, run:  

```bash
pip install -r requirements.txt

from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

# Define a strict system message
system_message = """
You are an AI assistant that only answers **education-related** questions.
You must respond only to queries related to **mathematics, science, programming, history, and general academics**.

If the user asks **non-educational** questions (e.g., weather, entertainment, personal life), respond with:
"I'm here to help with education-related topics only. Please ask an academic question."

For **basic greetings** (hello, hi, how are you), respond normally with a polite greeting.

Now, answer the user's question if it is educational.
"""

# Define the prompt template
prompt = PromptTemplate(
    input_variables=["input"],
    template="{system_message}\nUser: {input}\nAI:",
)

# Initialize the Ollama model
model = OllamaLLM(model="llama3.2")

print("Welcome to the Educational Chatbot! Type 'exit' to quit.")

# Continuous input loop
while True:
    user_input = input("\nYou: ")  # Get user input
    if user_input.lower() == "exit":  # Exit condition
        print("Goodbye!")
        break

    # Format the prompt properly
    formatted_prompt = prompt.format(system_message=system_message, input=user_input)

    # Get the response from the model
    result = model.invoke(formatted_prompt)

    print("Bot:", result)  # Print the AI's response

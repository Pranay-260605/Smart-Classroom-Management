import tkinter as tk
from tkmacosx import Button  # Importing Button from tkmacosx for macOS compatibility
from tkinter import messagebox

def get_button(window, text, color, command, fg="white"):
    button = Button(
        window,
        text=text,
        bg=color,
        fg=fg,
        activebackground="black",
        activeforeground="white",
        command=command,
        height=50,  # Adjusted height for macOS
        width=250,  # Adjusted width for macOS
        font=('Myriad Pro Bold', 20),
        borderless=1  # Removes extra border
    )
    return button

def get_img_label(window):
    label = tk.Label(window)
    label.grid(row=0, column=0)
    return label

def get_text_label(window, text):
    label = tk.Label(window, text=text, font=("Myriad Pro Bold", 21), justify="left")
    return label

def get_entry_text(window):
    inputtxt = tk.Text(
        window,
        height=2,
        width=15,
        font=("Arial", 32)
    )
    return inputtxt

def msg_box(title, description):
    messagebox.showinfo(title, description)
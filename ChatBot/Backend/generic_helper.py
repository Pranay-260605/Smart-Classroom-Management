import re

def extract_session_id(session_str : str):
    match = re.match(pattern=r"sessions/(.*)", string=session_str)
    if match:
        session_id = match.group(1)
        return session_id
    return ""
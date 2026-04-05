import os
import re

posts_dir = "/Users/ishaandesai/Documents/Blueprint-ftc/src/posts"
placeholder_text = "Start writing here..."

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Split frontmatter and body
    parts = re.split(r'^---$', content, flags=re.MULTILINE)
    if len(parts) < 3:
        return False, "No frontmatter"
    
    frontmatter = parts[1]
    body = parts[2].strip()
    
    # Check if "completed" is in tags
    if not re.search(r'tags:.*completed', frontmatter, re.IGNORECASE):
        return False, "Not tagged completed"
    
    # Check for "actual material"
    # Material is NOT placeholder text and body is not empty
    if not body or body == placeholder_text:
        return True, "No actual material"
    
    return False, "Has material"

files_to_update = []
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)
        is_empty, reason = check_file(filepath)
        if is_empty:
            files_to_update.append(filepath)

print("\n".join(files_to_update))

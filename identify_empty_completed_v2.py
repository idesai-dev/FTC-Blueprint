import os

posts_dir = "/Users/ishaandesai/Documents/Blueprint-ftc/src/posts"

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if not content.startswith('---'):
        return False, "No frontmatter start"
        
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False, "No frontmatter end"
    
    frontmatter = parts[1]
    body = parts[2].strip()
    
    # Check if "completed" is in tags
    # Handle both tags: [..., completed, ...] and tags: ["completed"]
    if "completed" not in frontmatter.lower():
        return False, "Not tagged completed"
    
    # Material is NOT placeholder text and body is not empty/very short
    placeholders = [
        "Content coming soon...",
        "Start writing here...",
        "Coming soon!",
        "Write something here..."
    ]
    
    if not body:
        return True, "Empty body"
    
    if body in placeholders:
        return True, f"Body is placeholder: {body}"

    # If body is just a header and a placeholder
    lines = [l.strip() for l in body.split('\n') if l.strip()]
    if len(lines) <= 2:
        for p in placeholders:
            if any(p in line for line in lines):
                return True, f"Body is minimal with placeholder: {lines}"
    
    # Check for test-test case: Start writing here... [image]
    if "Start writing here..." in body and len(body) < 300:
         return True, "Minimal body with 'Start writing here...'"

    return False, "Has material"

files_to_update = []
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)
        is_empty, reason = check_file(filepath)
        if is_empty:
            files_to_update.append((filepath, reason))

for f, r in files_to_update:
    print(f"{f} | {r}")

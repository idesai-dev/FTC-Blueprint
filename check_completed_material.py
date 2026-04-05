import os
import re

posts_dir = "/Users/ishaandesai/Documents/Blueprint-ftc/src/posts"

def get_file_info(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    parts = re.split(r'^---$', content, flags=re.MULTILINE)
    if len(parts) < 3:
        return None
    
    frontmatter = parts[1]
    body = parts[2].strip()
    
    if not re.search(r'tags:.*completed', frontmatter, re.IGNORECASE):
        return None
        
    return {
        "path": filepath,
        "body_len": len(body),
        "body_preview": body[:100].replace('\n', ' ')
    }

results = []
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        info = get_file_info(os.path.join(posts_dir, filename))
        if info:
            results.append(info)

# Sort by body length
results.sort(key=lambda x: x['body_len'])

for r in results:
    print(f"{r['body_len']:5d} {r['path']} | {r['body_preview']}")

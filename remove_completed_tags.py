import os
import re

posts_dir = "/Users/ishaandesai/Documents/Blueprint-ftc/src/posts"

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if not content.startswith('---'):
        return False, "No frontmatter start"
        
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False, "No frontmatter end"
    
    frontmatter = parts[1]
    body = parts[2].strip()
    
    # Check for "actual material"
    placeholders = [
        "Content coming soon...",
        "Start writing here...",
        "Coming soon!",
        "Write something here..."
    ]
    
    is_placeholder = False
    if not body:
        is_placeholder = True
    elif any(p.lower() in body.lower() for p in placeholders):
        is_placeholder = True
    elif len(body) < 300 and "Start writing here..." in body:
        is_placeholder = True
        
    if not is_placeholder:
        return False, "Has material"

    # Check if "completed" is in tags
    if "completed" not in frontmatter.lower():
        return False, "Not tagged completed"
    
    # Regex to find the tags line
    tags_match = re.search(r'tags:\s*\[(.*?)\]', frontmatter)
    if tags_match:
        tags_str = tags_match.group(1)
        # Split tags, remove 'completed'
        tags = [t.strip() for t in tags_str.split(',') if t.strip()]
        new_tags = []
        for t in tags:
            clean_t = t.strip(' \'"')
            if clean_t.lower() != 'completed':
                new_tags.append(clean_t)
        
        # Format tags back
        use_quotes = '"' in tags_str or "'" in tags_str
        if use_quotes and new_tags:
            formatted_tags = ['"{}"'.format(t) for t in new_tags]
        else:
            formatted_tags = [t for t in new_tags]
            
        new_tags_line = "tags: [{}]".format(', '.join(formatted_tags))
        new_fm = frontmatter.replace(tags_match.group(0), new_tags_line)
        
        if new_fm == frontmatter:
            return False, "No change in tags"
            
        new_content = "---" + new_fm + "---" + parts[2]
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True, "Updated"
    
    return False, "Tags not found"

updated_files = []
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)
        success, reason = update_file(filepath)
        if success:
            updated_files.append(filepath)

print("Updated files:")
for f in updated_files:
    print(f)

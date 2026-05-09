import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern matches href="products/nameHASH.html?variant=..."
# Strips the last 4 hex characters before .html
pattern = r'href="products/([a-z0-9-]+?)[a-f0-9]{4}\.html'
replacement = r'href="products/\1.html'

new_content = re.sub(pattern, replacement, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Product links updated.")

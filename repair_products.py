import os
import shutil

products_dir = 'products'
files = os.listdir(products_dir)

# Find all base files (no 4-char hex hash before .html)
base_files = [f for f in files if f.endswith('.html') and not any(c in 'abcdef0123456789' for c in f[-9:-5])]
# Wait, that logic is complex. Let's just find all files and check if they have a base version.

for f in files:
    if not f.endswith('.html') or len(f) < 10:
        continue
    
    # Potential hashed file: nameHASH.html (where HASH is 4 chars)
    # Check if a file exists without the last 4 chars
    name_without_hash = f[:-9] # strips HASH.html
    base_name = name_without_hash + '.html'
    
    if base_name in files and f != base_name:
        base_path = os.path.join(products_dir, base_name)
        hashed_path = os.path.join(products_dir, f)
        
        # If hashed file is much smaller or empty, overwrite it
        if os.path.getsize(hashed_path) < os.path.getsize(base_path) * 0.9:
            print(f"Repairing {f} using {base_name}...")
            shutil.copy2(base_path, hashed_path)

print("Product repair complete.")

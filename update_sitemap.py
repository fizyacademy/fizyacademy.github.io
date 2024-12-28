import os
from datetime import datetime

# Define the root directory of your website
root_dir = './'

# Define the base URL of your website
base_url = 'https://fizyacademy.github.io'

# Define the name of the sitemap file
sitemap_file = os.path.join(root_dir, 'sitemap.xml')
stylesheet_path = 'sitemap.xsl'  # Define the path to your stylesheet

# List of file extensions to include in the sitemap
valid_extensions = ['.html', '.htm']

# List of paths or patterns to ignore
ignore_list = [
    'google085c7894048661b1.html',
    'admin/',
    'myenv/',
    'venv/',
    'quiz/admin.html',
    '404.html',
    'package.json',
    'package-lock.json',
    'tests/'
]

# Function to generate the XML for a single URL entry
def generate_url_entry(loc, lastmod, changefreq='monthly', priority='0.5'):
    return f'''
    <url>
        <loc>{loc}</loc>
        <lastmod>{lastmod}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>'''

# Function to scan the directory and generate URL entries
def scan_directory(directory, base_url, ignore_list):
    url_entries = []
    for subdir, _, files in os.walk(directory):
        # Skip directories listed in ignore_list
        if any(ignored in subdir for ignored in ignore_list):
            continue
        for file in files:
            file_path = os.path.join(subdir, file)
            relative_path = os.path.relpath(file_path, directory)
            loc = f"{base_url}/{relative_path.replace(os.path.sep, '/')}"
            
            # Skip ignored paths
            if any(ignored in loc for ignored in ignore_list):
                continue

            if os.path.splitext(file)[1] in valid_extensions:
                if loc.endswith('index.html'):
                    loc = loc.replace('/index.html', '') if loc != f"{base_url}/index.html" else base_url
                else:
                    loc = loc.replace('.html', '')
                lastmod = datetime.now().strftime('%Y-%m-%d')
                
                # Set priority and change frequency based on URL
                if loc == base_url:
                    priority = '1.0'
                    changefreq = 'monthly'
                elif '/sessions' in loc:
                    priority = '0.9'
                    changefreq = 'always'
                elif '/contact' in loc:
                    priority = '0.5'
                    changefreq = 'yearly'
                elif '/404' in loc:
                    priority = '0.5'
                    changefreq = 'yearly'
                elif '/account' in loc:
                    priority = '0.5'
                    changefreq = 'yearly'
                else:
                    priority = '0.7'
                    changefreq = 'weekly'
                
                url_entries.append(generate_url_entry(loc, lastmod, changefreq=changefreq, priority=priority))
    return url_entries

# Function to generate the entire sitemap XML
def generate_sitemap(url_entries):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{"".join(url_entries)}
</urlset>'''

# Function to add the stylesheet reference
def add_stylesheet_reference(sitemap_path, stylesheet_path):
    with open(sitemap_path, 'r', encoding='UTF-8') as file:
        lines = file.readlines()

    if '<?xml-stylesheet' not in lines[1]:
        lines.insert(1, f'<?xml-stylesheet type="text/xsl" href="{stylesheet_path}"?>\n')

    with open(sitemap_path, 'w', encoding='UTF-8') as file:
        file.writelines(lines)

# Generate URL entries by scanning the root directory
url_entries = scan_directory(root_dir, base_url, ignore_list)

# Generate the sitemap XML
sitemap_xml = generate_sitemap(url_entries)

# Write the sitemap XML to the sitemap file
with open(sitemap_file, 'w') as file:
    file.write(sitemap_xml)

# Add the stylesheet reference to the sitemap file
add_stylesheet_reference(sitemap_file, stylesheet_path)

print(f'Sitemap updated and saved to {sitemap_file}')

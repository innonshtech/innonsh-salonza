import re

with open('salonos v2.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if match:
    styles = match.group(1)
    # Replace branding and fonts
    styles = styles.replace('SalonOS', 'Innonsh Salonza')
    styles = styles.replace('--font:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif;', '--font:var(--font-google-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;')
    
    with open('app/landing.css', 'w', encoding='utf-8') as f:
        f.write(styles)
    print("CSS extracted successfully")
else:
    print("Could not find <style> block")

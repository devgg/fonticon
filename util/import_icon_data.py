import urllib.request, json 

icons_json_url = 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/advanced-options/metadata/icons.json'

with urllib.request.urlopen(icons_json_url) as url:
    icons_json = json.loads(url.read().decode())

result = []
for icon_name, icon in icons_json.items():
    for style in icon['styles']:
        if style != 'brands':
            result.append({
                'id': icon_name,
                'name': icon['label'],
                'search_terms': icon['search']['terms'],
                'style': style,
            })

js_icons = 'var icons = ' + json.dumps(result)

with open('js/icons.js', 'w') as f:
    f.write(js_icons)

print(str(len(result)) + ' icons were written.')

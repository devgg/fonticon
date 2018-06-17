import urllib.request, json

icons_json_url = 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/advanced-options/metadata/icons.json'

with urllib.request.urlopen(icons_json_url) as url:
    icons_json = json.loads(url.read().decode())

result = []
for icon_name, icon in icons_json.items():
    for style in icon['styles']:
        if style != 'brands':
            result_icon = {
                'id': icon_name,
                'name': icon['label'],
                'style': style,
                'unicode': '\\u' + icon['unicode'],
            }
            search_terms = icon['search']['terms']
            if search_terms:
                result_icon['search_terms'] = search_terms
            result.append(result_icon)

js_icons = 'var icons = ' + json.dumps(
    result, separators=(',', ':')).replace('\\\\', '\\')

with open('js/icons.js', 'w') as f:
    f.write(js_icons)

print(str(len(result)) + ' icons were written.')

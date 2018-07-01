import urllib.request, json
from PIL import ImageFont

icons_json_url = 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/advanced-options/metadata/icons.json'

with urllib.request.urlopen(icons_json_url) as url:
    icons_json = json.loads(url.read().decode())

def get_style(style):
    if style == 'solid':
        return ('fas',  './node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/fa-solid-900.woff')
    elif style == 'regular':
        return ('far',  './node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/fa-regular-400.woff')
    else:
        print('Warning: style {0} unkown.'.format(style))

def get_max_size(font, icon):
    font_size = 1200;
    max_size = 1024
    width = max_size + 1
    height = max_size + 1

    # todo implement binary search
    while width >= max_size or height >= max_size:
        font_size -= 10
        f = ImageFont.truetype(font, font_size)
        width, height = f.getsize(icon)

    if width > 0:
        while width < max_size and height < max_size:
            font_size += 1
            f = ImageFont.truetype(font, font_size)
            width, height = f.getsize(icon)
    return font_size


result = []
idx = 0
for i, (icon_name, icon) in enumerate(icons_json.items()):
    if icon_name != 'font-awesome-logo-full':
        for style in icon['styles']:
            if style != 'brands':
                style, font = get_style(style)
                uni = ('\\u' + icon['unicode']).encode().decode('unicode-escape')
                result_icon = {
                    'ix': idx,
                    'id': icon_name,
                    'st': style,
                    'uc': uni,
                    'si': get_max_size(font, uni),
                }
                search_terms = icon['search']['terms']
                if search_terms:
                    result_icon['se'] = search_terms
                result.append(result_icon)
                idx += 1
    print('{0}/{1} icons processed.'.format(i + 1, len(icons_json)), end="\r")

js_icons = 'export default ' + json.dumps(result, separators=(',', ':'))

with open('src/js/generated/icons.js', 'w') as f:
    f.write(js_icons)

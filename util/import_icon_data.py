import urllib.request
import json
import urllib.parse
import tinycss2
import os
import io
import sys
import tempfile

from PIL import ImageFont

css_url = 'https://use.fontawesome.com/releases/v5.1.0/css/all.css'
icons_json_url = 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/advanced-options/metadata/icons.json'

def load_fonts(css_url):
    with urllib.request.urlopen(css_url) as url:
        css = url.read().decode()

    rules = tinycss2.parse_stylesheet(css, skip_comments=True)
    font_solid = None
    font_regular = None
    for rule in rules:
        if rule.type == 'at-rule' and rule.at_keyword == 'font-face':
            for component in rule.content:
                if component.type == 'url' and component.value.endswith('.woff'):
                    font_url = urllib.parse.urljoin(css_url, component.value)
                    fd = urllib.request.urlopen(font_url)
                    font = fd.read()
                    if 'fa-solid-900' in component.value:
                        font_solid = font
                    elif 'fa-regular-400' in component.value:
                        font_regular = font
                    else:
                        print('Warning font "{0}" found in import but unused.'.format(font_url));
    if font_solid == None or font_regular == None:
        print('Error one of the required fonts was not found')
        sys.exit()
    return (font_solid, font_regular)

font_solid, font_regular = load_fonts(css_url)

def get_style(style):
    if style == 'solid':
        return ('fas',  font_solid_path)
    elif style == 'regular':
        return ('far',  font_regular_path)
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

with tempfile.TemporaryDirectory() as tmp_dir:
    font_solid_path = tmp_dir + 'solid.woff'
    with open(font_solid_path, 'wb') as output:
        output.write(font_solid)
    font_regular_path = tmp_dir + 'regular.woff'
    with open(font_regular_path, 'wb') as output:
        output.write(font_regular)

    with urllib.request.urlopen(icons_json_url) as url:
        icons_json = json.loads(url.read().decode())

    result = []
    idx = 0
    for i, (icon_name, icon) in enumerate(icons_json.items()):
        if icon_name != 'font-awesome-logo-full':
            for style in icon['styles']:
                if style != 'brands':
                    style, font = get_style(style)
                    font
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

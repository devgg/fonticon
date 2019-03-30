import urllib.request
import json
import urllib.parse
import tinycss2
import os
import io
import sys
import tempfile
from git import Repo

from PIL import ImageFont

FONTAWESOME_GIT_URL = "git@github.com:FortAwesome/Font-Awesome.git"


def get_style(style):
    if style == "solid":
        return "fas"
    elif style == "regular":
        return "far"
    else:
        print("Warning: style {0} unkown.".format(style))


def get_max_size(font, icon):
    font_size = 1200
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


with tempfile.TemporaryDirectory() as repo_dir:
    Repo.clone_from(FONTAWESOME_GIT_URL, repo_dir)
    font_solid_path = repo_dir + "/webfonts/fa-solid-900.woff"
    font_regular_path = repo_dir + "/webfonts/fa-regular-400.woff"

    with open(repo_dir + "/metadata/icons.json") as f:
        icons_json = json.load(f)

    result = []
    idx = 0
    for i, (icon_name, icon) in enumerate(icons_json.items()):
        if icon_name != "font-awesome-logo-full":
            for style in icon["styles"]:
                if style != "brands":
                    style = get_style(style)
                    font = font_solid_path if style == "fas" else font_regular_path

                    uni = ("\\u" + icon["unicode"]).encode().decode("unicode-escape")
                    result_icon = {"ix": idx, "id": icon_name, "st": style, "uc": uni, "si": get_max_size(font, uni)}
                    search_terms = icon["search"]["terms"]
                    if search_terms:
                        result_icon["se"] = search_terms
                    result.append(result_icon)
                    idx += 1
        print("{0}/{1} icons processed.".format(i + 1, len(icons_json)), end="\r")

    js_icons = "export default " + json.dumps(result, separators=(",", ":"))

    with open("src/js/generated/icons.js", "w") as f:
        f.write(js_icons)

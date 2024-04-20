import json
import tempfile
from git import Repo

from PIL import ImageFont

FONTAWESOME_GIT_URL = "git@github.com:FortAwesome/Font-Awesome.git"
OUTPUT_ICONS_PATH = "src/js/generated/icons.js"


def get_font(fonts, style):
    if style in fonts.keys():
        return fonts[style]
    else:
        print(f"Warning: style {style} unkown.")


def get_max_size(font, icon):
    font_size = 1200
    max_size = 960
    width = max_size + 1
    height = max_size + 1

    # todo implement binary search
    while width >= max_size or height >= max_size:
        font_size -= 20
        f = ImageFont.truetype(font, font_size)
        l, u, r, b = f.getbbox(icon)
        width = r - l
        height = b - u

    if width > 0:
        while width < max_size and height < max_size:
            font_size += 1
            f = ImageFont.truetype(font, font_size)
            l, u, r, b = f.getbbox(icon)
            width = r - l
            height = b - u

    return font_size


def load_icons(repo_url, output_path, allow_brands):
    with tempfile.TemporaryDirectory(delete=False) as repo_dir:
        print(f"writing to: {repo_dir}")
        Repo.clone_from(repo_url, repo_dir)
        fonts = {
            "brands": {"path": repo_dir + "/webfonts/fa-brands-400.woff2", "style": "fab"},
            "light": {"path": repo_dir + "/webfonts/fa-light-300.woff2", "style": "fal"},
            "regular": {"path": repo_dir + "/webfonts/fa-regular-400.woff2", "style": "far"},
            "solid": {"path": repo_dir + "/webfonts/fa-solid-900.woff2", "style": "fas"},
        }

        with open(repo_dir + "/metadata/icons.json") as f:
            icons_json = json.load(f)

        result = []
        idx = 0
        for i, (icon_name, icon) in enumerate(icons_json.items()):
            if icon_name != "font-awesome-logo-full":
                for style in icon["styles"]:
                    if allow_brands or style != "brands":
                        font = get_font(fonts, style)

                        pr = "f" if style in icon["free"] else "t"
                        uni = chr(int(icon["unicode"], 16))
                        result_icon = {
                            "ix": idx,
                            "id": icon_name,
                            "st": font["style"],
                            "pr": pr,
                            "uc": uni,
                            "si": get_max_size(font["path"], uni),
                        }
                        search_terms = icon["search"]["terms"]
                        if search_terms:
                            result_icon["se"] = search_terms
                        result.append(result_icon)
                        idx += 1
            print(f"{i + 1}/{len(icons_json)} icons processed.", end="\r")

        print(f"{len(icons_json)}/{len(icons_json)}")
        js_icons = "export default " + json.dumps(result, separators=(",", ":"))

        with open(output_path, "w") as f:
            f.write(js_icons)


load_icons(FONTAWESOME_GIT_URL, OUTPUT_ICONS_PATH, True)

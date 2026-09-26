# geppa.github.io

Single-page academic site. Plain Jekyll, no theme, no plugins, so GitHub Pages builds it as is.

## Layout of the repo

```
_config.yml              site title, description (this is what link previews show), URL
_data/profile.yml        name, role, "Now" line, links, bio paragraphs, footer
_data/news.yml           news list, newest first
_data/publications.yml   papers, newest first, with figure lists
_layouts/default.html    <head>: meta / Open Graph tags, fonts, CSS
index.html               the page (Liquid templates over the _data files)
assets/css/main.css      styling; colors and fonts are tokens at the top
assets/js/main.js        figure prev/next, lightbox, optional GIF-on-hover
assets/img/pubs/         figure images (WebP, max 1600 px wide)
assets/img/profile-pic.jpg   portrait (4:5 crop, 960 px wide)
assets/img/favicon.svg
assets/pdf/CV_MinKukKim.pdf
```

## Everyday edits

- News: add a line at the top of `_data/news.yml`.
- New paper: copy a block in `_data/publications.yml`, drop its figures into `assets/img/pubs/`.
  The first figure is the teaser; visitors flip through the rest with the arrows and click to enlarge.
  Leave a link `url: ""` to show it as "(soon)".
- "Now" line: `now:` in `_data/profile.yml`. Set it to `""` to hide it.
- Accent color: `--accent` in `assets/css/main.css`.

## Figures

Export figures as PDF, then rasterize to WebP (white background, max 1600 px wide), e.g.

```
pdftoppm -png -r 200 -f 1 -l 1 figure.pdf tmp
python3 -c "from PIL import Image; im=Image.open('tmp-1.png').convert('RGB'); w=1600; im=im.resize((w, round(im.height*w/im.width))) if im.width>w else im; im.save('assets/img/pubs/NAME-1.webp','WEBP',quality=86)"
```

A GIF teaser: keep the still as `src` and add `hover: /assets/img/pubs/NAME-1.gif` to that figure; it plays while the mouse is over the frame.

## Local preview

```
bundle install
bundle exec jekyll serve
```

`Gemfile` pins the same Jekyll that GitHub Pages runs.

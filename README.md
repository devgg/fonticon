# [fonticon](http://gauger.io/fonticon)

[![Build Status](https://travis-ci.com/devgg/fonticon.svg?branch=master)](https://travis-ci.com/devgg/fonticon)
![License](https://img.shields.io/github/license/devgg/fonticon.svg)

Tool for creating favicons and images from [Font Awesome](http://fontawesome.io/) icons. The generated icon can be previewed live in the browser.

<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/41500849-e678252c-7199-11e8-9554-14a8bbae8653.gif">
</p>

# Features
- Latest Font Awesome 5.8.1
- Preview of favicon live in browser
- Download favicons with all features of [realfavicongenerator.net](https://realfavicongenerator.net)
- Color icon and background by specifying any valid [TinyColor](https://github.com/bgrins/TinyColor#accepted-string-input) value
- Font Awesome Pro support 
- Transparent icon and background
- Fuzzy search and keyword search
- Support stacked icons

# Font Awesome Pro
You can easily use your Font Awesome Pro purchase with fonticon!

Note: **DO NOT FORGET TO EXECUTE THE LAST STEP!**  
You might make yourself legally liable otherwise.

1. Add **gauger.io** as your Font Awesome Pro domain ([link](https://fontawesome.com/start)) and copy the resulting webfont <link> tag.
2. Navigate to [gauger.io/fonticon](http://gauger.io/fonticon) and open the developer tools.
3. Replace the existing Font Awesome &lt;link&gt; tag with your copied tag.
4. Execute ```enableFAPro()``` in the developer console.
5. Do your thing :)
6. **After you are done, remove gauger.io from your list of allowed domains!**

<details><summary>Show detailed description</summary>
1. Add <b>gauger.io</b> as your Font Awesome Pro domain (<a href="https://fontawesome.com/start">link</a>) and copy the resulting webfont <link> tag.
<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/55287323-b7372880-53a7-11e9-9e93-91a33ade8960.png">
</p>
3. Replace the existing Font Awesome &lt;link&gt; tag with your copied tag.
<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/55276369-5c43f980-52f3-11e9-9748-937a2993383c.png">
</p>
4. Execute enableFAPro() in the developer console.
<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/55276386-8f868880-52f3-11e9-9ee8-1e3cc06c6e11.png">
</p>
6. <b>After you are done, remove gauger.io from your list of allowed domains!</b>
<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/55287347-f6657980-53a7-11e9-9dc9-1ca605dfaa36.png">
</p>
  
  
</details>


# Contributing
To contribute fork the repository and execute

```shell
git clone <YOUR_FORK>
cd fonticon
npm install
# Install pre-commit hooks for automatic code formatting (requires python to be installed).
npm run pre-commit
```

This installs all the necessary dependencies. Now you can build the code by running:

```shell
npm run build
```

Afterwards the `index.html` and other static assets can be found in the `dist` directory.

Alternatively, you can run:

```shell
npm run start:dev
```

This will start a [webpack-dev-server](https://github.com/webpack/webpack-dev-server). While the server is running you can go to [localhost:8080](http://localhost:8080) where all your changes will be reflected as soon as you save a file.

During your commit, all changed code will be formatted with [Prettier](https://prettier.io/) and [Black](https://github.com/ambv/black) so no need to worry about formatting 😄🎉.

# [fonticon](http://gauger.io/fonticon)

[![Build Status](https://travis-ci.com/devgg/fonticon.svg?branch=master)](https://travis-ci.com/devgg/fonticon)

Tool for creating favicons and images from [Font Awesome](http://fontawesome.io/) icons. The generated icon can be previewed live in the browser.

<p align="center">
  <img src="https://user-images.githubusercontent.com/8250067/41500849-e678252c-7199-11e8-9554-14a8bbae8653.gif">
</p>

# Features

* Latest Font Awesome 5.0.13
* Preview of favicon live in browser
* Download favicons with all features of [realfavicongenerator.net](https://realfavicongenerator.net)
* Transparent icon and background
* Fuzzy search and keyword search
* Support stacked icons

# Contributing

To contribute fork the repository and execute 

```shell
git clone <YOUR_FORK>
cd fonticon
npm install
```

This installs all the necessary dependencies. Now you can build the code by running:

```shell
npm run build
```

Afterwards the `index.html` and other static assets can be found in the `dist` directory.

Alternatively you can run: 

```shell
npm run start:dev
```

This will start a [webpack-dev-server](https://github.com/webpack/webpack-dev-server). While the server is running you can go to [localhost:8080](http://localhost:8080) where all your changes will be reflected as soon as you save a file.

During your commit all changed code will be formated with [Prettier](https://prettier.io/) so no need to worry about formating 😄🎉.

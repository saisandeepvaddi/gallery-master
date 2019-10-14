<p align="center">
    <a href="https://github.com/saisandeepvaddi/gallery-master">
      <img alt="Ten Hands Logo" src="./app/images/icon-128.png" width="60" />
    </a>
  <h1 align="center">
    Gallery Master
  </h1>
</p>

# What is this?

A Chrome extension which collects the images displayed on the visited page and organizes them into a gallery.
You can also click on images in gallery to start slideshows. Check the feature list for more details.

## Features

- View images in a grid with selected number of columns.
- View images with minimum height and width dimensions.
- Download all collected or selected (Ctrl + click) images to your local machine.
- Automatically picks the highest quality images even if page displays only low quality thumbnails (see limitations below).
- Zoom, Rotate the image in slideshows.

## Usage

1. Download the extension from webstore (currently pending review) or download package file from [here](https://github.com/saisandeepvaddi/gallery-master/releases) and drag & drop in your chrome at chrome://extensions.
2. On any page with images, click on the extension icon.

## Limitations & Known issues

These limitations & issues might be resolved in later versions based on the possibility. You can contribute code if you are a developer.

Automatically picking highest-quality images works in the following cases.

1. If the webpages are using responsive HTML attributes (srcset) [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
2. If you are using the following image search services.
     - Google Images
     - Bing Images

3. Doesn't support data URIs yet.
4. Websites use different methods or js libraries to lazyload images where each library might be using different methods to lazyload. It might not be possible to get highest quality image in all such cases since it requires different logic to extract the highest quality. In future versions, there may be increased support for such cases.
5. Can only download images if the link is working. (Browser might block hitting suspicious links even if the image appears in the page).
6. Can only download if the image visible actually ends with image file extension. Images can be just links to other websites with image set from CSS background property.
7. All downloads are .jpg files.

# For Developers

## Install

    $ yarn install

## Development

    yarn dev:chrome
    yarn dev:firefox
    yarn dev:opera
    yarn dev:edge

## Build

    yarn build:chrome
    yarn build:firefox
    yarn build:opera
    yarn build:edge

## Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts.

## Docs

- [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)


## License
[GPLv3](/LICENSE) - Sai Sandeep Vaddi

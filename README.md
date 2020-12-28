
## Douban Movie Calendar 2020 Daily Graphic Archive

Since the movie calendar can only be viewed on the iOS/iPadOS mobile widget (maybe M1 mac widget can also see it), I spent some time on this project in order to be able to view it on the web.

![](./data/images/DoubanMoviePic/12/2020-12-21.png)

### Introduction

The graphical information for each day of 2020 is captured using the http client provided by Node, and the request headers and parameters captured by the APP network request debugging. The captured information is stored as a json file in the `data/json` directory.

The canvas-node library is used to read the json data, typeset the images and text, and generate the images and output them to the `data/images` directory.

### How to use

```sh

# Install dependencies
npm install

# Grabbing json information
npm run spider 

# Read json files and generate images to save
npm run start

```

### Important note

This project is for learning purposes only and should not be used for other commercial purposes.

If the installation dependency fails, try using cnpm. If `node-canvas` doesn't work, take a look at the `node-pre-gyp` project.

One more thing, buy a paper calendar here https://market.douban.com/campaign/calendar2020 . You can also buy from e-commerce platforms and browse the online movie calendar here https://vensing.com/movie/ .


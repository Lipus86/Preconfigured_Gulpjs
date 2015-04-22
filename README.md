# Preconfigured Gulp for Front-end Developer (with bootstrap)

### Features

* compile Sass/SCSS
* livereload
* minify CSS
* add vendor prefixes
* optimize images
* create sprite from png images (with scss variables)
* create sprite from svg images (with scss variables)

## How to use

1. Download *gulp* and *project* folder
2. Configure paths in `gulpfile.js` (paths object)
3. Run `npm install` in gulp folder
4. Run `gulp` for starting work

...

&#8734;.  Run `gulp finish`


### Sprite

1. Put image in !dev-images folder
2. In SCSS:
  * for png use this mixin:
    `@include sprite($s-*NAME_OF_SOURCE_IMAGE*)`;
  * for svg use this mixin:
    `@include svg-sprite($svg-*NAME_OF_SOURCE_IMAGE*)`;
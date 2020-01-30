# MultiMenu.js


## Install


use npm

```sh
$ npm install multi-menu --save
```

or from cdn

```html
<link rel="stylesheet" href="https://unpkg.com/multi-menu@0.0.1/css/multi-level-menu.css">
<script src="https://unpkg.com/multi-menu@0.0.1/bundle/multi-menu.js"></script>
```


## Usage

```js
import MultiMenu from 'multi-menu';
import 'multi-menu/css/multi-level-menu.css';

new MultiMenu('.js-multi-menu', {
  backBtn: '.js-menu-back-btn',
  prependHTML: '<li><a href="#" class="js-menu-back-btn">← Back</a></li>',
});
```

## Demo

https://pensive-lovelace-a07c9a.netlify.com/
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

### basic usage

```js
import MultiMenu from 'multi-menu';
import 'multi-menu/css/multi-level-menu.css';

new MultiMenu('.js-multi-menu');
```

### When you want to limit the ul level to apply js

```js
import MultiMenu from 'multi-menu';
import 'multi-menu/css/multi-level-menu.css';

new MultiMenu('.js-multi-menu', {
  levelLimit: 2
});
```

### When you don't want to apply js to specific ul

```js
import MultiMenu from 'multi-menu';
import 'multi-menu/css/multi-level-menu.css';

new MultiMenu('.js-multi-menu', {
  disableMenuClass: 'js-disable-menu'
});
```

```html
<ul class="js-multi-menu">
  <li>test</li>
  <ul class="js-disable-menu">
    <li>test</li>
  </ul>
</ul>
```

### When you want to prepend custom HTML on top of the ul

```js
import MultiMenu from 'multi-menu';
import 'multi-menu/css/multi-level-menu.css';

new MultiMenu('.js-multi-menu', {
  prependHTML: (link) => `<a href="#" class="js-menu-back-btn">← Back </a></li><li class="title">${link.dataset.title}<li>`,
});
```


## Demo

https://pensive-lovelace-a07c9a.netlify.com/
# StackedMenu

> A flexible stacked navigation menu writing on JavaScript vanilla and modules.

### Table of contents
1. [Get started](#get-started)
2. [What's includes](#whats-includes)
3. [Usage](#usage)
4. [Demo](#demo)
5. [Limitations](#limitations)
6. [Contributing](#contributing)


## Get started <a name="get-started"></a>

[Download the latest release](https://gitlab.com/bent10/stacked-menu/tags) of StackedMenu.

### What's includes <a name="whats-includes"></a>

On download directories and files, you'll see something like this:

```
dist/
├── css/
│   ├── stacked-menu.css
│   ├── stacked-menu.css.map
│   ├── stacked-menu.min.css
│   └── stacked-menu.min.css.map
├── js/
│   ├── amd/
│   ├── commonjs/
│   ├── es6/
│   ├── umd/
│   ├── stacked-menu.js
│   ├── stacked-menu.js.map
│   ├── stacked-menu.min.js
│   └── stacked-menu.min.js.map
├── scss/
│    ├── _collapsible.scss
│    ├── _core.scss
│    ├── _direction.scss
│    ├── _extras.scss
│    ├── _hoverable.scss
│    ├── _mixins.scss
│    ├── _variables.scss
│    └── stacked-menu.scss
src/
README.md
```


## Usage

Implementing as easy as posible.

### Include css file:

```html
<!-- StackedMenu -->
<link href="stacked-menu/dist/css/stacked-menu.min.css" rel="stylesheet">
```

### Include javascript file:

```html
<!-- StackedMenu -->
<script src="stacked-menu/dist/js/stacked-menu.min.js"></script>
```


### Basic template

You mush have `stacked-menu` element on your markup. The template will look like this:

```html
<div id="stacked-menu" class="stacked-menu">
  <nav class="menu">
    <li class="menu-item">
     <a href="#" class="menu-link">
       <i class="menu-icon fa fa-home"></i>
       <span class="menu-text">Home</span>
       <span class="badge badge-danger">9+</span>
     </a>
    <li>
  </nav>
</div>
```

Then called:
```javascript
var menu = new StackedMenu();
```

Please see [API docs](http://docs.stilearning.com/drawerjs/latest/StackedMenu.html) for more details.


## Demo <a name="demo"></a>

[StackedMenu demo](https://bent10.gitlab.io/stacked-menu) are included in the download files in the root directory.



## Limitations

#### Browser support
* Chrome >= 20
* Firefox >= 24
* Edge >= 12
* Explorer >= 8
* iOS >= 6
* Safari >= 6
* Android 2.3
* Android >= 4
* Opera >= 12


## Contributing <a name="contributing"></a>

> Thank-you for your interest in StackedMenu, Beni Arisandi.

If you notice any bug(s) or have any idea(s) for new feature(s), skin(s), or something else, feel free to open a issue, so we can make StackedMenu better together.
# How to create your own crossword

First, open the `style.css` and define the width, height, and grid dimensions of your crossword.  
Then open `script.js`, look for line number 23, and define your crossword board there.  

And that's it! you can ignore the rest. Now open `index.html` to see your crossword.

# Information regarding `script.js`

> The `index.html` and `style.css` is a simple html and css file that you can understand in a blink. This section explain some points about what happens inside `script.js`.

When defining the crossword in `script.js`, it is composed with one of the following characters:

- Dashes (-), to define a blank grid.
- Uppercase letters, to define an active but read-only grid.
- And lowercase letters, to define an active grid which will have some interactivity.

An html element will then be created based on each given character. For each element, an id is given using this format:

```bash
item{row number, start from 1}-{column number, start from 1}
```

Now, here's how a character is 'translated' to an html element:

## Dashes (-)

A dash is translated to a `<span>` with id and class of `crossword-board__item--blank`. That's it.

## Uppercase and lowercase letters 

A letter, wether uppercase or lowercase, is translated to an `<input>` with id, class of `crossword-board__item`, and a bunch of other things. 

But then an uppercase will have:

- `readOnly` attribute.
- `value` attribute, with the letter itself as the value.
- `tabIndex` of `-1`, to disable its tab indexing.

While a lowercase will have:

- `pos` dataset, which saves the letter, but in form of Unicode character code (charCode).
- `isAcross` and `isDown` dataset, to mark whether the element is across or down. `1` for yes, and empty for no.
- `isClicked` dataset, to mark wether the element has been clicked or not. This dataset is given only if the element is both `isAcross` and `isDown`.
- `prevX` and `jumpPrevX` dataset.  
   `prevX` dataset store the id of active element on its direct left side. If the element is blank or read-only, then the value will be empty.
   `jumpPrevX` dataset store the id of the 'next' active element after its direct left side, ONLY if `prevX` is empty. Otherwise, `jumpPrevX` will be left empty.
- `nextX` and `jumpNextX` dataset. Idea is similiar as above, but for the right side.
- `prevY` and `jumpPrevY` dataset.
- `nextY` and `jumpNextY` dataset.
- And event listeners on:
   - click, which decide whether the typing flow should be across or down.
   - input, which filter to only accept letter as input and move focus to the next element.
   - focus.
   - blur.
   - keydown, which makes nagivate using arrows possible and handle move focus while deleting.
   - keyup, which checks whether the inputs are all filled, and whether all the inputs is correct or not.
const ACROSS = 'across';
const DOWN = 'down';
var current_flow = '';

window.onload = function () {
    var crossword = [
        '--c---c---',
        '--r---R---',
        'crossword-',
        '--s---s---',
        '--s---s---',
        '--w---w---',
        'croSsword-',
        '--r---r---',
        '--d---d---'
    ];

    var crossword_rows = document.getElementById('crossword-board');

    for (let i = 0; i < crossword.length; i++) {
        crossword_rows.appendChild(document.createComment(["ROW", i + 1, "START"].join(' ')));
        c = crossword[i].split('');

        for (let j = 0; j < c.length; j++) {

            let id = ["item", i + 1, "-", j + 1].join('');
            let char = c[j];

            if (char == '-') {
                let span = document.createElement("span");
                span.id = id;
                span.className = "crossword-board__item--blank";
                crossword_rows.appendChild(span);
            } else {
                let input = document.createElement("input");
                input.id = id;
                input.className = "crossword-board__item";
                input.type = "text";
                input.minLength = "1";
                input.maxLength = "1";
                input.autocomplete = "off";
                input.setAttribute("role", "presentation");

                if (/[A-Z]/.test(char)) {
                    input.value = char;
                    input.readOnly = true;
                    input.tabIndex = -1;
                } else {
                    input.value = "";
                    input.dataset.pos = char.charCodeAt(0) - 97;

                    let neighbors = findNeighbors(crossword, i, j);
                    let prevX = [i, '-', j - 1].join('');
                    let nextX = [i, '-', j + 1].join('');
                    let prevY = [i - 1, '-', j].join('');
                    let nextY = [i + 1, '-', j].join('');

                    let neighbor_prev_x = neighbors[prevX];
                    let neighbor_jump_prev_x = neighbors['jump' + prevX];
                    let neighbor_next_x = neighbors[nextX];
                    let neighbor_jump_next_x = neighbors['jump' + nextX];
                    let neighbor_prev_y = neighbors[prevY];
                    let neighbor_jump_prev_y = neighbors['jump' + prevY];
                    let neighbor_next_y = neighbors[nextY];
                    let neighbor_jump_next_y = neighbors['jump' + nextY];

                    input.dataset.prevX = neighbor_prev_x ? neighbor_prev_x : '';
                    input.dataset.jumpPrevX = neighbor_jump_prev_x ? neighbor_jump_prev_x : '';
                    input.dataset.nextX = neighbor_next_x ? neighbor_next_x : '';
                    input.dataset.jumpNextX = neighbor_jump_next_x ? neighbor_jump_next_x : '';
                    input.dataset.prevY = neighbor_prev_y ? neighbor_prev_y : '';
                    input.dataset.jumpPrevY = neighbor_jump_prev_y ? neighbor_jump_prev_y : '';
                    input.dataset.nextY = neighbor_next_y ? neighbor_next_y : '';
                    input.dataset.jumpNextY = neighbor_jump_next_y ? neighbor_jump_next_y : '';

                    input.dataset.isAcross = neighbor_prev_x || neighbor_next_x ? 1 : '';
                    input.dataset.isDown = neighbor_prev_y || neighbor_next_y ? 1 : '';

                    if ((neighbor_prev_x || neighbor_next_x) && (neighbor_prev_y || neighbor_next_y)) {
                        input.dataset.isClicked = '';
                    }

                }
                crossword_rows.appendChild(input);
            }
        }
        crossword_rows.appendChild(document.createComment(["ROW", i + 1, "END"].join(' ')));
    }
    setupCrossword();
}


function findNeighbors(myArray, i, j) {
    var rowLimit = myArray.length - 1;
    var columnLimit = myArray[0].length - 1;
    var neighbors = {};

    for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if ((x === i || y === j) && !(x === i && y === j)) {
                let key = [x, '-', y].join('');
                if (/[a-z]/.test(myArray[x][y])) {
                    neighbors[key] = ['item', x + 1, '-', y + 1].join('');
                } else if (/[A-Z]/.test(myArray[x][y])) {
                    neighbors[key] = false;
                    if (x === i) {
                        let k = y;
                        if (y > j) {
                            while (k <= columnLimit) {
                                k++;
                                if (/[a-z]/.test(myArray[x][k])) {
                                    neighbors[key] = ['item', x + 1, '-', k + 1].join('');
                                    break;
                                } else if (myArray[x][k] === '-') {
                                    break;
                                }
                            }
                        } else if (y < j) {
                            while (k >= 0) {
                                --k;
                                if (/[a-z]/.test(myArray[x][k])) {
                                    neighbors[key] = ['item', x + 1, '-', k + 1].join('')
                                    break;
                                } else if (myArray[x][k] === '-') {
                                    break;
                                }
                            }
                        }
                    } else if (y === j) {
                        let k = x;
                        if (x > i) {
                            while (k <= rowLimit) {
                                k++;
                                if (/[a-z]/.test(myArray[k][y])) {
                                    neighbors[key] = ['item', k + 1, '-', y + 1].join('');
                                    break;
                                } else if (myArray[k][y] === '-') {
                                    break;
                                }
                            }
                        } else if (x < i) {
                            while (k >= 0) {
                                --k;
                                if (/[a-z]/.test(myArray[k][y])) {
                                    neighbors[key] = ['item', k + 1, '-', y + 1].join('');
                                    break;
                                } else if (myArray[x][k] === '-') {
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    neighbors[key] = false;
                }
                if (!neighbors[key]) {
                    neighbors['jump' + key] = false;
                    if (x === i) {
                        let k = y;
                        if (y > j) {
                            while (k < columnLimit) {
                                k++;
                                if (/[a-z]/.test(myArray[x][k])) {
                                    neighbors['jump' + key] = ['item', x + 1, '-', k + 1].join('');
                                    break;
                                }
                            }
                        } else if (y < j) {
                            while (k >= 1) {
                                --k;
                                if (/[a-z]/.test(myArray[x][k])) {
                                    neighbors['jump' + key] = ['item', x + 1, '-', k + 1].join('')
                                    break;
                                }
                            }
                        }
                    } else if (y === j) {
                        let k = x;
                        if (x > i) {
                            while (k < rowLimit) {
                                k++;
                                if (/[a-z]/.test(myArray[k][y])) {
                                    neighbors['jump' + key] = ['item', k + 1, '-', y + 1].join('');
                                    break;
                                }
                            }
                        } else if (x < i) {
                            while (k >= 1) {
                                --k;
                                if (/[a-z]/.test(myArray[k][y])) {
                                    neighbors['jump' + key] = ['item', k + 1, '-', y + 1].join('');
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    neighbors['jump' + key] = false;
                }
            }
        }
    }
    return neighbors;
}


function setupCrossword() {
    var crossword_items = document.querySelectorAll(".crossword-board__item:read-write");
    var crossword_items_length = crossword_items.length;

    for (let i = 0; i < crossword_items_length; i++) {
        crossword_items[i].addEventListener("click", clickHandler);
        crossword_items[i].addEventListener("input", inputHandler);
        crossword_items[i].addEventListener("focus", focusHandler);
        crossword_items[i].addEventListener("blur", blurHandler);
        crossword_items[i].addEventListener("keydown", keydownHandler);
        crossword_items[i].addEventListener("keyup", keyupHandler);
    }

    function clickHandler(evt) {
        proceedClickHandler(evt.target.id);
    }

    function proceedClickHandler(id) {
        let e = document.getElementById(id);
        let target_is_accros = e.dataset.isAcross;
        let target_is_down = e.dataset.isDown;

        if (target_is_accros && target_is_down) {
            if (!e.dataset.isClicked) {
                current_flow = ACROSS;
                e.dataset.isClicked = '1';
            } else {
                current_flow = DOWN;
                e.dataset.isClicked = '';
            }
        } else if (target_is_accros) {
            current_flow = ACROSS;
        } else if (target_is_down) {
            current_flow = DOWN;
        }
    }

    function inputHandler(evt) {
        evt.target.value = evt.target.value.replace(/[^A-Za-z]/g, "");
        if (!evt.target.value) {
            return;
        }

        if (current_flow === ACROSS) {
            if (evt.target.dataset.nextX) {
                document.getElementById(evt.target.dataset.nextX).focus();
            }
        } else if (current_flow === DOWN) {
            if (evt.target.dataset.nextY) {
                document.getElementById(evt.target.dataset.nextY).focus();
            }
        }
    }

    function focusHandler(evt) {
        evt.target.select();
    }

    function blurHandler(evt) {
        if (evt.target.isClicked) {
            evt.target.isClicked = '';
        }
    }

    function keydownHandler(evt) {
        if (evt.defaultPrevented) {
            return;
        }

        switch (evt.key) {
            case "Backspace":
                evt.target.value = "";
                if (current_flow === ACROSS) {
                    if (evt.target.dataset.prevX) {
                        document.getElementById(evt.target.dataset.prevX).focus();
                    }
                } else if (current_flow === DOWN) {
                    if (evt.target.dataset.prevY) {
                        document.getElementById(evt.target.dataset.prevY).focus();
                    }
                }
                break;

            case "Del":
            case "Delete":
                evt.target.value = "";
                if (current_flow === ACROSS) {
                    if (evt.target.dataset.nextX) {
                        document.getElementById(evt.target.dataset.nextX).focus();
                    }
                } else if (current_flow === DOWN) {
                    if (evt.target.dataset.nextY) {
                        document.getElementById(evt.target.dataset.nextY).focus();
                    }
                }
                break;

            case "Down":
            case "ArrowDown":
                var destination = evt.target.dataset.nextY || evt.target.dataset.jumpNextY;
                if (destination) {
                    proceedClickHandler(destination);
                    document.getElementById(destination).focus();
                }
                break;

            case "Up":
            case "ArrowUp":
                var destination = evt.target.dataset.prevY || evt.target.dataset.jumpPrevY;
                if (destination) {
                    proceedClickHandler(destination);
                    document.getElementById(destination).focus();
                }
                break;

            case "Left":
            case "ArrowLeft":
                var destination = evt.target.dataset.prevX || evt.target.dataset.jumpPrevX;
                if (destination) {
                    proceedClickHandler(destination);
                    document.getElementById(destination).focus();
                }
                break;

            case "Right":
            case "ArrowRight":
                var destination = evt.target.dataset.nextX || evt.target.dataset.jumpNextX;
                if (destination) {
                    proceedClickHandler(destination);
                    document.getElementById(destination).focus();
                }
                break;

            default:
                return;
        }

        evt.preventDefault();
    }

    function keyupHandler(evt) {
        let filled_items = Array.from(crossword_items).filter(item => Boolean(item.value)).length;

        if (filled_items < crossword_items_length) {
            console.log('Some inputs are still empty..');
        } else {
            console.log('All inputs are filled!');

            let true_answers = Array.from(crossword_items).filter(
                item => item.value.toLowerCase() === String.fromCharCode(parseInt(item.dataset.pos) + 97)
            ).length;

            if (true_answers == crossword_items_length) {
                alert('Your have filled all the crosswords correctly!');
            } else {
                alert('Some of your answer is incorrect..');
            }
        }
    }
}
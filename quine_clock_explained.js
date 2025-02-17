//
//   https://aem1k.com/qlock/
//
// The code below has been refactored to remove code golf tricks, and comments
// have been added to explain what it's doing. 
//
// IFFE (immediately invoked function expression) that sets an interval to
// execute logic every 100 milliseconds. The parameter `n` is never used and
// is apparently included so we can use the shorter `=>` function notation
// instead of the more verbose `function()`.
// The variable `quine` was named `r` in the original.
(quine = n => setInterval(t => {
    // Initialize the display string for the current frame and define script tag
    let displayString = "\n"; // `o` in the original

    // in the original, this is defined as a variable `S` to save a little
    // space on a string that is used twice.
    let scriptTag = "script>\n";

    // character "sprites" are just integers, which we'll interpret as 3x5
    // bitmap images for each character.
    let characterSprites = [
        31599,
        19812,
        14479,
        31207,
        23524,
        29411,
        29679,
        30866,
        31727,
        31719,
        1040,
     ];

    /* 
    Sprites in binary. Note: the 0/1 grids shown here are show *mirrored*
    so you can see them the right way round.
    Sprite '0':              Sprite '1':              Sprite '2':
    Decimal: 31599           Decimal: 19812           Decimal: 14479
    Binary: 111101101101111  Binary: 100110101100100  Binary: 011100010001111
    1 1 1                    0 0 1                    1 1 0
    1 0 1                    0 1 1                    0 0 1
    1 0 1                    1 0 1                    0 1 0
    1 0 1                    0 0 1                    1 0 0
    1 1 1                    0 0 1                    1 1 1
    Sprite '3':              Sprite '4':              Sprite '5':
    Decimal: 31207           Decimal: 23524           Decimal: 29411
    Binary: 111100111100111  Binary: 101101111100100  Binary: 111001011100011
    1 1 1                    1 0 1                    1 1 1
    0 0 1                    1 0 1                    1 0 0
    1 1 1                    1 1 1                    1 1 0
    0 0 1                    0 0 1                    0 0 1
    1 1 1                    0 0 1                    1 1 0
    Sprite '6':              Sprite '7':              Sprite '8':
    Decimal: 29679           Decimal: 30866           Decimal: 31727
    Binary: 111001111101111  Binary: 111100010010010  Binary: 111101111101111
    1 1 1                    1 1 1                    1 1 1
    1 0 0                    0 0 1                    1 0 1
    1 1 1                    0 1 0                    1 1 1
    1 0 1                    0 1 0                    1 0 1
    1 1 1                    0 1 0                    1 1 1
    Sprite '9':              Sprite ':':
    Decimal: 31719           Decimal: 1040
    Binary: 111101111100111  Binary: 000010000010000
    1 1 1                    0 0 0
    1 0 1                    0 1 0
    1 1 1                    0 0 0
    0 0 1                    0 1 0
    1 1 1                    0 0 0
    */

    // Use JavaScript's implicit conversion to string to convert the
    // JavaScript function `quine()` into a string, which gives us 99% of the
    // source code. Add on the extra couple of characters that were outside the
    // function to reproduce the entire program as a string.
    let sourceCode = `(r=${quine})()`;

    // This next line of code was not found in the original; because this
    // version has comments and whitespace, we've added logic to remove
    // comments and white space so that it will still look OK:
    sourceCode = sourceCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').replace(/\s+/gm, '');

    // keep track of which character we're on.
    let characterIndex = 0;  // `j` in the original

    // Loop over the 5 rows (y) and 63 [sic] columns (x) of the program.
    for (let y = 4; y >= 0; y--) {
        for (let x = 0; x < 63; x++) {
            // Calculate the array index and date value for character coloring
            let arrayIndex = Math.floor(x / 8);

            // Parse the JavaScript default date format: 
            //
            //  "Thu May 30 2024 14:05:52 GMT-0500 (Central Daylight Time)"

            // to grab just the "12:12:12" portion starting at position 16.

            let character = Date()[16 + arrayIndex]; // `D` in the original

            // Map ":" to index 10.
            character = (character < 12 ? character : 11);
            
            // Load the "sprite" for the character by indexing into the array.
            // Note that this relies on JavaScript implicit conversion of
            // strings to numbers.
            let sprite = characterSprites[character];

            // This will select the single bit as position (x, y) if we think
            // of the bits of the "sprite" as 3x5 bitmap image. 
            // Note that a "pixel" is actually two characters wide; that's why
            // we initially divide x by two.
            let bitmask = 1 << (x / 2 % 4 + 3 * y);

            // There's also a one pixel gap between characters - those pixels
            // are always off. The 3 pixels of the character plus the one pixel
            // gap explain why we take x modulo 4 and not 3.
            let insideCharacter = (x / 2 % 4 < 3);
            let pixel =  insideCharacter && (sprite & bitmask);

            // Append a single colored (white or yellow) character to output.
            // We increment `characterIndex` as a side-effect.
            let color = pixel ? '#FF0' : "#444";
            displayString += sourceCode[characterIndex++].fontcolor(color);
        }

        // Append a newline the end the line
        displayString += "\n";
    }

    // Update the webpage's inner HTML to show the displayString bracketed
    // in a script tag.
    document.body.innerHTML = (
        "<pre>" +
        "&lt" + scriptTag + 
        displayString +
        "\n" +
        "&lt/" + scriptTag 
    );

}, 100))()
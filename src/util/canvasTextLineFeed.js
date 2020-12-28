/**
 *  
 * canvas text new line tools
 * 
 */


 /**
  * Binary search splits to find a line break point
  * @param {*} text 
  * @param {*} width 
  * @param {*} context 
  */
function findBreakPoint(text, width, context) {

    let min = 0;
    let max = text.length - 1;

    while (min <= max) {
        let middle = Math.floor((min + max) / 2);
        let middleWidth = context.measureText(text.substr(0, middle)).width;
        let oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
            return middle;
        }
        if (middleWidth < width) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }

    return -1;
}

/**
 * Binary search splits a string to many lines
 * @param {*} text 
 * @param {*} width 
 * @param {*} font 
 */
function breakLinesForCanvas(context, text, width, font) {
    
    let result = [];
    let breakPoint = 0;

    if (font) {
        context.font = font;
    }

    while ((breakPoint = findBreakPoint(text, width, context)) !== -1) {
        result.push(text.substr(0, breakPoint));
        text = text.substr(breakPoint);
    }

    if (text) {
        result.push(text);
    }

    return result;
}

module.exports = { breakLinesForCanvas };

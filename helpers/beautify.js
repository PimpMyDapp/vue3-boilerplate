const roundToDecimal = (number, decimal) => Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);

export const thousands = (val) => {
    const str = val.toString();

    function insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }

    function stringReverse(str) {
        return str.split("").reverse().join("");
    }

    const indexesToSetSpace = [];
    for (let i = 0; i < str.length; i++) {
        const naturalI = i + 1;
        if (naturalI % 3 === 0) {
            indexesToSetSpace.push(i + indexesToSetSpace.length);
        }
    }
    let result = stringReverse(str);
    indexesToSetSpace.forEach(index => {
        result = insertAtIndex(result, ' ', index + 1);
    });
    return stringReverse(result);
}

export default (number, decimals, toFixed = null) => {
    if (Number.isNaN(number)) {
        return '...';
    }
    number = parseFloat(number);
    let postfix = '';
    if (number > 900 * 10 ** 3) {
        number /= 10 ** 6;
        postfix = 'M';
        decimals = 2;
    } else if (number > 900) {
        number /= 10 ** 3;
        postfix = 'K';
        decimals = 2;
    }
    number = roundToDecimal(number, decimals);
    const split = number.toString().split('.');
    split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (toFixed) {
        split[1] = split[1] ? split[1].padEnd(toFixed, '0') : '000';
    }
    return split.join('.') + postfix;
}

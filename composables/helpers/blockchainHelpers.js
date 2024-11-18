import { BigNumber, ethers } from 'ethers';

/**
 * Turns hex number to usual number
 * @param hexNumber
 * @returns {number}
 */
export function hexToNumber(hexNumber) {
    return parseInt(BigNumber.from(hexNumber).toString());
}

/**
 * Turns usual number to hex format
 * @param number
 * @returns {string}
 */
export function numberToHex(number) {
    return ethers.utils.hexValue(BigNumber.from(number));
}

/**
 * Cuts hex string in two parts and places "..." in the middle
 * @param hex
 * @param short - if true, first part will be just three symbols. Otherwise, there will be seven symbols
 * @returns { string }
 */
export function cutHex(hex, short = false) {
    return hex.slice(0, short ? 3 : 5) + "..." + hex.slice(-4);
}

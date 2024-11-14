import { BigNumber, ethers } from 'ethers';

export function hexToNumber(hexNumber) {
    return parseInt(BigNumber.from(hexNumber).toString());
}

export function numberToHex(number) {
    return ethers.utils.hexValue(BigNumber.from(number));
}

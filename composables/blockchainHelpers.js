import { BigNumber } from 'ethers';

export function hexToNumber(hexNumber) {
    return parseInt(BigNumber.from(hexNumber).toString());
}

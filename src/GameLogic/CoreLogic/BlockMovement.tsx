import {Map} from 'immutable';
import {cloneDeep, fill} from 'lodash';
import {store} from '../../Store/Reducers';
import {actionUpdateQueue} from '../Actions';
import {BlocksArray} from './Blocks';

const storeGetState = () => (store.getState() as Map<string, Map<string, any>>);

export const generateQueue = (index: number) => {
    for (let i = 0; i < index; i++) {
        const pickBlock: object = BlocksArray[Math.floor(Math.random() * BlocksArray.length)];

        store.dispatch(actionUpdateQueue(pickBlock));
    }

};

const createParameters = () => {
    const gridBlockState = (store.getState() as Map<string, Map<string, any>>)
        .get('gridBlockData');

};

export const changeGridStatusTry: IChangeGameGridNew = ({vertical = 0, horizontal = 0, locked, downKey}): IReturnTypeGridChange => {
    const storeStatus: IActionMovingBlockReturnGrid = storeGetState().getIn(['GameLogicReducer', 'gridBlockData', 'data']);
    const {dataGridState, block, blockPositionVertical, blockPositionHorizontal, lockedBlocks} = storeStatus;
    const correctedBlockPositionHorizontal = blockPositionHorizontal + horizontal;
    const correctedBlockPositionVertical = blockPositionVertical + vertical;
    const horizontalGridLength = 10;
    const temporaryGrid = cloneDeep(lockedBlocks);
    const makeData = (newDataGridState, newLockedBlocks) => (
        {
            data: {
                dataGridState: newDataGridState,
                correctedBlockPositionVertical,
                correctedBlockPositionHorizontal,
                block,
                lockedBlocks: newLockedBlocks
            }
        });

    const error = 'Illegal movement, the space occupied by the tetronimo is bigger than the grid';
    try {
        for (let i = 0; i < block.length; i++) {
            // picks a row of the block
            const blockRow = block[i];
            // gets higher as the rows of the block go up
            const verticalGridRow = (correctedBlockPositionVertical - i );

            // space occupied by the block
            const totalOccupiedSpace = (correctedBlockPositionHorizontal + blockRow.length );

            if (verticalGridRow < 0) {
                // irrelevant movement
                break;
            } else if (totalOccupiedSpace > horizontalGridLength) {
                // illegal movement
                throw {error, totalOccupiedSpace, horizontalGridLength};
                // return {temporaryGrid: dataGridState, completed: false};
            }

            const zeros = blockRow.filter(blockNumbers => blockNumbers === 0);
            // zeroes are only relevant to the starting  horizontal offset position.
            const correctedPosition = correctedBlockPositionHorizontal + zeros.length;
            // the number to slice should be only those affected by the blocks presence (represented by number one)
            const endSlice = correctedBlockPositionHorizontal + blockRow.length - zeros.length;

            const resultRow = temporaryGrid[verticalGridRow].slice(correctedPosition, endSlice);
            const searchResult = resultRow.indexOf(1);

            if (searchResult !== -1) {
                return {
                    data: {
                        dataGridState,
                        blockPositionVertical:  correctedBlockPositionVertical,
                        blockPositionHorizontal:  correctedBlockPositionHorizontal,
                        block,
                        lockedBlocks: dataGridState,
                        downKey

                    }, locked
                };

            }
            fill(temporaryGrid[verticalGridRow], 1, correctedPosition, endSlice);
            //  console.log(fill(prova[verticalGridRow], 1, correctedPosition, endSlice))
        }
        // block has hit the bottom
        if (correctedBlockPositionVertical === 15) {
            return {
                locked: true, data: {
                    dataGridState: temporaryGrid,
                    blockPositionVertical: correctedBlockPositionVertical,
                    blockPositionHorizontal:  correctedBlockPositionHorizontal,
                    block,
                    lockedBlocks: temporaryGrid,
                    downKey
                }
            };
        } else {
            return {
                completed: true,
                data: {
                    dataGridState: temporaryGrid,
                    blockPositionVertical: correctedBlockPositionVertical,
                    blockPositionHorizontal: correctedBlockPositionHorizontal,
                    block,
                    lockedBlocks,
                    downKey
                }
            };
        }
    } catch (error) {
        throw error;
    }
};
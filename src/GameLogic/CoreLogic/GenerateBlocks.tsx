import {List, Map} from 'immutable';
import {store} from '../../Store/Reducers';
import {
    actionCurrentBlock, actionDownKey, actionGenerateQueue, actionMovingBlock, actionRemoveQueuePiece, actionUpdateQueue
} from '../Actions';
import {BlocksArray} from './BlocksAttributes';

export const storeGetState = () => (store.getState() as Map<string, Map<string, any>>);

export const rotateBlock = (position: number): number[][] => {
    const error = 'incorrect number';
    if (position >= 4) {
        throw error;
    }
    const blockObject: IBlockObject = storeGetState().getIn(['GameLogicReducer', 'currentBlock']);

    return blockObject[position];
};

export const generateBlocksQueue = (index: number): void => {

    for (let i = 0; i < index; i++) {
        const pickedBlock: IBlockObject = BlocksArray[Math.floor(Math.random() * BlocksArray.length)];

        store.dispatch(actionUpdateQueue(pickedBlock));
    }

};

export const newBlockInGame = (): void => {
    const blocks: List<any> = storeGetState().getIn(['GameLogicReducer', 'queuedBlocks']);

    const block: IBlock = blocks.get(0);
    const grid: number [][] = storeGetState().getIn(['GameLogicReducer', 'dataGridState']);
    store.dispatch(actionCurrentBlock(block));
    store.dispatch(actionRemoveQueuePiece(0));
    store.dispatch(actionGenerateQueue(1));

    store.dispatch(actionMovingBlock({
        block: block[0],
        downKey: false,
        dataGridState: grid,
        blockPositionVertical: -1,
        lockedBlocks: grid,
        blockPositionHorizontal: 5,
        blockColor: block[5],
        blockLength: block[4][0]
    }));
    //store.dispatch(actionActiveBlock());
    store.dispatch(actionDownKey(false));
};

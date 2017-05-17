import {View} from 'react-native';
import * as React from 'react';
import {shallow} from 'enzyme';

import { makeDataGrid} from '../CoreLogic/Grid';
import {L} from '../CoreLogic/Blocks';
import {createGrid} from '../../Components/GameScreen/Cells';
import {store} from '../../Store/Reducers';
import {cloneDeep} from 'lodash';
import {actionMovingBlock, actionRenderGrid} from '../Actions';
import {changeGridStatus} from '../CoreLogic/MovingBlockLogic';

const getGridState = () => (store.getState() as Map<string, any>).get('GameLogicReducer').get('dataGridState');
let baseDataGrid: number[][];
let parameters: IChangeGridStatusParameters;
beforeEach(() => {
    baseDataGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    parameters = {
        dataGridState: baseDataGrid,
        blockPositionHorizontal: 7,
        blockPositionVertical: 5,
        block: L[0],
        lockedBlocks: baseDataGrid
    };
});
const expectedDataWithBlock = {
    completed: true,
    dataGridState: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
};

describe('testing logic functions', () => {
    it('should generate a view grid', () => {
        const grid = createGrid();
        const shallowGrid = shallow(<View>{ grid }</View>);
        expect(shallowGrid.children()).toHaveLength(16);
    });

    it('should generate a  blank data grid', () => {

        const gridData = makeDataGrid();
        expect(gridData).toEqual(baseDataGrid);
    });

    it('should fill a row', () => {
        const temporaryGrid = cloneDeep(baseDataGrid);
        temporaryGrid[15].fill(1, 0, 2);
        // expect(temporaryGrid).toEqual(baseDataGrid);
    });

    it('should modify the blank data grid', () => {

        const result = changeGridStatus(parameters);
        expect(result.data.dataGridState).toEqual(expectedDataWithBlock.dataGridState);

    });

    it('should not allow an illegal movement', () => {
        // const expectedData = expectedDataWithBlock;
        // expectedData.completed = false;
        const parameters2: IChangeGridStatusParameters = {
            dataGridState: baseDataGrid,
            blockPositionHorizontal: 9,
            blockPositionVertical: 5,
            block: L[0],
            lockedBlocks: baseDataGrid
        };

        expect(() => changeGridStatus(parameters2)).toThrow();
    });

    it('should update the store', () => {
        store.dispatch(actionRenderGrid(expectedDataWithBlock.dataGridState));
        expect(getGridState())
            .toEqual(expectedDataWithBlock.dataGridState);
    });

    it('should move a step forward the block', () => {

        const sagaParameters = {
            block: L[0],
            dataGridState: baseDataGrid,
            blockPositionVertical: 12,
            type: '',
            blockPositionHorizontal: 5,
            lockedBlocks: baseDataGrid
        };
        store.dispatch(actionMovingBlock(sagaParameters));

    });

});

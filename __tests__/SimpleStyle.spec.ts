'use strict';

import 'jest';
import SimpleStyle from '../src/graphDiagram/model/SimpleStyle';

describe('SimpleStyle', () => {
    it('Should be pass sanity', () => {
        expect(typeof SimpleStyle).toBe('function');
    });

    it('Should be able to create new instance', () => {
        expect(typeof new SimpleStyle()).toBe('object');
    });
});

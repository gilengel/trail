import { numberArray2wkt, point2wkt, wkt2numberArray, wkt2point } from "./database.conversion";

describe('Conversion', () => {
    it('converts a 2d point to wkt string', () => {
        const result = point2wkt([8, 8]);
        expect(result).toBe('POINT(8 8)');
    });

    it('converts a 3d point to wkt string', () => {
        const result = point2wkt([8, 8, 8]);
        expect(result).toBe('POINT(8 8 8)');
    });

    it('converts a 2d wkt string to point', () => {
        const result = wkt2point('POINT(8 8)');
        expect(result).toStrictEqual([8, 8]);
    });

    it('converts a 2d wkt string to point', () => {
        const result = wkt2point('POINT(8 8 8)');
        expect(result).toStrictEqual([8, 8, 8]);
    });

    it('converts a 2d wkt linestring to a segment', () => {
        const result = wkt2numberArray('LINESTRING Z(30 10,10 30,40 40)');
        expect(result).toStrictEqual([[30, 10], [10, 30], [40, 40]]);
    });

    it('converts a 2d segment to a wkt linestring', () => {
        const result = numberArray2wkt([[30, 10], [10, 30], [40, 40]]);
        expect(result).toStrictEqual('LINESTRING Z(30 10,10 30,40 40)');
    });
});

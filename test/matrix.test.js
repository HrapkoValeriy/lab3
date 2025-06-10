const { expect } = require('chai');
const sinon = require('sinon');
const chai = require('chai');

require('sinon-chai');
chai.use(require('sinon-chai'));

const Matrix = require('../matrix');

describe('Matrix Class Tests', () => {

  it('should create a matrix with valid data', () => {
    const data = [[1, 2], [3, 4]];
    const matrix = new Matrix(data);
    expect(matrix.data).to.deep.equal(data);
  });

  it('should throw an error for non-array constructor input', () => {
    expect(() => new Matrix(null)).to.throw('Вхідні дані повинні бути двовимірним масивом.');
    expect(() => new Matrix(123)).to.throw('Вхідні дані повинні бути двовимірним масивом.');
  });

  it('should throw an error for non-2D array input', () => {
    expect(() => new Matrix([1, 2, 3])).to.throw('Вхідні дані повинні бути двовимірним масивом.');
    expect(() => new Matrix([[1], "not a row"])).to.throw('Вхідні дані повинні бути двовимірним масивом.');
  });

  it('should throw an error for inconsistent row lengths', () => {
    expect(() => new Matrix([[1, 2], [3]])).to.throw('Всі рядки матриці повинні мати однакову довжину.');
  });

  it('should handle empty matrix creation', () => {
    const matrix = new Matrix([]);
    expect(matrix.data).to.deep.equal([]);
  });

  it('should handle matrix with empty rows', () => {
    const matrix = new Matrix([[],[]]);
    expect(matrix.data).to.deep.equal([[],[]]);
  });

  it('should return the correct row', () => {
    const data = [[1, 2, 3], [4, 5, 6]];
    const matrix = new Matrix(data);
    expect(matrix.getRow(0)).to.deep.equal([1, 2, 3]);
    expect(matrix.getRow(1)).to.deep.equal([4, 5, 6]);
  });

  it('should throw an error when getting a row out of bounds', () => {
    const matrix = new Matrix([[1, 2]]);
    expect(() => matrix.getRow(-1)).to.throw('Індекс рядка виходить за межі.');
    expect(() => matrix.getRow(1)).to.throw('Індекс рядка виходить за межі.');
  });

  it('should return the correct column', () => {
    const data = [[1, 2, 3], [4, 5, 6]];
    const matrix = new Matrix(data);
    expect(matrix.getColumn(0)).to.deep.equal([1, 4]);
    expect(matrix.getColumn(1)).to.deep.equal([2, 5]);
    expect(matrix.getColumn(2)).to.deep.equal([3, 6]);
  });

  it('should return an empty array for getColumn on an empty matrix', () => {
    const matrix = new Matrix([]);
    expect(matrix.getColumn(0)).to.deep.equal([]);
  });

  it('should throw an error when getting a column out of bounds', () => {
    const matrix = new Matrix([[1, 2]]);
    expect(() => matrix.getColumn(-1)).to.throw('Індекс стовпця виходить за межі.');
    expect(() => matrix.getColumn(2)).to.throw('Індекс стовпця виходить за межі.');
  });

  describe('Static add method', () => {
    it('should correctly add two matrices of the same dimensions', () => {
      const A = new Matrix([[1, 2], [3, 4]]);
      const B = new Matrix([[5, 6], [7, 8]]);
      const expected = new Matrix([[6, 8], [10, 12]]);
      const result = Matrix.add(A, B);
      expect(result.data).to.deep.equal(expected.data);
    });

    it('should throw an error when adding matrices of different dimensions', () => {
      const A = new Matrix([[1, 2], [3, 4]]);
      const B = new Matrix([[5, 6, 7], [8, 9, 0]]);
      expect(() => Matrix.add(A, B)).to.throw('Розмірності матриць не співпадають для додавання.');
    });

    it('should throw an error if arguments are not Matrix instances', () => {
        const A = new Matrix([[1, 2], [3, 4]]);
        const B = [[5, 6], [7, 8]];
        expect(() => Matrix.add(A, B)).to.throw('Обидва аргументи повинні бути екземплярами класу Matrix.');
    });
  });

  describe('Using Fake', () => {
    class FakeTransposer {
      transpose(matrixData) {
        if (matrixData.length === 0) return [];
        const rows = matrixData.length;
        const cols = matrixData[0].length;
        const transposed = Array(cols).fill(0).map(() => Array(rows).fill(0));
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            transposed[j][i] = matrixData[i][j];
          }
        }
        return transposed;
      }
    }

    it('should use a FakeTransposer to get transposed data', () => {
      const fakeTransposer = new FakeTransposer();
      const originalData = [[1, 2, 3], [4, 5, 6]];
      const expectedTransposed = [[1, 4], [2, 5], [3, 6]];

      const result = fakeTransposer.transpose(originalData);
      expect(result).to.deep.equal(expectedTransposed);
    });

    class FakeMatrixDB {
      constructor() {
        this.matrices = {
          'matrixA': new Matrix([[10, 20], [30, 40]]),
          'matrixB': new Matrix([[1, 1], [1, 1]]),
        };
      }

      getMatrixById(id) {
        return this.matrices[id];
      }

      saveMatrix(id, matrix) {
        this.matrices[id] = matrix;
      }
    }

    it('should retrieve a matrix from a FakeMatrixDB', () => {
      const db = new FakeMatrixDB();
      const matrix = db.getMatrixById('matrixA');
      expect(matrix.data).to.deep.equal([[10, 20], [30, 40]]);
    });

    it('should allow saving a matrix to FakeMatrixDB', () => {
      const db = new FakeMatrixDB();
      const newMatrix = new Matrix([[5, 5], [5, 5]]);
      db.saveMatrix('matrixC', newMatrix);
      expect(db.getMatrixById('matrixC').data).to.deep.equal(newMatrix.data);
    });
  });
});
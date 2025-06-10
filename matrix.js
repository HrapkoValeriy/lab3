class Matrix {
  constructor(data) {
    if (!Array.isArray(data) || !data.every(row => Array.isArray(row))) {
      throw new Error('Вхідні дані повинні бути двовимірним масивом.');
    }
    if (data.length > 0 && !data.every(row => row.length === data[0].length)) {
      throw new Error('Всі рядки матриці повинні мати однакову довжину.');
    }
    this.data = data;
  }

  getRow(i) {
    if (i < 0 || i >= this.data.length) {
      throw new Error('Індекс рядка виходить за межі.');
    }
    return this.data[i];
  }

  getColumn(j) {
    if (this.data.length === 0) return [];
    if (j < 0 || (this.data.length > 0 && j >= this.data[0].length)) {
      throw new Error('Індекс стовпця виходить за межі.');
    }
    return this.data.map(row => row[j]);
  }

  static add(A, B) {
    if (!(A instanceof Matrix) || !(B instanceof Matrix)) {
      throw new Error('Обидва аргументи повинні бути екземплярами класу Matrix.');
    }
    if (A.data.length !== B.data.length || A.data[0].length !== B.data[0].length) {
      throw new Error('Розмірності матриць не співпадають для додавання.');
    }
    const result = A.data.map((row, i) => row.map((val, j) => val + B.data[i][j]));
    return new Matrix(result);
  }

  equals(otherMatrix) {
    if (!(otherMatrix instanceof Matrix)) {
      return false;
    }
    if (this.data.length !== otherMatrix.data.length) {
      return false;
    }
    if (this.data.length > 0 && this.data[0].length !== otherMatrix.data[0].length) {
      return false;
    }
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (this.data[i][j] !== otherMatrix.data[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = Matrix;
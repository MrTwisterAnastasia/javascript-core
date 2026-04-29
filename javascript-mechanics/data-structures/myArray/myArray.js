function doesStringContainOnlyDigits(prop) {
  return typeof prop === "string" && /^\d+$/.test(prop);
}

function isArrayLengthOnlyArgument() {
  const firstEl = arguments[0];
  return (
    arguments.length === 1 && typeof firstEl === "number" && !isNaN(firstEl)
  );
}

export class MyArray {
  _myArray = Object.create(null);
  *[Symbol.iterator]() {
    for (let key in this._myArray) {
      if (doesStringContainOnlyDigits(key)) {
        yield this._myArray[key];
      }
    }
  }

  constructor(...elements) {
    const isFirstElArrayLength = isArrayLengthOnlyArgument(...elements);

    if (isFirstElArrayLength) {
      const length = elements[0];
      for (let index = 0; index < length; index++) {
        this.push(undefined);
      }
    } else {
      for (let el of elements) {
        this.push(el);
      }
    }

    return new Proxy(this, {
      get(target, prop, myArrayInstance) {
        if (doesStringContainOnlyDigits(prop)) {
          return target._myArray[prop];
        }

        return Reflect.get(target, prop, myArrayInstance);
      },
      set(target, prop, value, myArrayInstance) {
        if (doesStringContainOnlyDigits(prop)) {
          target._myArray[prop] = value;
          return true;
        }

        return Reflect.set(target, prop, value, myArrayInstance);
      },
    });
  }

  get length() {
    let size = 0;

    for (let key in this._myArray) {
      if (doesStringContainOnlyDigits(key)) {
        size++;
      }
    }

    return size;
  }

  // adds the specified elements to the end of an array and returns the new length of the array.
  push(element) {
    this._myArray[this.length] = element;
    return this.length;
  }

  // removes the last element from an array and returns that element. This method changes the length of the array.
  pop() {
    const lastElementIndex = this.length ? this.length - 1 : undefined;

    if (lastElementIndex === undefined) {
      return undefined;
    }

    const elementToRemove = this._myArray[lastElementIndex];
    delete this._myArray[lastElementIndex];

    return elementToRemove;
  }

  // takes an integer value and returns the item at that index, allowing for positive and negative integers.
  // Negative integers count back from the last item in the array.
  at(number) {
    let index = number;

    if (number < 0) {
      index = number + this.length;
    }

    return this._myArray[index];
  }

  // returns the first element in the provided array that satisfies the provided testing function.
  // If no values satisfy the testing function, undefined is returned.
  find(callbackFn) {
    for (let key in this._myArray) {
      const value = this._myArray[key];
      if (callbackFn(value)) {
        return value;
      }
    }

    return undefined;
  }

  // creates a new array populated with the results of calling a provided function on every element in the calling array
  map(callbackFn) {
    let newArray = new MyArray();

    // All properties that are integer indices appear first in the overall object property order and are sorted numerically.
    // so we will not worry that modified elements will have another indexes
    for (let key in this._myArray) {
      const newValue = callbackFn(this._myArray[key], key, this);

      newArray.push(newValue);
    }

    return newArray;
  }

  // creates a copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.
  filter(callbackFn) {
    let newArray = new MyArray();

    for (let key in this._myArray) {
      const value = this._myArray[key];
      const isValid = callbackFn(value, key, this);

      if (isValid) {
        newArray.push(value);
      }
    }

    return newArray;
  }

  // executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element
  reduce(callbackFn, initialValue) {
    const hasInitialValue = arguments.length > 1;
    let accumulator = hasInitialValue ? initialValue : this._myArray[0];
    const startIndex = hasInitialValue ? 0 : 1;

    for (let index = startIndex; index < this.length; index++) {
      const currentValue = this._myArray[index];
      accumulator = callbackFn(accumulator, currentValue, index, this);
    }

    return accumulator;
  }

  every(callbackFn) {
    for (let key in this._myArray) {
      if (!callbackFn(this._myArray[key], key, this)) {
        return false;
      }
    }
    return true;
  }
}

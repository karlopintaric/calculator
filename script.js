const display = document.querySelector('.display');
const numberKeys = Array.from(document.querySelectorAll('.number'));
const clearKeys = document.querySelector('button[value="clear"]')
const operatorKeys = Array.from(document.querySelectorAll('.operator'));
const equalKey = document.querySelector('.equals');
const dotKey = document.querySelector('.dot');
const plusMinusKey = document.querySelector('button[value="plus-minus"');
const percentKey = document.querySelector('button[value="percent"');

let displayValue;
let firstNum;
let secondNum;
let operator;

calc = new Calculator();

document.addEventListener('DOMContentLoaded', reset);

function showContent(content) {
    if (content) {
        display.textContent = content;
    } else if (Number.isNaN(content)) {
        display.textContent = 'fatal error';
    } else {
        display.textContent = '0';
    }
}

function reset() {
    displayValue = '';
    firstNum = 0;
    secondNum = 0;
    operator = '';
    showContent('0');
}

clearKeys.addEventListener('click', () => {
    reset();
})

document.addEventListener('keydown', (e) => {
    if (!isNaN(e.key)) {
        displayValue += e.key;
        showContent(displayValue);
    } else if (e.key === 'Backspace') {
        displayValue = displayValue.slice(0, -1);
        showContent(displayValue);
    } else if (e.key === 'Enter' || e.key === '=') {
        equalKey.click();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(convertOperator(e.key));
    } else if (e.key === '.') {
        dotKey.click();
    } else if (e.key === '%') {
        percentKey.click();
    } else if (e.key === 'Escape') {
        reset();
    } else if (e.key === '_') {
        plusMinusKey.click();
    }
});

numberKeys.forEach(key => key.addEventListener('click', e => {
    displayValue += e.target.value;
    showContent(displayValue);
}))

operatorKeys.forEach(key => key.addEventListener('click', e => {
    handleOperator(e.target.value);
}))

equalKey.addEventListener('click', () => {
    calculateResult();
})

dotKey.addEventListener('click', () => {
    if (displayValue.includes('.')) {
        return;
    }

    displayValue += '.';
    showContent(displayValue);
})

plusMinusKey.addEventListener('click', () => {
    if (displayValue[0] === '-') {
        displayValue = displayValue.slice(1);
    } else {
        displayValue = `-${displayValue}`;
    }
    showContent(displayValue);
})

percentKey.addEventListener('click', () => {
    displayValue /= 100;
    showContent(displayValue);
})

function convertOperator(key) {
    const operators = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };
    return operators[key];
}

function handleOperator(op) {
    if (operator) {
        secondNum = displayValue;
        displayValue = calc.calculate(operator, firstNum, secondNum);
        secondNum = '';
        showContent(displayValue);
    }

    firstNum = displayValue;
    operator = op;
    displayValue = '';
}

function calculateResult() {
    if (!(operator && displayValue)) {
        return;
    }

    secondNum = displayValue;
    firstNum = calc.calculate(operator, firstNum, secondNum);
    showContent(firstNum);

    displayValue = '';
    operator = '';
}

function Calculator() {
    this.add = (a, b) => a + b;
    this.subtract = (a, b) => a - b;
    this.multiply = (a, b) => a * b;
    this.divide = (a, b) => (b !== 0) ? a / b : NaN;

    this.calculate = (op, a, b) => {
        let result = this[op](Number(a), Number(b))
        if (Math.floor(result) !== result) {
            result = Math.round(result * 1e6) / 1e6;
        }
        return result;
    };
}



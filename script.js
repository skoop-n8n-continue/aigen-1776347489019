class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.isRadian = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    appendOperator(operator) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.shouldResetScreen = true;
    }

    appendFunction(func) {
        let val = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'sin':
                result = this.isRadian ? Math.sin(val) : Math.sin(val * Math.PI / 180);
                break;
            case 'cos':
                result = this.isRadian ? Math.cos(val) : Math.cos(val * Math.PI / 180);
                break;
            case 'tan':
                result = this.isRadian ? Math.tan(val) : Math.tan(val * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(val);
                break;
            case 'ln':
                result = Math.log(val);
                break;
            case 'sqrt':
                result = Math.sqrt(val);
                break;
            default:
                return;
        }

        if (isNaN(result) || !isFinite(result)) {
            this.currentOperand = 'Error';
        } else {
            this.currentOperand = this.formatNumber(result);
        }
        this.shouldResetScreen = true;
    }

    appendConstant(constant) {
        if (constant === 'pi') {
            this.currentOperand = Math.PI.toString();
        } else if (constant === 'e') {
            this.currentOperand = Math.E.toString();
        }
        this.shouldResetScreen = true;
    }

    toggleRadDeg() {
        this.isRadian = !this.isRadian;
        document.getElementById('rad-deg-btn').innerText = this.isRadian ? 'Rad' : 'Deg';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = computation === 'Error' ? 'Error' : this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber.length > 12) {
            return number.toPrecision(8);
        }
        return stringNumber;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

function appendNumber(number) {
    calculator.appendNumber(number);
    calculator.updateDisplay();
}

function appendOperator(operator) {
    calculator.appendOperator(operator);
    calculator.updateDisplay();
}

function appendFunction(func) {
    calculator.appendFunction(func);
    calculator.updateDisplay();
}

function appendConstant(constant) {
    calculator.appendConstant(constant);
    calculator.updateDisplay();
}

function compute() {
    calculator.compute();
    calculator.updateDisplay();
}

function clearDisplay() {
    calculator.clear();
    calculator.updateDisplay();
}

function deleteLast() {
    calculator.delete();
    calculator.updateDisplay();
}

function toggleRadDeg() {
    calculator.toggleRadDeg();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+') appendOperator('+');
    if (e.key === '-') appendOperator('-');
    if (e.key === '*') appendOperator('*');
    if (e.key === '/') appendOperator('/');
    if (e.key === '^') appendOperator('^');
});

type Operation = 'multiply' | 'add' | 'divide'

const calculator = (a: number, b: number, op: Operation): number => {
  switch (op) {
    case 'multiply':
      return a * b
    case 'add':
      return a + b
    case 'divide':
      return a / b
    default:
      break
  }
}

console.log(calculator(2, 4, 'multiply'))

console.log(process.argv)

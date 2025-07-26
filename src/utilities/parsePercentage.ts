function parsePercentage(value: any) {
    return typeof value === 'string' && value.trim().endsWith('%') 
           ? parseFloat(value.trim()) / 100 
           : parseFloat(value);
}

export default parsePercentage;
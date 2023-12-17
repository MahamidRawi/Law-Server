const cleanRes = (res: string) => {
    const cleanRes = res.replaceAll('"', '').replaceAll("N"," N")
    return cleanRes.charAt(0).toUpperCase() + cleanRes.slice(1);
}

const balanceParser = (balance: number) => {
    return balance.toLocaleString() + ' $';
}

console.log(balanceParser(1002034.30))

export {cleanRes, balanceParser}
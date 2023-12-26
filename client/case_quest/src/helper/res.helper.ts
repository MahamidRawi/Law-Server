const cleanRes = (res: string) => {
    const cleanRes = res.replaceAll('"', '').replaceAll("N"," N")
    return cleanRes.charAt(0).toUpperCase() + cleanRes.slice(1);
}

const balanceParser = (balance: number) => {
    return balance.toLocaleString() + ' $';
}

const formatDate = (date: string) => {
    const now = new Date(date);
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
    const year = now.getFullYear();
    const time = now.toLocaleTimeString(); // You can customize this format further if needed
    return `${day}/${month}/${year} ${time}`;
}

export {cleanRes, balanceParser, formatDate}
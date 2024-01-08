const cleanRes = (res: string) => {
    const cleanRes = res.replaceAll('"', '').replaceAll("N"," N")
    return cleanRes.charAt(0).toUpperCase() + cleanRes.slice(1);
}

const balanceParser = (balance: number) => {
    return balance.toLocaleString() + ' $';
}

const formatDate = (date: string): string => {
    const now = new Date(date);
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toLocaleTimeString();
    return `${day}/${month}/${year} at ${time}`;
}

const cutResume = (resume: string) => resume.split(' ').slice(0,25).join(' ') + '...';

export {cleanRes, balanceParser, formatDate, cutResume}
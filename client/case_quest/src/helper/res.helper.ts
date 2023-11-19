const cleanRes = (res: string) => {
    console.log(res)
    const cleanRes = res.replaceAll('"', '').replaceAll("N"," N")
    return cleanRes.charAt(0).toUpperCase() + cleanRes.slice(1);
}

export {cleanRes}
const cleanRes = (res) => {
    const cleanRes = res.replaceAll('"', '').replaceAll("N"," N")
    return cleanRes.charAt(0).toUpperCase() + cleanRes.slice(1);
}

module.exports = {cleanRes}
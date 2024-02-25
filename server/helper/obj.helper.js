function randomPosition () {
  if (Math.random() < 0.5) {
    return 'defense';
} else {
    return 'prosecution'
}
}

const generateLawyer = (name, pos) => {
  return {
    name,
    role: `${pos}'s Attorney`,
    ctc: true,
    alive: true,
    subpoena: false,
    shortDescription: `The Representing Attorney of the ${pos}`
}
}

module.exports = {randomPosition, generateLawyer};
// module.exports = updateArray
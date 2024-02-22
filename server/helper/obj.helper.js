function randomPosition () {
  if (Math.random() < 0.5) {
    return 'defense';
} else {
    return 'prosecution'
}
}

module.exports = randomPosition;
// module.exports = updateArray
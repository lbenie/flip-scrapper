module.exports = {
  '*.md': ['prettier --write', 'git add'],
  '*.ts': ['eslint --fix', 'git add'],
}

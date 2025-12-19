#!/bin/bash

set -e
trap 'echo "Error occurred at line $LINENO. Exiting..."; exit 1' ERR

echo "Setting up development environment..."

sudo chown node node_modules

echo "Configuring bash aliases..."

cat <<EOF >>~/.bashrc
alias ..='cd ..'
alias ...='cd ../..'
alias gs='git status'
alias ga='git add .'
alias gpl='git pull'
alias gl='git log --oneline'
alias gp='git push'
alias gc='git commit'
alias gr='git reset'
alias gcm='git checkout main'
alias gplom='git pull origin main'
EOF

git config --global core.editor "vim"

npm i -g @anthropic-ai/claude-code

if [ -z "$(git config --local --get user.name)" ]; then
  echo "Please enter your Git name:"
  read git_name
  git config --local user.name "$git_name"
fi

if [ -z "$(git config --local --get user.email)" ]; then
  echo "Please enter your Git email:"
  read git_email
  git config --local user.email "$git_email"
fi
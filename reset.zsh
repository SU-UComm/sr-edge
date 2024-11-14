#!/bin/zsh

# A NPM script will run under a shell that cannot properly parse glob syntax, so run this as a zsh file to ensure it
# runs in zshell and can handle globs and correctly search for any instance of what we want to clear out

setopt no_nomatch # stop reporting no matches

if [[ "$1" == "hard" ]]; then
    rm -rf ./**/package-lock.json
fi

rm -rf ./**/node_modules
rm -rf ./**/dist
rm -rf ./**/lib
rm -rf ./**/export
rm -rf ./**/coverage
setopt nomatch # start reporting no matches

npm i
npm install --ignore-scripts
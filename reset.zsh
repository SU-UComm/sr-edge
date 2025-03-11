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
rm -rf ./**/__coverage__
setopt nomatch # start reporting no matches

dotenv -e .env npm i
dotenv -e .env npm install --ignore-scripts

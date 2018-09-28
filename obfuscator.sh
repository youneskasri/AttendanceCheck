#! /bin/sh

rm -rf target && echo Removed Old Target Folder
[ -d target ] || mkdir target

for directory in config libs models routes services
do
    javascript-obfuscator $directory --output ./target --target node
done

for file in app.js credentials.js
do
    javascript-obfuscator $file --output ./target/$file --target node
done


mkdir target/logs

for folder in node_modules public views
do
    cp -r $folder ./target && echo "Copy of $folder done !" 
done


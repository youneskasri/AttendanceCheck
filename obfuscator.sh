#! /bin/sh

echo "Running Obfuscator script.."

# Create ./target folder if not exists
[ -d target ] || mkdir target

#--------------------------------
# Obfuscate Sources
#--------------------------------

# Obfuscate source directories
for directory in config libs models routes services
do
    javascript-obfuscator $directory --output ./target --target node
done

# Obfuscate the remaing source files
for file in app.js credentials.js
do
    javascript-obfuscator $file --output ./target/$file --target node
done


# Create logs subdirectory in target
[ -e target/logs ] || mkdir target/logs

# Copy non-js folders to target
for folder in public views
do
    cp -r $folder ./target && echo "Copy of $folder done !" 
done


#--------------------------------
# Copy node_modules if necessary
#--------------------------------

# Nb Node Modules in source directory
let nbNodeModules=$(find node_modules/* -maxdepth 0 -type d | wc -l);

# Nb Node Modules in Target directory
let nbNodeModulesTarget=0 
[ -d target/node_modules ] && nbNodeModulesTarget=$(find target/node_modules/* -maxdepth 0 -type d | wc -l);

# If nb of Modules did change, Then Copy again
if [ $nbNodeModules -ne $nbNodeModulesTarget ]
then
    rm -rf ./target/node_modules && echo "Deleted old target/node_modules !"
    cp -r node_modules ./target && echo "Copy of node_modules done !" 
fi
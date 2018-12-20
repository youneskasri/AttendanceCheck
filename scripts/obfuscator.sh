#! /bin/sh

echo "Running Obfuscator script.."

# Create ./target folder if not exists
[ -d target ] || mkdir _target

#--------------------------------
# Obfuscate Sources
#--------------------------------

# Obfuscate source directories
for directory in config libs models routes services
do
    javascript-obfuscator $directory --output ./_target --target node
done

# Obfuscate the remaing source files
for file in app.js credentials.js
do
    javascript-obfuscator $file --output ./_target/$file --target node
done


# Create logs subdirectory in target
[ -e _target/logs ] || mkdir _target/logs

# Copy non-js folders to target
for folder in public views
do
    cp -r $folder ./_target && echo "Copy of $folder done !" 
done

# Minify CSS assets in Target 
for cssFile in $(ls ./target/public/stylesheets/*.css) 
do  
    node-minify --compressor clean-css --input $cssFile --output $cssFile 
done

# Minify JS assets in Target 
for jsFile in $(ls ./target/public/javascripts/*.js) 
do  
    node-minify --compressor uglify-es --input $jsFile --output $jsFile 
done

# Minify VIEWS in Target
# TODO with a middleware

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
    rm -rf ./_target/node_modules && echo "Deleted old target/node_modules !"
    cp -r node_modules ./_target && echo "Copy of node_modules done !" 
fi
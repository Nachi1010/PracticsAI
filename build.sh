#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Copy routing files for SPA
echo "Copying routing files..."
cp public/404.html dist/
cp public/index-redirect.html dist/
mkdir -p dist/questionnaire
cp public/questionnaire/index.html dist/questionnaire/

# Ensure CNAME and .nojekyll exist
echo "Adding CNAME and .nojekyll..."
echo "practicsai.com" > dist/CNAME
touch dist/.nojekyll

echo "Build completed successfully! The 'dist' directory is ready for deployment." 
# removing old api files
rm -rf ./src/api

# creating new api files
node orval-create.cjs
yarn generate
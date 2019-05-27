for file in pact/postman/collections/*
do
    ext=${file##*.}
    fname=`basename $file $ext`
    envfname=pact/postman/env/$fname\env.json
    collectionfname=pact/postman/collections/$fname\json
    npx newman run $collectionfname -e $envfname
done
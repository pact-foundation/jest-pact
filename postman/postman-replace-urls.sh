mkdir -p pact/postman/env
for file in pact/postman/collections/*
do
    echo $file
    ext=${file##*.}
    fname=`basename $file $ext`
    postnamefname=pact/postman/env/$fname\env.json
    cp ./postman/postman_env.json $postnamefname
    npx newman-wrapper $postnamefname "url" $PACT_PROVIDER_URL
done
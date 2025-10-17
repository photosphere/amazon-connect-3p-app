#!/bin/bash
BUCKET_NAME="thirdpartyapplicationdemo0529"
FOLDER_PATH="3p"

npm run build
aws s3 sync . s3://$BUCKET_NAME/$FOLDER_PATH/ --exclude "*" --include "index.html" --include "bundle.js"
aws cloudfront create-invalidation --distribution-id E2UE1UWZONLK4Y --paths "/$FOLDER_PATH/*"

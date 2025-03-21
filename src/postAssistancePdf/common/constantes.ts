export const REGION_CODE = process.env.REGION_CODE ?? 'us-east-1';

export const BUCKET_NAME = process.env.BUCKET_NAME ?? '';
export const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID ?? '';
export const BUCKET_PATH_CV = process.env.BUCKET_PATH_CV ?? '';

console.log("BUCKET_NAME: ",BUCKET_NAME)
console.log("BEDROCK_MODEL_ID: ",BEDROCK_MODEL_ID)
console.log("BUCKET_PATH_CV: ",BUCKET_PATH_CV)
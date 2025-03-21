import { S3 } from 'aws-sdk';
import { REGION_CODE } from '../common/constantes';
import { CodeError } from '../exceptions/codeError';

const s3 = new S3({ region: REGION_CODE });

export const listFilesInS3 = async ( bucketName: string, prefix: string): Promise<string[]> => {
    const params: S3.ListObjectsV2Request = {
        Bucket: bucketName,
        Prefix: prefix
    };
    try {
        const result = await s3.listObjectsV2(params).promise();
        const keys =  result.Contents?.map( (obj: any) => obj.Key!).filter(key => key.endsWith(".pdf")) || [];
        console.log(`Se encontraron ${keys?.length || 0} archivos en ${bucketName} con el prefijo ${prefix}`);
        return keys;
    } catch (error) {
        console.error('Error S3:', error);
        throw new CodeError('Hubo un error listando los archivos en S3', 409);
    }
};
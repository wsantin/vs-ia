interface ResponsePayload<T> {
    success: boolean;
    message: string;
    error: string | null;
    data: T | null;
}

interface LambdaResponse<T> {
    statusCode: number;
    body: string;
}

export const response = <T>(
    params: ResponsePayload<T>,
    statusCode: number = params.success ? 200 : 400
): LambdaResponse<T> => {
    return {
        statusCode,
        body: JSON.stringify(params)
    };
};
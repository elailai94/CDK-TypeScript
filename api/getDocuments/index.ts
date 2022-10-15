import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

import S3 from "aws-sdk/clients/s3";

const s3 = new S3();
const bucketName = process.env.DOCUMENTS_BUCKET_NAME;

async function generateSignedURL(
  object: S3.Object
): Promise<{ filename: string; url: string }> {
  const url = await s3.getSignedUrlPromise("getObject", {
    Bucket: bucketName,
    Expires: 60 * 60, // one hour
    Key: object.Key!,
  });

  return {
    filename: object.Key!,
    url,
  };
}

async function getDocuments(
  _event: APIGatewayProxyEventV2,
  _context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  console.log(`Bucket Name: ${bucketName}`);

  try {
    const { Contents: results } = await s3
      .listObjects({ Bucket: bucketName! })
      .promise();
    const documents = await Promise.all(
      results!.map(async (object) => generateSignedURL(object))
    );

    return {
      body: JSON.stringify(documents),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: (error as Error).message,
      statusCode: 500,
    };
  }
}

export { getDocuments };

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

const bucketName = process.env.DOCUMENTS_BUCKET_NAME;

async function getDocuments(
  _event: APIGatewayProxyEventV2,
  _context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  console.log(`Bucket Name: ${bucketName}`);

  return {
    body: "Success",
    statusCode: 200,
  };
}

export { getDocuments };

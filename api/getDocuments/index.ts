import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";

async function getDocuments(_event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    return {
        body: "Success",
        statusCode: 200
    };
};

export { getDocuments };

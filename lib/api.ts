import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface DocumentManagementAPIProps {}

export class DocumentManagementAPI extends Construct {
    constructor(scope: Construct, id: string, _props?: DocumentManagementAPIProps) {
        super(scope, id);

        new lambda.NodejsFunction(this, "GetDocumentsFunction", {
            architecture: Architecture.ARM_64,
            bundling: {
                externalModules: ["aws-sdk"]
            },
            entry: path.join(__dirname, "..", "api", "getDocuments", "index.ts"),
            handler: "getDocuments",
            runtime: Runtime.NODEJS_16_X
        });
    }
}

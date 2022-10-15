import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface DocumentManagementAPIProps {
    documentBucket: s3.IBucket;
}

export class DocumentManagementAPI extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: DocumentManagementAPIProps
  ) {
    super(scope, id);

    new lambda.NodejsFunction(this, "GetDocumentsFunction", {
      architecture: Architecture.ARM_64,
      bundling: {
        externalModules: ["aws-sdk"],
      },
      entry: path.join(__dirname, "..", "api", "getDocuments", "index.ts"),
      environment: {
        DOCUMENTS_BUCKET_NAME: props.documentBucket.bucketName
      },
      handler: "getDocuments",
      runtime: Runtime.NODEJS_16_X,
    });
  }
}

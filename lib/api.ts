import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface DocumentManagementAPIProps {
  documentBucket: s3.IBucket;
}

export class DocumentManagementAPI extends Construct {
  constructor(scope: Construct, id: string, props: DocumentManagementAPIProps) {
    super(scope, id);

    const region = cdk.Stack.of(this).region;
    const getDocumentsFunction = new lambda.NodejsFunction(
      this,
      "GetDocumentsFunction",
      {
        architecture: Architecture.ARM_64,
        bundling: {
          externalModules: ["aws-sdk"],
        },
        entry: path.join(__dirname, "..", "api", "getDocuments", "index.ts"),
        environment: {
          DOCUMENTS_BUCKET_NAME: props.documentBucket.bucketName,
        },
        handler: "getDocuments",
        runtime: Runtime.NODEJS_16_X,
      }
    );

    const bucketPermissions = new iam.PolicyStatement();
    bucketPermissions.addResources(`${props.documentBucket.bucketArn}/*`);
    bucketPermissions.addActions("s3:GetObject", "s3:PutObject");
    getDocumentsFunction.addToRolePolicy(bucketPermissions);

    const bucketContainerPermissions = new iam.PolicyStatement();
    bucketContainerPermissions.addResources(props.documentBucket.bucketArn);
    bucketContainerPermissions.addActions("s3:ListBucket");
    getDocumentsFunction.addToRolePolicy(bucketContainerPermissions);

    const httpAPI = new apigateway.CfnApi(this, "HttpAPI", {
      corsConfiguration: {
        allowMethods: ["GET"],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10).toSeconds(),
      },
      name: "document-management-api",
      protocolType: "HTTP",
    });

    const integration = new apigateway.CfnIntegration(
      this,
      "GetDocumentsIntegration",
      {
        apiId: httpAPI.ref,
        integrationMethod: "GET",
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${getDocumentsFunction.functionArn}/invocations`,
        payloadFormatVersion: "2.0",
      }
    );

    new apigateway.CfnRoute(this, "GetDocumentsRoute", {
      apiId: httpAPI.ref,
      routeKey: "GET /getDocuments",
      target: `integrations/${integration.ref}`,
    });

    new cdk.CfnOutput(this, "APIEndpoint", {
      value: httpAPI.attrApiEndpoint,
    });
  }
}

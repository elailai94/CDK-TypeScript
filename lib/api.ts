import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

interface DocumentManagementAPIProps {
  documentBucket: s3.IBucket;
}

export class DocumentManagementAPI extends Construct {
  constructor(scope: Construct, id: string, props: DocumentManagementAPIProps) {
    super(scope, id);

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

    const httpAPI = new apigateway.HttpApi(this, "HttpAPI", {
      apiName: "document-management-api",
      corsPreflight: {
        allowMethods: [apigateway.CorsHttpMethod.GET],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10),
      },
      createDefaultStage: true,
    });

    const integration = new HttpLambdaIntegration(
      "GetDocumentsIntegration",
      getDocumentsFunction
    );

    httpAPI.addRoutes({
      integration,
      methods: [apigateway.HttpMethod.GET],
      path: "/getDocuments",
    });

    new cdk.CfnOutput(this, "APIEndpoint", {
      exportName: "APIEndpoint",
      value: httpAPI.url!,
    });
  }
}

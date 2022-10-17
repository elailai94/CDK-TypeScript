import * as cdk from "aws-cdk-lib";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";

import { Construct } from "constructs";
import { DocumentManagementAPI } from "./api";
import { DocumentManagementWebserver } from "./webserver";
import { Networking } from "./networking";

export class TypescriptCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "DocumentsBucket", {
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3Deploy.BucketDeployment(this, "DocumentsDeployment", {
      destinationBucket: bucket,
      memoryLimit: 512,
      sources: [s3Deploy.Source.asset(path.join(__dirname, "..", "documents"))],
    });

    new cdk.CfnOutput(this, "DocumentsBucketNameExport", {
      exportName: "DocumentsBucketName",
      value: bucket.bucketName,
    });

    const networkingStack = new Networking(this, "NetworkingConstruct", {
      maxAzs: 2,
    });

    cdk.Tags.of(networkingStack).add("Module", "Networking");

    const api = new DocumentManagementAPI(this, "DocumentManagementAPI", {
      documentBucket: bucket,
    });

    cdk.Tags.of(api).add("Module", "API");

    const webserver = new DocumentManagementWebserver(this, "DocumentManagementWebserver", {
      api: api.httpAPI,
      vpc: networkingStack.vpc
    });

    cdk.Tags.of(webserver).add("Module", "Webserver");
  }
}

import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";
import { DocumentManagementAPI } from "./api";
import { Networking } from "./networking";

export class TypescriptCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "DocumentsBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    new cdk.CfnOutput(this, "DocumentsBucketNameExport", {
      exportName: "DocumentsBucketName",
      value: bucket.bucketName
    });

    const networkingStack = new Networking(this, "NetworkingConstruct", {
      maxAzs: 2
    });

    cdk.Tags.of(networkingStack).add("Module", "Networking");

    const api = new DocumentManagementAPI(this, "DocumentManagementAPI");

    cdk.Tags.of(api).add("Module", "API");
  }
}

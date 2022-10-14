import * as cdk from "aws-cdk-lib";

import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";

export class TypescriptCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "DocumentsBucket", {
      encryption: BucketEncryption.S3_MANAGED
    });

    new cdk.CfnOutput(this, "DocumentsBucketNameExport", {
      exportName: "DocumentsBucketName",
      value: bucket.bucketName
    });
  }
}

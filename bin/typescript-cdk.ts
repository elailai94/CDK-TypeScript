#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

import { TypescriptCdkStack } from "../lib/typescript-cdk-stack";

const app = new cdk.App();
const stack = new TypescriptCdkStack(app, "TypescriptCdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

cdk.Tags.of(stack).add("App", "DocumentManagement");
cdk.Tags.of(stack).add("Environment", "Development");

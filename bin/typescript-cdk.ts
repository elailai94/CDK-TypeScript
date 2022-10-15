#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { TypescriptCdkStack } from "../lib/typescript-cdk-stack";

const app = new cdk.App();
const stack = new TypescriptCdkStack(app, "TypescriptCdkStack");

cdk.Tags.of(stack).add("App", "DocumentManagement");
cdk.Tags.of(stack).add("Environment", "Development");

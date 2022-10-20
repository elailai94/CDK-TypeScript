# TypeScript CDK

![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### About
This repository contains practice code to provision infrastructure on Amazon Web Services (AWS) using the AWS Cloud Development Kit (CDK) and TypeScript. The code is based on the materials covered in the [AWS Infrastructure with TypeScript: Getting Started](https://www.pluralsight.com/courses/aws-infrastructure-typescript-getting-started) on Pluralsight by [David Tucker](https://github.com/davidtucker).

The `cdk.json` file tells the CDK how to execute the app. When the app is deployed, it creates an API Gateway, EC2 instance with a Docker container managed by ECS & Fargate, Lambda function and S3 bucket.

### Dependency Installation
In a new terminal window, install the dependencies by running:

```bash
# Install AWS CDK globally
npm install -g aws-cdk
# Verify installation by checking version number of the AWS CDK 
cdk --version
# Install TypeScript globally
npm install -g typescript
# Verify installation by checking version number of TypeScript
tsc --version
# Install Node packages in package.json
npm install
```

### TypeScript Compilation
The `npm run build` command compiles the TypeScript code into JavaScript code.

### Unit Testing
The `npm run test` command performs the Jest unit tests.

### Stack Synthesis
The `cdk synth` command synthesizes the stack defined in the app into a CloudFormation template.

### Stack Comparison
The `cdk diff` command compares the current version of the stack (and its dependencies) defined in the app with the already-deployed version(s) and displays a list of changes.

### Stack Deployment
The `cdk deploy` command deploys the stack to the default AWS account and region.

### Stack Watching
The `cdk watch` command continuously monitors the CDK app's source files and assets for changes and immediately performs a deployment of the stack when a change is detected.

### Stack Destruction
The `cdk destroy` command destroys the stack by removing resources according to their deletion policy. This command should be ran when the stack is no longer needed.

### License
* This repository is licensed under the [MIT License](https://github.com/elailai94/typescript-cdk/blob/main/LICENSE.md).

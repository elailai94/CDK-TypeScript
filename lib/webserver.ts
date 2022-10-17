import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as path from "path";

import { Construct } from "constructs";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";

interface DocumentManagementWebserverProps {
    api: apigateway.HttpApi;
    vpc: ec2.IVpc;
}

export class DocumentManagementWebserver extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: DocumentManagementWebserverProps
  ) {
    super(scope, id);

    const webserverDocker = new DockerImageAsset(this, "WebserverDockerAsset", {
      directory: path.join(__dirname, "..", "containers", "webserver")
    });

    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, "WebserverService", {
      taskImageOptions: {
        containerPort: 8080,
        environment: {
          API_BASE: props.api.url!,
          SERVER_PORT: "8080"
        },
        image: ecs.ContainerImage.fromDockerImageAsset(webserverDocker)
      },
      vpc: props.vpc
    });

    new cdk.CfnOutput(this, "WebserverHost", {
      exportName: "WebserverHost",
      value: fargateService.loadBalancer.loadBalancerDnsName
    });
  }
}

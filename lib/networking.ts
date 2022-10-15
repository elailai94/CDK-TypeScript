import * as ec2 from "aws-cdk-lib/aws-ec2";

import { Construct } from "constructs";

interface NetworkingProps {
    maxAzs: number;
}

export class Networking extends Construct {
    public readonly vpc: ec2.IVpc;

    constructor(scope: Construct, id: string, props: NetworkingProps) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, "AppVPC", {
            cidr: "10.0.0.0/16",
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                {
                    subnetType: ec2.SubnetType.PUBLIC,
                    name: "Public",
                    cidrMask: 24
                },
                {
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    name: "Private",
                    cidrMask: 24
                }
            ]
        });
    }
}

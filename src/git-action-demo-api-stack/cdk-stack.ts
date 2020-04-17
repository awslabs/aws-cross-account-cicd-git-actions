/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class GitActionDemoApiStack extends core.Stack {
  constructor(scope: core.App, id: string, props?: core.StackProps) {
    super(scope, id, props);

    /*********************************** Stack Resources ************************************/
    // Lambda definition
    const gitActionDemoLambda = new lambda.Function(
      this,
      'GitActionDemoLambda',
      {
        code: new lambda.AssetCode('dist/src/git-action-demo-api-stack/lambda/git-action-demo-lambda/package.zip'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        description: 'Lambda to demo git action deployment',
        functionName: 'git-action-demo-lambda',
        memorySize: 128,
        reservedConcurrentExecutions: 1,
        timeout: core.Duration.seconds(5)
      }
    );

    // API Gateway definition
    const gitActionDemoApi = new apigw.RestApi(
      this,
      'GitActionDemoApi',
      {
        description: 'API to demo git action deployment',
        endpointTypes: [
          apigw.EndpointType.REGIONAL
        ],
        restApiName: 'git-action-demo-api',
        defaultCorsPreflightOptions: {
          allowOrigins: apigw.Cors.ALL_ORIGINS,
          allowMethods: apigw.Cors.ALL_METHODS
        }
      });
    const demoResource = gitActionDemoApi.root.addResource('demo');
    const demoLambdaIntegration = new apigw.LambdaIntegration(gitActionDemoLambda)
    demoResource.addMethod('GET', demoLambdaIntegration);
    
    /****************************************************************************************/

    /*********************************** List of Outputs ************************************/
    new core.CfnOutput(
      this,
      'DocUploadRestApiId',
      {
        description: 'API id for git action demo API',
        exportName: 'GIT-ACTION-DEMO-API-ID',
        value: gitActionDemoApi.restApiId
      }
    )

    new core.CfnOutput(
      this,
      'DocUploadRestApiRootUrl',
      {
        description: 'Root url of git action demo API',
        exportName: 'GIT-ACTION-DEMO-API-ROOT-URL',
        value: gitActionDemoApi.url
      }
    )

    new core.CfnOutput(
      this,
      'DocUploadRestApiResourceUrl',
      {
        description: 'Resource url of git action demo API',
        exportName: 'GIT-ACTION-DEMO-API-RESOURCE-URL',
        value: demoResource.url
      }
    )
    /****************************************************************************************/
  }
}

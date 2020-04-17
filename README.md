# aws-cross-account-cicd-git-actions

## This project is a simplistic implementation of Lambda backed REST api to be deployed via GitHub Action and CDK (Typescript)

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

### System requirements

- [node (version >= 12x)](https://nodejs.org/en/download/)
- [jq](https://github.com/stedolan/jq/wiki/Installation)

### Prerequisites

> Before proceeding further please read and README.md in [aws-cross-account-cicd-git-actions-prereq](https://github.com/awslabs/aws-cross-account-cicd-git-actions-prereq) and carry out the deployment steps specified.

### How to get started

> Before you checkin the code in this repo into your own git repo, you will need to make updates as shown below. Replace the `<target-account-id>` in parameter `CFN_EXECUTION_ROLE` in `src/params/cdk_stack_param.json` file with AWS account id of your designated deployment target account. This parameter represets the iam role that would be assumed by CDK to carryout deployment.
> You may get the full value of parameter `CFN_EXECUTION_ROLE` from Cloudformation output export `GIT-ACTIONS-CF-EXECUTION-ROLE-ARN` of stack deployed in Prerequisite.

### Project Structure

> Project has been structured such that the API stack has its own folder under root folder `src/`
>> `src/git-action-demo-api-stack` deploys AWS resources associated with Git Action Demo API.
>> `src/params/cdk_stack_param.json` parameter file
>> 
>> Stack specific folder has following components
>> - `/lambda` folder which holds individual lambda functions implemented as part of the API.
>> - `cdk_stack.ts` representing CDK stack for Lambda, API Gateway and associated resources
>> 
>> The stack ties into `app.ts` at root folder location which represents CDK app.

### Deployment using CDK

> The project is to be deployed as a whole app using GitAction workflows defined under `.github/workflows` folder. Each workflow has its own `.yml` file whose name is in the format `cicd-workflow-<region>.yml`. The single workflow handles deployment to a specific region that is mentioned in its name. For e.g. `cicd-workflow-us-east-1` deploys to us-east-1 region. 
> 
> Workflow has following set of steps.
>
> 1. Workflow is triggered when code is pushed to a specific branch in the repo.
> 2. Checks out latest version of code.
> 3. Configures AWS credentials using Tools Account Access Key and Secret to assume the Cross Account Role for deployment.
> 4. Installs prerequisits such as CDK
> 5. Builds and deploys cdk stacks using `deploy.sh` script provided at the root of the project folder.
>
> The `deploy.sh` script takes following deployment steps
>
> 1. Install npm packages.
> 2. Transpile code into javascript in `dist` folder.
> 3. Package .js files into zip
> 3. Uses CDK CLI commands to first bootstrap CDK app and then deploy it.
> ***To manually deploy using script directly, we need to set up default profile for TARGET aws account and then run deploy.sh.***

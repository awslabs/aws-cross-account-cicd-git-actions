# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

# Permission is hereby granted, free of charge, to any person obtaining a copy of this
# without restriction, including without limitation the rights to use, copy, modify,
# merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
# PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

################################################## Build #####################################################
npm install
npm run build
################################################################################################################

###################################### Cloudformation Execution Role ############################################
PARAM_FILE="src/params/cdk-stack-param.json"
CFN_EXECUTION_ROLE=$(cat $PARAM_FILE | jq -r '.CFN_EXECUTION_ROLE')
echo $CFN_EXECUTION_ROLE
##################################################################################################################

######################################## Package And Upload Document Upload API ##################################
cd dist/src/git-action-demo-api-stack/lambda/git-action-demo-lambda
zip package.zip *.js
cd ../../../../../
##################################################################################################################

############################################## CDK Bootstrap & Deploy ############################################
cdk bootstrap

cdk synth -r $CFN_EXECUTION_ROLE

cdk diff -r $CFN_EXECUTION_ROLE

cdk deploy \* -r $CFN_EXECUTION_ROLE --require-approval never
###################################################################################################################
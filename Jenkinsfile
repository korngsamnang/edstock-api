pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-1'
        AWS_ACCOUNT_ID = '767398103155'
        ECR_REPO = 'edstock-api'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set region $AWS_REGION
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
            }
        }

        stage('Build and Push API Image') {
            steps {
                sh '''
                docker build -t ${ECR_REPO}:$IMAGE_TAG .
                docker tag ${ECR_REPO}:$IMAGE_TAG ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:$IMAGE_TAG
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:$IMAGE_TAG
                '''
            }
        }
    }

    post {
        failure {
            echo 'API build or push to ECR failed!'
        }
        success {
            echo 'API Docker image successfully built and pushed to ECR!'
        }
    }
}

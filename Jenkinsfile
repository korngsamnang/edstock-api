pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-1'
        AWS_ACCOUNT_ID = '767398103155'
        ECR_REPO = 'edstock-api'
        IMAGE_TAG = ''
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'aws-credentials-id', region: "${AWS_REGION}")]) {
                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        """
                    }
                }
            }
        }

        stage('Build and Push API Image') {
            steps {
                script {
                    sh """
                        docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                        docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy API to EKS') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'aws-credentials-id', region: "${AWS_REGION}")]) {
                        sh 'aws eks --region ${AWS_REGION} update-kubeconfig --name my-eks-cluster'
                        sh 'kubectl apply -f eks/configuration-files/secrets.yaml'
                        sh "kubectl set image deployment/api edstock-api=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
                        sh 'kubectl apply -f eks/configuration-files/api-service.yaml'
                    }
                }
            }
        }

    }

    post {
        success {
            echo "✅ Newly built API has been deployed to EKS!"
        }
        failure {
            echo "❌ Failed to deploy API to EKS!"
        }
    }
}

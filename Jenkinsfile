pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running Spring Boot backend tests...'

                dir('backend') {
                    bat '.\\mvnw.cmd test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                echo 'Installing frontend dependencies...'

                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                echo 'Running frontend Jest tests...'

                dir('frontend') {
                    bat 'npm test -- --watch=false'
                }
            }
        }
    }

    post {
        success {
            echo 'CI pipeline passed successfully.'
        }

        failure {
            echo 'CI pipeline failed. Check the logs above.'
        }
    }
}
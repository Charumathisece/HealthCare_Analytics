pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building Healthcare Analytics Website...'
                // Create a publish folder and copy files
                sh '''
                    mkdir -p publish
                    cp index.html publish/
                    cp styles.css publish/
                    cp script.js publish/
                '''
                sh 'ls -la publish'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running basic checks...'
                sh '''
                    if [ ! -f publish/index.html ]; then
                        echo "❌ index.html missing!"
                        exit 1
                    fi
                    echo "✅ index.html found. Build looks good!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Build & test passed.'
        }
        failure {
            echo '❌ Pipeline failed! Check console output.'
        }
    }
}

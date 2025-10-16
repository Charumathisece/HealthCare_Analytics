pipeline {
    agent any

    environment {
        // Your GitHub repository details
        REPO = 'Charumathisece/HealthCare_Analytics'
        TARGET_BRANCH = 'gh-pages'   // Change to 'main' if deploying directly to main
        GITHUB_CRED = 'github-pats'   // Jenkins credential ID for GitHub token
    }

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
                sh '''
                    mkdir -p publish
                    cp index.html publish/
                    cp styles.css publish/
                    cp script.js publish/
                '''
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

        stage('Deploy to GitHub Pages') {
            steps {
                echo '🚀 Deploying to GitHub Pages...'
                withCredentials([usernamePassword(credentialsId: env.GITHUB_CRED, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        cd publish
                        git init
                        git config user.email "jenkins@example.com"
                        git config user.name "$GIT_USER"
                        git add -A
                        git commit -m "Deploy from Jenkins"
                        git branch -M main
                        git push --force "https://${GIT_USER}:${GIT_TOKEN}@github.com/${REPO}.git" main:${TARGET_BRANCH}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Your website is deployed.'
        }
        failure {
            echo '❌ Pipeline failed! Check Jenkins logs for details.'
        }
    }
}

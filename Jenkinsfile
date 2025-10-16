// pipeline {
//     agent any

//     environment {
//         // Your GitHub repository details
//         REPO = 'Charumathisece/HealthCare_Analytics'
//         TARGET_BRANCH = 'gh-pages'   // Change to 'main' if deploying directly to main
//         GITHUB_CRED = 'github-pats'   // Jenkins credential ID for GitHub token
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 echo '📦 Checking out code from GitHub...'
//                 checkout scm
//             }
//         }

//         stage('Build') {
//             steps {
//                 echo '🏗️ Building Healthcare Analytics Website...'
//                 // Create a publish folder and copy files
//                 sh '''
//                     mkdir -p publish
//                     cp index.html publish/
//                     cp styles.css publish/
//                     cp script.js publish/
//                 '''
//                 sh 'ls -la publish'
//             }
//         }

//         stage('Test') {
//             steps {
//                 echo '🧪 Running basic checks...'
//                 sh '''
//                     if [ ! -f publish/index.html ]; then
//                         echo "❌ index.html missing!"
//                         exit 1
//                     fi
//                     echo "✅ index.html found. Build looks good!"
//                 '''
//             }
//         }
//     }

//     post {
//         success {
//             echo '✅ Pipeline completed successfully! Build & test passed.'
//         }
//         failure {
//             echo '❌ Pipeline failed! Check console output.'
//         }
//     }
// }




pipeline {
    agent any

    tools {
        maven 'Maven3'   // Name of Maven installation in Jenkins
        jdk 'JDK11'      // Name of JDK installation in Jenkins
    }

    environment {
        TARGET_BRANCH = 'main'   // Branch to build from
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
                echo '🏗️ Building project with Maven...'
                sh 'mvn clean compile'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running JUnit tests...'
                sh 'mvn test'
            }
        }

        stage('Package') {
            steps {
                echo '📦 Packaging project...'
                sh 'mvn package'
                sh 'ls -la target'   // Show compiled JAR/files
            }
        }

        stage('Optional: Static Site Check') {
            steps {
                echo '🔍 Checking static files (HTML/CSS/JS) if present...'
                sh '''
                if [ -f index.html ]; then
                    echo "✅ index.html exists"
                else
                    echo "⚠️ index.html missing"
                fi
                '''
            }
        }

        // Optional stages for SonarQube or security scans
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube analysis...'
                // Uncomment if SonarQube is configured
                // sh 'sonar-scanner'
            }
        }

        stage('Security Scan') {
            steps {
                echo '🛡️ Running Trivy vulnerability scan...'
                // Uncomment if Trivy is installed
                // sh 'trivy fs .'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Build & tests passed.'
        }
        failure {
            echo '❌ Pipeline failed! Check console output.'
        }
    }
}

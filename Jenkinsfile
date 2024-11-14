pipeline {
    agent {
        kubernetes {
            cloud 'rsys-devel'
            defaultContainer 'nodejs'
            inheritFrom 'nodejs'
        }
    }

    stages {
        stage("install") {
            steps {
                sh 'npm install'
            }
        }
        stage("test") {
            steps {
                sh 'npm run test:junit'
                recordCoverage(tools: [[parser: 'JUNIT', pattern: 'junit/*.xml']])
            }
        }
        stage("build") {
            steps {
                sh 'npm run build:prod'
                archiveArtifacts artifacts: 'dist/audioshowkit.js', fingerprint: true, followSymlinks: false, onlyIfSuccessful: true
            }
        }
        stage("generate docs") {
            steps {
                sh 'npm run docs'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'Documentation', reportTitles: ''])
            }
        }
    }
}
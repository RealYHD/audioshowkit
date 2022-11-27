pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                sh '''#!/usr/bin/env pwsh
                conda env create -f environment.yml
                conda activate webdev
                npm install
                '''
            }
        }
        stage("tests") {
            steps {
                sh '''#!/usr/bin/env pwsh
                conda activate webdev
                npm run test:junit
                '''
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            steps {
                sh '''#!/usr/bin/env pwsh
                conda activate webdev
                npm run build:prod
                '''
                fingerprint "dist/**"
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh '''#!/usr/bin/env pwsh
                conda activate webdev
                npm run docs
                '''
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                sh 'mamba env create -f environment.yml'
                sh 'mamba activate webdev && npm install'
            }
        }
        stage("test") {
            steps {
                sh 'mamba activate webdev && npm run test:junit'
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            steps {
                sh 'mamba activate webdev && npm run build:prod'
                fingerprint "dist/**"
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh 'mamba activate webdev && npm run docs'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
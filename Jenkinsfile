pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                sh 'mamba env update --file environment.yml --prefix ./env || mamba env create --force --file environment.yml --prefix ./env'
                sh 'node --version && npm --version'
                sh 'npm install'
            }
        }
        stage("test") {
            steps {
                sh 'npm run test:junit'
                junit 'junit/*.xml'
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
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
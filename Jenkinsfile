pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                sh 'conda env update --file environment.yml'
                sh 'echo "conda activate audioshowkit" >> ~/.bashrc'
                sh 'node --version && npm --version'
                sh 'npm install'
            }
        }
        stage("test") {
            steps {
                sh '''
                source ~/.bashrc
                npm run test:junit
                '''
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            steps {
                sh '''
                source ~/.bashrc
                npm run build:prod
                '''
                fingerprint "dist/**"
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh '''
                source ~/.bashrc
                npm run docs
                '''
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
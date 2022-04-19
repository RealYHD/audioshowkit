pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm install"
                }
            }
        }
        stage("tests") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run test:junit"
                }
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            when {
                branch "master"
            }
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run build:prod"
                }
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh "rm -r ./docs"
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run docs"
                }
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
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
        stage("build") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run build:dev"
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
        stage("archive product") {
            steps {
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run docs"
                }
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit JSDocs', reportTitles: ''])
            }
        }
    }
}
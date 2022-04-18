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
        stage("test") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run test"
                }
                junit 'junit/*.xml'
            }
        }
        stage("archive product") {
            steps {
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("build showcase") {
            steps {
                dir('./showcase/') {
                    nodejs('NodeJS (17.4.0)') {
                        sh "npm i"
                        sh "npm run build"
                    }
                }
            }
        }
        stage("publish docs") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run docs"
                }
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'docs', reportFiles: 'index.html', reportName: 'AudioShowKit JSDocs', reportTitles: ''])
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'showcase/dist', reportFiles: 'index.html', reportName: 'AudioShowKit Demo', reportTitles: ''])
            }
        }
    }
}
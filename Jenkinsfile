pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                nodejs('System NodeJS') {
                    sh "npm install"
                }
            }
        }
        stage("tests") {
            steps {
                nodejs('System NodeJS') {
                    sh "npm run test:junit"
                }
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            steps {
                nodejs('System NodeJS') {
                    sh "npm run build:prod"
                }
                fingerprint "dist/**"
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh "rm -r ./docs"
                nodejs('System NodeJS') {
                    sh "npm run docs"
                }
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
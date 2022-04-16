pipeline{
    agent any
    stages{
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
                    sh "npm run build"
                }
            }
        }
        stage("test") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run test"
                }
            }
        }
        stage("archive product") {
            steps {
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("publish docs") {
            steps {
                nodejs('NodeJS (17.4.0)') {
                    sh "npm run docs"
                }
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'docs', reportFiles: 'index.html', reportName: 'AudioShowKit JSDocs', reportTitles: ''])
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'dist', reportFiles: 'demo.html', reportName: 'AudioShowKit Demo', reportTitles: ''])
            }
        }
    }
}
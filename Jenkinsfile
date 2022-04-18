pipeline {
    agent any
    stages {
        stage("install") {
            steps {
                dir('audioshowkit') {
                    nodejs('NodeJS (17.4.0)') {
                        sh "npm install"
                    }
                }
            }
        }
        stage("build") {
            steps {
                dir('audioshowkit') {
                    nodejs('NodeJS (17.4.0)') {
                        sh "npm run build:dev"
                    }
                }
            }
        }
        stage("test") {
            steps {
                dir('audioshowkit') {
                    nodejs('NodeJS (17.4.0)') {
                        sh "npm run test:junit"
                    }
                    junit 'junit/*.xml'
                }
            }
        }
        stage("archive product") {
            steps {
                archiveArtifacts artifacts: 'audioshowkit/dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("publish") {
            parallel {
                stage("setup showcase") {
                    stages {
                        stage("install showcase") {
                            steps {
                                dir('showcase') {
                                    nodejs('NodeJS (17.4.0)') {
                                        sh "npm i"
                                    }
                                }
                            }
                        }
                        stage("build showcase") {
                            steps {
                                dir('showcase') {
                                    nodejs('NodeJS (17.4.0)') {
                                        sh "npm run build"
                                    }
                                }
                            }
                        }
                        stage("deploy showcase") {
                            steps {
                                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'showcase/dist', reportFiles: 'index.html', reportName: 'AudioShowKit Demo', reportTitles: ''])
                            }
                        }
                    }
                }
                stage("generate docs") {
                    steps {
                        dir('audioshowkit') {
                            nodejs('NodeJS (17.4.0)') {
                                sh "npm run docs"
                            }
                        }
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'audioshowkit/docs', reportFiles: 'index.html', reportName: 'AudioShowKit JSDocs', reportTitles: ''])
                    }
                }
            }
        }
    }
}
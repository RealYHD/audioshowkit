pipeline {
    agent any
    environment {
        PATH = "/home/jenkins/.local/share/fnm:${PATH}"
    }
    stages {
        stage("install") {
            steps {
                sh '''
                curl -fsSL https://fnm.vercel.app/install | bash
                eval "`fnm env`"
                fnm install
                fnm use
                npm install
                '''
            }
        }
        stage("test") {
            steps {
                sh '''
                eval "`fnm env`"
                npm run test:junit
                '''
                junit 'junit/*.xml'
            }
        }
        stage("build") {
            steps {
                sh '''
                eval "`fnm env`"
                npm run build:prod
                '''
                fingerprint "dist/**"
                archiveArtifacts artifacts: 'dist/audioshowkit.js', followSymlinks: false
            }
        }
        stage("generate docs") {
            steps {
                sh '''
                eval "`fnm env`"
                npm run docs
                '''
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'AudioShowKit Docs', reportTitles: ''])
            }
        }
    }
}
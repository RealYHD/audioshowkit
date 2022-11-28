pipeline {
    agent any
    environment {
        PATH = "/home/jenkins/.local/share/fnm:${PATH}"
    }
    stages {
        stage("install") {
            steps {
                sh 'curl -fsSL https://fnm.vercel.app/install | bash'
                sh 'fnm install'
                sh '''
                echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc
                source ~/.bashrc
                fnm use
                npm install
                '''
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
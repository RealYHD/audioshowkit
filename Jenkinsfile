pipeline {
    agent {
        kubernetes {
            cloud 'Reslate Systems'
            defaultContainer 'conda'
        }
    }
    stages {
        stage("install") {
            steps {
                sh 'conda update conda -y -q'
                sh 'conda env update -n base --file environment.yml -q'
                sh 'conda run -n base npm install'
            }
        }
        stage("test") {
            steps {
                sh 'conda run -n base npm run test:junit'
                recordCoverage(tools: [[parser: 'JUNIT', pattern: 'junit/*.xml']])
            }
        }
        stage("build") {
            steps {
                sh 'conda run -n base npm run build:prod'
                archiveArtifacts artifacts: 'dist/audioshowkit.js', fingerprint: true, followSymlinks: false, onlyIfSuccessful: true
            }
        }
        stage("generate docs") {
            steps {
                sh 'conda run -n base npm run docs'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './docs', reportFiles: 'index.html', reportName: 'Documentation', reportTitles: ''])
            }
        }
    }
}
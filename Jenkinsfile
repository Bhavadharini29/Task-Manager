pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh './mvnw -B -DskipTests clean package'
      }
    }

    stage('Test') {
      steps {
        sh './mvnw -B test'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker compose down --volumes --remove-orphans || true
          docker compose up -d --build
          docker ps --filter "name=todo-app" --format "{{.Names}} - {{.Status}} - {{.Ports}}"
        '''
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully. Your app and database should be running.'
    }
    failure {
      echo 'Pipeline failed. Check the console output for errors.'
    }
  }
}

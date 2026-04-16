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
        bat './mvnw.cmd -B -DskipTests clean package'
      }
    }

    stage('Test') {
      steps {
        bat './mvnw.cmd -B test'
      }
    }

    stage('Deploy') {
      steps {
        bat '''
          echo SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/todo > .env
          echo SPRING_DATASOURCE_USERNAME=postgres >> .env
          echo SPRING_DATASOURCE_PASSWORD=1234 >> .env
          docker compose down --volumes --remove-orphans || echo Ignored
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

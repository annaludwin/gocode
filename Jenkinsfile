pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.59.1-noble'
      args '-u root:root'
    }
  }

  parameters {
    choice(name: 'TARGET_ENV', choices: ['production', 'staging', 'local'], description: 'Srodowisko testow (TEST_ENV)')
  }

  environment {
    CI = 'true'
    TEST_ENV = "${params.TARGET_ENV}"
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('E2E') {
      steps {
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
      junit testResults: 'test-results/junit.xml', allowEmptyResults: true
    }
  }
}

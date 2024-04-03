provider "aws" {
  region = "us-west-2"
}

resource "aws_ecr_repository" "fullstack_hono_sqlite" {
  name = "fullstack-hono-sqlite"
}

resource "aws_ecs_cluster" "fullstack_hono_sqlite-ecs-cluster" {
  name = "fullstack_hono_sqlite-ecs-cluster"
}

resource "aws_ecs_service" "fullstack_hono_sqlite-ecs-service" {
  name            = "fullstack_hono_sqlite"
  cluster         = aws_ecs_cluster.fullstack_hono_sqlite-ecs-cluster.id
  task_definition = aws_ecs_task_definition.fullstack_hono_sqlite-ecs-task-definition.arn
  launch_type     = "FARGATE"
  desired_count = 1
  network_configuration {
    subnets          = ["subnet-b3d96af9"]
    assign_public_ip = true
  }
}

resource "aws_ecs_task_definition" "fullstack_hono_sqlite-ecs-task-definition" {
  family                   = "fullstack_hono_sqlite"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "1024"
  cpu                      = "512"
  execution_role_arn       = "arn:aws:iam::537041156478:role/ecsTaskExecutionRole"
  container_definitions    = <<EOF
[
  {
    "name": "${aws_ecr_repository.fullstack_hono_sqlite.name}",
    "image": "${aws_ecr_repository.fullstack_hono_sqlite.repository_url}:latest",
    "memory": 1024,
    "cpu": 512,
    "essential": true,
    "portMappings": [
      {
          "containerPort": 8080,
          "hostPort": 8080,
          "protocol": "tcp"
      },
      {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
      }
    ]
  }
]
EOF
}

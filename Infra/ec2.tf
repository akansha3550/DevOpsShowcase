resource "aws_instance" "k3s_node" {
  ami           = "ami-0731becbf832f281e"
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = aws_subnet.public.id
  associate_public_ip_address = false


  vpc_security_group_ids = [aws_security_group.k3s_sg.id]


  tags = {
    Name = "k3s-node"
  }


  user_data = <<-EOF
              #!/bin/bash
              curl -sfL https://get.k3s.io | sh -
              cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/k3s.yaml
              chown ubuntu:ubuntu /home/ubuntu/k3s.yaml
              sed -i "s/127.0.0.1/$(curl -s ifconfig.me)/" /home/ubuntu/k3s.yaml
              EOF
}

resource "aws_eip" "my_eip" {
  instance = aws_instance.k3s_node.id
  domain   = "vpc"
}


resource "aws_security_group" "k3s_sg" {
  name        = "k3s-sg"
  description = "Allow Kubernetes and SSH"
  vpc_id = aws_vpc.k8s_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

ingress {
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

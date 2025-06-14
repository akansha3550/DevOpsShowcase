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
              apt-get update -y
              apt-get install -y curl iptables

              # Switch to legacy iptables where possible
              update-alternatives --set iptables /usr/sbin/iptables-legacy || true
              update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy || true

              # Install k3s with explicit iptables backend and proxy mode
              curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--kube-proxy-arg=proxy-mode=iptables --iptables-backend=legacy" sh -

              # Set up kubeconfig for ubuntu user
              cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/k3s.yaml
              chown ubuntu:ubuntu /home/ubuntu/k3s.yaml
              chmod 644 /home/ubuntu/k3s.yaml

              mkdir -p /home/ubuntu/.kube
              cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
              chown -R ubuntu:ubuntu /home/ubuntu/.kube
              chmod 600 /home/ubuntu/.kube/config
              PRIVATE_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)
              sed -i "s/127.0.0.1/$PRIVATE_IP/" /home/ubuntu/k3s.yaml
              echo 'export KUBECONFIG=/home/ubuntu/k3s.yaml' >> /home/ubuntu/.bashrc
              chown ubuntu:ubuntu /home/ubuntu/.bashrc
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
  from_port   = 5000
  to_port     = 5000
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  ingress {
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

ingress {
  from_port   = 30000
  to_port     = 32767
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

ingress {
  from_port   = -1
  to_port     = -1
  protocol    = "icmp"
  cidr_blocks = ["0.0.0.0/0"]
}


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

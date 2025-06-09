output "instance_ip" {
  value = aws_eip.my_eip.public_ip
}

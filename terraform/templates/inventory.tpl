[masters]
master ansible_host=${master_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${key_path}

[workers]
worker1 ansible_host=${worker1_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${key_path}
worker2 ansible_host=${worker2_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${key_path}

[k8s_cluster:children]
masters
workers

[k8s_cluster:vars]
ansible_python_interpreter=/usr/bin/python3

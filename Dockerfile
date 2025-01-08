# 使用 Nginx 作为前端的静态文件服务器
FROM nginx:alpine

# 将前端文件拷贝到 Nginx 服务器的工作目录
COPY . /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 8080

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]

# 使用 Nginx 作为前端的静态文件服务器
# FROM nginx:1.15-alpine

# RUN  apk add --no-cache nginx-mod-http-lua 


FROM openresty/openresty:alpine

# Copy your nginx.conf into the container
COPY ./nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# 将前端文件拷贝到 Nginx 服务器的工作目录
COPY index.html script.js style.css /usr/local/openresty/nginx/html/

# 替换默认的 Nginx 配置文件（可选）
# COPY ./nginx.conf /etc/nginx/nginx.conf


# 暴露 8080 端口
EXPOSE 8080

# 启动 Nginx 服务
CMD ["openresty", "-g", "daemon off;"]

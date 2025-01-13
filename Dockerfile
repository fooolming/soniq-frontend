# 使用 openresty 作为前端服务器, 同时做为网关把api调用路由到backend
FROM openresty/openresty:alpine

# Copy your nginx.conf into the container
COPY ./nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# 将前端文件拷贝到 Nginx 服务器的工作目录
COPY index.html script.js style.css /usr/local/openresty/nginx/html/

# 暴露 8080 端口
EXPOSE 8080

# 启动 Nginx 服务 -- 保持默认不变化
# CMD ["openresty", "-g", "daemon off;"]

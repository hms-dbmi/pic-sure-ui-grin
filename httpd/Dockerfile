FROM dbmi/pic-sure-ui:master_ce15e2d AS pic-sure-ui
FROM dbmi/pic-sure-auth-ui:jason_udn_deployment_83a4fe0 as pic-sure-auth-ui
FROM httpd:2.4.27-alpine

RUN apk add --update openssl sed

# Replace virtual host config file with ours
COPY httpd-vhosts.conf ${HTTPD_PREFIX}/conf/extra/httpd-vhosts.conf

# Enable virtual hosting config file
RUN sed -i '/^#Include conf.extra.httpd-vhosts.conf/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf

# Enable necessary proxy modules
RUN sed -i '/^#LoadModule proxy_module/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf
RUN sed -i  '/^#LoadModule proxy_http_module/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf

#### SSL ####
# enable ssl
RUN sed -i '/^#LoadModule ssl_module modules\/mod_ssl.so/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf
RUN sed -i '/^#LoadModule rewrite_module modules\/mod_rewrite.so/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf
RUN sed -i '/^#LoadModule socache_shmcb_module modules\/mod_socache_shmcb.so/s/^#//' ${HTTPD_PREFIX}/conf/httpd.conf
RUN mkdir /usr/local/apache2/logs/ssl_mutex

COPY --from=pic-sure-auth-ui /usr/local/apache2/htdocs /usr/local/apache2/htdocs
COPY --from=pic-sure-ui /usr/local/apache2/htdocs /usr/local/apache2/htdocs
COPY src/main/javascript/overrides /usr/local/apache2/htdocs/picsureui/overrides
COPY src/main/javascript/psama_overrides/login.js /usr/local/apache2/htdocs/psamaui/login/login.js

# Temporary fix for picsureui
COPY extras/index.html ${HTTPD_PREFIX}/htdocs/picsureui
COPY extras/main6.js ${HTTPD_PREFIX}/htdocs/picsureui
COPY extras/login.hbs ${HTTPD_PREFIX}/htdocs/picsureui/hpds

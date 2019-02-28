FROM dbmi/pic-sure-irct-resource:picsure246-jndi.8c898d

COPY web.xml /opt/local/docker-config/webxml/web.xml

USER root

RUN yum install -y zip

RUN unzip /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource.war -d /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource/ \
  && cp /opt/local/docker-config/webxml/web.xml /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource/WEB-INF/web.xml \
  && rm /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource.war \
  && zip -r /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource.war /opt/jboss/wildfly/standalone/deployments/pic-sure-irct-resource/

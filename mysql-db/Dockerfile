FROM dbmi/irct-db:mysql.5.7.22-irct.1.4.2-i2b2-wildfly

RUN mkdir /tempsql/
RUN touch /tempsql/init_script.sql

COPY db/picsure-auth-dump-initial.sql /tempsql/picsure-auth-dump-initial.sql
COPY db/picsure2-dump-initial.sql /tempsql/picsure2-dump-initial.sql
RUN cat /tempsql/picsure2-dump-initial.sql >> /tempsql/init_script.sql
RUN cat /tempsql/picsure-auth-dump-initial.sql >> /tempsql/init_script.sql

EXPOSE 3306

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["mysqld","--init-file","/tempsql/init_script.sql"]

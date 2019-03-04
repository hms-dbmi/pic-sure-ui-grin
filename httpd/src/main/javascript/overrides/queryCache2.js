define(['picSure/ontology', 'jquery','underscore'], function(ontology, $, _){
	
	var runningQueryIds = {};
	
	var submitQuery = function(targetSystem, query, displayName, dataCallback){
		var checkStatus = function(id, stillRunning){
			setTimeout(function(){
				$.ajax(targetSystem.queryPath + '/' + runningQueryIds[displayName] + '/status', {
					type:'POST',
					contentType: 'application/json',
					headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
					data: JSON.stringify({
                                        resourceCredentials : {
                                                GNOME_BEARER_TOKEN : localStorage.getItem("id_token"),
                                                I2B2_BEARER_TOKEN : localStorage.getItem("id_token")
                                        }}),
					success: function(data){
						switch(data.status){
						case "RUNNING":
							// Query is still running so just keep waiting.
							stillRunning();
							break;
						case "PENDING":
							// Query is still running so just keep waiting.
							stillRunning();
							break;
						case "CREATED":
                            // Query just started running so just keep waiting.
                            stillRunning();
                            break;
						case "AVAILABLE":
							// Query has completed
							var i2b2ResultId = data.resourceResultId;
							$.ajax({
								url : targetSystem.queryPath + '/' + runningQueryIds[displayName] + '/result',
								data: JSON.stringify({
       		                                 		resourceCredentials : {
       	       		                                		GNOME_BEARER_TOKEN : localStorage.getItem("id_token"),
                        		                	        I2B2_BEARER_TOKEN : localStorage.getItem("id_token")
                                        			}}),
								type: 'POST',
			                                        contentType: 'application/json',
								headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
								success : function(result){
									result.i2b2ResultId = i2b2ResultId;
									dataCallback(result);
								},
								failure : function(data){
									console.log(data);
								}
							});
							break;
						case "ERROR":
							// Query failed
							dataCallback(data);
							break;
						default :
							console.log("UNKNOWN QUERY STATUS : " + data.status);
							dataCallback(undefined);
							break;
						};
					},
					headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")}
				});
			}, 500);
		}

		var initiateQuery = function(){
			var ps2Query = {};
			if(query.gnome && targetSystem.id==='BCH'){
				ps2Query = {
					resourceUUID : '34373337-3035-6337-2d33-6538332d3131',
					resourceCredentials : {
						GNOME_BEARER_TOKEN : localStorage.getItem("id_token"),
						I2B2_BEARER_TOKEN : localStorage.getItem("id_token")
					},
					query : query
				};
				$.ajax(targetSystem.queryPath, {
					data : JSON.stringify(ps2Query),
					headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
					contentType: 'application/json',
					type: 'POST',
					success: function(data, status, jqXHR){
						runningQueryIds[displayName] = data.picsureResultId;
						var stillRunning = function(){
							checkStatus(runningQueryIds[displayName], stillRunning);				
						};
						stillRunning();
					},
					error: function(data, status, jqXHR){
						dataCallback(data);
					}
				});
			}else{
				ps2Query = {query:query, resourceUUID:targetSystem.uuid, resourceCredentials:{IRCT_BEARER_TOKEN:localStorage.getItem("id_token")}};
			}
		}
		
			initiateQuery();
	};

	return {
		submitQuery : submitQuery
	}
});


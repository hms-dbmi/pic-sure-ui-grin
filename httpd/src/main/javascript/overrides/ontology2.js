define(["picSure/resourceMeta", "overrides/ontology"], function(resourceMeta, overrides){
	//test
	var extractCategoryFromPui = (typeof overrides.extractCategoryFromPui === 'function') ?
			overrides.extractCategoryFromPui 
			: function(puiSegments){
				return puiSegments[5].split(' ').join('_');
			};
	var extractParentFromPui = (typeof overrides.extractParentFromPui === 'function') ?
			overrides.extractParentFromPui 
			: function(puiSegments){
				return puiSegments[puiSegments.length-3];
			};
			
	var mapResponseToResult = function(query, response){
		var result = {};
		console.log(response);
        result.suggestions = _.filter(response.results, function(result){return !result.pui.includes("patient-mapping");}).map(entry => {
			var puiSegments = entry.pui.split("/");
			return {
				value : entry.name,
				data : entry.pui,
				category : extractCategoryFromPui(puiSegments),
				tooltip : entry.attributes.tooltip,
				columnDataType : entry.attributes.columndatatype,
				metadata:  entry.attributes.metadataxml,
				parent : puiSegments[puiSegments.length-3]
			};
		}).sort(function(a, b){
			var indexOfTerm = a.value.toLowerCase().indexOf(query) - b.value.toLowerCase().indexOf(query);
			var differenceInLength = a.value.length - b.value.length;
			return indexOfTerm == 0 ? indexOfTerm + differenceInLength : indexOfTerm;
		});
		if(result.length > 100){
			result = result.slice(0,99);
		}
		return result;
	};

	var searchCache = {};
	
	var autocomplete = function(query, done){
		if(searchCache[query.toLowerCase()]){
			done(searchCache[query.toLowerCase()]);
		}else{
			return $.ajax({
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({query:'%'+query+'%', resourceCredentials:{BEARER_TOKEN:localStorage.getItem("id_token"),IRCT_BEARER_TOKEN:localStorage.getItem("id_token")}}),
				url: window.location.origin + resourceMeta[0].findPath,
				headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
				success: function(response){
					var result = mapResponseToResult(query, response);
					searchCache[query.toLowerCase()]=result;
					done(result);
				}.bind({done:done}),
				error: function(response){
					searchCache[query.toLowerCase()]=[];
					done({suggestions:[]});
				},
				dataType: "json"
			});		
		}
	}.bind({resourceMeta:resourceMeta});

	var verifyPathsExist = function(paths, targetResource, done){
		if(!localStorage.getItem("id_token")){
			done(false);
			var resolved = $.Deferred();
			resolved.resolve();
			return resolved;
		}
		return $.ajax({
			url: window.location.origin + targetResource.findPath,
			type: 'POST',
			headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
			contentType: 'application/json',
			data: JSON.stringify({query:paths, resourceCredentials:{IRCT_BEARER_TOKEN:localStorage.getItem("id_token"),BEARER_TOKEN:localStorage.getItem("id_token")}}),
			success: function(response){
				done(true);
			},
			error: function(response){
				done(false);
			}
		});
	};

	return {
		autocomplete: autocomplete,
		verifyPathsExist: verifyPathsExist
	};
});

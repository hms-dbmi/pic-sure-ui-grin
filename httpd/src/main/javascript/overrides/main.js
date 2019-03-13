define([],function(){
	require.config({
		paths: {
			// Overriding the queryBuilder module entirely to handle gNOME queries
			"filter/filter" : "overrides/filter2",
			"picSure/queryBuilder" : "overrides/queryBuilder",
			"picSure/ontology" : "overrides/ontology2",
			"picSure/resourceMeta" : "overrides/resourceMeta2",
                        "picSure/queryCache" : "overrides/queryCache2"
		}
	});	
});

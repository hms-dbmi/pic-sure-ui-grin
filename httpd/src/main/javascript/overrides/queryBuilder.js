define(['underscore'], function(_){
	// The default behavior. Since we are overriding the module as a whole, we have no choice but to duplicate the code here.
	var createWhere = function(pui, logicalOperator){
		if(pui.includes('GRIN_CONSENT')||pui.includes('BIOBANK_FLAG')){
			pui = pui + 'Y';
		}
		return {
			field : {
				pui : pui,
				dataType : "STRING"
			},
			logicalOperator: logicalOperator,
			predicate : "CONTAINS",
			fields : {
				ENCOUNTER : "YES"
			}
		};
	};
	// The where clause is different for gNOME resource interfaces
	var createGnomeWhere = function(searchValue){
		return {
			field : {
				pui : "/gnome/query_rest.cgi",
				dataType : "STRING"
			},
			predicate : "CONTAINS",
			fields : {
				qtype : "variants",
				vqueries : [searchValue]
			}
		};
	};
	var createQuery = function(filters){
		var query = {
				where: []
		};
		var lastFilter = undefined;
		_.each(filters, function(filter){
			if(filter.get("searchTerm").trim().length !== 0){
				if(filter.get("searchTerm").indexOf("gnome")> -1){
					query.where.push(createGnomeWhere(filter.get("searchValue")));
				} else {
					query.where.push(
							createWhere(filter.get("searchTerm"), 
									filter.get("inclusive") ? 
											(lastFilter ? (lastFilter.get("and") ? "AND" : "OR") : "AND")
											: "NOT"));                                      
				}
			}
			lastFilter = filter;
		});
		return query;
	};
	return {
		createQuery: createQuery
	}
});

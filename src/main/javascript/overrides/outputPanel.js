define(["handlebars", "backbone", "picSure/resourceMeta", "picSure/ontology", "picSure/queryCache"], 
		function(HBS, BB, resourceMeta, ontology, queryCache){
	return {
		// Overridden update function to handle parsing gNOME RI responses.
		update: function(incomingQuery){
			this.model.set("totalPatients",0);
			this.model.set("isGnome", incomingQuery.where[0].field.pui.indexOf("gnome") > -1);
			this.model.spinAll();
			this.render();
			_.each(resourceMeta, function(picsureInstance){

				// make a safe deep copy of the incoming query so we don't modify it
				var query = JSON.parse(JSON.stringify(incomingQuery));

				var dataCallback = function(result){
					if(result == undefined || result.status=="ERROR"){
						this.model.get("resources")[picsureInstance.id].patientCount = 0;
					}else{
						var count = this.model.get("isGnome") && result.data[0][1]? 
								_.keys(_.groupBy(result.data, function(entry){
									return entry[1]["Sample ID"];
								})).length
								: parseInt(result.data[0][0].patient_set_counts);
						this.model.get("resources")[picsureInstance.id].queryRan=true;
						this.model.get("resources")[picsureInstance.id].patientCount = count;
						this.model.set("totalPatients", this.model.get("totalPatients") + count);
					}
					this.model.get("resources")[picsureInstance.id].spinning = false;
					if(_.every(this.model.get('resources'), (resource)=>{return resource.spinning==false})){
						this.model.set("spinning", false);
						this.model.set("queryRan", true);
					}
					this.render();
				}.bind(this);

				_.each(query.where, function(whereClause){
					whereClause.field.pui = whereClause.field.pui.replace(/(\/[\w-]+){4}/, picsureInstance.basePui);
				});

				ontology.verifyPathsExist(_.pluck(_.pluck(query.where, 'field'), 'pui'), picsureInstance, function(allPathsExist){
					if(allPathsExist){
						queryCache.submitQuery(
								picsureInstance,
								query,
								picsureInstance.id,
								dataCallback);
					}else{
						dataCallback({data:[[{patient_set_counts: 0}]]});
					}
				});
			}.bind(this))

		}
	};
});
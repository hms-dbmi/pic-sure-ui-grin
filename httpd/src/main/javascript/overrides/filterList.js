define(["output/outputPanel","picSure/queryBuilder", "filter/filter"], 
		function(outputPanel, queryBuilder, filter){
	var filterList = {
		init : function(){
			$('#filter-list').html();
			this.filters = [];
			this.addFilter();
		}
	};
	filterList.addFilter = function(){
		$('.filter-boolean-operator').removeClass('hidden');
		var newFilter = new filter.View({
			queryCallback : this.runQuery,
			model : new filter.Model(),
			removeFilter : this.removeFilter,
		});
		newFilter.render();
		this.filters.push(newFilter);
		$('#filter-list').append(newFilter.$el);
	}.bind(filterList);
	filterList.runQuery = function(){
		var filtersByType = _.groupBy(_.pluck(this.filters, "model"), function(filter){return filter.attributes.searchTerm.split('/')[1] === 'gnome' ? 'gnome' : 'i2b2';});
		var gnomeQuery = (filtersByType.gnome ? queryBuilder.createQuery(filtersByType.gnome) : undefined);
		var i2b2Query = (filtersByType.i2b2 ? queryBuilder.createQuery(filtersByType.i2b2) : undefined);
		outputPanel.View.update({i2b2 : i2b2Query, gnome : gnomeQuery});
		if(_.countBy(this.filters, function(filter){
			return filter.model.get("searchTerm").trim() === "" ? "empty" : "notEmpty";
		}).empty == undefined) {
            this.addFilter();
        }
	}.bind(filterList);
	filterList.removeFilter = function (cid) {
        var indexToRemove;
        for (var i = 0; i < this.filters.length; i++) {
            if (this.filters[i].cid === cid) {
                indexToRemove = i;
                break;
            }
		}
		// now remove view from list
		if (typeof indexToRemove != 'undefined') {
            this.filters.splice(indexToRemove, 1);
        }
        this.runQuery();
	}.bind(filterList);

	return filterList;
});


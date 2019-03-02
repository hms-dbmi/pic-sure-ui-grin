define(["filter/searchResult"], function(searchResult){
    return {
        addSearchResultRows: function (data, filterView, queryCallback) {
			keys = _.keys(data).sort();
			$('.search-tabs', filterView.$el).append(this.searchResultTabs(keys));
			keys.forEach((key) = > {
				var categorySearchResultViews = [];
				if (data[key]) {
					_.each(data[key], function (value) {
						if (value.data.indexOf("i2b2-wildfly-grin-patient-mapping") == -1) {
							var newSearchResultRow = new searchResult.View({
								queryCallback: queryCallback,
								model: new searchResult.Model(value),
								filterView: filterView
								});
							newSearchResultRow.render();
							categorySearchResultViews.push(newSearchResultRow);
							data[key] = undefined;
                        }
					});
				}
				$('#' + key + '.tab-pane', filterView.$el).append(_.pluck(categorySearchResultViews, "$el"));
			});

			$("#" + _.first(keys)).addClass("active");
			$(".nav-pills li:first-child").addClass("active");
			$('a[data-label="' + _.first(keys) + '"]').trigger('shown.bs.tab')
        }.bind(this)
	}
});


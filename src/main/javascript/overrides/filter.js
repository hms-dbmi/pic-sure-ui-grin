define([], function(){
	var enterKeyHandler = function(){
		var term = $('input.search-box', this.$el).val();

		// detecting gnome variant spec notation and skipping the path lookup.
		if(term.indexOf(",")>-1){
			this.showSearchResults({
				suggestions: [
					{
						category: "VARIANT",
						data: "/gnome/query_rest.cgi",
						isCategorical: false,
						isVariant: true,
						parent: "",
						tooltip: term,
						value: term
					}
					]
			});
		}
		term = $('input.search-box', this.$el).val();
		if(term && term.length > 0){
			this.model.set("searchTerm", term);
			this.searchTerm(term);
		}
	};

	return {
		enterKeyHandler : enterKeyHandler
	};
});
define([], function(){
        var enterKeyHandler = function(){
                var term = $('input.search-box', this.$el).val();

                if(term && term.length > 0){
                        this.model.set("searchTerm", term);
                        // detecting gnome variant spec notation and skipping the path lookup.
                        if(/chr\d+,\d+,\d+,.+,.+/.test(term)){
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
                        }else{
                                this.searchTerm(term);
                        }
                }
        };

	return {
                enterKeyHandler : enterKeyHandler
        };
});

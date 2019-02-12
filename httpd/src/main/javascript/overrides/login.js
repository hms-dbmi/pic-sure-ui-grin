define([], function(){
	return {
		authorization : function(queryObject, callback){
			var subClaimUUID;

			if(queryObject && queryObject.id_token){
				subClaimUUID = JSON.parse(atob(queryObject.id_token.split('.')[1])).sub.split('|')[2];

				var ken = '19e0eed5-73ff-40d9-a1af-8bc5bda77646';

				var paul = 'ffa0eb6c-5954-4830-b4f0-78cb18fc3218';

				var jason = 'e7727769-c306-4618-9c41-8cdb2effa4fa';

			}
			callback(subClaimUUID === ken || subClaimUUID === jason || subClaimUUID === paul);
		},
		postRender : function(){
			$('#frmAuth0Login').on("DOMNodeInserted", function(event){
				//$('.a0-googleplus').hide();
			});
		},
		client_id : "ywAq4Xu4Kl3uYNdm3m05Cc5ow0OibvXt"
	};
});

var SMART_METHOD ={

        handlerData:function(resJSON){
            console.log("resJSON is", resJSON);
            var templateSource   = $("#smart-template").html();

            var template = Handlebars.compile(templateSource);

            var smartHTML = template({"incident":resJSON});

           $('#all_incidents').html(smartHTML);
            
        },
        loadRangerData : function(){

            $.ajax({
                url:"fakeData.json",
                method:'get',
                cache: false,
                dataType: 'json',
                success:this.handlerData,
                //success:function(data){ console.log(data); },
                error:function(o,s,data){ console.log(o,s,data); },
            })
        }
};

$(document).ready(function(){

    SMART_METHOD.loadRangerData();
});




var dataModel;
var dataView;

var loadedFakeData = false;
var fakeData;

var humanCategories = ["fishing tools", "spent cartridges", "people", "cutting tools"];
var weaponCategories = ["firearm", "ammunition"];
var trapCategories = ["trap", "poison"];


//fakeData.json'
// Take in the static JS data and apply sort filter
 function loadJSON(callback, endpoint, loadingFakeData=false) {   

    console.log("Creating GET request for JSON");

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', endpoint, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText, loadingFakeData);
          }else{
            console.log("Could not fetch data! Status " + xobj.status);
          }
    };
    xobj.send(null);  
 }


 function updateDataModel(response, loadingFakeData){

    if (loadingFakeData){
        if (!loadedFakeData){
            fakeData = JSON.parse(response);
            dataModel = fakeData;
            filterTest();
            return;
        }
    }

    var serverData = JSON.parse(response);

    console.log("Fetched " + serverData.length + " datapoints from server.");

    dataModel = fakeData.concat(serverData);
    console.log("Total datapoints is " + dataModel.length);
    console.log(serverData);
 }

 function filterDataModel(fromDate, toDate, bHuman, bWeapon, bTrap, bAnimal, animalList){

    console.log("Filtering data model");

    var activeCategories = new Array();

    // Human, trap, weapon, live animal, dead animal
    if (bHuman === true){ 
        activeCategories = activeCategories.concat(humanCategories); 
    }

    if (bWeapon === true){ activeCategories = activeCategories.concat(weaponCategories); }
    if (bTrap === true){ activeCategories = activeCategories.concat(trapCategories); }
    if (bAnimal === true){ activeCategories = activeCategories.concat(animalList); }

    console.log("Active categories: " + activeCategories);

    var filteredModel = _.filter(dataModel, function(report) {

        // return false;
        var allParams = report["animals"].concat(report["human-activities"]);
        var mDate = moment(report["TimeStamp"]);

        // console.log(mDate.format('MMMM Do YYYY, h:mm:ss a'));

        for (var i = 0; i < allParams.length; i++){

            //Is param contained within activeCategories
            var catMatch = _.contains(activeCategories, allParams[i]);
            var dateMatch = (mDate.isBefore(toDate) && mDate.isAfter(fromDate));

            // console.log(mDate.format('MMMM Do YYYY, h:mm:ss a') + " not between " + fromDate.format('MMMM Do YYYY, h:mm:ss a') + " " + toDate.format('MMMM Do YYYY, h:mm:ss a'));

            if (catMatch && dateMatch){
                return true;
            } 
        }
        return false;
    });

    var sortedModel = _.sortBy(filteredModel, function(report) {
        return moment(report["TimeStamp"]);
    });

    // Sort data model by filtered model
    return sortedModel;
 }

// Function to test several filters
function filterTest(){

    var to = new Date();
    var from = new Date();
    from.setYear(2015);

    to = moment(to);
    from = moment(from);


    console.log("Date range:");
    console.log(to.format('MMMM Do YYYY, h:mm:ss a') );
    console.log(from.format('MMMM Do YYYY, h:mm:ss a') );

    var humanFilter = filterDataModel(from, to, true, false, false, false, []);
    console.log("HUMAN FILTER " + humanFilter.length);

    var trapFilter = filterDataModel(from, to, false, false, true, false, []);
    console.log("TRAP FILTER " + trapFilter.length);

    var weaponFilter = filterDataModel(from, to, false, true, false, false, []);
    console.log("WEAPON FILTER: " + weaponFilter.length);

    var animalFilter = filterDataModel(from, to, false, false, false, true, ["lion"]);
    console.log("ANIMAL FILTER: LION " + animalFilter.length);

    var trapAnimalFilter = filterDataModel(from, to, false, false, true, true, ["lion, rhino"]);
    console.log("TRAP ANIMAL FILTER: LION, RHINO " + trapAnimalFilter.length);

}

function pollData(){
    
    console.log("Polling for data!");

    if (!loadedFakeData){
       loadJSON(updateDataModel, "fakeData.json", true);
    }

    loadJSON(updateDataModel, "http://40.78.26.172/incidents", false);
}

console.log("Polling fake data");
pollData();
 setInterval(pollData, 60000);

 // Underscore test
 console.log(_.isEmpty({}));
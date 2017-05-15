        

  const fs=require("fs");
  const readline=require("readline");
  const stream=require('stream');

//  Global variables to get access data in entire file

 let allData,colheader,regions,southEuro,centralEuro,northEuro;

 

 //  This fucnction is used to get index of a coloumn in Header row
    function getIndexOf(element)
{
	// console.log("inside get indexOf function");
	
	return colheader.indexOf(element);
}

//  this function is used to validate files passed as argument
 function validateFile(fileName)
{

	// console.log("inside validate");
	if(!fileName)
	{
		return true;
	}
}


// this function is to get region of a country
function getIndex(sourceArray,element)
{
      // console.log("inside index ");
      let res=-1;
      if(element && sourceArray.includes(element))
      {
      	return 2;
      }
      else if(element && southEuro.includes(element))
      {
      	return 0;
      }    
      else if( element && northEuro.includes(element))
      {
      	return 1;
      }
      return res;
  }


 function convertSugerNSalt(sourceCSV,resultJSON)
{
   // console.log("Started Converting : ....");

   let countries=['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
   let sugerConsumption=[0,0,0,0,0,0,0,0,0]; // to store suger consumption
   let saltConsumption=[0,0,0,0,0,0,0,0,0];  // to store salt consumtion
   let sugerNSalt=[];  // to hold combined value of suger and Salt
   let country,countryIndx,sugerIndx,saltIndx,indx,retVal;
   let lineNum=0;  
   let sugerTitle="sugars_100g"; // title of suger in csv file
   let saltTitle="salt_100g";   // title of salt in csv file
   let countryTitle="countries_en";  // title of country in csv file
    

    // console.log("validating input file......");

   if(validateFile(sourceCSV)|| validateFile(resultJSON))
  	{

  		retVal ="Please enter a valid file name";
  	}

   	else
   	{
      
   	    // console.log("valid files !");

   		let instream = fs.createReadStream(sourceCSV); // reading csv file
   		let outStream= new stream();  
   		let li=readline.createInterface(instream,outStream); 
   		// console.log("Reading input file : ");
   		li.on('line',function(line)
   		{
           

           let curLine=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // to split line with slash

           if(lineNum==0)  // to fetch header from file
           {
           	  colheader=curLine;
           	  countryIndx=getIndexOf(countryTitle); // to get index of country
           	  sugerIndx=getIndexOf(sugerTitle);  // to get index of suger
           	  saltIndx=getIndexOf(saltTitle);   // to get index of salt
           	  lineNum=1;
           }
           if(curLine[countryIndx] && curLine[countryIndx].includes(',')){

               let values=curLine[countryIndx].split(','); // splitting to extract each coloumn value

               for(let k=0;k<values.length;k=k+1)
               {
                   indx=countries.indexOf(values[k]);  // to get index of suger and salts
                   if(indx!=-1)
                   {
                   	 sugerConsumption[indx]=sugerConsumption[indx]+ Number(curLine[sugerIndx]);  // adding values
                   	 saltConsumption[indx]=saltConsumption[indx]+Number(curLine[saltIndx]);   
                   }
               }
           }

         else if(curLine[countryIndx]) {

        indx = countries.indexOf(curLine[countryIndx]);
        if(indx !== -1) {
          sugerConsumption[indx] = sugerConsumption[indx] + Number(curLine[sugerIndx]);
          saltConsumption[indx] = saltConsumption[indx] + Number(curLine[saltIndx]);
        }
      }



   		});

   		li.on('close',function(){
              
              // console.log("Conversion done....");

              for (let i = 0; i< countries.length ; i=i+1) {
          	  let jsobj={};  // intializing an object to hold values
          	  jsobj.country=countries[i];  // to copy country array in object
          	  jsobj.suger=sugerConsumption[i];  // to copy suger array in object
          	  jsobj.salt=saltConsumption[i];  //to copy salt array in object
          	  sugerNSalt.push(jsobj);  // to insert object in array
              // console.log("writing into JSON File ");
          }
          
          fs.writeFileSync(resultJSON,JSON.stringify(sugerNSalt)); // writing array in JSON file

          if(sugerNSalt)
   		{
   			retVal="JSOn COnverted Successfully";
   		}

   		});
   		
   		
   	}

   	return retVal;
   
} 





function ConvertFatCarboNProtn(sourceCSV,resultJSON)
  {
  	
  	console.log("started execution");
  	regions=['South Europe','North Europe', 'Central Europe']; // Regions array
  	southEuro=['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia', 'Albania']; //  All region arrays
  	centralEuro=['France', 'Belgium', 'Germany', 'Switzerland', 'Netherlands']; 
  	northEuro=['United Kingdom', 'Denmark', 'Sweden', 'Norway'];

  	//  letiable declarations 
  	let carboFatProtn=[];
  	let fat=[0,0,0];
  	let protn=[0,0,0];
  	let  carbHydrt=[0,0,0];
  	let colHeadSignal=0;
  	let countryIndx,fatIndx,protIndx,carbIndx,indx,retVal,inS,outS,li;
  	let countryName='countries_en';
  	let carbName='carbohydrates_100g';
  	let fatName='fat_100g';
  	let protnName='proteins_100g';

  	if(validateFile(sourceCSV)|| validateFile(resultJSON))  // calling method to validate input files
  	{

  		retVal ="Please enter a valid file name";
  	}
  	else
  	{
  		
  		inS=fs.createReadStream(sourceCSV); // reading input csv file
  		outS=new stream();
  		// console.log("reading file :");
  		li=readline.createInterface(inS,outS);
  		li.on('line',function(line)
  		{

  			let curLine=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // splitting contents

  			if(colHeadSignal==0)
  			{
  				
  				colheader=curLine;
  				// console.log("reading header");
  				countryIndx=getIndexOf(countryName); // to get index of country in header
  				// console.log(countryIndx);

  				fatIndx=getIndexOf(fatName); // to get index of fat , protien and cabohydrates
  				// console.log(fatIndx);
  				carbIndx=getIndexOf(carbName);
  				// console.log(carbIndx);
  				protIndx=getIndexOf(protnName);
  				// console.log(protIndx);
  				
  				colHeadSignal=1;

  			}
  			if(curLine[countryIndx] && curLine[countryIndx].includes(',')) // to handle coloumns having more than one values
  			{
              // console.log("line has multiple values");
              let values=curLine[countryIndx].split(',');
              // console.log(values);

              for(let k=0;k<values.length;k=k+1)
              {
              	
              	  Indx=getIndex(centralEuro,values[k]); //to get region of country
                 // Indx = regions.indexOf(curLine[countryIndx]);

                  // console.log("index of is : "+Indx);


                  if(Indx!= -1)
                  {
                    // console.log("index doestn exiyts");
                    fat[Indx]=fat[Indx]+Number(curLine[fatIndx]); // to get fat, carb and protn values for the country
                    carbHydrt[Indx]=carbHydrt[Indx]+Number(curLine[carbIndx]);
                    protn[Indx]=protn[Indx]+Number(curLine[protIndx]);
                }
            }
        }


        else  if(curLine[countryIndx]) {  // to handle single coloumn values
        	
             // console.log("single country");

             //Indx = regions.indexOf(curLine[countryIndx]); 

             Indx=getIndex(centralEuro,curLine[countryIndx]);

             if(Indx !=-1) {
             	
            // console.log(fat[Indx]);
            fat[Indx]=fat[Indx]+Number(curLine[fatIndx]);
            // console.log(fat[Indx]);
            carbHydrt[Indx]=carbHydrt[Indx]+Number(curLine[carbIndx]);
             // console.log(carbHydrt[Indx]);
             protn[Indx]=protn[Indx]+Number(curLine[protIndx]);
             // console.log(protn[Indx]);
             
         }
     }
     
 });

  		li.on('close',function(){
  			
  			// console.log("writing into json");

  			for(let i=0;i<regions.length;i=i+1)
  			{
  				let jsobj={};
  				jsobj.region=regions[i];
  				jsobj.fat=fat[i];
  				jsobj.protein=protn[i];
  				jsobj.carbohydrate=carbHydrt[i];
  				carboFatProtn.push(jsobj);
  			}
  			
  			fs.writeFileSync(resultJSON,JSON.stringify(carboFatProtn));
  			if(carboFatProtn)
  			{
  				retVal="JSOn COnverted Successfully";
  			}
  		});     
  		
  	}
  	return retVal;
  }




// console.log("Starting With File One : ");
 let result;
 result= convertSugerNSalt("data/FoodFacts.csv","output/sugerSaltFile.json");
// console.log(result);

 // console.log("starting with file two :");

result=ConvertFatCarboNProtn("data/FoodFacts.csv","output/fatCarboProtnData.json");

  // console.log(result);


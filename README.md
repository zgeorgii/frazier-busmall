# frazier-busmall
Codefellows 201 week 3 project


I want to build an app that can be distributed to focus groups to determine which products should be included in a catalog.


------------------------------------design------------------------------------
Initial DOM setup:
  grab all the things we'll be writing into

Product constructor:
  name
  img filepath
  no of wins
  what it won against
  what is lost to
  discription?
  number of times it was displayed

app object:
  storage method
  retrieval method
  display method
  click method
  objects array
  dispalyed object array
  data display function
  counter

event listener
event listener function--can I put this inside of an object as a method?


------------------------------------user stories------------------------------------
test-subject:
I want to be able to easily interact with the app so that I can choose things quickly      X
I want to be able to view the data in a simple, easily-understood way      
I want to have the option to look at the total data      

developer:
I want to build a responsive app so that the app functions similarly regardless of the screen resolution     X
I want to write simple, elegant, and modular code       
I want my data to persist past a page refresh using local storage      
I want to use skeleton or flexbox to handle the bulk of the formatting and css issues      X
I want to be able to handle multiple image types for my product displays       

client:
I want the app to display three products side-by-side to the test-subject    X
I want the subject to be able to choose which of the products they would be most likely to purchase   X
I want to collect the data from multiple users for analysis     
I want to the app to collect data in a fair way so that the data is usable    X
I want to allow the user to view to collected data in a visually appealing way     
I only want to allow the user to view the data after they have made 15 total selections         X
I want to be able to understand how each choice was ranked in the context of what it was ranked against   X
I want to ask the user how much they would be willing to pay for it --Heyduck idea

------------------------------------assignment text------------------------------------ 1/18/16
You've been hired by a startup called BusMall, whose product is similar to the SkyMall catalog found in the seatback pockets on airplanes: a catalog of assorted high-markup products provided to a captive audience seeking a mental escape from the drudgery of travel. But in this case, BusMall catalogs are placed on Puget Sound regional transit system buses... whose overall travel times are now comparable to cross-country flights, after all.

Since catalogs are expensive to print and distribute, the products cost money to make and warehouse, and BusMall is a lean startup that needs to carefully watch its expenditures, BusMall wants to feature only the items in its catalog that are the most likely to sell. This means that BusMall wants to do market analysis on proposed products to test their potential customer interest... before actually putting them into the catalog and getting the manufacturing wheels in motion.

To make this market analysis maximally effective, BusMall wants you to build an app that displays potential products to individuals focus groups (three products at a time, side-by-side-by-side, so you'll need to manage the size and the aspect ratio of the images and perhaps edit them a bit), then has the group members choose the one they would be most likely to purchase, and then store, calculate, and visually display the resulting data.

To keep the product selection process as untainted as possible, you have been instructed to not allow any results to be shown to the user until there have been a total of 15 selections made. Also, the marketing research team has asked that you not automatically display the results after 15 clicks, but

You are also responsible for the look and feel of the app, so don't forget a custom font, color palette, layout with semantic HTML (and maybe a Skeleton or flexbox approach to layout) and so on.

stretch goals:
sort the result list   
add more statistical analysis, like how many times each was displayed, etc.

NOTES: deciding on storage type for wonVs, lostTo, tiedWith:
currently an array like ['boots', 'cthulhu', 'boots', ...]
needs to be processed before it can be used for charts--could be processed by another app function:
for loop to iterate through objects, for x in obj loop && type = array to find arrays

OR could store as an obj:
if (obj[lostTo]){
  obj[lostTo]++
} else {
  obj[lostTo]=1
}

OR could make all wonVs, lostTo, tiedWith, etc. arrays that have initial values [0,0,....] and use imageKey to go between boots and the index that should be incremented

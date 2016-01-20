# frazier-busmall
Codefellows 201 week 3 project


This is an app that can be distributed to focus groups to determine which products should be included in a catalog.


------------------------------------design------------------------------------
Initial DOM setup:
  grab all the things we'll be writing into

Product constructor imageChoice (name, source):
  name -- string -- name
  img filepath -- string -- source
  no of wins -- number -- winsNo
  win percent -- number -- winPercent
  what it won against -- object -- wonVs
  what it lost to -- object -- lostTo
  what it tied with -- object -- tiedWith
  number of times displayed -- number -- displayedNo
  update win percent --function -- getWinPercent
  description?
  price list?



app object:
  storage method for results -- array -- has a subarray for each object, each of which contains a subarray for each object containing its record against that object --storageArray
  results threshold -- number -- number of clicks before results button allowed -- thesholdForResults
  storage method for objects -- one large object using name to retrieve, one array containing the names -- allImgObjects and imageArray
  display method -- function that displays the objects to click -- redraw, calls displayAll and display
  click method --function that runs on click -- onClick
  displayed object array -- array of the three objects shown on screen -- displayedObjects
  data display function -- function to draw charts when results button clicked -- doesn't exist yet
  counter -- number of times an object has been clicked -- counter
  storage retrieval -- get results out of local storage -- doesn't exist yet
  storage method-- puts results into local storage --doesn't exist yet

event listener for each image
event listener for results button


------------------------------------user stories------------------------------------
test-subject:
I want to be able to easily interact with the app so that I can choose things quickly      X
I want to be able to view the data in a simple, easily-understood way      
I want to have the option to look at the total data      

developer:
I want to build a responsive app so that the app functions similarly regardless of the screen resolution     X
I want to write simple, elegant, and modular code       
I want my data to persist past a page refresh using local storage      
I want to use skeleton to handle the bulk of the formatting and css issues      X
I want to be able to handle multiple image types for my product displays      
I want to store the data for my client and return it in a sorted and easily usable format   X
I want to build cool looking charts that are informative for my client and my users
I want mouseover events to indicate which item the user is about to select  (alt for images?)
I want to make the results button differentiate between the first time its clicked and when it's clicked again if new data has been added so it's clear that the dataset has changed
I want to make it so that when an individual object's summary is shown, an image of that object is also shown

client:
I want the app to display three products side-by-side to the test-subject    X
I want the subject to be able to choose which of the products they would be most likely to purchase   X
I want to collect the data from multiple users for analysis     
I want to the app to collect data in a fair way so that the data is usable    X
I want to allow the user to view to collected data in a visually appealing way     
I only want to allow the user to view the data after they have made 15 total selections         X
I want to be able to understand how each choice was ranked in the context of what it was ranked against   X
I want to ask the user how much they would be willing to pay for it --Heyduck idea
Potentially want to show the user each object at least once before asking them to rank the others again
potentially add a logo for the project to remind user

------------------------------------assignment text------------------------------------ 1/18/16
You've been hired by a startup called BusMall, whose product is similar to the SkyMall catalog found in the seatback pockets on airplanes: a catalog of assorted high-markup products provided to a captive audience seeking a mental escape from the drudgery of travel. But in this case, BusMall catalogs are placed on Puget Sound regional transit system buses... whose overall travel times are now comparable to cross-country flights, after all.

Since catalogs are expensive to print and distribute, the products cost money to make and warehouse, and BusMall is a lean startup that needs to carefully watch its expenditures, BusMall wants to feature only the items in its catalog that are the most likely to sell. This means that BusMall wants to do market analysis on proposed products to test their potential customer interest... before actually putting them into the catalog and getting the manufacturing wheels in motion.

To make this market analysis maximally effective, BusMall wants you to build an app that displays potential products to individuals focus groups (three products at a time, side-by-side-by-side, so you'll need to manage the size and the aspect ratio of the images and perhaps edit them a bit), then has the group members choose the one they would be most likely to purchase, and then store, calculate, and visually display the resulting data.

To keep the product selection process as untainted as possible, you have been instructed to not allow any results to be shown to the user until there have been a total of 15 selections made. Also, the marketing research team has asked that you not automatically display the results after 15 clicks, but

You are also responsible for the look and feel of the app, so don't forget a custom font, color palette, layout with semantic HTML (and maybe a Skeleton or flexbox approach to layout) and so on.

stretch goals:
sort the result list   
add more statistical analysis, like how many times each was displayed, etc.


Notes: used the discussion at http://stackoverflow.com/questions/31913967/how-to-set-chartjs-y-axis-title to figure out how to extend my bar chart to get y axis labels

using getElementWidth from here: http://www.cjboco.com/blog.cfm/post/determining-an-elements-width-and-height-using-javascript/
